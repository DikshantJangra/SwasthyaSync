// Metric "type" is a limited set of strings (helps TS catch typos).
export type MetricType = "hydration" | "weight" | "height" | "blood_group";

export interface HealthMetric {
  /** Database id (set after insert) */
  id?: number;

  /** Who this metric belongs to */
  userId: string;

  /** What this row represents */
  type: MetricType;

  /** Number for most metrics, string for blood group (e.g. "A+") */
  value: number | string;

  /** Optional unit (and a legacy fallback spot for blood group) */
  unit?: string | null;

  /** When it was logged */
  timestamp: Date;
}
