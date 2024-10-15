import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

type BillInvolvement = Database["public"]["Tables"]["bill_involvement"];

class BillInvolvementModel {
  private client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async get(
    bill_type: string,
    bill_number: number,
    congress_number: number
  ): Promise<BillInvolvement["Row"] | null> {
    const { data, error } = await this.client
      .from("bill_involvement")
      .select("*")
      .eq("bill_type", bill_type)
      .eq("bill_number", bill_number)
      .eq("congress_number", congress_number)
      .single();

    if (error) return null;
    return data;
  }

  async insert(row: BillInvolvement["Insert"]): Promise<void> {
    const { error } = await this.client.from("bill_involvement").insert(row);
    if (error) throw new Error("Error inserting bill involvement!");
  }

  async bulkInsert(rows: BillInvolvement["Insert"][]): Promise<void> {
    const creationTime = new Date().toISOString();
    rows.forEach((row) => {
      row.created_at = creationTime;
      row.updated_at = creationTime;
    });
    const { error } = await this.client.from("bill_involvement").insert(rows);
    if (error) throw new Error("Error bulk inserting bill involvements!");
  }

  async update(row: BillInvolvement["Update"]): Promise<void> {
    if (!row.bill_type || !row.bill_number || !row.congress_number) {
      throw new Error(
        "Bill type, bill number, and congress number are required for update!"
      );
    }

    row.updated_at = new Date().toISOString();

    const { error } = await this.client
      .from("bill_involvement")
      .update(row)
      .eq("bill_type", row.bill_type)
      .eq("bill_number", row.bill_number)
      .eq("congress_number", row.congress_number);

    if (error) throw new Error("Error updating bill involvement!");
  }
}

export default BillInvolvementModel;
