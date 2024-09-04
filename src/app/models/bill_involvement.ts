import client from "@/utils/supabase/client";
import { Database } from "./types";

type BillInvolvement = Database["public"]["Tables"]["bill_involvement"];

class BillInvolvementModel {
  static async get(
    bioguide_id: string
  ): Promise<
    Pick<
      BillInvolvement["Row"],
      "bill_number" | "bill_type" | "is_main_sponsor"
    >[]
  > {
    const { data, error } = await client
      .from("bill_involvement")
      .select("bill_number, bill_type, is_main_sponsor")
      .eq("bioguide_id", bioguide_id);

    if (error) throw new Error("Error fetching bill involvements!");
    return data;
  }

  static async insert(row: BillInvolvement["Insert"]): Promise<void> {
    const { error } = await client.from("bill_involvement").insert(row);
    if (error) throw new Error("Error inserting bill involvement!");
  }

  static async bulkInsert(rows: BillInvolvement["Insert"][]): Promise<void> {
    const { error } = await client.from("bill_involvement").insert(rows);
    if (error) throw new Error("Error bulk inserting bill involvements!");
  }
}

export default BillInvolvementModel;
