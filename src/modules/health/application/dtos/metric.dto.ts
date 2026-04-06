export interface MetricDTO {
  /** Database id */
  id: number;

  /** Metric type (hydration/weight/height/blood_group) */
  type: string;

  /** Value is a number for most metrics, or a string for blood group */
  value: number | string;

  /** Optional unit (and used as a fallback for blood group in some DB setups) */
  unit: string | null;

  timestamp: string; // ISO string for frontend
}
