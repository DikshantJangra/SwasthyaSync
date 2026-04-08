import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});


const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // During build time on Vercel, some env vars might be missing. 
  // We only throw if we're NOT in a build environment.
  if (process.env.NEXT_PHASE !== 'phase-production-build') {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment variables');
  }
}

// Export the data if successful, otherwise a partial/empty object for build phase
export const env = parsed.success ? parsed.data : (process.env as any);
