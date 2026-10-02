# Sample C++ Research Memo: High-Frequency Statistical Arbitrage & Volatility Scaling

## Executive Summary
This research memo outlines a high-performance C++20 quantitative strategy implementing pair-wise statistical arbitrage and intraday volatility targeting across S&P 500 equities and major crypto pairs.

## Core Methodology
1. **Cointegrated Pair Trading**: Identifies mean-reverting price spreads across sector pairs using rolling augmented Dickey-Fuller (ADF) statistics.
2. **Dynamic Volatility Scaling**: Positions are scaled inversely to 20-period realized volatility to ensure portfolio risk stays within the 20% single-asset limit.
3. **C++ Performance Optimization**: Sub-millisecond signal calculation written in standard C++20 with zero dynamic heap allocations during evaluation loops.

## Backtest Performance Summary
- **Period**: Jan 1, 2021 – Oct 31, 2026
- **Expected Sharpe Ratio**: 2.15
- **Expected Calmar Ratio**: 2.45
- **Max Drawdown**: 7.2%
- **Annual Turnover**: 60.0%
- **Gross Exposure**: 115.0% | **Net Exposure**: +10.0%
