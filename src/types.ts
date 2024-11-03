export type Vehicle = {
  id: number;
  created_at?: string;
  createdby_id?: string;
  name: string;
  model: string | null;
  make: string;
  color: string;
  drivetrain: string;
  width: string;
  length: string;
  height?: string;
  weight: number;
  body_type: string;
  licenseplate_number: string;
  vehicle_identification_number: string | null;
  engine_id?: number;
  transmission_id?: number;
  eu_control_date: string | null;
  registered_date: string;
  fuel_capacity: number;
  type: string;
  mileage_unit: string;
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
  mileage?: number;
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
  mileage?: number;
  notes?: string;
  cost: number;
  currency?: string;
  unit?: string;
  /** Computed value */
  price_per_litre?: Readonly<number>;
};
