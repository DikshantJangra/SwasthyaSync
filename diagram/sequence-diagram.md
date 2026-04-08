# 🔄 SwasthyaSync — Sequence Diagrams

> Shows the runtime flow of key operations through all architecture layers. Derived from `src/modules/health/FLOW.txt`, tRPC routers, use cases, and composition roots.

---

## 1. Log Health Metric (Weight / Height / Blood Group)

The primary write flow. Demonstrates the full hexagonal pipeline including domain events and background job enqueuing.

```mermaid
sequenceDiagram
    actor User
    participant UI as Dashboard Page
    participant tRPC as healthRouter (tRPC)
    participant Zod as CreateMetricSchema (Zod)
    participant UC as LogMetricUseCase
    participant Repo as DrizzleMetricRepository
    participant DB as PostgreSQL
    participant Mapper as MetricMapper
    participant EB as EventBus
    participant Queue as BullMQ

    User->>UI: Enter weight = 72 kg, click Save
    UI->>tRPC: trpc.health.logMetric.mutate({ type: "weight", value: 72, unit: "kg" })
    tRPC->>tRPC: Auth check (protectedProcedure)
    tRPC->>Zod: Validate input against CreateMetricSchema
    Zod-->>tRPC: ✅ Valid

    tRPC->>UC: logMetricUseCase.execute(userId, { type, value, unit })
    UC->>Repo: save({ userId, type: "weight", value: 72, unit: "kg", timestamp: now })
    Repo->>DB: INSERT INTO health_metrics
    DB-->>Repo: Inserted row (id=42)
    Repo-->>UC: HealthMetric entity

    UC->>EB: publish(MetricLoggedEvent { metric })
    EB-->>Queue: addJob("process-metric", { metricId: 42, userId, type: "weight" })

    UC->>Mapper: toDTO(savedMetric)
    Mapper-->>UC: MetricDTO { id: 42, type: "weight", value: 72, unit: "kg", timestamp: ISO }
    UC-->>tRPC: MetricDTO
    tRPC-->>UI: Success response

    UI->>tRPC: trpc.health.getMetrics.refetch()
    tRPC->>UC: getMetricsUseCase.execute(userId)
    UC->>Repo: findByUserId(userId)
    Repo->>DB: SELECT * FROM health_metrics WHERE userId = ...
    DB-->>Repo: All metric rows
    Repo-->>UC: HealthMetric[]
    UC->>UC: pickLatestPerType(allRows)
    UC->>Mapper: toDTOs(latestMetrics)
    Mapper-->>UC: MetricDTO[]
    UC-->>tRPC: MetricDTO[]
    tRPC-->>UI: Updated metrics
    UI-->>User: Dashboard shows Weight = 72 kg
```

---

## 2. Get Unified Pulse Dashboard

The master dashboard read that aggregates data from **three repositories** in parallel.

```mermaid
sequenceDiagram
    actor User
    participant UI as Dashboard Page
    participant tRPC as healthRouter (tRPC)
    participant UC as GetUnifiedPulseDashboardUseCase
    participant FR as FitnessRepository
    participant MR as MetricRepository
    participant MDR as MedicalRepository
    participant DB as PostgreSQL

    User->>UI: Navigate to Dashboard
    UI->>tRPC: trpc.health.getUnifiedPulse.useQuery()
    tRPC->>tRPC: Auth check (protectedProcedure)
    tRPC->>UC: getUnifiedPulseUseCase.execute(userId)

    par Parallel data fetching via Promise.all
        UC->>FR: getWorkoutLogs(userId)
        FR->>DB: SELECT fitness_workout_logs
        DB-->>FR: WorkoutLog[]

        UC->>FR: getNutritionLogs(userId)
        FR->>DB: SELECT fitness_nutrition_logs
        DB-->>FR: NutritionLogEntry[]

        UC->>FR: getGoals(userId)
        FR->>DB: SELECT fitness_goals
        DB-->>FR: Goal[]

        UC->>FR: getAIInsights(userId)
        FR->>DB: SELECT fitness_ai_insights
        DB-->>FR: AIInsight[]

        UC->>FR: getSleepLogs(userId)
        FR->>DB: SELECT fitness_sleep_logs
        DB-->>FR: SleepLog[]

        UC->>FR: getWaterIntake(userId, today)
        FR->>DB: SELECT fitness_water_intake
        DB-->>FR: WaterIntake[]

        UC->>FR: getFastingLogs(userId)
        FR->>DB: SELECT fitness_fasting_logs
        DB-->>FR: FastingLog[]

        UC->>FR: getTdeeLogs(userId)
        FR->>DB: SELECT fitness_tdee_logs
        DB-->>FR: TdeeLog[]

        UC->>MR: findByUserId(userId)
        MR->>DB: SELECT health_metrics
        DB-->>MR: HealthMetric[]

        UC->>MDR: getAppointments(userId)
        MDR->>DB: SELECT medical_appointments
        DB-->>MDR: MedicalAppointment[]

        UC->>MDR: getVaultRecords(userId)
        MDR->>DB: SELECT health_vault_records
        DB-->>MDR: HealthVaultRecord[]
    end

    UC->>UC: Compute metabolicPulse (TDEE, daily calories)
    UC->>UC: Compute movementPulse (workouts, active minutes)
    UC->>UC: Compute recoveryPulse (sleep, hydration, fasting)
    UC->>UC: Compute medicalPulse (appointments, records, BMI)

    UC-->>tRPC: UnifiedPulsePayload
    tRPC-->>UI: JSON response
    UI-->>User: Full dashboard rendered
```

---

## 3. Log Workout

Demonstrates the fitness module write flow.

```mermaid
sequenceDiagram
    actor User
    participant UI as Workout Page
    participant tRPC as fitnessRouter (tRPC)
    participant Zod as Zod Validator
    participant Engine as fitnessEngine (Composition Root)
    participant UC as LogWorkoutUseCase
    participant Repo as DrizzleFitnessRepository
    participant DB as PostgreSQL

    User->>UI: Complete workout, click Save
    UI->>tRPC: trpc.fitness.logWorkout.mutate({ durationMinutes, sets, notes })
    tRPC->>tRPC: Auth check (protectedProcedure)
    tRPC->>Zod: Validate input schema
    Zod-->>tRPC: ✅ Valid

    tRPC->>Engine: fitnessEngine.logWorkout({ ...input, userId, id, date })
    Engine->>UC: logWorkoutUseCase.execute(workoutLog)
    UC->>Repo: logWorkout(workoutLog)
    Repo->>DB: INSERT INTO fitness_workout_logs (sets stored as JSONB)
    DB-->>Repo: Inserted
    Repo-->>UC: Success
    UC-->>Engine: Success
    Engine-->>tRPC: Success
    tRPC-->>UI: Response
    UI-->>User: Workout logged ✅
```

---

## 4. User Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Login Page
    participant Auth as Supabase Auth / Better Auth
    participant DB as PostgreSQL

    User->>UI: Enter email + password
    UI->>Auth: auth.signIn({ email, password })
    Auth->>DB: Verify credentials in account table
    DB-->>Auth: Match found
    Auth->>DB: INSERT INTO session (token, userId, expiresAt)
    DB-->>Auth: Session created
    Auth-->>UI: Session token + user object
    UI->>UI: Set session cookie
    UI-->>User: Redirect to Dashboard

    Note over UI,Auth: On subsequent requests
    UI->>Auth: auth.api.getSession({ headers })
    Auth->>DB: SELECT FROM session WHERE token = ?
    DB-->>Auth: Valid session
    Auth-->>UI: { session, user }
```

---

> *Source of truth: `src/modules/health/FLOW.txt`, `src/server/routers/`, `src/modules/*/application/use-cases/`*
