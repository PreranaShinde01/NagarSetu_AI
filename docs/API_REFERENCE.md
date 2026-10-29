# NAGARSETU AI — REST API REFERENCE DOCUMENTATION

**Base API URL:** `http://localhost:5000/api/v1`  
**Authentication:** JWT Bearer Token attached via HTTP Header (`Authorization: Bearer <token>`)

---

## 1. Auth Endpoints (`/api/v1/auth`)

| Endpoint | Method | Scope | Description |
| :--- | :--- | :--- | :--- |
| `/login` | `POST` | Public | Authenticate user credentials & return JWT token + user profile. |
| `/me` | `GET` | Authenticated | Retrieve authenticated user's profile and assigned role. |

---

## 2. Municipalities Endpoints (`/api/v1/municipalities`)

| Endpoint | Method | Scope | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Public | List active municipalities (Pune, Kolhapur, Nashik, Nagpur, Ichalkaranji). |
| `/:id` | `GET` | Public | Get detailed municipality configuration (wards, departments, admin units). |
| `/:id/categories` | `GET` | Public | Retrieve configured complaint categories & default SLA hours. |

---

## 3. Complaints Endpoints (`/api/v1/complaints`)

| Endpoint | Method | Scope | Description |
| :--- | :--- | :--- | :--- |
| `/` | `POST` | Citizen | Create new complaint, calculate SLA target, generate `NGS-2026-XXXXXX` ID. |
| `/` | `GET` | Role Scoped | List complaints scoped to user's jurisdiction (Ward, Department, Municipality). |
| `/my` | `GET` | Citizen | Retrieve logged-in citizen's active & past complaint history. |
| `/:id` | `GET` | Role Scoped | Get full complaint details, location coordinates, media, and status history. |
| `/:id/timeline` | `GET` | Role Scoped | Get chronological status history array. |
| `/:id/ai-routing` | `GET` | Controller | Generate AI triage recommendation (priority, ward, department, worker). |
| `/:id/route` | `POST` | Controller | Route/dispatch complaint to ward & department (Approve or Override). |
| `/:id/citizen-verify` | `POST` | Citizen | Confirm resolution closure OR reject & reopen case with justification. |
| `/:id/reopen` | `POST` | Citizen | Reopen resolved complaint with mandatory justification & audit log. |

---

## 4. Work Orders Endpoints (`/api/v1/work-orders`)

| Endpoint | Method | Scope | Description |
| :--- | :--- | :--- | :--- |
| `/` | `POST` | Supervisor | Create new Work Order (`WO-2026-XXXXXX`). Prevents duplicate active orders. |
| `/` | `GET` | Role Scoped | List work orders scoped to worker/supervisor. |
| `/:id` | `GET` | Role Scoped | Get work order details, assigned team, due date, completion evidence. |
| `/:id/accept` | `POST` | Worker | Worker accepts assigned work order. Status → `ACCEPTED`. |
| `/:id/start` | `POST` | Worker | Worker marks field work started. Status → `IN_PROGRESS`. |
| `/:id/complete` | `POST` | Worker | Worker submits before/after photo evidence & notes. Status → `COMPLETED`. |
| `/:id/verify` | `POST` | Supervisor | Supervisor approves (`VERIFIED`) or rejects (`REWORK`) completion evidence. |

---

## 5. SLA & Escalation Endpoints (`/api/v1/sla` & `/api/v1/escalations`)

| Endpoint | Method | Scope | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/sla/summary` | `GET` | Controller | Get SLA compliance metrics, at-risk count, and breached count. |
| `/api/v1/sla/at-risk` | `GET` | Controller | Get list of complaints approaching SLA breach. |
| `/api/v1/sla/breached` | `GET` | Controller | Get list of breached complaints. |
| `/api/v1/escalations` | `GET` | Controller / Senior | List active level 1–3 escalations. |
| `/api/v1/escalations` | `POST` | Controller | Manually trigger escalation for a breached complaint. |
| `/api/v1/escalations/:id/reassign` | `POST` | Controller | Reassign escalated ticket to senior supervisor. |

---

## 6. Analytics & Audit Endpoints (`/api/v1/analytics` & `/api/v1/audit`)

| Endpoint | Method | Scope | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/analytics/overview` | `GET` | Controller / Admin | Get overview metrics, city health score, and category distribution. |
| `/api/v1/analytics/trends` | `GET` | Controller | Get 7-day reported vs. resolved grievance trend line. |
| `/api/v1/analytics/public` | `GET` | Public | Get aggregate city telemetry metrics (PII filtered). |
| `/api/v1/audit` | `GET` | Controller / Admin | Fetch append-only system audit log entries. |
