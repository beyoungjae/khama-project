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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          last_login_at: string | null
          name: string
          permissions: Json | null
          role: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_login_at?: string | null
          name: string
          permissions?: Json | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_login_at?: string | null
          name?: string
          permissions?: Json | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admins_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          application_fee: number | null
          certificate_fee: number | null
          created_at: string | null
          description: string | null
          eligibility: string | null
          exam_methods: Json | null
          exam_subjects: Json | null
          exemption_benefits: string | null
          grade: string | null
          id: string
          image_url: string | null
          name: string
          passing_criteria: string | null
          qualification_type: string | null
          registration_number: string
          status: string | null
          updated_at: string | null
          validity_period: string | null
        }
        Insert: {
          application_fee?: number | null
          certificate_fee?: number | null
          created_at?: string | null
          description?: string | null
          eligibility?: string | null
          exam_methods?: Json | null
          exam_subjects?: Json | null
          exemption_benefits?: string | null
          grade?: string | null
          id?: string
          image_url?: string | null
          name: string
          passing_criteria?: string | null
          qualification_type?: string | null
          registration_number: string
          status?: string | null
          updated_at?: string | null
          validity_period?: string | null
        }
        Update: {
          application_fee?: number | null
          certificate_fee?: number | null
          created_at?: string | null
          description?: string | null
          eligibility?: string | null
          exam_methods?: Json | null
          exam_subjects?: Json | null
          exemption_benefits?: string | null
          grade?: string | null
          id?: string
          image_url?: string | null
          name?: string
          passing_criteria?: string | null
          qualification_type?: string | null
          registration_number?: string
          status?: string | null
          updated_at?: string | null
          validity_period?: string | null
        }
        Relationships: []
      }
      education_courses: {
        Row: {
          category: string
          course_code: string
          course_fee: number | null
          created_at: string | null
          curriculum: Json | null
          description: string | null
          duration_hours: number
          id: string
          instructor_bio: string | null
          instructor_name: string | null
          materials_included: string | null
          max_participants: number
          name: string
          prerequisites: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          course_code: string
          course_fee?: number | null
          created_at?: string | null
          curriculum?: Json | null
          description?: string | null
          duration_hours?: number
          id?: string
          instructor_bio?: string | null
          instructor_name?: string | null
          materials_included?: string | null
          max_participants?: number
          name: string
          prerequisites?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          course_code?: string
          course_fee?: number | null
          created_at?: string | null
          curriculum?: Json | null
          description?: string | null
          duration_hours?: number
          id?: string
          instructor_bio?: string | null
          instructor_name?: string | null
          materials_included?: string | null
          max_participants?: number
          name?: string
          prerequisites?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      education_schedules: {
        Row: {
          address: string | null
          classroom: string | null
          course_id: string
          created_at: string | null
          current_participants: number | null
          end_date: string
          id: string
          location: string
          max_participants: number
          registration_end_date: string
          registration_start_date: string
          special_notes: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          classroom?: string | null
          course_id: string
          created_at?: string | null
          current_participants?: number | null
          end_date: string
          id?: string
          location: string
          max_participants?: number
          registration_end_date: string
          registration_start_date: string
          special_notes?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          classroom?: string | null
          course_id?: string
          created_at?: string | null
          current_participants?: number | null
          end_date?: string
          id?: string
          location?: string
          max_participants?: number
          registration_end_date?: string
          registration_start_date?: string
          special_notes?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_schedules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "education_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_applications: {
        Row: {
          applicant_address: string | null
          applicant_birth_date: string
          applicant_email: string
          applicant_name: string
          applicant_phone: string
          application_status: string | null
          certification_id: string
          created_at: string | null
          education_certificate_url: string | null
          education_completed: boolean | null
          exam_number: string | null
          exam_schedule_id: string
          exam_taken_at: string | null
          id: string
          paid_at: string | null
          pass_status: boolean | null
          payment_amount: number | null
          payment_method: string | null
          payment_status: string | null
          practical_score: number | null
          total_score: number | null
          updated_at: string | null
          user_id: string
          written_score: number | null
        }
        Insert: {
          applicant_address?: string | null
          applicant_birth_date: string
          applicant_email: string
          applicant_name: string
          applicant_phone: string
          application_status?: string | null
          certification_id: string
          created_at?: string | null
          education_certificate_url?: string | null
          education_completed?: boolean | null
          exam_number?: string | null
          exam_schedule_id: string
          exam_taken_at?: string | null
          id?: string
          paid_at?: string | null
          pass_status?: boolean | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          practical_score?: number | null
          total_score?: number | null
          updated_at?: string | null
          user_id: string
          written_score?: number | null
        }
        Update: {
          applicant_address?: string | null
          applicant_birth_date?: string
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string
          application_status?: string | null
          certification_id?: string
          created_at?: string | null
          education_certificate_url?: string | null
          education_completed?: boolean | null
          exam_number?: string | null
          exam_schedule_id?: string
          exam_taken_at?: string | null
          id?: string
          paid_at?: string | null
          pass_status?: boolean | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          practical_score?: number | null
          total_score?: number | null
          updated_at?: string | null
          user_id?: string
          written_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_applications_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_applications_exam_schedule_id_fkey"
            columns: ["exam_schedule_id"]
            isOneToOne: false
            referencedRelation: "exam_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_schedules: {
        Row: {
          certification_id: string
          created_at: string | null
          current_applicants: number | null
          exam_address: string | null
          exam_date: string
          exam_instructions: string | null
          exam_location: string
          id: string
          max_applicants: number | null
          registration_end_date: string
          registration_start_date: string
          required_items: Json | null
          result_announcement_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          certification_id: string
          created_at?: string | null
          current_applicants?: number | null
          exam_address?: string | null
          exam_date: string
          exam_instructions?: string | null
          exam_location: string
          id?: string
          max_applicants?: number | null
          registration_end_date: string
          registration_start_date: string
          required_items?: Json | null
          result_announcement_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          certification_id?: string
          created_at?: string | null
          current_applicants?: number | null
          exam_address?: string | null
          exam_date?: string
          exam_instructions?: string | null
          exam_location?: string
          id?: string
          max_applicants?: number | null
          registration_end_date?: string
          registration_start_date?: string
          required_items?: Json | null
          result_announcement_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_schedules_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          alt_text: string | null
          category: string
          created_at: string | null
          description: string | null
          display_order: number | null
          file_name: string
          file_path: string
          file_url: string
          id: string
          is_active: boolean | null
          tags: Json | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          file_name: string
          file_path: string
          file_url: string
          id?: string
          is_active?: boolean | null
          tags?: Json | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          file_name?: string
          file_path?: string
          file_url?: string
          id?: string
          is_active?: boolean | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      notices: {
        Row: {
          attachments: Json | null
          author_id: string | null
          author_name: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          expires_at: string | null
          id: string
          is_important: boolean | null
          is_pinned: boolean | null
          is_published: boolean | null
          published_at: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          attachments?: Json | null
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          expires_at?: string | null
          id?: string
          is_important?: boolean | null
          is_pinned?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          attachments?: Json | null
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          expires_at?: string | null
          id?: string
          is_important?: boolean | null
          is_pinned?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          answered_at: string | null
          author_id: string | null
          author_name: string
          category: string | null
          comment_count: number | null
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          is_admin_author: boolean | null
          is_answered: boolean | null
          is_important: boolean | null
          is_pinned: boolean | null
          is_private: boolean | null
          like_count: number | null
          published_at: string | null
          question_type: string | null
          questioner_email: string | null
          questioner_phone: string | null
          status: string | null
          title: string
          type: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          answered_at?: string | null
          author_id?: string | null
          author_name: string
          category?: string | null
          comment_count?: number | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_admin_author?: boolean | null
          is_answered?: boolean | null
          is_important?: boolean | null
          is_pinned?: boolean | null
          is_private?: boolean | null
          like_count?: number | null
          published_at?: string | null
          question_type?: string | null
          questioner_email?: string | null
          questioner_phone?: string | null
          status?: string | null
          title: string
          type: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          answered_at?: string | null
          author_id?: string | null
          author_name?: string
          category?: string | null
          comment_count?: number | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_admin_author?: boolean | null
          is_answered?: boolean | null
          is_important?: boolean | null
          is_pinned?: boolean | null
          is_private?: boolean | null
          like_count?: number | null
          published_at?: string | null
          question_type?: string | null
          questioner_email?: string | null
          questioner_phone?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          birth_date: string | null
          created_at: string | null
          detail_address: string | null
          gender: string | null
          id: string
          last_login_at: string | null
          marketing_agreed: boolean | null
          marketing_agreed_at: string | null
          name: string | null
          phone: string | null
          postal_code: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          created_at?: string | null
          detail_address?: string | null
          gender?: string | null
          id: string
          last_login_at?: string | null
          marketing_agreed?: boolean | null
          marketing_agreed_at?: string | null
          name?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          created_at?: string | null
          detail_address?: string | null
          gender?: string | null
          id?: string
          last_login_at?: string | null
          marketing_agreed?: boolean | null
          marketing_agreed_at?: string | null
          name?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      qna_answers: {
        Row: {
          author_id: string | null
          author_name: string | null
          content: string
          created_at: string | null
          id: string
          is_official: boolean | null
          question_id: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_official?: boolean | null
          question_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_official?: boolean | null
          question_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qna_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "qna_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      qna_questions: {
        Row: {
          author_email: string | null
          author_id: string
          author_name: string | null
          category: string | null
          content: string
          created_at: string | null
          id: string
          is_answered: boolean | null
          is_private: boolean | null
          status: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_email?: string | null
          author_id: string
          author_name?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_answered?: boolean | null
          is_private?: boolean | null
          status?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_email?: string | null
          author_id?: string
          author_name?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_answered?: boolean | null
          is_private?: boolean | null
          status?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_required: boolean | null
          name: string
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
          validation_rules: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_required?: boolean | null
          name: string
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
          validation_rules?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_required?: boolean | null
          name?: string
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
          validation_rules?: Json | null
        }
        Relationships: []
      }
      user_education_enrollments: {
        Row: {
          attendance_rate: number | null
          certificate_issued_date: string | null
          certificate_number: string | null
          completion_status: string | null
          created_at: string | null
          education_schedule_id: string
          enrollment_date: string | null
          enrollment_number: string
          enrollment_status: string | null
          id: string
          payment_amount: number | null
          payment_date: string | null
          payment_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attendance_rate?: number | null
          certificate_issued_date?: string | null
          certificate_number?: string | null
          completion_status?: string | null
          created_at?: string | null
          education_schedule_id: string
          enrollment_date?: string | null
          enrollment_number: string
          enrollment_status?: string | null
          id?: string
          payment_amount?: number | null
          payment_date?: string | null
          payment_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attendance_rate?: number | null
          certificate_issued_date?: string | null
          certificate_number?: string | null
          completion_status?: string | null
          created_at?: string | null
          education_schedule_id?: string
          enrollment_date?: string | null
          enrollment_number?: string
          enrollment_status?: string | null
          id?: string
          payment_amount?: number | null
          payment_date?: string | null
          payment_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_education_enrollments_education_schedule_id_fkey"
            columns: ["education_schedule_id"]
            isOneToOne: false
            referencedRelation: "education_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bypass_rls_for_service: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      generate_exam_number: {
        Args: { cert_id: string; schedule_id: string }
        Returns: string
      }
      get_file_url: {
        Args: { bucket_name: string; file_path: string }
        Returns: string
      }
      get_user_profile: {
        Args: { user_uuid?: string }
        Returns: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          status: string
        }[]
      }
      increment_gallery_views: {
        Args: { gallery_uuid: string }
        Returns: undefined
      }
      increment_post_views: {
        Args: { post_uuid: string }
        Returns: undefined
      }
      increment_view_count: {
        Args: { record_id: string; table_name: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      update_exam_schedule_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
