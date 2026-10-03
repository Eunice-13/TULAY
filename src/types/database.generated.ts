export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activation_audit: {
        Row: {
          approved_at: string
          approved_by: string
          beneficiary_id: string
          clinic_id: string
          id: string
        }
        Insert: {
          approved_at?: string
          approved_by: string
          beneficiary_id: string
          clinic_id: string
          id?: string
        }
        Update: {
          approved_at?: string
          approved_by?: string
          beneficiary_id?: string
          clinic_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activation_audit_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activation_audit_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activation_audit_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          address: string
          created_at: string
          id: string
          is_demo_verified: boolean
          kind: Database["public"]["Enums"]["facility_kind"]
          latitude: number | null
          longitude: number | null
          name: string
          operating_hours: string | null
          public_contact: string | null
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          is_demo_verified?: boolean
          kind: Database["public"]["Enums"]["facility_kind"]
          latitude?: number | null
          longitude?: number | null
          name: string
          operating_hours?: string | null
          public_contact?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          is_demo_verified?: boolean
          kind?: Database["public"]["Enums"]["facility_kind"]
          latitude?: number | null
          longitude?: number | null
          name?: string
          operating_hours?: string | null
          public_contact?: string | null
        }
        Relationships: []
      }
      medicine_availability: {
        Row: {
          facility_id: string
          id: string
          medicine_id: string
          status: Database["public"]["Enums"]["availability_status"]
          status_changed_at: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          facility_id: string
          id?: string
          medicine_id: string
          status: Database["public"]["Enums"]["availability_status"]
          status_changed_at?: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          facility_id?: string
          id?: string
          medicine_id?: string
          status?: Database["public"]["Enums"]["availability_status"]
          status_changed_at?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "medicine_availability_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medicine_availability_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medicine_availability_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medicines: {
        Row: {
          coverage_group: Database["public"]["Enums"]["medicine_coverage_group"]
          created_at: string
          dosage_form: string
          generic_name: string
          id: string
          strength: string
        }
        Insert: {
          coverage_group: Database["public"]["Enums"]["medicine_coverage_group"]
          created_at?: string
          dosage_form: string
          generic_name: string
          id?: string
          strength: string
        }
        Update: {
          coverage_group?: Database["public"]["Enums"]["medicine_coverage_group"]
          created_at?: string
          dosage_form?: string
          generic_name?: string
          id?: string
          strength?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          beneficiary_id: string
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          id: string
          message: string
          read_at: string | null
          source_key: string
          title: string
        }
        Insert: {
          beneficiary_id: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          source_key: string
          title: string
        }
        Update: {
          beneficiary_id?: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          source_key?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prescription_items: {
        Row: {
          created_at: string
          id: string
          instructions: string
          medicine_id: string
          prescribed_quantity: number | null
          prescription_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          instructions: string
          medicine_id: string
          prescribed_quantity?: number | null
          prescription_id: string
        }
        Update: {
          created_at?: string
          id?: string
          instructions?: string
          medicine_id?: string
          prescribed_quantity?: number | null
          prescription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_items_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescription_items_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          beneficiary_id: string
          clinic_id: string
          doctor_id: string
          id: string
          issued_at: string
          mock_upsc: string
        }
        Insert: {
          beneficiary_id: string
          clinic_id: string
          doctor_id: string
          id?: string
          issued_at?: string
          mock_upsc: string
        }
        Update: {
          beneficiary_id?: string
          clinic_id?: string
          doctor_id?: string
          id?: string
          issued_at?: string
          mock_upsc?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"] | null
          activated_at: string | null
          assigned_clinic_id: string | null
          created_at: string
          display_name: string | null
          facility_id: string | null
          id: string
          registry_record_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          activated_at?: string | null
          assigned_clinic_id?: string | null
          created_at?: string
          display_name?: string | null
          facility_id?: string | null
          id: string
          registry_record_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          activated_at?: string | null
          assigned_clinic_id?: string | null
          created_at?: string
          display_name?: string | null
          facility_id?: string | null
          id?: string
          registry_record_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_assigned_clinic_id_fkey"
            columns: ["assigned_clinic_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      restock_subscriptions: {
        Row: {
          beneficiary_id: string
          created_at: string
          facility_id: string
          id: string
          medicine_id: string
        }
        Insert: {
          beneficiary_id: string
          created_at?: string
          facility_id: string
          id?: string
          medicine_id: string
        }
        Update: {
          beneficiary_id?: string
          created_at?: string
          facility_id?: string
          id?: string
          medicine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restock_subscriptions_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restock_subscriptions_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restock_subscriptions_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_beneficiary: { Args: { p_reference: string }; Returns: Json }
      issue_mock_prescription: {
        Args: { p_beneficiary_id: string; p_items: Json }
        Returns: Json
      }
      list_nearby_yakap_clinics: {
        Args: { p_latitude: number; p_longitude: number }
        Returns: Json
      }
      lookup_pending_beneficiary: {
        Args: { p_reference: string }
        Returns: Json
      }
      lookup_prescription_by_upsc: {
        Args: { p_mock_upsc: string }
        Returns: Json
      }
      match_mock_beneficiary: {
        Args: {
          p_birth_date: string
          p_first_name: string
          p_last_name: string
          p_mock_philhealth_id: string
        }
        Returns: Json
      }
      set_beneficiary_clinic: {
        Args: { p_clinic_id: string; p_latitude?: number; p_longitude?: number }
        Returns: Json
      }
    }
    Enums: {
      account_status: "pending" | "active"
      availability_status: "available" | "out_of_stock"
      facility_kind: "clinic" | "pharmacy"
      medicine_coverage_group: "yakap_essential_21" | "gamot_additional_54"
      notification_channel: "in_app" | "simulated_sms"
      user_role: "beneficiary" | "clinic_staff" | "doctor" | "pharmacy_staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["pending", "active"],
      availability_status: ["available", "out_of_stock"],
      facility_kind: ["clinic", "pharmacy"],
      medicine_coverage_group: ["yakap_essential_21", "gamot_additional_54"],
      notification_channel: ["in_app", "simulated_sms"],
      user_role: ["beneficiary", "clinic_staff", "doctor", "pharmacy_staff"],
    },
  },
} as const
