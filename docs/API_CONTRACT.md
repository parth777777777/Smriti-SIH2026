# Smriti V1 Frontend Integration Guide

> **Canonical Machine-Readable Contract**: [`docs/openapi.yaml`](./openapi.yaml) (OpenAPI 3.1)  
> **Backend Gateway (Node.js/Express)**: `http://localhost:5000`  
> **Target Clients**: React (Web) & React Native (Mobile)

---

## 1. Overview & Architecture

The Smriti cognitive platform exposes a single unified frontend gateway via the **Node.js Express Backend** on port `5000`. The Python **FastAPI Cognitive Assessment Engine** (port `8000`) is an internal service invoked by the Node backend and is not directly called by frontend clients.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Frontend (Web / Mobile)                     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (Bearer JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Node.js Express Backend (Port 5000)           │
│  - User authentication & role-based access control          │
│  - Daily routines, medications, and reminder tracking       │
│  - Activity session initiation & history persistence        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Internal HTTP (POST /v1/process-session)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          FastAPI Cognitive Assessment Engine (Port 8000)    │
│  - Stage 2: Feature extraction from event telemetry         │
│  - Stage 3: Normalization                                   │
│  - Stage 4: Memory domain composite scoring                 │
│  - Stage 5: Personalized longitudinal baseline calculation  │
│  - Stage 6: Standardized deviation (Z-score) computation    │
│  - Stage 7: Longitudinal drift detection & review flagging  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication & Authorization

All protected endpoints require an `Authorization` header containing the JWT token received from `/auth/login`:

```http
Authorization: Bearer <access_token>
```

### Roles
- `PATIENT`: Accesses personal dashboard, routines, reminders, medications, activities, and personal session history.
- `CAREGIVER`: Accesses managed patient rosters, caregiver alerts, progress summaries, and patient session histories.

### Demo Credentials (V1 Mock Auth)
| Role | Email | User ID | Name |
|---|---|---|---|
| `PATIENT` | `patient@example.com` | `P001` | John Doe |
| `CAREGIVER` | `caregiver@example.com` | `C001` | Sarah Caregiver |

> **Integration Note**: In the current V1 mock authentication, sending any email containing `"caregiver"` generates a `CAREGIVER` token; any other email generates a `PATIENT` token. Passwords are not verified. Tokens expire after 24 hours.

---

## 3. Frontend Gameplay & Session Flow

The lifecycle of a game activity from the frontend client perspective:

```text
1. Select Activity
   Frontend ──GET /activities──► Backend

2. Start Session
   Frontend ──POST /activities/:id/sessions──► Backend
            ◄──{ session_id, started_at, status: "STARTED" }

3. Active Gameplay & Telemetry Collection
   - Frontend displays game board and starts recording interaction events.
   - Every card selection and match evaluation creates a telemetry event.

4. Submit Telemetry on Game Completion
   Frontend ──POST /activities/:id/sessions/:session_id/complete──► Backend
              { telemetry: { session_id, num_pairs, started_at, ended_at, events } }
            ◄──Full Assessment Result Object (Score, Baseline, Deviation, Drift)──

5. Review History & Long-Term Trends
   Frontend ──GET /patients/me/session-history──► Backend
            ◄──Array of past AssessmentResult objects──
```

---

## 4. Memory Match Telemetry Contract

When submitting a completed Memory Match game via `POST /activities/:id/sessions/:session_id/complete`, the request body must have a `telemetry` object structured as follows:

```json
{
  "telemetry": {
    "session_id": "S_1788982858810",
    "activity_id": "memory_match_v1",
    "num_pairs": 4,
    "started_at": "2026-09-07T19:00:00Z",
    "ended_at": "2026-09-07T19:01:24Z",
    "events": [
      {
        "event": "card_selected",
        "timestamp": 1725735605123,
        "card_id": "card_7",
        "position": 7
      },
      {
        "event": "card_selected",
        "timestamp": 1725735606710,
        "card_id": "card_2",
        "position": 2
      },
      {
        "event": "match_result",
        "timestamp": 1725735606725,
        "card_1": "card_7",
        "card_2": "card_2",
        "is_match": false
      }
    ]
  }
}
```

### Critical Telemetry Requirements
1. **`num_pairs`**: **Required** positive integer $\ge 1$. This is the authoritative count of pairs placed on the board (e.g. `4` for an 8-card grid). The assessment engine uses this to calculate true recall and repetition efficiency.
2. **Timestamps**:
   - `started_at` & `ended_at`: ISO 8601 UTC strings (`"2026-09-07T19:00:00Z"`).
   - `events[].timestamp`: **Unix epoch milliseconds** (`1725735605123`).
3. **Event Types**:
   - `card_selected`: Fired on user card click (`event`, `timestamp`, `card_id`, `position`).
   - `match_result`: Fired after evaluating two flipped cards (`event`, `timestamp`, `card_1`, `card_2`, `is_match`).

---

## 5. Cognitive Assessment Result Structure

The assessment engine processes the raw telemetry through a 7-stage pipeline and returns an `AssessmentResult` object:

```json
{
  "session_id": "S_1788982858810",
  "status": "COMPLETED",
  "domain": "MEMORY",
  "features": {
    "accuracy": 0.5,
    "response_time_ms": 84000,
    "target_time_ms": 15000,
    "error_count": 1,
    "pairs_presented": 4,
    "pairs_recalled": 1,
    "repeated_selections": 1,
    "mean_inter_response_time_ms": 2759.0
  },
  "normalized_features": {
    "recall_score": 0.25,
    "accuracy_score": 0.5,
    "repetition_score": 0.875,
    "efficiency_score": 0.1786
  },
  "domain_score": {
    "score": 0.408,
    "score_components": {
      "recall": 0.25,
      "accuracy": 0.5,
      "repetition_efficiency": 0.875,
      "temporal_efficiency": 0.1786
    }
  },
  "baseline": {
    "n_sessions": 2,
    "mean": 0.7884,
    "std_dev": 0.1366
  },
  "deviation": {
    "z_score": -1.0,
    "direction": "BELOW_BASELINE"
  },
  "longitudinal": {
    "trend": "DECLINING",
    "persistent": false,
    "status": "OK"
  }
}
```

### Key Field Interpretations

- **`domain_score.score`** ($0.0 - 1.0$): Memory domain composite score:
  $$\text{Score} = 0.40 \times \text{Recall} + 0.30 \times \text{Accuracy} + 0.15 \times \text{Repetition} + 0.15 \times \text{Temporal}$$
- **`baseline`** (Nullable): Reference distribution of historical sessions prior to this session:
  - `null` on **Session 1** (no prior history).
  - `{ n_sessions: 1, mean: ..., std_dev: 0.0 }` on **Session 2**.
  - Populated with true variance on **Session 3+**.
- **`deviation`** (Nullable): Standard deviation units from baseline ($Z = (X - \mu) / \sigma$):
  - `null` whenever baseline is missing or variance is zero (`std_dev == 0.0`).
  - `{ z_score: -1.0, direction: "BELOW_BASELINE" }` when variance is non-zero.
- **`longitudinal.status`**:
  - `"OK"`: Normal operating range.
  - `"REVIEW_FLAG"`: Triggered when 3 consecutive sessions are all strictly below $Z = -1.5$.
  - ⚠️ **Clinical Meaning**: `REVIEW_FLAG` is an automated clinical review recommendation signal, **NOT** a medical diagnosis of cognitive decline.

---

## 6. Frontend Endpoint Quick Reference

For complete request/response schemas, headers, status codes, and type definitions, consult [`docs/openapi.yaml`](./openapi.yaml).

| Method | Path | Role | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Authenticates user by email, returns JWT and user profile |
| `GET` | `/patients/me` | `PATIENT` | Returns profile, diagnosis, and streak |
| `GET` | `/patients/me/progress` | `PATIENT` | Returns completed activity count and streak |
| `GET` | `/patients/me/reminders` | `PATIENT` | Daily hydration and activity reminders |
| `GET` | `/patients/me/medications` | `PATIENT` | Medication schedule and adherence status |
| `GET` | `/patients/me/session-history` | `PATIENT` | List of all completed session assessments |
| `GET` | `/activities` | `PATIENT`, `CAREGIVER` | List all available games and activities |
| `GET` | `/activities/{id}` | `PATIENT`, `CAREGIVER` | Get specific activity details |
| `POST` | `/activities/{id}/sessions` | `PATIENT` | Start a new session (`session_id`) |
| `POST` | `/activities/{id}/sessions/{session_id}/complete` | `PATIENT` | Submit game telemetry and receive assessment result |
| `GET` | `/caregiver/patients` | `CAREGIVER` | List all managed patients |
| `GET` | `/caregiver/patients/{id}` | `CAREGIVER` | Detailed profile for managed patient |
| `GET` | `/caregiver/patients/{id}/session-history` | `CAREGIVER` | Full session assessment history for patient |
| `GET` | `/caregiver/patients/{id}/progress` | `CAREGIVER` | Adherence rate and memory trend |
| `GET` | `/caregiver/patients/{id}/medications` | `CAREGIVER` | Medication list for managed patient |
| `GET` | `/caregiver/alerts` | `CAREGIVER` | Active patient notifications & alerts |

---

## 7. Error Handling & API Inconsistencies

The backend returns standard HTTP status codes:
- `400 Bad Request`: Missing or invalid payload (e.g. missing `telemetry`).
- `401 Unauthorized`: Missing `Authorization` header.
- `403 Forbidden`: Token invalid, expired, or insufficient role permissions.
- `500 Internal Server Error`: Backend failure or cognitive assessment engine unreachable.

### Known V1 Error Response Shape Inconsistency
Frontend developers should be aware that the current Express backend returns two different error envelope formats depending on the middleware:
1. **Auth Middleware**: `{ "message": "Access token missing or invalid format" }`
2. **Role & Route Handlers**: `{ "error": "Forbidden: Insufficient permissions" }` or `{ "error": "telemetry object is required" }`

*Frontend client code should check both `response.data.error` and `response.data.message` when handling API errors.*

---

## 8. Current V1 Limitations

1. **In-Memory History**: Session history and baseline distributions are stored in memory (`sessionHistory` in Node, `_history` and `_z_history` in Python). Restarting either backend service resets patient baseline state.
2. **Synchronous Evaluation**: Session telemetry evaluation executes synchronously on session completion; no asynchronous polling or webhook is needed in V1.
3. **Mock Data**: Daily reminders, medications, alerts, and patient profiles are served from in-memory mock data fixtures.
