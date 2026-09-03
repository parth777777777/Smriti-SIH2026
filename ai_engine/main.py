from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

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

@app.post("/recommend")
def calculate_adaptation(payload: AdaptationPayload):
    sessions = payload.sessions
    current_diff = payload.profile.current_difficulty

    if not sessions:
        return {
            "new_difficulty": current_diff,
            "performance_score": 0.0,
            "recommended_activity": "MEMORY_MATCH",
            "trigger_alert": False
        }

    scores = []
    for s in sessions:
        time_score = min(1.0, s.target_time_ms / max(1, s.response_time_ms))
        error_penalty = min(1.0, s.error_count / 5.0)
        p_score = (0.50 * s.accuracy) + (0.30 * time_score) - (0.20 * error_penalty)
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
