# BFB SmartComps Backend

Flask API backend for BFB's smartComps valuation tool. Serves `/api/smartcomps/*`
routes, consumed by the Next.js frontend's `/api/[tool]/[...path]` proxy route.

Deployed on Google Cloud Run (see `Dockerfile`). The `sentence-transformers`
embedding model is baked into the image at build time to avoid a slow live
download from Hugging Face Hub on every cold start.
