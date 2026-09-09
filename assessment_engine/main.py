from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from telemetry_extractors import extract_features
from normalization import normalize_session


app = FastAPI(title="Smriti Cognitive Adaptation Engine")

class SessionData(BaseModel):
    accuracy: float
    response_time_ms: int
    target_time_ms: int = 15000
    error_count: int

class PatientProfile(BaseModel):
    patient_id: str
    current_difficulty: int = 1

class AdaptationPayload(BaseModel):
    profile: PatientProfile
    sessions: List[SessionData]

@app.get("/")
def health_check():
    return {"status": "ok"}

def _score_sessions(sessions: List[SessionData], current_diff: int) -> dict:

    if not sessions:
        return {
            "new_difficulty": current_diff,
            "performance_score": 0.0,
            "recommended_activity": "MEMORY_MATCH",
            "trigger_alert": False
        }

    scores = []
    for s in sessions:
        n = normalize_session(s.accuracy, s.response_time_ms, s.target_time_ms, s.error_count)
        p_score = (0.50 * n["accuracy_score"]) + (0.30 * n["time_score"]) - (0.20 * n["error_penalty"])
        scores.append(p_score)

    avg_performance = sum(scores) / len(scores)

    if avg_performance >= 0.80 and len(sessions) >= 3:
        new_diff = min(5, current_diff + 1)
    elif avg_performance <= 0.45 and len(sessions) >= 2:
        new_diff = max(1, current_diff - 1)
    else:
        new_diff = current_diff

    return {
        "new_difficulty": new_diff,
        "performance_score": round(avg_performance, 2),
        "recommended_activity": "RECALL_SIMPLE" if avg_performance < 0.50 else "PATTERN_MATCH",
        "trigger_alert": avg_performance < 0.40
    }

class RawSessionTelemetry(BaseModel):
    session_id: str
    patient_id: str
    activity_id: str
    started_at: str
    ended_at: str
    events: List[dict]


class RecommendFromTelemetryPayload(BaseModel):
    profile: PatientProfile
    raw_sessions: List[RawSessionTelemetry]

@app.post("/recommend")
def calculate_adaptation(payload: AdaptationPayload):
    return _score_sessions(payload.sessions, payload.profile.current_difficulty)

@app.post("/recommend-from-telemetry")
def calculate_adaptation_from_telemetry(payload: RecommendFromTelemetryPayload):
    sessions = [
        SessionData(**extract_features(rs.dict()))
        for rs in payload.raw_sessions
    ]
    return _score_sessions(sessions, payload.profile.current_difficulty)