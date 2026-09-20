from flask import Flask
import os
import sys
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Add backend directory to sys.path so we can do clean package imports
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from werkzeug.middleware.proxy_fix import ProxyFix
from limiter import limiter

app = Flask(__name__)

# Trust X-Forwarded-For headers from reverse proxy (Cloud Run / Vercel)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# Limit maximum payload size to 10 MB to prevent memory exhaustion
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

# Initialize rate limiter
limiter.init_app(app)

# ==========================================
# REGISTER BLUEPRINTS FOR MODULAR TOOLS
# ==========================================

# 1. Register smartComps Blueprint
try:
    from tools.smartcomps.router import smartcomps_bp
    app.register_blueprint(smartcomps_bp, url_prefix='/api/smartcomps')
    logger.info("Successfully registered smartComps blueprint.")
except Exception as e:
    logger.error(f"Failed to register smartComps blueprint: {e}")

# 2. Register future tools here (e.g. BAI, Quant Accelerator)
# try:
#     from tools.bai.router import bai_bp
#     app.register_blueprint(bai_bp, url_prefix='/api/bai')
# except Exception as e:
#     logger.warning(f"BAI blueprint not found/registered: {e}")

if __name__ == '__main__':
    # Listen on port 5001 by default
    app.run(debug=True, port=5001)
