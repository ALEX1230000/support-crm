# Support CRM System - Customer Support Ticketing

A full-stack web-based customer support management system built for the **Datastraw Assessment Test**. The application manages customer support tickets, status lifecycles, customer data, internal notes, and team collaboration.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **SQLite**. Designed for **1-click deployment on Vercel**.

---

## 🌟 Key Features

1. **Create Tickets (`POST /api/tickets`)**:
   - Customer name, customer email, issue title (subject), and detailed description.
   - Auto-generated sequential ticket ID (e.g. `TKT-001`, `TKT-002`) and timestamp.
   - Instant client validation and submission feedback.

2. **List All Tickets (`GET /api/tickets`)**:
   - Clean, professional table and mobile-card view displaying Ticket ID, Customer Name & Email, Subject, Status Badge, and Creation Date.

3. **As-You-Type Search Functionality**:
   - Instant search across customer names, ticket IDs, customer emails, subjects, and descriptions.

4. **Filter by Status**:
   - Filter by status tabs: `All`, `Open`, `In Progress`, and `Closed`.
   - Summary workload metrics counter (Total, Open, In Progress, Closed).

5. **View & Update Tickets (`GET /api/tickets/{ticket_id}` & `PUT /api/tickets/{ticket_id}`)**:
   - Comprehensive detail page for each ticket showing customer contact details, description, and status history.
   - Quick one-click status transitions (`Open` &rarr; `In Progress` &rarr; `Closed`).
   - Internal notes / comments timeline with chronological history and instant posting.

---

## 🏗️ Architecture & Database Design

The database schema strictly adheres to the requested two-table structure without over-engineering:

### 1. `tickets` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER (PK AUTOINCREMENT) | Internal record ID |
| `ticket_id` | TEXT (UNIQUE) | Human-readable ID (e.g. `TKT-001`) |
| `customer_name` | TEXT | Customer full name |
| `customer_email`| TEXT | Customer email address |
| `subject` | TEXT | Ticket subject / title |
| `description` | TEXT | Full description of the issue |
| `status` | TEXT | `Open`, `In Progress`, or `Closed` |
| `created_at` | DATETIME | ISO timestamp of ticket creation |
| `updated_at` | DATETIME | ISO timestamp of last update |

### 2. `notes` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER (PK AUTOINCREMENT) | Internal note ID |
| `ticket_id` | TEXT (FK) | Reference to `tickets.ticket_id` |
| `note_text` | TEXT | Internal comment or resolution note |
| `created_at` | DATETIME | ISO timestamp of note creation |

---

## 🚀 API Endpoints Reference

All endpoints return standard JSON and appropriate HTTP status codes:

- **`POST /api/tickets`**
  - **Body**: `{ "customer_name": "string", "customer_email": "string", "subject": "string", "description": "string" }`
  - **Returns**: `{ "ticket_id": "TKT-004", "created_at": "2026-09-21T04:20:00.000Z" }` (HTTP 201)

- **`GET /api/tickets`**
  - **Query Params (Optional)**: `?status=Open&search=john`
  - **Returns**: `[{ "ticket_id": "TKT-001", "customer_name": "...", "subject": "...", "status": "...", "created_at": "..." }]` (HTTP 200)

- **`GET /api/tickets/{ticket_id}`**
  - **Returns**: `{ "ticket_id": "...", "customer_name": "...", "customer_email": "...", "subject": "...", "description": "...", "status": "...", "notes": [...] }` (HTTP 200)

- **`PUT /api/tickets/{ticket_id}`**
  - **Body**: `{ "status": "In Progress", "notes": "New investigation update" }`
  - **Returns**: `{ "success": true, "updated_at": "2026-09-21T04:25:00.000Z" }` (HTTP 200)

---

## 💻 Local Setup & Running

### Prerequisites
- Node.js 18+ or 20+
- npm (or yarn / pnpm)

### Steps

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd support-crm
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   ```bash
   cp .env.example .env.local
   ```
   *By default, the app will automatically create a local SQLite database file (`support_crm.db`) and seed initial demo tickets on first launch!*

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## ☁️ Deploying to Vercel

Vercel is a serverless environment where disk storage is read-only outside of `/tmp`. This application is designed to support both deployment strategies seamlessly:

### Option A: 1-Click Zero Setup on Vercel
1. Import the repository into [Vercel](https://vercel.com).
2. Leave build command as default (`npm run build`).
3. Deploy! The app detects Vercel's serverless environment and utilizes `/tmp/support_crm.db` with auto-seeded demo tickets.

### Option B: Persistent SQLite with Turso (Recommended for Production)
Turso is a managed serverless SQLite database built on libSQL (open-source SQLite fork).
1. Create a free database at [turso.tech](https://turso.tech) (takes 30 seconds).
2. In your Vercel Project Settings &rarr; **Environment Variables**, add:
   - `DATABASE_URL`: `libsql://your-db-name.turso.io`
   - `TURSO_AUTH_TOKEN`: your Turso token
3. Deploy or Redeploy. All ticket data and notes are now permanently stored across edge instances!

---


---

