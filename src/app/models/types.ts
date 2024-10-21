export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      bill_involvement: {
        Row: {
          bill_number: number;
          bill_type: string;
          bioguide_id: string | null;
          congress_number: number;
          created_at: string;
          is_main_sponsor: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          bill_number: number;
          bill_type: string;
          bioguide_id?: string | null;
          congress_number: number;
          created_at?: string;
          is_main_sponsor?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          bill_number?: number;
          bill_type?: string;
          bioguide_id?: string | null;
          congress_number?: number;
          created_at?: string;
          is_main_sponsor?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      bills: {
        Row: {
          chamber: string | null;
          congress_number: string;
          cosponsors: Json | null;
          created_at: string;
          introduced_date: string | null;
          name: string | null;
          number: number;
          sponsors: Json | null;
          summary: string | null;
          type: string;
          updated_at: string | null;
          url: string | null;
        };
        Insert: {
          chamber?: string | null;
          congress_number: string;
          cosponsors?: Json | null;
          created_at?: string;
          introduced_date?: string | null;
          name?: string | null;
          number: number;
          sponsors?: Json | null;
          summary?: string | null;
          type: string;
          updated_at?: string | null;
          url?: string | null;
        };
        Update: {
          chamber?: string | null;
          congress_number?: string;
          cosponsors?: Json | null;
          created_at?: string;
          introduced_date?: string | null;
          name?: string | null;
          number?: number;
          sponsors?: Json | null;
          summary?: string | null;
          type?: string;
          updated_at?: string | null;
          url?: string | null;
        };
        Relationships: [];
      };
      politicians: {
        Row: {
          bioguide_id: string;
          created_at: string;
          current_party: string | null;
          home_state: string | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          bioguide_id: string;
          created_at?: string;
          current_party?: string | null;
          home_state?: string | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          bioguide_id?: string;
          created_at?: string;
          current_party?: string | null;
          home_state?: string | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
