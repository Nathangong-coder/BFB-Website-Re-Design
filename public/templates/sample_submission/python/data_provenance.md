# Data Dictionary & Provenance

## Primary Data Sources
1. **S&P 500 Equities**: Daily OHLCV data from Yahoo Finance / Polygon API (2021-2026). Timestamps aligned to 4:00 PM EST market close.
2. **Crypto Spot Pairs**: Binance spot 1-hour and 1-day Kline bars for BTCUSDT and ETHUSDT (2021-2026). Timestamps in UTC.

## Data Preprocessing & Cleaning
- Split and dividend adjustments applied to historical equity series.
- Missing values forward-filled for up to 3 consecutive bars; unresolvable gaps flagged and excluded from signal calculation.
- Survivorship bias mitigated by incorporating historical constituent lists.
