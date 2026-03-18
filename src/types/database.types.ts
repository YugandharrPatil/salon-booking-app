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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      pet_addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean | null
          line_1: string
          line_2: string | null
          postal_code: string
          state: string
          user_id: string
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          line_1: string
          line_2?: string | null
          postal_code: string
          state: string
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          line_1?: string
          line_2?: string | null
          postal_code?: string
          state?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "pet_users"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_carts: {
        Row: {
          id: string
          items: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          items?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          items?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "pet_users"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_order_items: {
        Row: {
          id: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string
          price_at_purchase?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "pet_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "pet_products"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_orders: {
        Row: {
          created_at: string
          id: string
          shipping_address: Json
          shipping_cost: number
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          shipping_address: Json
          shipping_cost?: number
          status?: string
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          shipping_address?: Json
          shipping_cost?: number
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "pet_users"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_products: {
        Row: {
          age_group: string
          created_at: string
          description: string | null
          feeding_guide: string | null
          id: string
          image_urls: string[] | null
          ingredients: string | null
          name: string
          pet_type: string
          price: number
          stock: number
        }
        Insert: {
          age_group: string
          created_at?: string
          description?: string | null
          feeding_guide?: string | null
          id?: string
          image_urls?: string[] | null
          ingredients?: string | null
          name: string
          pet_type: string
          price: number
          stock?: number
        }
        Update: {
          age_group?: string
          created_at?: string
          description?: string | null
          feeding_guide?: string | null
          id?: string
          image_urls?: string[] | null
          ingredients?: string | null
          name?: string
          pet_type?: string
          price?: number
          stock?: number
        }
        Relationships: []
      }
      pet_users: {
        Row: {
          clerk_user_id: string
          created_at: string
          email: string
          id: string
          name: string | null
        }
        Insert: {
          clerk_user_id: string
          created_at?: string
          email: string
          id?: string
          name?: string | null
        }
        Update: {
          clerk_user_id?: string
          created_at?: string
          email?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      re_chats: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          property_id: string | null
          updated_at: string
          user_email: string
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          property_id?: string | null
          updated_at?: string
          user_email: string
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          property_id?: string | null
          updated_at?: string
          user_email?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "re_chats_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "re_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      re_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          property_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          property_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          property_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "re_inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "re_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      re_messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          sender_id: string
          sender_role: Database["public"]["Enums"]["sender_role"]
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          sender_id: string
          sender_role: Database["public"]["Enums"]["sender_role"]
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
          sender_role?: Database["public"]["Enums"]["sender_role"]
        }
        Relationships: [
          {
            foreignKeyName: "re_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "re_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      re_properties: {
        Row: {
          address: string
          area_sqft: number
          bathrooms: number
          bedrooms: number
          city: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          latitude: number | null
          longitude: number | null
          price: number
          property_type: Database["public"]["Enums"]["property_type"]
          state: string
          status: Database["public"]["Enums"]["property_status"]
          title: string
          updated_at: string
          zip: string
        }
        Insert: {
          address: string
          area_sqft?: number
          bathrooms?: number
          bedrooms?: number
          city: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          price: number
          property_type?: Database["public"]["Enums"]["property_type"]
          state: string
          status?: Database["public"]["Enums"]["property_status"]
          title: string
          updated_at?: string
          zip: string
        }
        Update: {
          address?: string
          area_sqft?: number
          bathrooms?: number
          bedrooms?: number
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          latitude?: number | null
          longitude?: number | null
          price?: number
          property_type?: Database["public"]["Enums"]["property_type"]
          state?: string
          status?: Database["public"]["Enums"]["property_status"]
          title?: string
          updated_at?: string
          zip?: string
        }
        Relationships: []
      }
      re_saved_properties: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "re_saved_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "re_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      re_visits: {
        Row: {
          created_at: string
          id: string
          property_id: string
          status: Database["public"]["Enums"]["visit_status"]
          user_email: string
          user_id: string
          user_name: string
          visit_date: string
          visit_time: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          status?: Database["public"]["Enums"]["visit_status"]
          user_email: string
          user_id: string
          user_name: string
          visit_date: string
          visit_time: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          status?: Database["public"]["Enums"]["visit_status"]
          user_email?: string
          user_id?: string
          user_name?: string
          visit_date?: string
          visit_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "re_visits_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "re_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_appointments: {
        Row: {
          customer_name: string | null
          date: string
          id: string
          rating: number | null
          review: string | null
          service_id: string
          status: string | null
          stylist_id: string
          time: string
          user_id: string
        }
        Insert: {
          customer_name?: string | null
          date: string
          id?: string
          rating?: number | null
          review?: string | null
          service_id: string
          status?: string | null
          stylist_id: string
          time: string
          user_id: string
        }
        Update: {
          customer_name?: string | null
          date?: string
          id?: string
          rating?: number | null
          review?: string | null
          service_id?: string
          status?: string | null
          stylist_id?: string
          time?: string
          user_id?: string
        }
        Relationships: []
      }
      salon_services: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          image_url: string | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: string
          image_url?: string | null
          name: string
          price?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          image_url?: string | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      salon_stylists: {
        Row: {
          id: string
          image_url: string | null
          name: string
          password: string | null
          service_ids: string[] | null
        }
        Insert: {
          id: string
          image_url?: string | null
          name: string
          password?: string | null
          service_ids?: string[] | null
        }
        Update: {
          id?: string
          image_url?: string | null
          name?: string
          password?: string | null
          service_ids?: string[] | null
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
      property_status: "available" | "sold" | "pending"
      property_type:
        | "house"
        | "apartment"
        | "condo"
        | "townhouse"
        | "land"
        | "commercial"
      sender_role: "user" | "admin"
      visit_status: "pending" | "confirmed" | "cancelled"
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
    Enums: {
      property_status: ["available", "sold", "pending"],
      property_type: [
        "house",
        "apartment",
        "condo",
        "townhouse",
        "land",
        "commercial",
      ],
      sender_role: ["user", "admin"],
      visit_status: ["pending", "confirmed", "cancelled"],
    },
  },
} as const
