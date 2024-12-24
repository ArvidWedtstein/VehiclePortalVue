export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Changelog: {
        Row: {
          changes: Json
          created_at: string
          createdby_id: string | null
          id: number
          operation: string
          schema_name: string
          table_name: string
          vehicle_id: number | null
        }
        Insert: {
          changes: Json
          created_at?: string
          createdby_id?: string | null
          id?: number
          operation: string
          schema_name: string
          table_name: string
          vehicle_id?: number | null
        }
        Update: {
          changes?: Json
          created_at?: string
          createdby_id?: string | null
          id?: number
          operation?: string
          schema_name?: string
          table_name?: string
          vehicle_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Changelog_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "Vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      Profiles: {
        Row: {
          created_at: string
          id: number
          name: string | null
          profile_image_url: string | null
          role_id: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          profile_image_url?: string | null
          role_id?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          profile_image_url?: string | null
          role_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          },
        ]
      }
      Roles: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      RolesPermissions: {
        Row: {
          created_at: string
          createdby_id: string | null
          delete: boolean | null
          id: number
          insert: boolean | null
          role_id: number
          table_name: string
          update: boolean | null
        }
        Insert: {
          created_at?: string
          createdby_id?: string | null
          delete?: boolean | null
          id?: number
          insert?: boolean | null
          role_id: number
          table_name: string
          update?: boolean | null
        }
        Update: {
          created_at?: string
          createdby_id?: string | null
          delete?: boolean | null
          id?: number
          insert?: boolean | null
          role_id?: number
          table_name?: string
          update?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "RolesPermissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          },
        ]
      }
      VehicleDocuments: {
        Row: {
          created_at: string
          file_path: string
          file_size: number | null
          id: number
          name: string | null
          service_log_id: number | null
          type: string | null
          vehicle_id: number
        }
        Insert: {
          created_at?: string
          file_path: string
          file_size?: number | null
          id?: number
          name?: string | null
          service_log_id?: number | null
          type?: string | null
          vehicle_id: number
        }
        Update: {
          created_at?: string
          file_path?: string
          file_size?: number | null
          id?: number
          name?: string | null
          service_log_id?: number | null
          type?: string | null
          vehicle_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "VehicleDocuments_service_log_id_fkey"
            columns: ["service_log_id"]
            isOneToOne: false
            referencedRelation: "VehicleServiceLogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "VehicleDocuments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "Vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      VehicleExpenses: {
        Row: {
          amount: number | null
          cost: number | null
          created_at: string
          createdby_id: string | null
          currency: string | null
          date: string
          id: number
          mileage: number | null
          notes: string | null
          price_per_unit: number | null
          type: string | null
          unit: string | null
          vehicle_id: number
        }
        Insert: {
          amount?: number | null
          cost?: number | null
          created_at?: string
          createdby_id?: string | null
          currency?: string | null
          date?: string
          id?: number
          mileage?: number | null
          notes?: string | null
          price_per_unit?: number | null
          type?: string | null
          unit?: string | null
          vehicle_id: number
        }
        Update: {
          amount?: number | null
          cost?: number | null
          created_at?: string
          createdby_id?: string | null
          currency?: string | null
          date?: string
          id?: number
          mileage?: number | null
          notes?: string | null
          price_per_unit?: number | null
          type?: string | null
          unit?: string | null
          vehicle_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "VehicleExpenses_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "Vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      VehicleManufacturers: {
        Row: {
          created_at: string
          id: number
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      Vehicles: {
        Row: {
          body_type: string | null
          color: string | null
          created_at: string
          createdby_id: string | null
          drivetrain: string | null
          engine_size: string | null
          eu_control_date: string | null
          fuel_capacity: number | null
          fuel_capacity_unit: string | null
          fuel_type: string | null
          height: string | null
          id: number
          length: string | null
          licenseplate_number: string | null
          make: string | null
          mileage_unit: string | null
          model: string | null
          name: string | null
          owner_user_id: string | null
          registered_date: string | null
          thumbnail: string | null
          transmission_gears: number | null
          transmission_type: string | null
          type: string | null
          vehicle_identification_number: string | null
          weight: number | null
          width: string | null
        }
        Insert: {
          body_type?: string | null
          color?: string | null
          created_at?: string
          createdby_id?: string | null
          drivetrain?: string | null
          engine_size?: string | null
          eu_control_date?: string | null
          fuel_capacity?: number | null
          fuel_capacity_unit?: string | null
          fuel_type?: string | null
          height?: string | null
          id?: number
          length?: string | null
          licenseplate_number?: string | null
          make?: string | null
          mileage_unit?: string | null
          model?: string | null
          name?: string | null
          owner_user_id?: string | null
          registered_date?: string | null
          thumbnail?: string | null
          transmission_gears?: number | null
          transmission_type?: string | null
          type?: string | null
          vehicle_identification_number?: string | null
          weight?: number | null
          width?: string | null
        }
        Update: {
          body_type?: string | null
          color?: string | null
          created_at?: string
          createdby_id?: string | null
          drivetrain?: string | null
          engine_size?: string | null
          eu_control_date?: string | null
          fuel_capacity?: number | null
          fuel_capacity_unit?: string | null
          fuel_type?: string | null
          height?: string | null
          id?: number
          length?: string | null
          licenseplate_number?: string | null
          make?: string | null
          mileage_unit?: string | null
          model?: string | null
          name?: string | null
          owner_user_id?: string | null
          registered_date?: string | null
          thumbnail?: string | null
          transmission_gears?: number | null
          transmission_type?: string | null
          type?: string | null
          vehicle_identification_number?: string | null
          weight?: number | null
          width?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Vehicles_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "Profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      VehicleServiceLogs: {
        Row: {
          cost: number | null
          created_at: string
          createdby_id: string | null
          currency: string | null
          date: string
          id: number
          mileage: number | null
          notes: string | null
          provider: string | null
          type: string | null
          vehicle_id: number
        }
        Insert: {
          cost?: number | null
          created_at?: string
          createdby_id?: string | null
          currency?: string | null
          date?: string
          id?: number
          mileage?: number | null
          notes?: string | null
          provider?: string | null
          type?: string | null
          vehicle_id: number
        }
        Update: {
          cost?: number | null
          created_at?: string
          createdby_id?: string | null
          currency?: string | null
          date?: string
          id?: number
          mileage?: number | null
          notes?: string | null
          provider?: string | null
          type?: string | null
          vehicle_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "VehicleServiceLogs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "Vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      VehicleShares: {
        Row: {
          created_at: string
          createdby_id: string | null
          id: number
          readonly: boolean
          updated_at: string | null
          user_id: string
          vehicle_id: number
        }
        Insert: {
          created_at?: string
          createdby_id?: string | null
          id?: number
          readonly?: boolean
          updated_at?: string | null
          user_id: string
          vehicle_id: number
        }
        Update: {
          created_at?: string
          createdby_id?: string | null
          id?: number
          readonly?: boolean
          updated_at?: string | null
          user_id?: string
          vehicle_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "VehiclesShared_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "VehiclesShared_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "Vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      changelog_with_profile: {
        Row: {
          changes: Json | null
          created_at: string | null
          createdby_id: string | null
          createdby_name: string | null
          createdby_profile_image_url: string | null
          id: number | null
          operation: string | null
          schema_name: string | null
          table_name: string | null
          vehicle_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Changelog_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "Vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_permission: {
        Args: {
          tablename: string
          operation: string
        }
        Returns: boolean
      }
      get_last_mileage: {
        Args: {
          vehicle_id: number
          type?: string
        }
        Returns: {
          mileage: number
          unit: string
        }[]
      }
      terminate_user: {
        Args: {
          profile_user_id: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

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
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

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
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
