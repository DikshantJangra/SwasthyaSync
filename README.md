# 🧠 SwasthyaSync — High-Maturity Health OS

> **"What gets measured, gets managed."**  
> **"Your Health, In Sync."**

SwasthyaSync is a **privacy-first, all-in-one personal health operating system**. It is a living ecosystem where individuals can track, store, analyze, and share every dimension of their health — from daily vitals and hydration to medical documents, doctor visits, nutrition, and metabolic trends.

---

## 🚀 Core Pillars

- **India-First, World-Ready**: Culturally-aware tracking for Indian diets, regional cuisines, and Ayurvedic wisdom.
- **Privacy as a Feature**: Temporary access links, audit logs, and encrypted storage. Your data stays yours.
- **Hexagonal Engine**: Built on a high-maturity enterprise architecture (Ports & Adapters) for maximum scalability and testability.
- **Unified Pulse**: Aggregating fitness, medical, and wellness data into a single, intelligent dashboard.

---

## 🏗️ Architecture: The Hexagonal Engine

SwasthyaSync follows a strict **Hexagonal (Ports & Adapters) Architecture** with **Dependency Inversion (DIP)** and **Domain-Driven Design (DDD)** principles.

### 1. Domain Layer (`/domain`)
The absolute core. Contains logic that doesn't change when technology does.
- **Entities**: Pure TypeScript Interfaces (e.g., `Metric.ts`).
- **Interfaces**: Port contracts for repositories.
- **Events**: Domain-meaningful state changes (e.g., `MetricLoggedEvent.ts`).

### 2. Application Layer (`/application`)
Orchestrates business logic through Use Cases.
- **Use Cases**: Atomic business actions (e.g., `LogMetricUseCase.ts`).
- **DTOs**: The only objects allowed to leave the Application boundary.
- **Mappers**: Translators (ACL) between Entities and DTOs.
- **Validators**: Zod-based entry validation.

### 3. Infrastructure Layer (`/infrastructure`)
The "Adapters" that connect the domain to the outside world.
- **Repositories**: Drizzle ORM implementations for PostgreSQL.
- **Adapters**: External systems like BullMQ (background jobs) and Redis.

### 4. Composition Root (`*.composition.ts`)
The **Brain** of each module. It instantiates infrastructure, wires them into Use Cases, and subscribes side-effects (BullMQ/Analytics) to Domain Events.

---

## 🌐 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **API** | tRPC (End-to-end typesafe API) |
| **Database** | PostgreSQL + Drizzle ORM |
| **Auth** | Better Auth / Supabase Auth |
| **Background Jobs** | BullMQ + Redis |
| **Validation** | Zod |
| **Styling** | Tailwind CSS v4 + Vanilla CSS |
| **Icons** | Lucide React + React Icons |

---

## 📱 Feature Modules

### 🫀 Health Tracking
Track key metrics like Height, Weight, Blood Group, and BMI. Data is processed through the hexagonal pipeline with background job triggers for AI analysis.

### 🏋️ Fitness & Nutrition
- **Workout Logging**: Sets, reps, RPE, and duration tracking.
- **Nutrition**: Meal logging with macro/micro-nutrient breakdown.
- **Metabolic Engine**: Adaptive TDEE calculation based on weight trends and calorie intake.

### 🩺 Medical Records (Health Vault)
- **Document Management**: Store prescriptions, lab reports, and X-rays.
- **Doctor Meetups**: Schedule and track appointments with specialty-based filtering.
- **Vault Search**: Tag-based search and filtering for all medical records.

### 🧘 Wellness & Metabolic
- **Hydration Tracker**: Multi-beverage tracking with daily goals.
- **Sleep Logs**: Track duration and quality scores.
- **Fasting**: Intermittent fasting timer and history.
- **Unified Pulse**: A master dashboard aggregating data from all repositories in parallel.

---

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router (UI Layer)
├── components/           # Shared UI components
├── lib/                  # Shared utilities (DB, Events, Auth)
│   ├── db/               # Drizzle schema & client
│   └── events/           # Internal EventBus implementation
├── modules/              # Hexagonal Feature Modules
│   ├── health/           # Health metrics module
│   ├── fitness/          # Fitness, Nutrition, & Metabolic module
│   └── medical/          # Appointments & Vault module
│       ├── domain/       # Entities & Repository Interfaces
│       ├── application/  # Use Cases, DTOs, & Mappers
│       ├── infrastructure/# Drizzle Repos & Adapters
│       └── *.composition.ts # Module wiring
└── server/               # tRPC router definitions
```

---

## 📊 System Diagrams

Detailed architectural diagrams are available in the [`/diagram`](./diagram/diagrams.md) directory:

- [**ER Diagram**](./diagram/er-diagram.md): Database schema and relationships.
- [**Class Diagram**](./diagram/class-diagram.md): Hexagonal architecture and class relationships.
- [**Sequence Diagrams**](./diagram/sequence-diagram.md): Runtime flows for key operations.
- [**Use Case Diagram**](./diagram/use-case-diagram.md): Actor-feature interactions.

---

## 🔧 Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL
- Redis (for BullMQ)

### 2. Installation
```bash
git clone https://github.com/DikshantJangra/SwasthyaSync.git
cd SwasthyaSync
npm install
```

### 3. Environment Setup
Create a `.env` file based on `.env.example`:
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
BETTER_AUTH_SECRET=...
```

### 4. Database Setup
```bash
npx drizzle-kit push
```

### 5. Run Development Server
```bash
npm run dev
```

---

## 🔮 Roadmap

- **Phase 1**: Foundation Hardening (Next.js migration, Zod validation).
- **Phase 2**: Indian-First Calorie Tracker (Regional cuisines, Thali builder).
- **Phase 3**: Activity & Yoga Integration.
- **Phase 4**: Prescription OCR & Medicine Reminders.
- **Phase 5**: Family Health Hub & Caregiver Mode.
- **Phase 6**: Doctor Portal with Temporary Access Links.
- **Phase 7**: AI Health Intelligence (Trend prediction, anomaly detection).

---

> *"We're not building another health app. We're building a health revolution — one sync at a time."* 🚀
