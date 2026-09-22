from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Shared Limiter instance using remote IP address and in-memory storage
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per month"],
    storage_uri="memory://"
)
