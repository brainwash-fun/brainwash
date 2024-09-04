import client from "@/utils/supabase/client";
import { Database } from "./types";

type Politicians = Database["public"]["Tables"]["politicians"];

class PoliticianModel {
  static async get(name: string): Promise<Politicians["Row"]> {
    const { data, error } = await client
      .from("politicians")
      .select("*")
      .eq("name", name)
      .single();
    if (error) throw new Error("Error fetching politician!");
    return data;
  }

  static async save(row: Politicians["Insert"]): Promise<void> {
    const { error } = await client.from("politicians").insert(row);
    if (error) throw new Error("Error saving politician!");
  }

  static async bulkSave(rows: Politicians["Insert"][]): Promise<void> {
    const { error } = await client.from("politicians").insert(rows);
    if (error) throw new Error("Error saving politicians!");
  }

  static async update(row: Politicians["Update"]): Promise<void> {
    if (!row.name) {
      console.log("No name provided, aborting update.");
      return;
    }
    try {
      const data = await this.get(row.name);
      if (!data) {
        await this.save(row as Politicians["Insert"]);
      } else {
        row.updated_at = new Date().toISOString();
        const { error } = await client
          .from("politicians")
          .update(row)
          .eq("name", row.name);
        if (error) throw error;
      }
    } catch (e) {
      throw new Error("Error updating politician!");
    }
  }
}

export default PoliticianModel;
