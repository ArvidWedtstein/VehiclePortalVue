export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      Changelog: {
        Row: {
          changes: Json;
          created_at: string;
          createdby_id: string | null;
          id: number;
          operation: string;
          record_id: number;
          schema_name: string;
          table_name: string;
          vehicle_id: number | null;
        };
        Insert: {
          changes: Json;
          created_at?: string;
          createdby_id?: string | null;
          id?: number;
          operation: string;
          record_id: number;
          schema_name: string;
          table_name: string;
          vehicle_id?: number | null;
        };
        Update: {
          changes?: Json;
          created_at?: string;
          createdby_id?: string | null;
          id?: number;
          operation?: string;
          record_id?: number;
          schema_name?: string;
          table_name?: string;
          vehicle_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Changelog_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'myvehicles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Changelog_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'Vehicles';
            referencedColumns: ['id'];
          },
        ];
      };
      Profiles: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
          profile_image_url: string | null;
          role_id: number | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string | null;
          profile_image_url?: string | null;
          role_id?: number | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
          profile_image_url?: string | null;
          role_id?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Profiles_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'Roles';
            referencedColumns: ['id'];
          },
        ];
      };
      Roles: {
        Row: {
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      RolesPermissions: {
        Row: {
          created_at: string;
          createdby_id: string | null;
          delete: boolean | null;
          id: number;
          insert: boolean | null;
          role_id: number;
          table_name: string;
          update: boolean | null;
        };
        Insert: {
          created_at?: string;
          createdby_id?: string | null;
          delete?: boolean | null;
          id?: number;
          insert?: boolean | null;
          role_id: number;
          table_name: string;
          update?: boolean | null;
        };
        Update: {
          created_at?: string;
          createdby_id?: string | null;
          delete?: boolean | null;
          id?: number;
          insert?: boolean | null;
          role_id?: number;
          table_name?: string;
          update?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'RolesPermissions_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'Roles';
            referencedColumns: ['id'];
          },
        ];
      };
      VehicleDocuments: {
        Row: {
          created_at: string;
          file_path: string;
          file_size: number | null;
          id: number;
          name: string | null;
          service_log_id: number | null;
          type: string | null;
          vehicle_id: number;
        };
        Insert: {
          created_at?: string;
          file_path: string;
          file_size?: number | null;
          id?: number;
          name?: string | null;
          service_log_id?: number | null;
          type?: string | null;
          vehicle_id: number;
        };
        Update: {
          created_at?: string;
          file_path?: string;
          file_size?: number | null;
          id?: number;
          name?: string | null;
          service_log_id?: number | null;
          type?: string | null;
          vehicle_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'VehicleDocuments_service_log_id_fkey';
            columns: ['service_log_id'];
            isOneToOne: false;
            referencedRelation: 'VehicleServiceLogs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'VehicleDocuments_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'myvehicles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'VehicleDocuments_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'Vehicles';
            referencedColumns: ['id'];
          },
        ];
      };
      VehicleEngines: {
        Row: {
          code: string | null;
          compression_ratio: number | null;
          created_at: string;
          createdby_id: string | null;
          displacement: number | null;
          fuel_type: string | null;
          horsepower: number | null;
          id: number;
          kilowatt: number | null;
          manufacturer: string | null;
          name: string | null;
          type: string | null;
          valves: number | null;
        };
        Insert: {
          code?: string | null;
          compression_ratio?: number | null;
          created_at?: string;
          createdby_id?: string | null;
          displacement?: number | null;
          fuel_type?: string | null;
          horsepower?: number | null;
          id?: number;
          kilowatt?: number | null;
          manufacturer?: string | null;
          name?: string | null;
          type?: string | null;
          valves?: number | null;
        };
        Update: {
          code?: string | null;
          compression_ratio?: number | null;
          created_at?: string;
          createdby_id?: string | null;
          displacement?: number | null;
          fuel_type?: string | null;
          horsepower?: number | null;
          id?: number;
          kilowatt?: number | null;
          manufacturer?: string | null;
          name?: string | null;
          type?: string | null;
          valves?: number | null;
        };
        Relationships: [];
      };
      VehicleExpenses: {
        Row: {
          amount: number | null;
          cost: number | null;
          created_at: string;
          createdby_id: string | null;
          currency: string | null;
          expense_date: string;
          expense_type: string | null;
          id: number;
          mileage: number | null;
          notes: string | null;
          price_per_litre: number | null;
          unit: string | null;
          vehicle_id: number;
        };
        Insert: {
          amount?: number | null;
          cost?: number | null;
          created_at?: string;
          createdby_id?: string | null;
          currency?: string | null;
          expense_date?: string;
          expense_type?: string | null;
          id?: number;
          mileage?: number | null;
          notes?: string | null;
          price_per_litre?: number | null;
          unit?: string | null;
          vehicle_id: number;
        };
        Update: {
          amount?: number | null;
          cost?: number | null;
          created_at?: string;
          createdby_id?: string | null;
          currency?: string | null;
          expense_date?: string;
          expense_type?: string | null;
          id?: number;
          mileage?: number | null;
          notes?: string | null;
          price_per_litre?: number | null;
          unit?: string | null;
          vehicle_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'VehicleExpenses_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'myvehicles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'VehicleExpenses_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'Vehicles';
            referencedColumns: ['id'];
          },
        ];
      };
      Vehicles: {
        Row: {
          body_type: string | null;
          color: string | null;
          created_at: string;
          createdby_id: string | null;
          drivetrain: string | null;
          engine_id: number | null;
          engine_size: string | null;
          eu_control_date: string | null;
          fuel_capacity: number | null;
          height: string | null;
          id: number;
          length: string | null;
          licenseplate_number: string | null;
          make: string | null;
          mileage_unit: string | null;
          model: string | null;
          name: string | null;
          registered_date: string | null;
          thumbnail: string | null;
          transmission_gears: number | null;
          transmission_id: number | null;
          transmission_type: string | null;
          type: string | null;
          vehicle_identification_number: string | null;
          weight: number | null;
          width: string | null;
        };
        Insert: {
          body_type?: string | null;
          color?: string | null;
          created_at?: string;
          createdby_id?: string | null;
          drivetrain?: string | null;
          engine_id?: number | null;
          engine_size?: string | null;
          eu_control_date?: string | null;
          fuel_capacity?: number | null;
          height?: string | null;
          id?: number;
          length?: string | null;
          licenseplate_number?: string | null;
          make?: string | null;
          mileage_unit?: string | null;
          model?: string | null;
          name?: string | null;
          registered_date?: string | null;
          thumbnail?: string | null;
          transmission_gears?: number | null;
          transmission_id?: number | null;
          transmission_type?: string | null;
          type?: string | null;
          vehicle_identification_number?: string | null;
          weight?: number | null;
          width?: string | null;
        };
        Update: {
          body_type?: string | null;
          color?: string | null;
          created_at?: string;
          createdby_id?: string | null;
          drivetrain?: string | null;
          engine_id?: number | null;
          engine_size?: string | null;
          eu_control_date?: string | null;
          fuel_capacity?: number | null;
          height?: string | null;
          id?: number;
          length?: string | null;
          licenseplate_number?: string | null;
          make?: string | null;
          mileage_unit?: string | null;
          model?: string | null;
          name?: string | null;
          registered_date?: string | null;
          thumbnail?: string | null;
          transmission_gears?: number | null;
          transmission_id?: number | null;
          transmission_type?: string | null;
          type?: string | null;
          vehicle_identification_number?: string | null;
          weight?: number | null;
          width?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Vehicles_engine_id_fkey';
            columns: ['engine_id'];
            isOneToOne: false;
            referencedRelation: 'VehicleEngines';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Vehicles_transmission_id_fkey';
            columns: ['transmission_id'];
            isOneToOne: false;
            referencedRelation: 'VehicleTransmissions';
            referencedColumns: ['id'];
          },
        ];
      };
      VehicleServiceLogs: {
        Row: {
          cost: number | null;
          createby_id: string | null;
          created_at: string;
          currency: string | null;
          id: number;
          mileage: number | null;
          notes: string | null;
          service_date: string;
          service_provider: string | null;
          type: string;
          vehicle_id: number;
        };
        Insert: {
          cost?: number | null;
          createby_id?: string | null;
          created_at?: string;
          currency?: string | null;
          id?: number;
          mileage?: number | null;
          notes?: string | null;
          service_date?: string;
          service_provider?: string | null;
          type: string;
          vehicle_id: number;
        };
        Update: {
          cost?: number | null;
          createby_id?: string | null;
          created_at?: string;
          currency?: string | null;
          id?: number;
          mileage?: number | null;
          notes?: string | null;
          service_date?: string;
          service_provider?: string | null;
          type?: string;
          vehicle_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'VehicleServiceLogs_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'myvehicles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'VehicleServiceLogs_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'Vehicles';
            referencedColumns: ['id'];
          },
        ];
      };
      VehicleShares: {
        Row: {
          created_at: string;
          createdby_id: string | null;
          id: number;
          readonly: boolean;
          updated_at: string | null;
          user_id: string;
          vehicle_id: number;
        };
        Insert: {
          created_at?: string;
          createdby_id?: string | null;
          id?: number;
          readonly?: boolean;
          updated_at?: string | null;
          user_id: string;
          vehicle_id: number;
        };
        Update: {
          created_at?: string;
          createdby_id?: string | null;
          id?: number;
          readonly?: boolean;
          updated_at?: string | null;
          user_id?: string;
          vehicle_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'VehiclesShared_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'Profiles';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'VehiclesShared_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'myvehicles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'VehiclesShared_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'Vehicles';
            referencedColumns: ['id'];
          },
        ];
      };
      VehicleTransmissions: {
        Row: {
          created_at: string;
          createdby_id: string | null;
          gears: number | null;
          id: number;
          manufacturer: string | null;
          name: string | null;
          type: string | null;
        };
        Insert: {
          created_at?: string;
          createdby_id?: string | null;
          gears?: number | null;
          id?: number;
          manufacturer?: string | null;
          name?: string | null;
          type?: string | null;
        };
        Update: {
          created_at?: string;
          createdby_id?: string | null;
          gears?: number | null;
          id?: number;
          manufacturer?: string | null;
          name?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      myvehicles: {
        Row: {
          body_type: string | null;
          color: string | null;
          created_at: string | null;
          createdby_id: string | null;
          drivetrain: string | null;
          engine_id: number | null;
          engine_size: string | null;
          engine_type: string | null;
          eu_control_date: string | null;
          fuel_capacity: number | null;
          fuel_type: string | null;
          height: string | null;
          id: number | null;
          last_odometer_reading: number | null;
          length: string | null;
          licenseplate_number: string | null;
          make: string | null;
          mileage_unit: string | null;
          model: string | null;
          name: string | null;
          registered_date: string | null;
          transmission_gears: number | null;
          transmission_id: number | null;
          transmission_type: string | null;
          type: string | null;
          vehicle_identification_number: string | null;
          weight: number | null;
          width: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Vehicles_engine_id_fkey';
            columns: ['engine_id'];
            isOneToOne: false;
            referencedRelation: 'VehicleEngines';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Vehicles_transmission_id_fkey';
            columns: ['transmission_id'];
            isOneToOne: false;
            referencedRelation: 'VehicleTransmissions';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      check_permission: {
        Args: {
          tablename: string;
          operation: string;
        };
        Returns: boolean;
      };
      get_last_mileage: {
        Args: {
          vehicle_id: number;
          type?: string;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
