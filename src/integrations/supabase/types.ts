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
      about_content: {
        Row: {
          hero_image: string | null
          id: number
          page_eyebrow: string | null
          page_title_line1: string | null
          page_title_line2: string | null
          stat1_label: string | null
          stat1_suffix: string | null
          stat1_value: number | null
          stat2_label: string | null
          stat2_suffix: string | null
          stat2_value: number | null
          stat3_label: string | null
          stat3_suffix: string | null
          stat3_value: number | null
          stat4_label: string | null
          stat4_suffix: string | null
          stat4_value: number | null
          story_body: string | null
          story_eyebrow: string | null
          story_title: string | null
          updated_at: string
          workshop_desc: string | null
          workshop_eyebrow: string | null
          workshop_image: string | null
          workshop_title: string | null
        }
        Insert: {
          hero_image?: string | null
          id?: number
          page_eyebrow?: string | null
          page_title_line1?: string | null
          page_title_line2?: string | null
          stat1_label?: string | null
          stat1_suffix?: string | null
          stat1_value?: number | null
          stat2_label?: string | null
          stat2_suffix?: string | null
          stat2_value?: number | null
          stat3_label?: string | null
          stat3_suffix?: string | null
          stat3_value?: number | null
          stat4_label?: string | null
          stat4_suffix?: string | null
          stat4_value?: number | null
          story_body?: string | null
          story_eyebrow?: string | null
          story_title?: string | null
          updated_at?: string
          workshop_desc?: string | null
          workshop_eyebrow?: string | null
          workshop_image?: string | null
          workshop_title?: string | null
        }
        Update: {
          hero_image?: string | null
          id?: number
          page_eyebrow?: string | null
          page_title_line1?: string | null
          page_title_line2?: string | null
          stat1_label?: string | null
          stat1_suffix?: string | null
          stat1_value?: number | null
          stat2_label?: string | null
          stat2_suffix?: string | null
          stat2_value?: number | null
          stat3_label?: string | null
          stat3_suffix?: string | null
          stat3_value?: number | null
          stat4_label?: string | null
          stat4_suffix?: string | null
          stat4_value?: number | null
          story_body?: string | null
          story_eyebrow?: string | null
          story_title?: string | null
          updated_at?: string
          workshop_desc?: string | null
          workshop_eyebrow?: string | null
          workshop_image?: string | null
          workshop_title?: string | null
        }
        Relationships: []
      }
      contact_content: {
        Row: {
          form_intro: string | null
          form_title: string | null
          id: number
          info_eyebrow: string | null
          info_title: string | null
          map_subtitle: string | null
          map_title: string | null
          page_eyebrow: string | null
          page_intro: string | null
          page_title: string | null
          page_title_italic: string | null
          updated_at: string
        }
        Insert: {
          form_intro?: string | null
          form_title?: string | null
          id?: number
          info_eyebrow?: string | null
          info_title?: string | null
          map_subtitle?: string | null
          map_title?: string | null
          page_eyebrow?: string | null
          page_intro?: string | null
          page_title?: string | null
          page_title_italic?: string | null
          updated_at?: string
        }
        Update: {
          form_intro?: string | null
          form_title?: string | null
          id?: number
          info_eyebrow?: string | null
          info_title?: string | null
          map_subtitle?: string | null
          map_title?: string | null
          page_eyebrow?: string | null
          page_intro?: string | null
          page_title?: string | null
          page_title_italic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      home_capabilities: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          image: string | null
          sort_order: number
          title: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image?: string | null
          sort_order?: number
          title: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          image?: string | null
          sort_order?: number
          title?: string
          visible?: boolean
        }
        Relationships: []
      }
      home_content: {
        Row: {
          adv1_desc: string | null
          adv1_image: string | null
          adv1_tag: string | null
          adv1_title: string | null
          adv2_desc: string | null
          adv2_image: string | null
          adv2_tag: string | null
          adv2_title: string | null
          advantage_eyebrow: string | null
          advantage_title: string | null
          brands: Json | null
          btn_contact: string | null
          btn_contact_link: string | null
          btn_explore: string | null
          btn_explore_link: string | null
          capabilities_desc: string | null
          capabilities_eyebrow: string | null
          capabilities_title: string | null
          clients_eyebrow: string | null
          clients_title: string | null
          cta_button: string | null
          cta_button_link: string | null
          cta_desc: string | null
          cta_eyebrow: string | null
          cta_title: string | null
          hero_eyebrow: string | null
          hero_image: string | null
          hero_intro: string | null
          hero_title_italic: string | null
          hero_title_line1: string | null
          hero_title_line2: string | null
          id: number
          section_order: Json | null
          section_visibility: Json | null
          stat1_label: string | null
          stat1_suffix: string | null
          stat1_value: number | null
          stat2_label: string | null
          stat2_suffix: string | null
          stat2_value: number | null
          stat3_label: string | null
          stat3_suffix: string | null
          stat3_value: number | null
          stat4_label: string | null
          stat4_suffix: string | null
          stat4_value: number | null
          stats_eyebrow: string | null
          stats_title: string | null
          updated_at: string
        }
        Insert: {
          adv1_desc?: string | null
          adv1_image?: string | null
          adv1_tag?: string | null
          adv1_title?: string | null
          adv2_desc?: string | null
          adv2_image?: string | null
          adv2_tag?: string | null
          adv2_title?: string | null
          advantage_eyebrow?: string | null
          advantage_title?: string | null
          brands?: Json | null
          btn_contact?: string | null
          btn_contact_link?: string | null
          btn_explore?: string | null
          btn_explore_link?: string | null
          capabilities_desc?: string | null
          capabilities_eyebrow?: string | null
          capabilities_title?: string | null
          clients_eyebrow?: string | null
          clients_title?: string | null
          cta_button?: string | null
          cta_button_link?: string | null
          cta_desc?: string | null
          cta_eyebrow?: string | null
          cta_title?: string | null
          hero_eyebrow?: string | null
          hero_image?: string | null
          hero_intro?: string | null
          hero_title_italic?: string | null
          hero_title_line1?: string | null
          hero_title_line2?: string | null
          id?: number
          section_order?: Json | null
          section_visibility?: Json | null
          stat1_label?: string | null
          stat1_suffix?: string | null
          stat1_value?: number | null
          stat2_label?: string | null
          stat2_suffix?: string | null
          stat2_value?: number | null
          stat3_label?: string | null
          stat3_suffix?: string | null
          stat3_value?: number | null
          stat4_label?: string | null
          stat4_suffix?: string | null
          stat4_value?: number | null
          stats_eyebrow?: string | null
          stats_title?: string | null
          updated_at?: string
        }
        Update: {
          adv1_desc?: string | null
          adv1_image?: string | null
          adv1_tag?: string | null
          adv1_title?: string | null
          adv2_desc?: string | null
          adv2_image?: string | null
          adv2_tag?: string | null
          adv2_title?: string | null
          advantage_eyebrow?: string | null
          advantage_title?: string | null
          brands?: Json | null
          btn_contact?: string | null
          btn_contact_link?: string | null
          btn_explore?: string | null
          btn_explore_link?: string | null
          capabilities_desc?: string | null
          capabilities_eyebrow?: string | null
          capabilities_title?: string | null
          clients_eyebrow?: string | null
          clients_title?: string | null
          cta_button?: string | null
          cta_button_link?: string | null
          cta_desc?: string | null
          cta_eyebrow?: string | null
          cta_title?: string | null
          hero_eyebrow?: string | null
          hero_image?: string | null
          hero_intro?: string | null
          hero_title_italic?: string | null
          hero_title_line1?: string | null
          hero_title_line2?: string | null
          id?: number
          section_order?: Json | null
          section_visibility?: Json | null
          stat1_label?: string | null
          stat1_suffix?: string | null
          stat1_value?: number | null
          stat2_label?: string | null
          stat2_suffix?: string | null
          stat2_value?: number | null
          stat3_label?: string | null
          stat3_suffix?: string | null
          stat3_value?: number | null
          stat4_label?: string | null
          stat4_suffix?: string | null
          stat4_value?: number | null
          stats_eyebrow?: string | null
          stats_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          admin_note: string | null
          company: string | null
          created_at: string
          email: string | null
          handled: boolean
          id: string
          message: string
          name: string
          phone: string | null
          status: string
        }
        Insert: {
          admin_note?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          handled?: boolean
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
        }
        Update: {
          admin_note?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          handled?: boolean
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string
          cover_url: string | null
          created_at: string
          id: string
          published: boolean
          published_date: string | null
          seo_desc: string | null
          seo_title: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          cover_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_date?: string | null
          seo_desc?: string | null
          seo_title?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          cover_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_date?: string | null
          seo_desc?: string | null
          seo_title?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      process_steps: {
        Row: {
          created_at: string
          description: string
          id: string
          sort_order: number
          step_no: string
          title: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          sort_order?: number
          step_no: string
          title: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          sort_order?: number
          step_no?: string
          title?: string
          visible?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          applications: string | null
          cover_url: string | null
          created_at: string
          featured: boolean
          features: Json
          id: string
          intro: string
          name: string
          name_en: string | null
          process: string | null
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          applications?: string | null
          cover_url?: string | null
          created_at?: string
          featured?: boolean
          features?: Json
          id?: string
          intro?: string
          name: string
          name_en?: string | null
          process?: string | null
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          applications?: string | null
          cover_url?: string | null
          created_at?: string
          featured?: boolean
          features?: Json
          id?: string
          intro?: string
          name?: string
          name_en?: string | null
          process?: string | null
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          business_hours: string | null
          company_name: string | null
          company_name_en: string | null
          email: string | null
          footer_copyright: string | null
          footer_intro: string | null
          footer_slogan: string | null
          id: number
          logo_url: string | null
          nav_about: string | null
          nav_contact: string | null
          nav_cta: string | null
          nav_home: string | null
          nav_news: string | null
          nav_products: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_hours?: string | null
          company_name?: string | null
          company_name_en?: string | null
          email?: string | null
          footer_copyright?: string | null
          footer_intro?: string | null
          footer_slogan?: string | null
          id?: number
          logo_url?: string | null
          nav_about?: string | null
          nav_contact?: string | null
          nav_cta?: string | null
          nav_home?: string | null
          nav_news?: string | null
          nav_products?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_hours?: string | null
          company_name?: string | null
          company_name_en?: string | null
          email?: string | null
          footer_copyright?: string | null
          footer_intro?: string | null
          footer_slogan?: string | null
          id?: number
          logo_url?: string | null
          nav_about?: string | null
          nav_contact?: string | null
          nav_cta?: string | null
          nav_home?: string | null
          nav_news?: string | null
          nav_products?: string | null
          phone?: string | null
          updated_at?: string
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
