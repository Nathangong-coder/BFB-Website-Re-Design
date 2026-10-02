# C++ Strategy Data Provenance

## Primary Data Sources
1. **S&P 500 Equities**: High-frequency order book and daily close prices.
2. **Crypto Spot Pairs**: Binance spot 1-second price ticks pre-aggregated into JSON snapshots.

## Data Preprocessing
- Timestamp alignment to UTC.
- Delisting and corporate action adjustments applied directly to input data feed.
