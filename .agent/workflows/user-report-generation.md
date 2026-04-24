---
description: Prepare a pipeline to manage user kundli generation based on selected plan and implement it with /generate/kundli page.
---

# Urekha Users Kundli Generation Workflow

## Core Architecture
* **Orchestrator:** A separate orchestrator strictly for user report generation.
* **Pipeline:** A distinct pipeline separate from the standard agent report generation.
* **Report View Page:** A dedicated user view page presented post-generation. Displays charts and prediction reports in a tabular format utilizing different tabs.

## Type Definitions
* All `/jyotisham/:slug` types (e.g., chart, dasha, dosha) are strictly located within the `types/` directory, **not** in general `types`.

## Subscription Plans
*Note: Feature sets must be configured dynamically to allow for easy additions or subtractions.*

### 20 Credits Plan
* Birth details
* Lagna profile
* Divisional charts: D1, D9, D10, D30, D60
* Dosha report
* Predictions: Personal insights, Health, Education

### 50 Credits Plan
* *All features included in the 20 Credits Plan, plus:*
* Planetary details
* Tatkalik friendship table (a subset of the main friendship table)
* Additional charts: D3, D7, D16, D20 + Moon chart
* Ashtakvarga table
* Predictions: Career, Finance, Love

### 150 Credits Plan
* *Comprehensive access:* Includes everything available in the full agent report generation.

## Data Storage & Fetching Constraints
* **Direct Fetching:** Data must be fetched directly from the database (MongoDB) or cache (Redis) on the report view page.
* **State Management:** Do **not** store these fetched results in the Zustand store.
* **Backend Storage:** Data fetched from backend endpoints (`/jyotisham/:slug` or `/predict/:slug`) must be stored in MongoDB specifically for users.
* **Server Actions:** Utilize Next.js Server Actions on the report view page to fetch this stored data.
* **Development Phasing:** The user report view page will be created subsequently, once all backend data fetching implementations are complete.