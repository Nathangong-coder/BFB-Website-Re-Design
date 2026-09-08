ARG PYTHON_VERSION=3.13
FROM python:${PYTHON_VERSION}-slim as base

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

# Keep the HF model cache inside /app so it's baked into the image and
# owned by appuser (avoids a live download from HF Hub on every cold start).
ENV HF_HOME=/app/.cache/huggingface

WORKDIR /app

# Create a non-privileged user that the app will run under.
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/home/appuser" \
    --shell "/sbin/nologin" \
    --uid "${UID}" \
    appuser

# Copy only the dependency list first
COPY pyproject.toml poetry.lock* ./

# Install poetry and project dependencies
RUN pip install --no-cache-dir poetry && \
    poetry config virtualenvs.create false && \
    export POETRY_HTTP_TIMEOUT=300 && \
    poetry install --no-interaction --no-ansi --no-root

# Copy the source code into the container.
COPY app.py ./
COPY tools/ ./tools/

# Pre-download the sentence-transformers model at build time so cold starts
# don't have to fetch ~420MB from HF Hub before the app can serve a request.
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-mpnet-base-v2')"

# Ensure the appuser owns the directories for write permissions
RUN chown -R appuser:appuser /app

# Switch to the non-privileged user to run the application.
USER appuser

# Expose the port that the application listens on.
EXPOSE 5001

# Run the application.
CMD ["gunicorn", "app:app", "--bind=0.0.0.0:5001", "--workers=1", "--timeout=580"]
