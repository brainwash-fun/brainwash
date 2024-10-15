import { BillInvolvementModel, BillModel, PoliticianModel } from "@/app/models";
import { NextRequest, NextResponse } from "next/server";

import {
  getPoliticianInfo,
  getBillsForMember,
} from "../../../../../../utils/api/politics";
import { createClient } from "../../../../../../utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { memberName: string } }
) {
  const { memberName } = params;

  // Create the Politician Model with the server side supabase client
  const supabase = createClient();
  const politicianModel = new PoliticianModel(supabase);

  if (!memberName) {
    return NextResponse.json(
      { message: "Invalid member name" },
      { status: 400 }
    );
  }

  try {
    // Politician name must be separated by a space, not a comma
    // Get politician information
    const politicianInfo = await getPoliticianInfo(
      politicianModel,
      memberName.toLowerCase()
    );

    if (!politicianInfo) {
      return NextResponse.json(
        { message: "Politician not found" },
        { status: 404 }
      );
    }

    const billModel = new BillModel(supabase);
    const billInvolvementModel = new BillInvolvementModel(supabase);
    const sponsoredBills = await getBillsForMember(
      billModel,
      billInvolvementModel,
      politicianInfo.bioguide_id,
      true
    );
    const cosponsoredBills = await getBillsForMember(
      billModel,
      billInvolvementModel,
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
