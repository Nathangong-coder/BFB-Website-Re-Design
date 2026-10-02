# Sample Research Memo: Dual-Momentum & Mean-Reversion Alpha Strategy

## Executive Summary
This research memo presents a quantitative multi-asset strategy combining medium-term cross-sectional momentum with short-term RSI mean-reversion signals across S&P 500 constituents and spot crypto assets (BTC/ETH).

## Thesis & Economic Rationale
1. **Cross-Sectional Momentum**: High-performing equities exhibit persistent momentum over 20-day to 60-day horizons driven by delayed institutional capital allocation.
2. **Mean-Reversion Overlay**: Short-term oversold conditions (RSI < 30) within structural uptrends offer high-probability entry points with favorable risk-reward ratios.
3. **Risk & Volatility Sizing**: Positions are volatility-weighted to enforce strict single-position (<20%) and gross exposure (<150%) limits.

## Backtest Performance Summary
- **Period**: Jan 1, 2021 – Oct 31, 2026
- **Expected Sharpe Ratio**: 1.85
- **Expected Calmar Ratio**: 2.10
- **Max Drawdown**: 8.5%
- **Annual Turnover**: 45.0%
- **Gross Exposure**: 120.0% | **Net Exposure**: +15.0%

## Limitations & Risks
- **Market Regime Shifts**: High-volatility market sell-offs can cause sudden drawdowns during crypto-equity correlation spikes.
- **Slippage Sensitivity**: High-turnover rebalancing during low-liquidity hours may increase execution costs.
