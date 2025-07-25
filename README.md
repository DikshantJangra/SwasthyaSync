# Swāsthya Sync

> Your Health, In Sync.

Swāsthya Sync is a **privacy-first health tracking & document storage platform** that empowers individuals to **track**, **store**, and **share** their health data with privacy and purpose.

---

## Project Overview

**Swāsthya Sync** is focused on:

- Organizing & storing health documents (prescriptions, test reports, etc.)
- Tracking key health metrics and medicine routines
- Providing **temporary access control** to doctors and caregivers
- Creating **awareness** around proactive health tracking

Our motto:  
**"What gets measured, gets managed."**

---

## Goals

1. Make people **aware** of the importance of tracking their health.
2. Build a platform where they can **actually start** doing it — easily, safely, and effectively.
3. Ensure **complete user data privacy** and access control.

---

## Tech Stack

| Area        | Tech Used                         |
|-------------|-----------------------------------|
| Frontend    | React + TypeScript + Vite         |
| Styling     | Tailwind CSS                      |
| Backend     | Supabase (Auth, DB, Storage, API) |
| Deployment  | Vercel -Officially soon           |

**Supabase** now powers authentication, database, and file storage for Swāsthya Sync.

---

## Features (MVP)

- [x] Landing Page (SPA, 5–6 sections)
- [x] Supabase Auth (Sign In/Up)
- [x] Health Info Collection (Start Flow)
- [x] Document Upload & Viewer (Supabase Storage)
- [x] Health Tracker (Vitals, Medicine)
- [ ] Temporary Access Link for Doctors
- [ ] Dashboard UI for user summary

---

## Who's This For?

- Health-conscious individuals
- Elders and caregivers managing records
- Patients visiting multiple doctors
- Fitness and lifestyle optimizers

---

## Getting Started

### 1. Clone the repo

```sh
git clone https://github.com/your-username/swarthya-sync.git
cd swasthyasync
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up Supabase

- Create a [Supabase](https://supabase.com/) project.
- Copy your Supabase URL and anon/public key.
- Create a `.env` file in the root:

  ```
  VITE_SUPABASE_URL=your-supabase-url
  VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
  ```

Contact me to get acces to the keys!

- (Optional) Set up database tables and storage buckets as per `/src/lib/supabaseClient.ts` and project needs.

### 4. Start the dev server

```sh
npm run dev
```

---

## Contribution Guide

We ❤️ contributions! Here’s how you can help:

### Ways to Contribute

- Polish the landing page UI
- Improve Supabase Auth & privacy flows
- Enhance the Health Docs Upload System
- Add new health tracking widgets
- Suggest content for awareness/blog
- Report issues or request features

### How to Contribute

1. **Fork** this repo
2. **Create a branch** for your feature/fix  
   `git checkout -b feature/your-feature-name`
3. **Commit** your changes  
   `git commit -m "Add your message"`
4. **Push** to your fork  
   `git push origin feature/your-feature-name`
5. **Open a Pull Request** describing your changes

#### Need help with Supabase setup?

- See `/src/lib/supabaseClient.ts` for integration details.
- Ask in Issues or Discussions if you get stuck!

---

## Feedback

We’re building this for real people — if you have any thoughts, share via:

- [Issues](https://github.com/DikshantJangra/SwasthyaSync/issues)
- [Discussions](https://github.com/DikshantJangra/SwasthyaSync/issues)
- [email@example.com](mailto:dikshant.jangra2024@nst.rishihood.edu.in)
- [@DikshantJangraa](https://x.com/DikshantJangraa)

---

## Vision

Swāsthya Sync is more than a tool — it’s a **movement toward mindful health**.  
We’re not here to just build another app. We're here to make tracking your health:

- Simple  
- Secure  
- Actually helpful

> *Let’s build health awareness that lasts. One sync at a time.*