# SwasthyaSync: High-Maturity Enterprise Context

## 🧬 Architectural Evolution
SwasthyaSync has evolved into a **High-Maturity Enterprise Architecture** (Hexagonal/DIP). We strictly follow the **SOLID** principles with a heavy emphasis on **Dependency Inversion** and **Event-Driven patterns.**

---

## 🏗️ The Evolutionary Layers

### 1. Domain Layer (`/domain`)
The absolute core. Contains logic that doesn't change when technology does.
-   **Entities**: Pure TS Interfaces ([`Metric.ts`](file:///src/modules/health/domain/entities/Metric.ts)).
-   **Interfaces**: Port contracts for repositories.
-   **Events**: Domain-meaningful state changes ([`MetricLoggedEvent.ts`](file:///src/modules/health/domain/events/MetricLoggedEvent.ts)).

### 2. Application Layer (`/application`)
User-facing use cases.
-   **Use Cases**: Atomic business actions ([`LogMetricUseCase.ts`](file:///src/modules/health/application/use-cases/LogMetricUseCase.ts)).
-   **DTOs**: The only objects allowed to leave the Application boundary ([`MetricDTO.ts`](file:///src/modules/health/application/dtos/metric.dto.ts)).
-   **Mappers**: Translators (ACL) between Entities and DTOs.
-   **Validators**: Zod-based entry validation.

### 3. Infrastructure Layer (`/infrastructure`)
-   **Repositories**: Drizzle implementations for PostgreSQL.
-   **Adapters**: External systems (BullMQ, Redis).

### 4. Composition Root (`health.composition.ts`)
The **Brain** of the module. It:
1.  Instantiates all infrastructure.
    2.  Wires them into Use Cases.
    3.  **Subscribes Infrastructure side-effects** (BullMQ/Analytics) to Domain Events.

---

## 📡 Messaging & Events: `EventBus`
Side effects are handled asynchronously through an internal **`EventBus`**. This ensures the primary user action (logging a weight) is fast and decoupled from secondary actions (triggering AI analysis via BullMQ).

---

## 🛡️ Data Protection (ACL) Protocol
-   **No leaking Domain Entities**: The UI only sees DTOs.
-   **No leaking DB details**: Use Cases only see Repository interfaces.
-   **Validation at the gate**: All inputs are Zod-filtered before reaching Use Cases.

---
**Last Updated**: 2026-04-11
**Maturity Level**: 🔥 Enterprise + DIP + Hexagonal
**Next Unlock**: Unit of Work & Saga Patterns
