"""
STAGES 5 & 6 — PERSONALIZED BASELINE + DEVIATION / Z-SCORE

Stage 5: Maintain historical per-patient, per-domain scores (prior sessions only)
         and compute the reference baseline (n_sessions, mean, std_dev).

Stage 6: Compare the current session's score against historical baseline.
         Returns None when baseline is missing or has zero variance (std_dev == 0),
         explicitly representing that standardized deviation is unavailable.

Lifecycle:
    1. baseline = get_baseline(patient_id, domain)      # reads PRIOR sessions only
    2. deviation = compute_deviation(score, baseline)   # None if std_dev == 0
    3. record_score(patient_id, domain, score)          # adds current session to history
"""

from __future__ import annotations

import math
from collections import defaultdict

# In-memory store: patient_id -> domain -> [score, score, ...]
_history: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))


def record_score(patient_id: str, domain: str, score: float) -> None:
    """
    Stage 5 — Append a completed session score to this patient's history.
    Must be called AFTER get_baseline() and compute_deviation() for the current session.
    """
    _history[patient_id][domain].append(round(score, 4))


def get_baseline(patient_id: str, domain: str) -> dict | None:
    """
    Stage 5 — Compute reference distribution from prior recorded sessions.

    Returns None when 0 historical sessions have been recorded.
    When n >= 1, computes mean and population standard deviation.
    When variance is zero (e.g. n=1 or identical scores), std_dev is 0.0.

    Returns:
        {
            "n_sessions": int,
            "mean":       float,
            "std_dev":    float,
        }
    """
    scores = _history[patient_id][domain]
    n = len(scores)
    if n == 0:
        return None

    mean = sum(scores) / n
    variance = sum((x - mean) ** 2 for x in scores) / n
    std = math.sqrt(variance)

    return {
        "n_sessions": n,
        "mean":       round(mean, 4),
        "std_dev":    round(std, 4),
    }


def compute_deviation(current_score: float, baseline: dict | None) -> dict | None:
    """
    Stage 6 — Z-score of current session against historical baseline.

    Z = (current_score - mean) / std_dev

    Returns None if baseline is None or std_dev == 0 (zero variance),
    explicitly representing that standardized deviation cannot be computed.

    When std_dev > 0:
    Returns:
        {
            "z_score":   float,
            "direction": "ABOVE_BASELINE" | "BELOW_BASELINE",
        }
    """
    if not baseline or baseline.get("std_dev", 0) <= 0:
        return None

    z = (current_score - baseline["mean"]) / baseline["std_dev"]
    return {
        "z_score":   round(z, 4),
        "direction": "ABOVE_BASELINE" if z >= 0 else "BELOW_BASELINE",
    }


def clear_history(patient_id: str | None = None, domain: str | None = None) -> None:
    """Helper to clear in-memory history (useful for test isolation)."""
    if patient_id is None:
        _history.clear()
    elif domain is None:
        _history.pop(patient_id, None)
    else:
        _history[patient_id].pop(domain, None)

