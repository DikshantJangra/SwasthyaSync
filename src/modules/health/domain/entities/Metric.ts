export type MetricType = 'hydration' | 'weight' | 'height' | 'blood_pressure';

export interface HealthMetric {
  id?: number;
  userId: string;
  type: MetricType;
  value: number;
  unit?: string | null;
  timestamp: Date;
}
