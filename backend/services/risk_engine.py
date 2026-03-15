"""
Risk Engine — aggregates scores from all detection modules and produces
the final risk score, classification, and reason list.

Score accumulation:
  raw_score = sum of all module penalties (can exceed 100)
  risk_score = min(raw_score, 100)

Classification thresholds:
   0 – 29  → Safe
  30 – 59  → Suspicious
  60 – 100 → Phishing
"""

from typing import Any


def compute_risk(module_results: list[tuple[int, list[dict]]]) -> dict[str, Any]:
    """
    Aggregate penalty scores and reasons from all detection modules.

    Args:
        module_results: A list of (score, reasons) tuples, one per module.
                        Each reasons item is a dict with keys:
                          'module'  — name of the detection module
                          'reason'  — human-readable explanation
                          'score'   — integer score contribution

    Returns:
        Dict with keys:
          - 'raw_score'       (int)  — raw sum of all penalties
          - 'risk_score'      (int)  — clamped to 0–100
          - 'classification'  (str)  — 'Safe' | 'Suspicious' | 'Phishing'
          - 'reasons'         (list) — consolidated reason list
    """
    raw_score = 0
    all_reasons: list[dict] = []

    for module_score, reasons in module_results:
        raw_score += module_score
        all_reasons.extend(reasons)

    # Clamp score to valid 0–100 range.
    risk_score = min(raw_score, 100)

    # Determine classification bucket.
    if risk_score < 30:
        classification = "Safe"
    elif risk_score < 60:
        classification = "Suspicious"
    else:
        classification = "Phishing"

    return {
        "raw_score": raw_score,
        "risk_score": risk_score,
        "classification": classification,
        "reasons": all_reasons,
    }


def blacklist_result() -> dict[str, Any]:
    """
    Return a pre-built result dict for URLs that matched a blacklist.

    Blacklist hits are assigned a definitive score of 100 without running
    any other detection modules — the URL is confirmed malicious.

    Returns:
        Dict with risk_score=100, classification='Phishing', and the
        blacklist reason entry.
    """
    return {
        "raw_score": 100,
        "risk_score": 100,
        "classification": "Phishing",
        "reasons": [
            {
                "module": "Blacklist",
                "reason": "URL found in active phishing blacklist (+100)",
                "score": 100,
            }
        ],
    }
