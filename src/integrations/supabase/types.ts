export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bill_splits: {
        Row: {
          amount: number
          bill_id: string
          created_at: string | null
          id: string
          paid_at: string | null
          payment_method: string | null
          payment_proof_url: string | null
          status: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          bill_id: string
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_proof_url?: string | null
          status?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          bill_id?: string
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_proof_url?: string | null
          status?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_splits_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_splits_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          created_at: string | null
          due_date: string
          household_id: string
          id: string
          month_year: string
          status: string | null
          total_amount: number
        }
        Insert: {
          created_at?: string | null
          due_date: string
          household_id: string
          id?: string
          month_year: string
          status?: string | null
          total_amount: number
        }
        Update: {
          created_at?: string | null
          due_date?: string
          household_id?: string
          id?: string
          month_year?: string
          status?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "bills_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      household_invitations: {
        Row: {
          created_at: string | null
          created_by: string
          current_uses: number | null
          email: string
          expires_at: string
          household_id: string
          id: string
          is_active: boolean | null
          max_uses: number | null
          token: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          current_uses?: number | null
          email: string
          expires_at: string
          household_id: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          token: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          current_uses?: number | null
          email?: string
          expires_at?: string
          household_id?: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          token?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "household_invitations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_invitations_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_invitations_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      household_members: {
        Row: {
          display_name: string
          email: string
          household_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          display_name: string
          email: string
          household_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          display_name?: string
          email?: string
          household_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_members_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          created_at: string | null
          created_by: string
          deletion_reason: string | null
          deletion_scheduled_at: string | null
          due_day: number
          id: string
          name: string
          rent_amount: number
          scheduled_for_deletion: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          deletion_reason?: string | null
          deletion_scheduled_at?: string | null
          due_day: number
          id?: string
          name: string
          rent_amount: number
          scheduled_for_deletion?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          deletion_reason?: string | null
          deletion_scheduled_at?: string | null
          due_day?: number
          id?: string
          name?: string
          rent_amount?: number
          scheduled_for_deletion?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          household_id: string
          id: string
          method: string | null
          paid_at: string | null
          payment_token: string | null
          paymob_order_id: string | null
          resident_id: string
          status: string
          tx_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          household_id: string
          id?: string
          method?: string | null
          paid_at?: string | null
          payment_token?: string | null
          paymob_order_id?: string | null
          resident_id: string
          status?: string
          tx_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          household_id?: string
          id?: string
          method?: string | null
          paid_at?: string | null
          payment_token?: string | null
          paymob_order_id?: string | null
          resident_id?: string
          status?: string
          tx_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "household_members"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_verification_attempts: {
        Row: {
          attempts_count: number | null
          blocked_until: string | null
          created_at: string | null
          id: string
          last_attempt_at: string | null
          phone_number: string
        }
        Insert: {
          attempts_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          last_attempt_at?: string | null
          phone_number: string
        }
        Update: {
          attempts_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          id?: string
          last_attempt_at?: string | null
          phone_number?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          email_verification_expires_at: string | null
          email_verification_token: string | null
          email_verified: boolean | null
          full_name: string | null
          id: string
          payment_pin_created_at: string | null
          payment_pin_hash: string | null
          phone_number: string | null
          phone_verification_code: string | null
          phone_verification_expires_at: string | null
          phone_verified: boolean | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          email_verification_expires_at?: string | null
          email_verification_token?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          payment_pin_created_at?: string | null
          payment_pin_hash?: string | null
          phone_number?: string | null
          phone_verification_code?: string | null
          phone_verification_expires_at?: string | null
          phone_verified?: boolean | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          email_verification_expires_at?: string | null
          email_verification_token?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          payment_pin_created_at?: string | null
          payment_pin_hash?: string | null
          phone_number?: string | null
          phone_verification_code?: string | null
          phone_verification_expires_at?: string | null
          phone_verified?: boolean | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      rent_periods: {
        Row: {
          created_at: string
          due_date: string
          end_date: string
          household_id: string
          id: string
          month_year: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_date: string
          end_date: string
          household_id: string
          id?: string
          month_year: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_date?: string
          end_date?: string
          household_id?: string
          id?: string
          month_year?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_periods_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_send_phone_verification: {
        Args: { phone: string }
        Returns: boolean
      }
      check_overdue_payments: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_household_payments: {
        Args: {
          target_household_id: string
          target_due_date: string
          target_amount: number
        }
        Returns: Json
      }
      end_rent_period: {
        Args: { target_household_id: string; target_month_year: string }
        Returns: Json
      }
      generate_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_phone_verification_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_created_households: {
        Args: Record<PropertyKey, never>
        Returns: {
          household_id: string
        }[]
      }
      get_user_households: {
        Args: Record<PropertyKey, never>
        Returns: {
          household_id: string
        }[]
      }
      is_household_creator: {
        Args: { target_household_id: string }
        Returns: boolean
      }
      is_household_member: {
        Args: { target_household_id: string }
        Returns: boolean
      }
      record_phone_verification_attempt: {
        Args: { phone: string }
        Returns: undefined
      }
      update_overdue_payments: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      use_invitation_token: {
        Args: {
          invitation_token: string
          user_id: string
          display_name: string
        }
        Returns: Json
      }
      validate_invitation_token: {
        Args: { invitation_token: string }
        Returns: Json
      }
      verify_user_email: {
        Args: { verification_token: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
