import axios from "axios";
import dotenv from "dotenv";
import { BillInvolvementModel, BillModel, PoliticianModel } from "@/app/models";
import { addQueryParams, checkApiKey, constructUrl } from "./helpers";
import type { Bill, DataGovMembersResponse } from "./types";
import type { Database } from "@/app/models/types";
import config from "@/app/config";
import { SupabaseClient } from "@supabase/supabase-js";

type politicians = Database["public"]["Tables"]["politicians"];
type bills = Database["public"]["Tables"]["bills"];
type billInvolvement = Database["public"]["Tables"]["bill_involvement"];

export interface ServiceContext {
  client: SupabaseClient;
  models?: {
    politicianModel?: PoliticianModel;
    billModel?: BillModel;
    billInvolvementModel?: BillInvolvementModel;
  };
}

dotenv.config();
const defaultUrls = config.politics.defaultUrls;
const apiKey = config.politics.dataGovApiKey;

const getBillInfo = async (
  billInvolvement: billInvolvement["Row"]
): Promise<bills["Row"]> => {
  const finalApiKey = checkApiKey(apiKey);
  const formedUrl = constructUrl(defaultUrls.bill, [
    billInvolvement.congress_number.toString(),
    billInvolvement.bill_type,
    billInvolvement.bill_number.toString(),
  ]);
  const url = addQueryParams(formedUrl, { api_Key: finalApiKey });
  const response = await axios.get(url);
  const data: bills["Row"] = response.data;
  return data;
};

const getPoliticianInfo = async (svcCtx: ServiceContext, name: string) => {
  const politicianModel = svcCtx.models?.politicianModel;
  if (!politicianModel) {
    throw new Error("PoliticianModel not provided in service context");
  }

  // attempt getting the politician info from the db
  const lowerName = name.toLowerCase();
  const politician = await politicianModel.get(name);
  if (politician) {
    console.log("Politician found in db:", politician);
    return politician;
  }

  // if not in db, get from congress.gov
  const response = await getPoliticianListsSearch(
    svcCtx,
    defaultUrls.member,
    lowerName
  );

  if (!response) {
    throw new Error(`Politician ${name} not found`);
  }

  // Save the politician to the database
  const politicianData = {
    // Create random id for now. I dont care what it is as long as it is random.
    name: response.member.name,
    bioguide_id: response.member.bioguideId,
    current_party: response.member.partyName,
    home_state: response.member.state,
  };

  await politicianModel.save(politicianData);

  return politicianData;
};

const getPoliticianListsSearch = async (
  svcCtx: ServiceContext,
  url: string,
  lowerName: string
) => {
  const politicianModel = svcCtx.models?.politicianModel;
  if (!politicianModel) {
    throw new Error("PoliticianModel not provided in service context");
  }

  const finalApiKey = checkApiKey(apiKey);
  const finalUrl = addQueryParams(url, { api_Key: finalApiKey, limit: "250" });
  let data: DataGovMembersResponse = (await axios.get(finalUrl)).data;
  if (!data.members || data.members.length === 0) {
    return null;
  }

  let targetMember = null;
  const [firstNameMatched, lastNameMatched] = lowerName.split(" ");
  let politiciansToSave = [];

  while (data.pagination.next && !targetMember) {
    for (const member of data.members) {
      politiciansToSave.push({
        name: member.name,
        bioguide_id: member.bioguideId,
        current_party: member.partyName,
        home_state: member.state,
      });
      if (
        member.name.toLowerCase().includes(firstNameMatched) &&
        member.name.toLowerCase().includes(lastNameMatched)
      ) {
        targetMember = member;
        break;
      }
      // Collect politician data
    }

    if (!targetMember && data.pagination.next) {
      data = (await axios.get(data.pagination.next)).data;
    }
  }

  // Bulk save politicians after the loop
  if (politiciansToSave.length > 0) {
    await politicianModel.bulkSave(politiciansToSave);
  }

  if (!targetMember) {
    return null;
  }

  const sponsoredBills = await getBillsForMember(
    svcCtx,
    targetMember.bioguideId,
    true
  );
  const cosponsoredBills = await getBillsForMember(
    svcCtx,
    targetMember.bioguideId,
    false
  );

  return {
    member: targetMember,
    sponsoredBills,
    cosponsoredBills,
  };
};

const getBillsForMember = async (
  svcCtx: ServiceContext,
  bioguideId: string,
  isSponsored: boolean
): Promise<any[]> => {
  try {
    const billModel = svcCtx.models?.billModel;
    const billInvolvementModel = svcCtx.models?.billInvolvementModel;

    if (!billModel || !billInvolvementModel) {
      throw new Error(
        "BillModel or BillInvolvementModel not provided in service context"
      );
    }

    const finalApiKey = checkApiKey(apiKey);
    const baseUrl = defaultUrls.member;
    const endpoint = isSponsored
      ? `${bioguideId}/sponsored-legislation`
      : `${bioguideId}/cosponsored-legislation`;
    const url = constructUrl(baseUrl, [endpoint]);
    const finalUrl = addQueryParams(url, {
      api_Key: finalApiKey,
      limit: "250",
    });

    let allBills: any[] = [];
    let nextUrl = finalUrl;
    let billsToFetch: any[] = [];
    let billInvolvementsToAdd: any[] = [];

    while (nextUrl) {
      const response = await axios.get(nextUrl);
      const data = response.data;

      const bills = isSponsored ? data.sponsoredLegislation : data.cosponsors;
      if (!bills || bills.length === 0) break;

      const processedBills = await Promise.all(
        bills.map(async (bill: Bill) => {
          const existingBill = await billModel.get(
            bill.congress.toString(),
            parseInt(bill.number),
            bill.type
          );

          const billInvolvement = {
            bill_number: parseInt(bill.number),
            bill_type: bill.type,
            congress_number: bill.congress,
            bioguide_id: bioguideId,
            is_main_sponsor: isSponsored,
          };

          const existingBillInvolvement = await billInvolvementModel.get(
            billInvolvement.bill_type,
            billInvolvement.bill_number,
            billInvolvement.congress_number
          );

          if (!existingBillInvolvement) {
            billInvolvementsToAdd.push(billInvolvement);
          }

          if (existingBill) {
            return { bill: existingBill, needsFetch: false };
          } else {
            return { bill, needsFetch: true };
          }
        })
      );

      processedBills.forEach(({ bill, needsFetch }) => {
        if (needsFetch) {
          billsToFetch.push(bill);
        } else {
          allBills.push(bill);
        }
      });

      nextUrl = data.pagination?.next;
    }

    // Fetch bill details concurrently
    const newBillsDetails = await Promise.all(
      billsToFetch.map((bill) => getBillDetails(bill.url, { api_Key: apiKey }))
    );

    const newBills: Array<bills["Insert"]> = newBillsDetails
      .map((billDetails) => {
        if (!billDetails.bill) {
          return null;
        }
        return {
          name: billDetails.bill.title,
          sponsors: billDetails.bill.sponsors,
          cosponsors: billDetails.bill.cosponsors,
          type: billDetails.bill.type,
          introduced_date: billDetails.bill.introducedDate,
          chamber: billDetails.bill.originChamber,
          congress_number: billDetails.bill.congress,
          summary: billDetails.bill.summaries,
          number: parseInt(billDetails.bill.number),
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
      })
      .filter((bill) => bill !== null);

    // Bulk insert new bills
    console.log("newBillsExample", newBills[0]);
    console.log("newBillsLength", newBills.length);
    if (newBills.length > 0) {
      await Promise.all(newBills.map((bill) => billModel.insert(bill)));
    }

    allBills.push(...newBills);

    // Bulk insert bill involvements
    if (billInvolvementsToAdd.length > 0) {
      await billInvolvementModel.bulkInsert(billInvolvementsToAdd);
    }

    return allBills;
  } catch (error) {
    console.error("Error in getBillsForMember:", error);
    throw error;
  }
};

const getBillDetails = async (url: string, queryParams: any): Promise<any> => {
  const finalUrl = addQueryParams(url, queryParams, false);
  const response = await axios.get(finalUrl);
  console.log("response", response.data);
  return response.data;
};

export { getPoliticianInfo, getBillsForMember };
