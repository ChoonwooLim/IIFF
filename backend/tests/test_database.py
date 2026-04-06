from sqlalchemy import text
from database import engine


def test_database_connection():
    """Verify we can connect to PostgreSQL and run a query."""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        assert result.scalar() == 1
