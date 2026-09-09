"""
STAGE 3: FEATURE NORMALIZATION

Previously, time_score and error_penalty were computed inline inside the
scoring loop in main.py -- functionally correct, but not a distinct,
independently visible or tunable stage. This file makes normalization its
own explicit step: raw SessionData in, three normalized 0-1 values out.

Stage 4 (domain scoring) should call normalize_session() rather than
computing time_score/error_penalty itself. This is also the one file to
hand your teammate for context on stage 5/6 (baseline/deviation) --
whatever they build should compare against the domain SCORE this
produces, not against these intermediate normalized values.
"""

from __future__ import annotations


def normalize_session(accuracy: float, response_time_ms: int, target_time_ms: int, error_count: int) -> dict:
    """
    Returns three normalized components, each bounded [0, 1]:
      - accuracy_score: pass-through, already 0-1 by definition
      - time_score: 1.0 if the patient was at or faster than target_time_ms,
        proportionally lower the slower they were
      - error_penalty: scales with error_count, capped at 1.0 (5+ errors
        = maximum penalty; this cap is a placeholder, tune once you have
        real session data on typical error counts per activity)
    """
    accuracy_score = max(0.0, min(1.0, accuracy))

    time_score = min(1.0, target_time_ms / max(1, response_time_ms))

    error_penalty = min(1.0, error_count / 5.0)

    return {
        "accuracy_score": round(accuracy_score, 4),
        "time_score": round(time_score, 4),
        "error_penalty": round(error_penalty, 4),
    }
