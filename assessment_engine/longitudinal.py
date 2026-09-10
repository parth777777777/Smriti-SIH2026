"""
STAGE 7 — LONGITUDINAL DRIFT DETECTION

Watches the rolling Z-score history per patient/domain and produces a
trend summary + status flag.

Key principle from the spec:
    REVIEW_FLAG != diagnosis.
    It means: "persistent below-baseline performance that may warrant review."

Thresholds (V1 — tune once real session data is available):
    DRIFT_THRESHOLD_Z  = -1.5   Z strictly below this (< -1.5) counts as "low"
    PERSISTENCE_COUNT  =  3     consecutive low sessions needed to raise flag
"""

from __future__ import annotations

from collections import defaultdict

# ---------------------------------------------------------------------------
# Configuration constants — change here only, referenced nowhere else.
# ---------------------------------------------------------------------------
DRIFT_THRESHOLD_Z: float = -1.5   # Z-score strictly below which a session is "low" (< -1.5)
PERSISTENCE_COUNT: int   = 3      # consecutive low sessions needed for REVIEW_FLAG

# In-memory Z-score history: patient_id -> domain -> [z, z, ...]
_z_history: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))


def record_z_score(patient_id: str, domain: str, z: float) -> None:
    """
    Append a valid Z-score from Stage 6 to this patient's longitudinal record.

    Only valid numeric Z-scores should be recorded (do not record None).
    """
    _z_history[patient_id][domain].append(round(z, 4))


def detect_drift(patient_id: str, domain: str) -> dict:
    """
    Stage 7 — Inspect recent Z-scores and return a trend + status.

    Semantics:
      - Fewer than PERSISTENCE_COUNT (3) valid Z-scores recorded:
          -> INSUFFICIENT_DATA, persistent=False, status=OK
      - All latest PERSISTENCE_COUNT Z-scores strictly below DRIFT_THRESHOLD_Z (< -1.5):
          -> DECLINING, persistent=True, status=REVIEW_FLAG
      - Otherwise, classify 3-way directional trend from the latest two Z-scores:
          * last > previous  -> IMPROVING, persistent=False, status=OK
          * last < previous  -> DECLINING, persistent=False, status=OK
          * last == previous -> STABLE, persistent=False, status=OK

    Note: REVIEW_FLAG is a clinical review signal, not a diagnosis.
    """
    zs = _z_history[patient_id][domain]
    n  = len(zs)

    if n < PERSISTENCE_COUNT:
        return {
            "trend":      "INSUFFICIENT_DATA",
            "persistent": False,
            "status":     "OK",
        }

    recent  = zs[-PERSISTENCE_COUNT:]
    all_low = all(z < DRIFT_THRESHOLD_Z for z in recent)

    if all_low:
        return {
            "trend":      "DECLINING",
            "persistent": True,
            "status":     "REVIEW_FLAG",
        }

    last = zs[-1]
    prev = zs[-2]

    if last > prev:
        trend = "IMPROVING"
    elif last < prev:
        trend = "DECLINING"
    else:
        trend = "STABLE"

    return {
        "trend":      trend,
        "persistent": False,
        "status":     "OK",
    }


def clear_z_history(patient_id: str | None = None, domain: str | None = None) -> None:
    """Helper to clear in-memory z-score history (useful for test isolation)."""
    if patient_id is None:
        _z_history.clear()
    elif domain is None:
        _z_history.pop(patient_id, None)
    else:
        _z_history[patient_id].pop(domain, None)
