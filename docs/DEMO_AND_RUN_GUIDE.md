# NAGARSETU AI — SETUP, DEMO & EXECUTION GUIDE

**Tagline:** *"Connecting Citizens. Empowering Governance."*

---

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` (or remote MongoDB connection URI)
- **OS**: Windows, macOS, or Linux

---

## 2. Environment Setup

Verify the configuration file `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nagarsetu_ai
JWT_SECRET=nagarsetu_ai_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

---

## 3. Database Seeding Command

Run the idempotent database seed script to populate 5 synthetic demo cities (Pune, Kolhapur, Nashik, Nagpur, Ichalkaranji), 11 demo persona accounts, 40+ complaints, work orders, escalations, and audit logs:

```bash
npm run seed
```

---

## 4. Starting the Application

### Option A: Concurrent Full-Stack Launch (Recommended)
Starts Express REST API (port 5000), Vite Dev Server (port 5173), and Electron Desktop Shell together:

```bash
npm run start
```

### Option B: Individual Service Launch
- **Backend API Server**:
  ```bash
  npm run server
  ```
- **Frontend Vite Dev Server**:
  ```bash
  npm run dev
  ```
- **Electron Shell**:
  ```bash
  npm run electron:dev
  ```

---

## 5. Demo Personas & Credentials Matrix

All demo accounts use the common password: `Demo@1234`

| Persona Role | Email Address | Password | Target Dashboard |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@nagarsetu.demo` | `Demo@1234` | `/citizen/dashboard` |
| **Municipal Controller** | `controller@nagarsetu.demo` | `Demo@1234` | `/controller/dashboard` |
| **Ward Officer** | `wardofficer@nagarsetu.demo` | `Demo@1234` | `/ward/dashboard` |
| **Department Officer** | `department@nagarsetu.demo` | `Demo@1234` | `/department/dashboard` |
| **Department Supervisor** | `supervisor@nagarsetu.demo` | `Demo@1234` | `/department/dashboard` |
| **Field Worker** | `worker@nagarsetu.demo` | `Demo@1234` | `/worker/dashboard` |
| **Senior Authority** | `senior@nagarsetu.demo` | `Demo@1234` | `/senior/dashboard` |
| **City Admin** | `cityadmin@nagarsetu.demo` | `Demo@1234` | `/admin/dashboard` |
| **Super Admin** | `superadmin@nagarsetu.demo` | `Demo@1234` | `/admin/dashboard` |
| **Police / Emergency User** | `police@nagarsetu.demo` | `Demo@1234` | `/emergency` |

---

## 6. End-to-End Demonstration Walkthrough

1. **Log in as Citizen** (`citizen@nagarsetu.demo` / `Demo@1234`).
2. Navigate to **Report Civic Issue** (`/citizen/report`).
3. Complete the **7-Step Intelligent Wizard**:
   - Step 1: Select Category (*Road Damage / Pothole Cavity*).
   - Step 2: Enter title and description.
   - Step 3: Attach before photo evidence.
   - Step 4: Pin location on Leaflet map.
   - Step 5: Review AI Analysis (Priority P2, 24h SLA).
   - Step 6: Review summary & click **Submit Civic Complaint**.
   - Step 7: Record unique atomic ID (e.g. `NGS-2026-000052`).
4. **Log in as Municipal Controller** (`controller@nagarsetu.demo`).
5. Open **AI Routing Queue** (`/controller/routing`), inspect ticket `NGS-2026-000052`, and click **Approve AI Route**.
6. **Log in as Department Supervisor** (`supervisor@nagarsetu.demo`).
7. Open **Department Dashboard** (`/department/dashboard`), select complaint `NGS-2026-000052`, and click **Create Work Order** (`WO-2026-XXXXXX`).
8. **Log in as Municipal Worker** (`worker@nagarsetu.demo`).
9. Open **Field Control Panel** (`/worker/dashboard`), click **Accept**, then **Start Work**, attach completion photos, and click **Submit Evidence**.
10. **Log in as Department Supervisor** (`supervisor@nagarsetu.demo`).
11. Inspect completion evidence and click **Approve Resolution**.
12. **Log in as Citizen** (`citizen@nagarsetu.demo`).
13. Open case file, inspect completion proof, and click **YES, ISSUE RESOLVED** to close the ticket!
