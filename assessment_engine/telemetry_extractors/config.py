"""
Target completion times per activity, in milliseconds. Shared across
every game's extractor -- lives here, not duplicated in each game file,
since it's config data, not per-game logic.
"""

ACTIVITY_TARGET_TIME_MS = {
    "memory_match_v1": 15000,
    "grocery_recall_v1": 20000,
    "pattern_sequence_v1": 18000,
    "pattern_match_v1": 18000,
    "word_pairing_v1": 25000,
}


def get_target_time_ms(activity_id: str) -> int:
    return ACTIVITY_TARGET_TIME_MS.get(activity_id, 15000)
