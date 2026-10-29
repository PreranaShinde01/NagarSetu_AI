# NagarSetu AI - Production Architecture Overview

NagarSetu AI is an AI-Powered Smart City Governance and Public Accountability Platform designed to connect Citizens, Controllers, Ward Officers, Department Supervisors, and Municipal Workers in a closed-loop governance platform.

---

## 1. System Topology

```
Electron Desktop Shell (Frameless, Preload Context Isolation)
       │
React 18 Renderer (Vite + React Router v6 + Framer Motion)
       │
API Service Modules (authService.js, complaintService.js, municipalityService.js)
       │
Axios Client Wrapper (src/api/client.js with Bearer token & error interceptors)
       │
Express REST API (server/)
       ├─ Security & Rate Limiters (Helmet, CORS, Express Rate Limit)
       ├─ Middleware (Auth JWT, Permission Enforcement & Data Scope Resolution)
       ├─ Controllers & Services (Auth, Municipality, Complaint, Audit, Counter)
       └─ Mongoose ODM (MongoDB Atlas / Local MongoDB connection)
```

---

## 2. Key Architectural Decisions

1. **Multi-City Data Isolation**:
   - Every resource (`User`, `Ward`, `Department`, `Complaint`, `SLAConfig`, `AuditLog`) carries a `municipalityId` reference.
   - Queries automatically append `municipalityId` filtering derived from `req.user.municipalityId` for non-SUPER_ADMIN users.

2. **Permission-First RBAC & Scope Resolution**:
   - Controllers check permissions (`requirePermission('complaint:read')`).
   - Data scope middleware (`applyDataScope`) resolves user roles (`CITIZEN` → `OWN`, `WARD_OFFICER` → `WARD`, `DEPARTMENT_OFFICER` → `DEPARTMENT`, `NAGARSETU_CONTROLLER` → `MUNICIPALITY`, `SUPER_ADMIN` → `SYSTEM`).

3. **Atomic Complaint ID Generation**:
   - Concurrency-safe atomic counter sequence using `Counter.findOneAndUpdate({ key: 'complaint', year }, { $inc: { sequence: 1 } }, { upsert: true, new: true })`.
   - Generates unique IDs: `NGS-2026-000124`.

4. **Immutable Audit Logging**:
   - Append-only `AuditLog` collection recording actor, role, municipality, action, entity ID, metadata, and request ID. Update/delete operations prohibited at schema level.

5. **AI Service Abstraction**:
   - `src/services/ai/aiService.js` encapsulates AI classification and visual analysis, ensuring renderer components never contain direct AI model secrets.
