export type ChargebeePlanId = {
  monthly?: string;
  [key: string]: string | undefined;
};

export interface TreatmentApi {
  id: number | string;
  name: string;
  header?: string | null;
  description?: string | null; // HTML
  starting_price?: string | null;
  duration?: number | null;
  image?: string | null;
  chargebee_plan_id?: ChargebeePlanId | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface TreatmentsResponse {
  data: TreatmentApi[];
}
