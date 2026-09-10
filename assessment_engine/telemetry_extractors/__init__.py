"""
STAGE 2: dispatcher.

Public interface is identical to the old single-file version:
    from .telemetry_extractors import extract_features
still works exactly the same from main.py's point of view. Adding a
third game means: write game_name.py in this folder, import it below,
add one line to EXTRACTORS. Nothing outside this folder ever changes.
"""

from typing import Any

from .memory_match import extract_memory_match_features
from .grocery_recall import extract_grocery_recall_features

EXTRACTORS = {
    "memory_match_v1": extract_memory_match_features,
    "grocery_recall_v1": extract_grocery_recall_features,
}


def extract_features(telemetry: dict[str, Any]) -> dict:
    activity_id = telemetry.get("activity_id")
    extractor = EXTRACTORS.get(activity_id)
    if extractor is None:
        raise NotImplementedError(
            f"No feature extractor registered for activity_id '{activity_id}'"
        )
    return extractor(telemetry)
