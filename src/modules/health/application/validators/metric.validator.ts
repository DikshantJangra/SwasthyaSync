import { z } from 'zod';

/**
 * Validation for incoming API input.
 * This runs at runtime on the server (not just TypeScript types).
 */
export const CreateMetricSchema = z.object({
  // Only allow known metric types
  type: z.enum(['hydration', 'weight', 'height', 'blood_group']),

  // Numbers for most metrics, string for blood group
  value: z.union([z.number(), z.string()]),

  // Optional unit, like "kg" or "cm"
  unit: z.string().optional(),
});

// TypeScript type derived from the schema above
export type CreateMetricDTO = z.infer<typeof CreateMetricSchema>;
