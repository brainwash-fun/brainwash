import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

type Politicians = Database["public"]["Tables"]["politicians"];

class PoliticianModel {
  private client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async testConnection(): Promise<boolean> {
    try {
      const { count, error } = await this.client
        .from("politicians")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error testing connection:", error);
        return false;
      }

      console.log("Connection test successful. Row count:", count);
      return true;
    } catch (e) {
      console.error("Unexpected error testing connection:", e);
      return false;
    }
  }

  async get(name: string): Promise<Politicians["Row"] | null> {
    const [lastName, firstName] = name
      .split(" ")
      .map(
        (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      ); // Split the name, and then capitalize the first letter of each part
    const { data, error } = await this.client
      .from("politicians")
      .select("*")
      .ilike("name", `%${firstName}%`)
      .ilike("name", `%${lastName}%`);
    if (error) {
      throw new Error("Error fetching politician!");
    }

    if (data && data.length > 0) {
      return data[0];
    }

    return null;
  }

  async save(row: Politicians["Insert"]): Promise<void> {
    const creationTime = new Date().toISOString();
    row.created_at = creationTime;
    row.updated_at = creationTime;
    const { error } = await this.client.from("politicians").insert(row);
    if (error) throw new Error("Error saving politician!");
  }

  async bulkSave(rows: Politicians["Insert"][]): Promise<void> {
    await this.testConnection();
    const creationTime = new Date().toISOString();
    rows.forEach((row) => {
      row.created_at = creationTime;
      row.updated_at = creationTime;
    });
    if (rows.length === 0) {
      console.log("No rows to save.");
      return;
    }

    try {
      // Attempt to fetch existing politicians
      const { data: existingPoliticians, error: fetchError } = await this.client
        .from("politicians")
        .select("bioguide_id")
        .in(
          "bioguide_id",
          rows.map((row) => row.bioguide_id)
        );

      if (fetchError) {
        console.error("Error fetching existing politicians:", fetchError);
        // If the table is empty, this might not be a critical error
        if (fetchError.code === "PGRST116") {
          console.log(
            "The politicians table appears to be empty. Proceeding with insert."
          );
        } else {
          throw new Error(
            `Error fetching existing politicians: ${fetchError.message}`
          );
        }
      }

      // Perform upsert for all rows
      const { error: upsertError } = await this.client
        .from("politicians")
        .upsert(rows, {
          onConflict: "bioguide_id",
          ignoreDuplicates: false,
        });

      if (upsertError) {
        throw new Error(`Error upserting politicians: ${upsertError.message}`);
      }

      console.log(`Successfully saved/updated ${rows.length} politicians.`);
    } catch (e) {
      console.error("Unexpected error in bulkSave:", e);
      throw new Error(
        `Unexpected error saving politicians: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }

  async update(row: Politicians["Update"]): Promise<void> {
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
        const { error } = await this.client
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
