"""Seed script to initialize database and test flow."""
from app.db import init_db, SessionLocal
from app.models import Visit
from datetime import datetime

if __name__ == "__main__":
    init_db()
    print("Database initialized.")
    print("✓ Tables created")
    print("\nTo start the demo:")
    print("1. Start API: cd api && uvicorn app.main:app --reload --port 8000")
    print("2. Start Web: cd web && npm install && npm run dev")
    print("3. Visit http://localhost:3000")
    print("\nDemo flow:")
    print("- Click 'Start visit' on home page")
    print("- Answer intake questions")
    print("- Join video visit (demo room if no Whereby key)")
    print("- End visit to see AI summary")
    print("- Complete pharmacy order")
