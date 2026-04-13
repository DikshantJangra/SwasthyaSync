import { z } from 'zod';

export const CreateMetricSchema = z.object({
  type: z.enum(['hydration', 'weight', 'height', 'blood_group']),
  value: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
});

export type CreateMetricDTO = z.infer<typeof CreateMetricSchema>;
