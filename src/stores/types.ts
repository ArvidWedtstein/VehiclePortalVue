export type Vehicle = {
  id: number | null;
  created_at?: string;
  createdby_id?: string;
  name: string;
  model: number;
  make: string;
  manufacturer: string;
  drivetrain: string;
  width: string;
  length: string;
  height?: string;
  body_type: string;
  register_number: string;
  vehicle_identification_number: string;
  engine_id?: number;
  transmission_id?: number;
  eu_control_date: string;
  registered_date: string;
  weight: number;
  fuel_capacity: number;
  type: string;
  odometer_unit: string;
  imageUrl?: string;
};

export type Service = {
  id: number | null;
  created_at: string;
  createdby_id?: string;
  vehicle_id: number;
  cost: number;
  currency: string;
  service_date: string;
  service_provider?: string;
  odometer_reading?: number;
  notes?: string;
  type: string;
};

export type Expense = {
  id: number | null;
  created_at: string;
  createdby_id?: string;
  vehicle_id: number;
  expense_date: string;
  expense_type: string;
  amount: number;
  /** TODO: get last value here */
  odometer_reading?: number;
  notes?: string;
  cost: number;
  currency?: string;
  unit?: string;
  /** Computed value */
  price_per_litre?: Readonly<number>;
};
