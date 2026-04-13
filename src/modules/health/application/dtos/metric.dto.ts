export interface MetricDTO {
  id: number;
  type: string;
  value: number | string;
  unit: string | null;
  timestamp: string; // ISO string for frontend
}
