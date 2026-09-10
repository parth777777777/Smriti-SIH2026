from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from telemetry_extractors import extract_features
from normalization import normalize_session, normalize_memory_match, compute_domain_score
from baseline import record_score, get_baseline, compute_deviation
from longitudinal import record_z_score, detect_drift


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
    model_config = {"extra": "allow"}

    session_id: str
    patient_id: str
    activity_id: str
    started_at: str
    ended_at: str
    events: List[dict]
    num_pairs: int | None = None


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


# ---------------------------------------------------------------------------
# V1 FULL PIPELINE ENDPOINT
# ---------------------------------------------------------------------------

class ProcessSessionPayload(BaseModel):
    """
    Input for the complete 7-stage V1 pipeline.
    raw_session carries the raw telemetry exactly as the game emits it.
    """
    profile:     PatientProfile
    raw_session: RawSessionTelemetry


@app.post("/v1/process-session")
def process_session_v1(payload: ProcessSessionPayload):
    """
    Runs the full Smriti V1 cognitive assessment pipeline for a single
    memory_match_v1 session:

        Stage 2  — feature extraction     (memory_match.py)
        Stage 3b — normalization          (normalization.py::normalize_memory_match)
        Stage 4  — domain scoring         (normalization.py::compute_domain_score)
        Stage 5  — baseline recording     (baseline.py::record_score / get_baseline)
        Stage 6  — deviation / Z-score    (baseline.py::compute_deviation)
        Stage 7  — longitudinal drift     (longitudinal.py::detect_drift)

    Returns the full intermediate state at every stage so that any
    downstream consumer (frontend, caregiver dashboard, researcher) can
    inspect exactly what the engine computed and why.
    """
    pid    = payload.profile.patient_id
    domain = "MEMORY"   # memory_match_v1 always targets the MEMORY domain

    # Stage 2 — feature extraction
    features = extract_features(payload.raw_session.dict())

    # Stage 3b — memory-match specific normalization
    normalized = normalize_memory_match(features)

    # Stage 4 — weighted domain score
    domain_score_result = compute_domain_score(normalized)
    score = domain_score_result["score"]

    # Stage 5 — get historical baseline from prior completed sessions ONLY
    baseline = get_baseline(pid, domain)

    # Stage 6 — deviation against historical baseline (None if baseline is missing or std_dev == 0)
    deviation = compute_deviation(score, baseline) if baseline else None

    # Record current session score into history AFTER baseline and deviation calculation
    record_score(pid, domain, score)

    # Stage 7 — longitudinal drift detection (record valid z-score if computed)
    if deviation is not None and "z_score" in deviation:
        record_z_score(pid, domain, deviation["z_score"])
    longitudinal = detect_drift(pid, domain)

    return {
        "session_id":          payload.raw_session.session_id,
        "domain":              domain,
        "features":            features,
        "normalized_features": normalized,
        "domain_score":        domain_score_result,
        "baseline":            baseline,
        "deviation":           deviation,
        "longitudinal":        longitudinal,
    }