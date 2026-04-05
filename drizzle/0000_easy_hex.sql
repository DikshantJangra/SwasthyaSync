CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_metrics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "health_metrics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"value" integer NOT NULL,
	"unit" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_vault_records" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"fileUrl" text,
	"recordDate" timestamp NOT NULL,
	"tags" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medical_appointments" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"doctorName" text NOT NULL,
	"specialty" text,
	"appointmentDate" timestamp NOT NULL,
	"location" text,
	"notes" text,
	"status" text DEFAULT 'scheduled',
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "fitness_ai_insights" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fitness_daily_summaries" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"date" date NOT NULL,
	"total_calories_in" double precision DEFAULT 0,
	"total_calories_out" double precision DEFAULT 0,
	"net_calories" double precision DEFAULT 0,
	"weight_kg" double precision,
	"steps" integer,
	"sleep_minutes" integer,
	"water_ml" integer,
	"mood_score" integer,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "fitness_exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"target_muscles" jsonb,
	"equipment" jsonb,
	"mechanic" text,
	"force" text,
	"level" text
);
--> statement-breakpoint
CREATE TABLE "fitness_external_providers" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"provider_type" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"token_expiry" timestamp,
	"last_sync" timestamp,
	"is_active" boolean DEFAULT true,
	"config" jsonb
);
--> statement-breakpoint
CREATE TABLE "fitness_family_access" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"member_id" text NOT NULL,
	"permissions" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fitness_fasting_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"target_duration_hours" integer,
	"is_completed" boolean DEFAULT false,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "fitness_foods" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"brand" text,
	"calories" integer NOT NULL,
	"protein" double precision NOT NULL,
	"carbs" double precision NOT NULL,
	"fat" double precision NOT NULL,
	"micronutrients" jsonb,
	"serving_size" double precision NOT NULL,
	"serving_unit" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fitness_goals" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"goal_date" date,
	"target_nutrients" jsonb,
	"target_values" jsonb,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fitness_nutrition_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"date" date NOT NULL,
	"meal_type" text NOT NULL,
	"food_name" text,
	"food_id" text,
	"meal_id" text,
	"quantity" double precision NOT NULL,
	"unit" text NOT NULL,
	"nutrients" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fitness_sleep_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"date" date NOT NULL,
	"bed_time" timestamp,
	"wake_time" timestamp,
	"total_duration_minutes" integer,
	"quality_score" integer,
	"stages" jsonb,
	"latency_minutes" integer,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "fitness_tdee_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"date" date NOT NULL,
	"tdee" double precision NOT NULL,
	"confidence" text NOT NULL,
	"is_fallback" boolean DEFAULT false,
	"calculation_context" jsonb
);
--> statement-breakpoint
CREATE TABLE "fitness_water_containers" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"volume_ml" integer NOT NULL,
	"is_default" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "fitness_water_intake" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"amount_ml" integer NOT NULL,
	"container_id" text
);
--> statement-breakpoint
CREATE TABLE "fitness_workout_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"workout_id" text,
	"date" timestamp DEFAULT now() NOT NULL,
	"duration_minutes" integer NOT NULL,
	"calories_burned" integer,
	"avg_heart_rate" integer,
	"steps" integer,
	"notes" text,
	"sets" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fitness_workouts" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"exercise_ids" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_metrics" ADD CONSTRAINT "health_metrics_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_vault_records" ADD CONSTRAINT "health_vault_records_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_appointments" ADD CONSTRAINT "medical_appointments_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_ai_insights" ADD CONSTRAINT "fitness_ai_insights_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_daily_summaries" ADD CONSTRAINT "fitness_daily_summaries_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_external_providers" ADD CONSTRAINT "fitness_external_providers_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_family_access" ADD CONSTRAINT "fitness_family_access_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_family_access" ADD CONSTRAINT "fitness_family_access_member_id_user_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_fasting_logs" ADD CONSTRAINT "fitness_fasting_logs_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_goals" ADD CONSTRAINT "fitness_goals_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_nutrition_logs" ADD CONSTRAINT "fitness_nutrition_logs_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_sleep_logs" ADD CONSTRAINT "fitness_sleep_logs_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_tdee_logs" ADD CONSTRAINT "fitness_tdee_logs_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_water_containers" ADD CONSTRAINT "fitness_water_containers_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_water_intake" ADD CONSTRAINT "fitness_water_intake_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_workout_logs" ADD CONSTRAINT "fitness_workout_logs_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_workout_logs" ADD CONSTRAINT "fitness_workout_logs_workout_id_fitness_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."fitness_workouts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fitness_workouts" ADD CONSTRAINT "fitness_workouts_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;