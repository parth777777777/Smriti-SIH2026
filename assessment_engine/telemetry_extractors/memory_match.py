"""
STAGE 2 (Memory Match only): raw telemetry -> SessionData-shaped features.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from .config import get_target_time_ms


def _parse_iso(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def extract_memory_match_features(telemetry: dict[str, Any]) -> dict:
    events = telemetry["events"]
    match_events = [e for e in events if e.get("event") == "match_result"]

    correct_matches = sum(1 for e in match_events if e.get("is_match") is True)
    incorrect_matches = sum(1 for e in match_events if e.get("is_match") is False)
    total_attempts = correct_matches + incorrect_matches

    accuracy = correct_matches / total_attempts if total_attempts > 0 else 0.0

    started = _parse_iso(telemetry["started_at"])
    ended = _parse_iso(telemetry["ended_at"])
    response_time_ms = max(0, int((ended - started).total_seconds() * 1000))

    return {
        "accuracy": round(accuracy, 4),
        "response_time_ms": response_time_ms,
        "target_time_ms": get_target_time_ms(telemetry["activity_id"]),
        "error_count": incorrect_matches,
    }
