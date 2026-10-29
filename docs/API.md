# NagarSetu AI - REST API Specifications

Tagline: *"Connecting Citizens. Empowering Governance."*

Base URL: `/api/v1`

Standard Response Structure:
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}
```

Standard Error Structure:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error description",
    "details": []
  },
  "requestId": "uuid-v4"
}
```

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /api/v1/auth/login`
- **Description**: Authenticates user using email & bcrypt password hash, returns JWT token.
- **Rate Limit**: Max 30 requests per 15 minutes.
- **Request Body**:
```json
{
  "email": "controller@nagarsetu.demo",
  "password": "Demo@1234"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "_id": "6701a2...",
      "name": "Rohan Deshmukh (Controller)",
      "email": "controller@nagarsetu.demo",
      "role": "NAGARSETU_CONTROLLER",
      "municipalityId": "6701a1..."
    }
  },
  "message": "Authentication successful."
}
```

### `GET /api/v1/auth/me`
- **Description**: Returns current authenticated user identity.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "6701a2...",
      "name": "Rohan Deshmukh (Controller)",
      "role": "NAGARSETU_CONTROLLER"
    }
  }
}
```

---

## 2. Municipalities Endpoints (`/api/v1/municipalities`)

### `GET /api/v1/municipalities`
- **Description**: Lists active synthetic demo municipalities.
- **Response (200 OK)**: Returns array of municipalities (`PMC-DEMO`, `KMC-DEMO`, `NMC-DEMO`, `NMC-NGP-DEMO`, `IMC-DEMO`).

### `GET /api/v1/municipalities/:id`
- **Description**: Returns municipality metadata, zones, wards, and departments.

---

## 3. Complaints Endpoints (`/api/v1/complaints`)

### `POST /api/v1/complaints`
- **Headers**: `Authorization: Bearer <token>`
- **Permission**: `complaint:create`
- **Request Body**:
```json
{
  "municipalityId": "6701a1...",
  "wardId": "6701a3...",
  "departmentId": "6701a4...",
  "title": "Water Pipeline Leak near FC Road",
  "description": "Substantial water leakage on public road requiring urgent repair",
  "category": "Water Supply",
  "priority": "P1",
  "severity": "CRITICAL",
  "location": {
    "coordinates": [73.8507, 18.5284],
    "address": "FC Road, Ward 12, Pune"
  }
}
```
- **Response (201 Created)**: Returns created complaint with atomic ID (`NGS-2026-000125`).

### `GET /api/v1/complaints`
- **Headers**: `Authorization: Bearer <token>`
- **Permission**: `complaint:read` (Applies RBAC data scope query filtering)
- **Query Parameters**: `page`, `limit`, `status`, `priority`, `severity`, `category`, `wardId`, `departmentId`, `search`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "page": 1,
    "limit": 20,
    "total": 40,
    "totalPages": 2
  }
}
```

### `PATCH /api/v1/complaints/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Permission**: `complaint:update`
- **Request Body**:
```json
{
  "status": "IN_PROGRESS",
  "priority": "P1",
  "note": "Worker dispatched to location"
}
```
