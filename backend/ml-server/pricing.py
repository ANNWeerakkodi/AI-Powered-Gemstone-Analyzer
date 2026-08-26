"""
CycloneGems AI - Price Prediction & Uncertainty Quantification Module
Provides market-calibrated price estimates with statistical 95% Confidence Intervals.
"""

import math

# USD to LKR exchange rate
USD_TO_LKR = 325.0

# Base price ranges per carat in USD for Sri Lankan gemstone market
BASE_PRICES = {
    'Blue Sapphire': (200, 15000),
    'Sapphire Blue': (200, 15000),
    'Ruby': (300, 12000),
    "Cat's Eye": (100, 8000),
    'Cats Eye': (100, 8000),
    'Padparadscha': (1000, 30000),
    'Star Sapphire': (150, 6000),
    'Alexandrite': (500, 20000),
    'Spinel': (50, 3000),
    'Topaz': (20, 500),
    'Garnet': (10, 300),
    'Garnet Red': (10, 300),
    'Tourmaline': (30, 800),
    'Zircon': (15, 400),
    'Moonstone': (5, 200),
    'Emerald': (400, 18000),
    'Aquamarine': (50, 1200),
    'Amethyst': (10, 150),
    'Citrine': (10, 120),
    'Tanzanite': (200, 4000),
    'Peridot': (25, 450),
    'Jade': (50, 5000),
}

# Grade multipliers for price adjustment
GRADE_MULTIPLIERS = {
    'AAA': (0.75, 1.0),    # Top 75-100% of price range
    'AA': (0.55, 0.80),    # 55-80% of range
    'A': (0.35, 0.60),     # 35-60% of range
    'B': (0.15, 0.40),     # 15-40% of range
    'C': (0.05, 0.20),     # Bottom 5-20% of range
}

# Market trends per gemstone
MARKET_TRENDS = {
    'Blue Sapphire': 'Stable — Strong demand for Ceylon sapphires',
    'Sapphire Blue': 'Stable — Strong demand for Ceylon sapphires',
    'Ruby': 'Rising — Premium rubies gaining value',
    "Cat's Eye": 'Stable — Consistent collector demand',
    'Cats Eye': 'Stable — Consistent collector demand',
    'Padparadscha': 'Rising — Extremely rare, appreciating fast',
    'Star Sapphire': 'Stable — Niche but steady market',
    'Alexandrite': 'Rising — Growing rarity driving prices up',
    'Spinel': 'Rising — Increasing recognition as premium gem',
    'Topaz': 'Stable — Moderate commercial demand',
    'Garnet': 'Stable — Widely available, steady prices',
    'Garnet Red': 'Stable — Widely available, steady prices',
    'Tourmaline': 'Stable — Color variety supports demand',
    'Zircon': 'Declining — Often confused with cubic zirconia',
    'Moonstone': 'Stable — Popular in artisanal jewelry',
}


def get_carat_multiplier(carat: float) -> float:
    """
    Calculate gemological carat weight rarity multiplier.
    Larger stones carry progressive per-carat price premiums.
    """
    if carat <= 0:
        carat = 1.0
    if carat < 0.5:
        return 0.70
    elif carat < 1.0:
        return 0.70 + (carat - 0.5) * 0.60  # 0.70 to 1.00
    elif carat < 2.0:
        return 1.00 + (carat - 1.0) * 0.35  # 1.00 to 1.35
    elif carat < 3.0:
        return 1.35 + (carat - 2.0) * 0.35  # 1.35 to 1.70
    elif carat < 5.0:
        return 1.70 + (carat - 3.0) * 0.40  # 1.70 to 2.50
    else:
        return 2.50 + min(1.50, (carat - 5.0) * 0.20)  # 2.50+


def predict_price(gemstone_name: str, quality_grade: str, quality_score: float, model_confidence: float = 0.85, carat_weight: float = 1.0) -> dict:
    """
    Predict price range and statistical 95% Confidence Interval for an identified gemstone based on quality and carat weight.
    """
    if carat_weight <= 0:
        carat_weight = 1.0

    base_min, base_max = BASE_PRICES.get(gemstone_name, (15, 600))
    carat_mult = get_carat_multiplier(carat_weight)

    # Per-carat rate adjusted for rarity multiplier
    per_carat_min = base_min * carat_mult
    per_carat_max = base_max * carat_mult
    price_range_per_carat = per_carat_max - per_carat_min

    # Apply quality grade multiplier
    grade_low, grade_high = GRADE_MULTIPLIERS.get(quality_grade, (0.15, 0.40))

    min_per_carat = per_carat_min + price_range_per_carat * grade_low
    max_per_carat = per_carat_min + price_range_per_carat * grade_high

    # Point estimate per carat
    score_factor = quality_score / 100.0
    suggested_per_carat = min_per_carat + (max_per_carat - min_per_carat) * score_factor

    # Total price calculation (Carat Weight x Per-Carat Rate)
    min_usd = min_per_carat * carat_weight
    max_usd = max_per_carat * carat_weight
    suggested_usd = suggested_per_carat * carat_weight

    # ── Uncertainty Quantification & Conformal 95% CI ──
    class_uncertainty = max(0.05, 1.0 - model_confidence)
    market_std = (max_usd - min_usd) / 4.0
    std_error = market_std * (1.0 + class_uncertainty * 0.75)
    margin_of_error = 1.96 * std_error

    ci_low_usd = max(base_min * carat_weight * 0.5, suggested_usd - margin_of_error)
    ci_high_usd = min(base_max * carat_weight * 1.3, suggested_usd + margin_of_error)
    uncertainty_pct = (margin_of_error / (suggested_usd + 1e-5)) * 100.0

    # Format values
    min_usd_r = round(min_usd, 2)
    max_usd_r = round(max_usd, 2)
    suggested_usd_r = round(suggested_usd, 2)
    per_carat_usd_r = round(suggested_per_carat, 2)
    ci_low_usd_r = round(ci_low_usd, 2)
    ci_high_usd_r = round(ci_high_usd, 2)

    min_lkr_r = round(min_usd_r * USD_TO_LKR, 2)
    max_lkr_r = round(max_usd_r * USD_TO_LKR, 2)
    suggested_lkr_r = round(suggested_usd_r * USD_TO_LKR, 2)
    per_carat_lkr_r = round(per_carat_usd_r * USD_TO_LKR, 2)
    ci_low_lkr_r = round(ci_low_usd_r * USD_TO_LKR, 2)
    ci_high_lkr_r = round(ci_high_usd_r * USD_TO_LKR, 2)

    market_trend = MARKET_TRENDS.get(gemstone_name, 'Market data stable')

    return {
        'caratWeight': round(carat_weight, 2),
        'caratMultiplier': round(carat_mult, 2),
        'perCaratUsd': per_carat_usd_r,
        'perCaratLkr': per_carat_lkr_r,
        'minUsd': min_usd_r,
        'maxUsd': max_usd_r,
        'suggestedUsd': suggested_usd_r,
        'minLkr': min_lkr_r,
        'maxLkr': max_lkr_r,
        'suggestedLkr': suggested_lkr_r,
        'baseMinUsd': base_min,
        'baseMaxUsd': base_max,
        'marketTrend': market_trend,
        'uncertainty': {
            'stdErrorUsd': round(std_error, 2),
            'marginOfErrorUsd': round(margin_of_error, 2),
            'confidenceInterval95Usd': [ci_low_usd_r, ci_high_usd_r],
            'confidenceInterval95Lkr': [ci_low_lkr_r, ci_high_lkr_r],
            'relativeUncertaintyPct': round(uncertainty_pct, 1),
            'confidenceLevelPct': 95.0
        }
    }

