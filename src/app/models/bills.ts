import client from "@/utils/supabase/client";
import { Database } from "./types";

type Bills = Database["public"]["Tables"]["bills"];

class BillModel {
  static async get(number: number, type: string): Promise<Bills["Row"] | null> {
    const { data, error } = await client
      .from("bills")
      .select("*")
      .eq("number", number)
      .eq("type", type)
      .single();

    if (error) throw new Error("Error fetching bill!");
    return data;
  }

  static async insert(row: Bills["Insert"]): Promise<void> {
    const { error } = await client.from("bills").insert(row);
    if (error) throw new Error("Error inserting bill!");
  }

  static async update(row: Bills["Update"]): Promise<void> {
    if (!row.number || !row.type) {
      throw new Error("Bill number and type are required for update!");
    }

    row.updated_at = new Date().toISOString();

    const { error } = await client
      .from("bills")
      .update(row)
      .eq("number", row.number)
      .eq("type", row.type);

    if (error) throw new Error("Error updating bill!");
  }

  static async bulkInsert(rows: Bills["Insert"][]): Promise<void> {
    const { error } = await client.from("bills").insert(rows);
    if (error) throw new Error("Error bulk inserting bills!");
  }

  static async bulkGet(
    billKeys: Array<{ number: number; type: string }>
  ): Promise<Bills["Row"][]> {
    if (billKeys.length === 0) {
      return [];
    }

    const { data, error } = await client
      .from("bills")
      .select("*")
      .or(
        billKeys
          .map((key) => `and(number.eq.${key.number},type.eq.${key.type})`)
          .join(",")
      );

    if (error) throw new Error("Error fetching bills in bulk!");
    return data || [];
  }

  static async bulkUpsert(rows: Bills["Insert"][]): Promise<void> {
    const existingBills = await this.bulkGet(
      rows.map((row) => ({ number: row.number, type: row.type }))
    );
    const existingBillMap = new Map(
      existingBills.map((bill) => [`${bill.number}-${bill.type}`, bill])
    );

    const billsToUpdate: Bills["Update"][] = [];
    const billsToInsert: Bills["Insert"][] = [];

    for (const row of rows) {
      const existingBill = existingBillMap.get(`${row.number}-${row.type}`);
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
      const { error: updateError } = await client
        .from("bills")
        .upsert(billsToUpdate);
      if (updateError) throw new Error("Error updating bills in bulk!");
    }

    if (billsToInsert.length > 0) {
      const { error: insertError } = await client
        .from("bills")
        .insert(billsToInsert);
      if (insertError) throw new Error("Error inserting new bills in bulk!");
    }
  }
}

export default BillModel;
