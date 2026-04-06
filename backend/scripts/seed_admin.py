"""Create initial SuperAdmin user. Run once after first migration."""
import sys
sys.path.insert(0, ".")

from database import SessionLocal
from models.user import User
from services.auth_service import hash_password


def seed_admin():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.role == "superadmin").first()
        if existing:
            print(f"SuperAdmin already exists: {existing.username} ({existing.email})")
            return

        admin = User(
            auth_provider="local",
            username="admin",
            password_hash=hash_password("Admin1234!"),
            email="admin@iiff.twinverse.org",
            name="관리자",
            nickname="IIFF관리자",
            phone="000-0000-0000",
            role="superadmin",
            status="active",
        )
        db.add(admin)
        db.commit()
        print("SuperAdmin created successfully:")
        print(f"  Username: admin")
        print(f"  Password: Admin1234!")
        print(f"  Email: admin@iiff.twinverse.org")
        print("  [!] Change the password after first login!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()
