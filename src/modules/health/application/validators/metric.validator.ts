import { z } from 'zod';

export const CreateMetricSchema = z.object({
  type: z.enum(['hydration', 'weight', 'height', 'blood_pressure']),
  value: z.number(),
  unit: z.string().optional(),
});

export type CreateMetricDTO = z.infer<typeof CreateMetricSchema>;
