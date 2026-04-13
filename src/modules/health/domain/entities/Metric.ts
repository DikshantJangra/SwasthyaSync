export type MetricType = 'hydration' | 'weight' | 'height' | 'blood_group';

export interface HealthMetric {
  id?: number;
  userId: string;
  type: MetricType;
  value: number | string;
  unit?: string | null;
  timestamp: Date;
}
