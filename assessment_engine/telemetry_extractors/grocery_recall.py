"""
STAGE 2 (Grocery Recall only): raw telemetry -> SessionData-shaped features.
"""

from __future__ import annotations

from typing import Any

from .config import get_target_time_ms


def extract_grocery_recall_features(telemetry: dict[str, Any]) -> dict:
    events = telemetry["events"]

    study_shown = next((e for e in events if e.get("event") == "study_shown"), None)
    market_shown = next((e for e in events if e.get("event") == "market_shown"), None)
    submitted = next((e for e in events if e.get("event") == "submitted"), None)

    if not (study_shown and market_shown and submitted):
        raise ValueError(
            f"grocery_recall telemetry for session {telemetry.get('session_id')} is "
            f"missing one of study_shown / market_shown / submitted -- cannot extract features."
        )

    target_ids = set(study_shown["item_ids"])
    submitted_ids = set(submitted["final_item_ids"])

    true_positives = len(target_ids & submitted_ids)
    false_negatives = len(target_ids - submitted_ids)
    false_positives = len(submitted_ids - target_ids)

    total_targets = len(target_ids) or 1
    # Recall-style accuracy -- see note in original design: "of the items
    # they needed to remember, how many did they get." This is a judgment
    # call, confirm with your team before treating it as final.
    accuracy = true_positives / total_targets
    error_count = false_positives + false_negatives

    # Response time = decision phase only (market open -> submission).
    response_time_ms = max(0, submitted["timestamp"] - market_shown["timestamp"])

    return {
        "accuracy": round(accuracy, 4),
        "response_time_ms": response_time_ms,
        "target_time_ms": get_target_time_ms(telemetry["activity_id"]),
        "error_count": error_count,
    }
