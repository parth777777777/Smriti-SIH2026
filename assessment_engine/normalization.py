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


# ---------------------------------------------------------------------------
# STAGE 3b — Memory-Match specific normalization
# ---------------------------------------------------------------------------

def normalize_memory_match(features: dict) -> dict:
    """
    Converts the rich cognitive features from Stage 2 into four named
    normalized scores, each in [0, 1], that Stage 4 (domain scoring) consumes.

    recall_score     — fraction of pairs the patient successfully found
    accuracy_score   — correct matches / total attempts (pass-through, already 0-1)
    repetition_score — penalises returning to cards already seen; 0 repeats = 1.0
    efficiency_score — time efficiency: target_time / actual_time, capped at 1.0
    """
    pairs_presented = max(1, features["pairs_presented"])
    pairs_recalled  = features["pairs_recalled"]

    recall_score = pairs_recalled / pairs_presented

    accuracy_score = max(0.0, min(1.0, features["accuracy"]))

    # Minimum possible card selections = pairs_presented * 2 (perfect play).
    # Extra selections beyond that are "wasted" due to forgetting.
    min_selections      = pairs_presented * 2
    repeated_selections = features["repeated_selections"]
    repetition_score    = max(0.0, 1.0 - repeated_selections / max(1, min_selections))

    efficiency_score = min(1.0, features["target_time_ms"] / max(1, features["response_time_ms"]))

    return {
        "recall_score":      round(recall_score, 4),
        "accuracy_score":    round(accuracy_score, 4),
        "repetition_score":  round(repetition_score, 4),
        "efficiency_score":  round(efficiency_score, 4),
    }


# ---------------------------------------------------------------------------
# STAGE 4 — Memory Domain Scoring
# ---------------------------------------------------------------------------

# Weights taken directly from the V1 spec candidate formula.
# Defined as named constants so they are easy to tune in one place.
DOMAIN_WEIGHTS = {
    "recall":      0.40,
    "accuracy":    0.30,
    "repetition":  0.15,
    "temporal":    0.15,
}


def compute_domain_score(normalized: dict) -> dict:
    """
    Stage 4: weighted composite of the four normalized scores → single
    Memory domain score in [0, 1].

    The weights follow the spec's candidate formula:
        score = 0.40 × Recall
              + 0.30 × Accuracy
              + 0.15 × Repetition Efficiency
              + 0.15 × Temporal Efficiency
    """
    score = (
        DOMAIN_WEIGHTS["recall"]     * normalized["recall_score"]
        + DOMAIN_WEIGHTS["accuracy"] * normalized["accuracy_score"]
        + DOMAIN_WEIGHTS["repetition"] * normalized["repetition_score"]
        + DOMAIN_WEIGHTS["temporal"] * normalized["efficiency_score"]
    )
    return {
        "score": round(score, 4),
        "score_components": {
            "recall":                normalized["recall_score"],
            "accuracy":              normalized["accuracy_score"],
            "repetition_efficiency": normalized["repetition_score"],
            "temporal_efficiency":   normalized["efficiency_score"],
        },
    }
