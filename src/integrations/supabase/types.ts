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
      assessments: {
        Row: {
          answers: Json
          created_at: string
          id: string
          results: Json
          user_id: string
        }
        Insert: {
          answers: Json
          created_at?: string
          id?: string
          results: Json
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          results?: Json
          user_id?: string
        }
        Relationships: []
      }
      capabilities: {
        Row: {
          id: string
          label: string
        }
        Insert: {
          id: string
          label: string
        }
        Update: {
          id?: string
          label?: string
        }
        Relationships: []
      }
      career_comparisons: {
        Row: {
          career_ids: string[]
          created_at: string
          id: string
          note: string | null
          user_id: string
        }
        Insert: {
          career_ids: string[]
          created_at?: string
          id?: string
          note?: string | null
          user_id: string
        }
        Update: {
          career_ids?: string[]
          created_at?: string
          id?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      career_interests: {
        Row: {
          career_id: string
          interest_id: string
        }
        Insert: {
          career_id: string
          interest_id: string
        }
        Update: {
          career_id?: string
          interest_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_interests_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
        ]
      }
      career_skills: {
        Row: {
          capability_id: string
          career_id: string
        }
        Insert: {
          capability_id: string
          career_id: string
        }
        Update: {
          capability_id?: string
          career_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_skills_capability_id_fkey"
            columns: ["capability_id"]
            isOneToOne: false
            referencedRelation: "capabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_skills_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
        ]
      }
      careers: {
        Row: {
          alt_routes: string[]
          career_type: string | null
          cost_note: string | null
          description: string
          emerging: boolean
          id: string
          industry: string
          progression: string[]
          qualifications: string[]
          resources: Json
          responsibilities: string[]
          subcategory: string | null
          title: string
          trial: string | null
          updated_at: string
        }
        Insert: {
          alt_routes?: string[]
          career_type?: string | null
          cost_note?: string | null
          description: string
          emerging?: boolean
          id: string
          industry: string
          progression?: string[]
          qualifications?: string[]
          resources?: Json
          responsibilities?: string[]
          subcategory?: string | null
          title: string
          trial?: string | null
          updated_at?: string
        }
        Update: {
          alt_routes?: string[]
          career_type?: string | null
          cost_note?: string | null
          description?: string
          emerging?: boolean
          id?: string
          industry?: string
          progression?: string[]
          qualifications?: string[]
          resources?: Json
          responsibilities?: string[]
          subcategory?: string | null
          title?: string
          trial?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      interests: {
        Row: {
          id: string
          label: string
        }
        Insert: {
          id: string
          label: string
        }
        Update: {
          id?: string
          label?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_range: string | null
          created_at: string
          display_name: string | null
          education_level: string | null
          id: string
          onboarded: boolean
          stream: string | null
          updated_at: string
        }
        Insert: {
          age_range?: string | null
          created_at?: string
          display_name?: string | null
          education_level?: string | null
          id: string
          onboarded?: boolean
          stream?: string | null
          updated_at?: string
        }
        Update: {
          age_range?: string | null
          created_at?: string
          display_name?: string | null
          education_level?: string | null
          id?: string
          onboarded?: boolean
          stream?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      roadmap_tasks: {
        Row: {
          description: string | null
          done: boolean
          effort: string | null
          id: string
          phase: number
          position: number
          resource: Json | null
          roadmap_id: string
          title: string
          user_id: string
          week: number | null
        }
        Insert: {
          description?: string | null
          done?: boolean
          effort?: string | null
          id?: string
          phase: number
          position?: number
          resource?: Json | null
          roadmap_id: string
          title: string
          user_id: string
          week?: number | null
        }
        Update: {
          description?: string | null
          done?: boolean
          effort?: string | null
          id?: string
          phase?: number
          position?: number
          resource?: Json | null
          roadmap_id?: string
          title?: string
          user_id?: string
          week?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_tasks_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          career_id: string
          created_at: string
          id: string
          settings: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          career_id: string
          created_at?: string
          id?: string
          settings?: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          career_id?: string
          created_at?: string
          id?: string
          settings?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_careers: {
        Row: {
          career_id: string
          created_at: string
          folder: string
          user_id: string
        }
        Insert: {
          career_id: string
          created_at?: string
          folder?: string
          user_id: string
        }
        Update: {
          career_id?: string
          created_at?: string
          folder?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          budget: number | null
          capabilities: string[]
          environment: string | null
          interests: string[]
          long_goal: string | null
          short_goal: string | null
          subjects: string[]
          updated_at: string
          user_id: string
          weekly_hours: number | null
        }
        Insert: {
          budget?: number | null
          capabilities?: string[]
          environment?: string | null
          interests?: string[]
          long_goal?: string | null
          short_goal?: string | null
          subjects?: string[]
          updated_at?: string
          user_id: string
          weekly_hours?: number | null
        }
        Update: {
          budget?: number | null
          capabilities?: string[]
          environment?: string | null
          interests?: string[]
          long_goal?: string | null
          short_goal?: string | null
          subjects?: string[]
          updated_at?: string
          user_id?: string
          weekly_hours?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
