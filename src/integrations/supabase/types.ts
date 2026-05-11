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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      current_affairs_domain_stats: {
        Row: {
          accuracy: number
          attempts: number
          consistency: number
          domain: string
          id: string
          retention: number
          trend: number
          updated_at: string
          user_id: string
          weak_areas: string[] | null
        }
        Insert: {
          accuracy?: number
          attempts?: number
          consistency?: number
          domain: string
          id?: string
          retention?: number
          trend?: number
          updated_at?: string
          user_id: string
          weak_areas?: string[] | null
        }
        Update: {
          accuracy?: number
          attempts?: number
          consistency?: number
          domain?: string
          id?: string
          retention?: number
          trend?: number
          updated_at?: string
          user_id?: string
          weak_areas?: string[] | null
        }
        Relationships: []
      }
      open_ended_responses: {
        Row: {
          answer: string
          category: string | null
          clarity_score: number | null
          communication_score: number | null
          confidence_score: number | null
          created_at: string
          evaluation: string | null
          follow_up_questions: string[] | null
          id: string
          logical_consistency_score: number | null
          originality_score: number | null
          overall_score: number | null
          question: string
          strengths: string[] | null
          user_id: string
          weaknesses: string[] | null
        }
        Insert: {
          answer: string
          category?: string | null
          clarity_score?: number | null
          communication_score?: number | null
          confidence_score?: number | null
          created_at?: string
          evaluation?: string | null
          follow_up_questions?: string[] | null
          id?: string
          logical_consistency_score?: number | null
          originality_score?: number | null
          overall_score?: number | null
          question: string
          strengths?: string[] | null
          user_id: string
          weaknesses?: string[] | null
        }
        Update: {
          answer?: string
          category?: string | null
          clarity_score?: number | null
          communication_score?: number | null
          confidence_score?: number | null
          created_at?: string
          evaluation?: string | null
          follow_up_questions?: string[] | null
          id?: string
          logical_consistency_score?: number | null
          originality_score?: number | null
          overall_score?: number | null
          question?: string
          strengths?: string[] | null
          user_id?: string
          weaknesses?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          current_affairs_score: number
          email: string | null
          hobbies: string[] | null
          id: string
          name: string | null
          readiness_score: number
          sop_interests: string | null
          streak: number
          stream: string | null
          updated_at: string
          xp: number
        }
        Insert: {
          created_at?: string
          current_affairs_score?: number
          email?: string | null
          hobbies?: string[] | null
          id: string
          name?: string | null
          readiness_score?: number
          sop_interests?: string | null
          streak?: number
          stream?: string | null
          updated_at?: string
          xp?: number
        }
        Update: {
          created_at?: string
          current_affairs_score?: number
          email?: string | null
          hobbies?: string[] | null
          id?: string
          name?: string | null
          readiness_score?: number
          sop_interests?: string | null
          streak?: number
          stream?: string | null
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          accuracy: number
          category: string | null
          completed_at: string
          id: string
          quiz_type: string
          score: number
          time_taken: number
          user_id: string
        }
        Insert: {
          accuracy?: number
          category?: string | null
          completed_at?: string
          id?: string
          quiz_type: string
          score?: number
          time_taken?: number
          user_id: string
        }
        Update: {
          accuracy?: number
          category?: string | null
          completed_at?: string
          id?: string
          quiz_type?: string
          score?: number
          time_taken?: number
          user_id?: string
        }
        Relationships: []
      }
      real_interview_archive: {
        Row: {
          best_answers: Json
          candidate_background: string | null
          created_at: string
          difficulty: string | null
          duration_minutes: number | null
          grilling_themes: string[] | null
          id: string
          interview_flow: Json
          lessons_learned: string[] | null
          panel_type: string | null
          slug: string
          stress_moments: Json
          tags: string[] | null
          title: string
          updated_at: string
          weak_answers: Json
        }
        Insert: {
          best_answers?: Json
          candidate_background?: string | null
          created_at?: string
          difficulty?: string | null
          duration_minutes?: number | null
          grilling_themes?: string[] | null
          id?: string
          interview_flow?: Json
          lessons_learned?: string[] | null
          panel_type?: string | null
          slug: string
          stress_moments?: Json
          tags?: string[] | null
          title: string
          updated_at?: string
          weak_answers?: Json
        }
        Update: {
          best_answers?: Json
          candidate_background?: string | null
          created_at?: string
          difficulty?: string | null
          duration_minutes?: number | null
          grilling_themes?: string[] | null
          id?: string
          interview_flow?: Json
          lessons_learned?: string[] | null
          panel_type?: string | null
          slug?: string
          stress_moments?: Json
          tags?: string[] | null
          title?: string
          updated_at?: string
          weak_answers?: Json
        }
        Relationships: []
      }
      streaks: {
        Row: {
          current_streak: number
          history: Json
          longest_streak: number
          quiz_frequency: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          history?: Json
          longest_streak?: number
          quiz_frequency?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          history?: Json
          longest_streak?: number
          quiz_frequency?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      xp_progress: {
        Row: {
          achievements: Json
          level: number
          milestones: Json
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          achievements?: Json
          level?: number
          milestones?: Json
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          achievements?: Json
          level?: number
          milestones?: Json
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
