import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

type Bills = Database["public"]["Tables"]["bills"];

class BillModel {
  private client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async get(
    congress_number: string,
    number: number,
    type: string
  ): Promise<Bills["Row"] | null> {
    const { data, error } = await this.client
      .from("bills")
      .select("*")
      .eq("congress_number", congress_number)
      .eq("number", number)
      .eq("type", type)
      .single();

    // if not found, return null
    if (error) return null;
    return data;
  }

  async insert(row: Bills["Insert"]): Promise<void> {
    const { error } = await this.client.from("bills").insert(row);
    if (error) {
      console.log("error", error);
      throw new Error("Error inserting bill!");
    }
  }

  async update(row: Bills["Update"]): Promise<void> {
    if (!row.congress_number || !row.number || !row.type) {
      throw new Error(
        "Congress number, bill number, and type are required for update!"
      );
    }

    row.updated_at = new Date().toISOString();

    const { error } = await this.client
      .from("bills")
      .update(row)
      .eq("congress_number", row.congress_number)
      .eq("number", row.number)
      .eq("type", row.type);

    if (error) throw new Error("Error updating bill!");
  }

  async bulkInsert(rows: Bills["Insert"][]): Promise<void> {
    const { error } = await this.client.from("bills").insert(rows);
    if (error) throw new Error("Error bulk inserting bills!");
  }

  async bulkGet(
    billKeys: Array<{ congress_number: string; number: number; type: string }>
  ): Promise<Bills["Row"][]> {
    if (billKeys.length === 0) {
      return [];
    }

    const { data, error } = await this.client
      .from("bills")
      .select("*")
      .or(
        billKeys
          .map(
            (key) =>
              `and(congress_number.eq.${key.congress_number},number.eq.${key.number},type.eq.${key.type})`
          )
          .join(",")
      );

    if (error) throw new Error("Error fetching bills in bulk!");
    return data || [];
  }

  async bulkUpsert(rows: Bills["Insert"][]): Promise<void> {
    const existingBills = await this.bulkGet(
      rows.map((row) => ({
        congress_number: row.congress_number,
        number: row.number,
        type: row.type,
      }))
    );
    const existingBillMap = new Map(
      existingBills.map((bill) => [
        `${bill.congress_number}-${bill.number}-${bill.type}`,
        bill,
      ])
    );

    const billsToUpdate: Bills["Update"][] = [];
    const billsToInsert: Bills["Insert"][] = [];

    for (const row of rows) {
      const existingBill = existingBillMap.get(
        `${row.congress_number}-${row.number}-${row.type}`
      );
      if (existingBill && existingBill.summary !== row.summary) {
        billsToUpdate.push({
          ...row,
          updated_at: new Date().toISOString(),
        });
      } else if (!existingBill) {
        billsToInsert.push(row);
      }
    }

    if (billsToUpdate.length > 0) {
      const { error: updateError } = await this.client
        .from("bills")
        .upsert(billsToUpdate);
      if (updateError) throw new Error("Error updating bills in bulk!");
    }

    if (billsToInsert.length > 0) {
      const { error: insertError } = await this.client
        .from("bills")
        .insert(billsToInsert);
      if (insertError) throw new Error("Error inserting new bills in bulk!");
    }
  }
}

export default BillModel;
