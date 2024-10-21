import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../../utils/supabase/server";
import { getPoliticianInfo, getBillsForMember } from "../../../../../../utils/api/politics";
import { PoliticianModel, BillModel, BillInvolvementModel } from "@/app/models";
import { ServiceContext } from "../../../../../../utils/api/politics";

export async function GET(
  request: NextRequest,
  { params }: { params: { memberName: string } }
) {
  const { memberName } = params;

  if (!memberName) {
    return NextResponse.json(
      { message: "Invalid member name" },
      { status: 400 }
    );
  }

  try {
    // Create the Supabase client
    const supabase = createClient();

    // Create the ServiceContext
    const svcCtx: ServiceContext = {
      client: supabase,
      models: {
        politicianModel: new PoliticianModel(supabase),
        billModel: new BillModel(supabase),
        billInvolvementModel: new BillInvolvementModel(supabase),
      }
    };

    // Get politician information
    const politicianInfo = await getPoliticianInfo(
      svcCtx,
      memberName.toLowerCase()
    );

    if (!politicianInfo) {
      return NextResponse.json(
        { message: "Politician not found" },
        { status: 404 }
      );
    }

    const sponsoredBills = await getBillsForMember(
      svcCtx,
      politicianInfo.bioguide_id,
      true
    );
    const cosponsoredBills = await getBillsForMember(
      svcCtx,
      politicianInfo.bioguide_id,
      false
    );

    const response = {
      politicianInfo,
      sponsoredBills,
      cosponsoredBills,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching member information:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}