"""
==============================================================================
BFB at UCLA - Alpha Research Competition
Python Strategy Implementation (strategy.py)
==============================================================================

CLI Execution Contract:
  python strategy.py market_data.json signals.json

Input File Format (market_data.json):
  JSON object containing market timestamps, prices, and OHLCV bars:
  {
    "timestamp": "2026-11-30T14:30:00Z",
    "universe": ["AAPL", "MSFT", "NVDA", "BTCUSDT", "ETHUSDT"],
    "prices": { "AAPL": 180.50, "MSFT": 410.20, "BTCUSDT": 64000.00 },
    "ohlcv": {
      "AAPL": { "open": 179.80, "high": 181.20, "low": 179.50, "close": 180.50, "volume": 45200000 }
    }
  }

Output File Format (signals.json):
  JSON object mapping ticker symbols to portfolio target allocation weights [-1.0, +1.0]:
  {
    "AAPL": 0.10,    # +10% Long Allocation
    "MSFT": -0.05,   # -5% Short Allocation
    "BTCUSDT": 0.05  # +5% Long Allocation
  }
"""

import sys
import json
from typing import Dict, Any


def generate_signals(market_data: Dict[str, Any]) -> Dict[str, float]:
    """
    Core Alpha Strategy Signal Generator.
    
    Parameters:
    -----------
    market_data : dict
        Contains current market state, including constituent prices, OHLCV, 
        volume, and technical/fundamental features.
        
    Returns:
    --------
    dict
        Target portfolio position weights mapping symbols to allocation percentages.
        Example: {"AAPL": 0.05, "MSFT": -0.03, "BTCUSDT": 0.02}
    """
    target_weights: Dict[str, float] = {}
    prices = market_data.get("prices", {})

    if not prices:
        return target_weights

    # --------------------------------------------------------------------------
    # YOUR STRATEGY LOGIC HERE
    # --------------------------------------------------------------------------
    num_assets = len(prices)
    weight_per_asset = 0.50 / max(num_assets, 1)  # Max 50% gross allocation

    for symbol in prices.keys():
        target_weights[symbol] = round(weight_per_asset, 4)

    return target_weights


def main():
    """CLI Entry point for local testing and BFB evaluation harness."""
    if len(sys.argv) >= 3:
        input_path = sys.argv[1]
        output_path = sys.argv[2]

        with open(input_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        signals = generate_signals(data)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(signals, f, indent=2)

        print(f"Generated signals for {len(signals)} assets -> {output_path}")
    else:
        sample_data = {"prices": {"AAPL": 180.50, "MSFT": 410.20, "BTCUSDT": 64000.00}}
        signals = generate_signals(sample_data)
        print("Sample Generated Signals:", json.dumps(signals, indent=2))


if __name__ == "__main__":
    main()
