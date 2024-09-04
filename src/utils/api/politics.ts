// This file is for the api calls to the external data sources. Specifically for politicians.
import axios from "axios";
import dotenv from "dotenv";
import { BillInvolvementModel, BillModel, PoliticianModel } from "@/app/models";
import {
  addQueryParams,
  bioguideToNumber,
  checkApiKey,
  constructUrl,
} from "./helpers";
import type { DataGovMembersResponse } from "./types";
import type { Database } from "@/app/models/types";
import config from "@/app/config";

type politicians = Database["public"]["Tables"]["politicians"];
type bills = Database["public"]["Tables"]["bills"];

dotenv.config();
const defaultUrls = config.politics.defaultUrls;
const apiKey = config.politics.dataGovApiKey;

const getBillInfo = async (bill: bills["Row"]): Promise<bills["Row"]> => {
  const finalApiKey = checkApiKey(apiKey);
  const formedUrl = constructUrl(defaultUrls.bill, [
    bill.congress_number,
    bill.type,
    bill.number.toString(),
  ]);
  const url = addQueryParams(formedUrl, { apiKey: finalApiKey });
  const response = await axios.get(url);
  const data: bills["Row"] = response.data;
  return data;
};

const getPoliticianInfo = async (name: string) => {
  // attempt getting the politician info from the db
  const lowerName = name.toLowerCase();
  const politician = await PoliticianModel.get(name);
  if (politician) {
    return politician;
  }

  // if not in db, get from congress.gov
  const constructedUrl = constructUrl(defaultUrls.member, [name]);
  const response = await getPoliticianListsSearch(constructedUrl, lowerName);

  if (!response) {
    throw new Error(`Politician ${name} not found`);
  }

  // Save the politician to the database
  await PoliticianModel.save({
    name: response.member.name,
    bioguide_id: response.member.bioguideId,
    current_party: response.member.partyName,
    home_state: response.member.state,
    terms: response.member.terms,
  });

  return response;
};

const getPoliticianListsSearch = async (url: string, lowerName: string) => {
  const finalApiKey = checkApiKey(apiKey);
  const finalUrl = addQueryParams(url, { apiKey: finalApiKey, limit: "250" });
  let data: DataGovMembersResponse = (await axios.get(finalUrl)).data;
  if (!data.members || data.members.length === 0) {
    return null;
  }

  let targetMember = null;
  while (data.pagination.next && !targetMember) {
    for (const member of data.members) {
      const [lastName, firstName] = member.name.split(", ");
      const fullName = `${firstName.toLowerCase()} ${lastName.toLowerCase()}`;
      if (fullName === lowerName) {
        targetMember = member;
        break;
      }
    }

    if (!targetMember && data.pagination.next) {
      data = (await axios.get(data.pagination.next)).data;
    }
  }

  if (!targetMember) {
    return null;
  }

  const sponsoredBills = await getBillsForMember(targetMember.bioguideId, true);
  const cosponsoredBills = await getBillsForMember(
    targetMember.bioguideId,
    false
  );

  await uploadBillsToDatabase(sponsoredBills);
  await uploadBillsToDatabase(cosponsoredBills);

  await uploadBillInvolvementToDatabase(
    targetMember.bioguideId,
    sponsoredBills,
    true
  );
  await uploadBillInvolvementToDatabase(
    targetMember.bioguideId,
    cosponsoredBills,
    false
  );

  return {
    member: targetMember,
    sponsoredBills,
    cosponsoredBills,
  };
};

const getBillsForMember = async (
  bioguideId: string,
  isSponsored: boolean
): Promise<any[]> => {
  const finalApiKey = checkApiKey(apiKey);
  const baseUrl = config.politics.defaultUrls.bill;
  const endpoint = isSponsored
    ? `member/${bioguideId}/sponsored-legislation`
    : `${bioguideId}`;
  const url = constructUrl(baseUrl, [endpoint]);
  const finalUrl = addQueryParams(url, { apiKey: finalApiKey, limit: "250" });

  let allBills: any[] = [];
  let nextUrl = finalUrl;

  while (nextUrl) {
    const response = await axios.get(nextUrl);
    const data = response.data;

    const bills = isSponsored ? data.sponsoredLegislation : data.cosponsors;
    if (!bills || bills.length === 0) break;

    for (const bill of bills) {
      const billDetails = await getBillDetails(bill.url, finalApiKey);
      allBills.push({
        title: billDetails.bill.title,
        sponsors: billDetails.bill.sponsors,
        cosponsors: { count: billDetails.bill.cosponsors.count },
        type: billDetails.bill.type,
        introducedDate: billDetails.bill.introducedDate,
        originChamber: billDetails.bill.originChamber,
        congress_number: billDetails.bill.congress,
        summaries: { count: billDetails.bill.summaries.count },
        number: parseInt(billDetails.bill.number),
      });
    }

    nextUrl = data.pagination?.next;
  }

  return allBills;
};

const getBillDetails = async (url: string, apiKey: string): Promise<any> => {
  const finalUrl = addQueryParams(url, { apiKey });
  const response = await axios.get(finalUrl);
  return response.data;
};

const uploadBillsToDatabase = async (
  bills: Database["public"]["Tables"]["bills"]["Insert"][]
): Promise<void> => {
  try {
    await BillModel.bulkUpsert(bills);
  } catch (error) {
    console.error("Error upserting bills to database:", error);
  }
};

const uploadBillInvolvementToDatabase = async (
  bioguideId: string,
  bills: any[],
  isMainSponsor: boolean
): Promise<void> => {
  const billInvolvements = bills.map((bill) => ({
    bill_number: bill.number,
    bill_type: bill.type,
    congress_number: bill.congress_number,
    bioguide_id: bioguideId,
    created_at: new Date().toISOString(),
    is_main_sponsor: isMainSponsor,
    updated_at: new Date().toISOString(),
  }));

  try {
    await BillInvolvementModel.bulkInsert(billInvolvements);
  } catch (error) {
    console.error("Error inserting bill involvements to database:", error);
    throw new Error("Failed to insert bill involvements");
  }
};

export { getPoliticianInfo, getBillsForMember };
