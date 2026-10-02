"""
==============================================================================
BFB at UCLA - Sample Python Strategy Implementation (strategy.py)
==============================================================================
Strategy: Dual-Momentum & Mean-Reversion Alpha
"""

import sys
import json
from typing import Dict, Any


def generate_signals(market_data: Dict[str, Any]) -> Dict[str, float]:
    """
    Generates target portfolio position weights mapping symbol -> allocation fraction.
    """
    target_weights: Dict[str, float] = {}
    prices = market_data.get("prices", {})
    ohlcv = market_data.get("ohlcv", {})

    if not prices:
        return target_weights

    # Count assets in universe
    symbols = list(prices.keys())
    num_assets = len(symbols)
    if num_assets == 0:
        return target_weights

    # Base target weight per asset (capped at 15% per asset to strictly stay <= 20%)
    base_weight = min(1.20 / num_assets, 0.15)

    for symbol, price in prices.items():
        bar = ohlcv.get(symbol, {})
        close = bar.get("close", price)
        open_price = bar.get("open", price)

        # Simple momentum signal: positive daily return -> Long, negative -> Short
        if close >= open_price:
            target_weights[symbol] = round(base_weight, 4)
        else:
            target_weights[symbol] = round(-base_weight * 0.5, 4)

    return target_weights


def main():
    if len(sys.argv) >= 3:
        input_path = sys.argv[1]
        output_path = sys.argv[2]

        with open(input_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        signals = generate_signals(data)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(signals, f, indent=2)

        print(f"Python Strategy: Generated signals for {len(signals)} assets -> {output_path}")
    else:
        sample_data = {"prices": {"AAPL": 180.50, "MSFT": 410.20, "BTCUSDT": 64000.00}}
        signals = generate_signals(sample_data)
        print("Sample Generated Signals:", json.dumps(signals, indent=2))


if __name__ == "__main__":
    main()
