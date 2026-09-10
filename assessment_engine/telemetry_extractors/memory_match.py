"""
STAGE 2 (Memory Match only): raw telemetry -> rich cognitive features.

Produces two groups of keys:
  - Legacy keys (accuracy, response_time_ms, target_time_ms, error_count)
    kept identical so the old /recommend-from-telemetry route still works.
  - Cognitive keys (pairs_presented, pairs_recalled, repeated_selections,
    mean_inter_response_time_ms) consumed by Stage 4 domain scoring.

Telemetry assumptions:
  - telemetry["num_pairs"]: positive integer representing total pairs on the board
  - event.timestamp: Unix epoch milliseconds
"""

from __future__ import annotations

from collections import Counter
from datetime import datetime
from typing import Any

from .config import get_target_time_ms


def _parse_iso(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def extract_memory_match_features(telemetry: dict[str, Any]) -> dict:
    events = telemetry["events"]

    select_events = [e for e in events if e.get("event") == "card_selected"]
    match_events  = [e for e in events if e.get("event") == "match_result"]

    correct_matches   = sum(1 for e in match_events if e.get("is_match") is True)
    incorrect_matches = sum(1 for e in match_events if e.get("is_match") is False)
    total_attempts    = correct_matches + incorrect_matches

    accuracy = correct_matches / total_attempts if total_attempts > 0 else 0.0

    # --- Cognitive features ---

    # pairs_presented: authoritative source from game configuration
    num_pairs = telemetry.get("num_pairs")
    if num_pairs is None or not isinstance(num_pairs, (int, float)) or num_pairs <= 0:
        raise ValueError(
            f"Memory Match telemetry for session {telemetry.get('session_id')} "
            f"must include a positive num_pairs"
        )
    pairs_presented = int(num_pairs)

    # pairs_recalled: count of successful matches completed
    pairs_recalled = correct_matches

    # repeated_selections: mechanical behavioral repetition metric counting
    # selections of cards previously encountered across separate attempts.
    card_counts         = Counter(e["card_id"] for e in select_events)
    repeated_selections = sum(count - 1 for count in card_counts.values() if count > 1)

    # mean_inter_response_time_ms: average duration (ms) between consecutive card selection events.
    # Assumes event.timestamp is in Unix epoch milliseconds.
    timestamps = sorted(e["timestamp"] for e in select_events)
    if len(timestamps) >= 2:
        gaps    = [timestamps[i + 1] - timestamps[i] for i in range(len(timestamps) - 1)]
        mean_irt = sum(gaps) / len(gaps)
    else:
        mean_irt = 0.0

    started          = _parse_iso(telemetry["started_at"])
    ended            = _parse_iso(telemetry["ended_at"])
    response_time_ms = max(0, int((ended - started).total_seconds() * 1000))

    return {
        # --- Legacy keys (Stage 3 / old route unchanged) ---
        "accuracy":         round(accuracy, 4),
        "response_time_ms": response_time_ms,
        "target_time_ms":   get_target_time_ms(telemetry["activity_id"]),
        "error_count":      incorrect_matches,
        # --- Cognitive keys (Stage 4+) ---
        "pairs_presented":             pairs_presented,
        "pairs_recalled":              pairs_recalled,
        "repeated_selections":         repeated_selections,
        "mean_inter_response_time_ms": round(mean_irt, 2),
    }
