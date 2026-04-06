"""Copy project images to uploads dir and attach to image board posts."""
import os
import sys
import uuid
import shutil

sys.path.insert(0, ".")

from database import SessionLocal
from models.board import Board
from models.post import Post
from models.file import File as FileModel
from config import settings

# Map image board post titles to source images (from frontend/public/images/)
POST_IMAGES = {
    "인천아트플랫폼 전경 사진": [
        ("hero/korea-night.webp", "인천_야경.webp"),
        ("venues/modern.webp", "아트플랫폼_내부.webp"),
    ],
    "IIFF 로고 디자인 시안": [
        ("decorative/filmreel.webp", "필름릴_디자인.webp"),
        ("decorative/projector.webp", "프로젝터_심볼.webp"),
    ],
    "작년 부산국제영화제 현장 스케치": [
        ("hero/audience.webp", "관객석_전경.webp"),
        ("hero/redcarpet.webp", "레드카펫_현장.webp"),
        ("hero/awards.webp", "시상식_무대.webp"),
    ],
    "송도 컨벤시아 행사장 답사 사진": [
        ("hero/aerial.webp", "송도_항공뷰.webp"),
        ("decorative/skyline.webp", "인천_스카이라인.webp"),
    ],
    "IIFF 굿즈 디자인 샘플": [
        ("hero/cinema.webp", "시네마_컨셉.webp"),
        ("programs/camera.webp", "카메라_장비.webp"),
        ("programs/workshop.webp", "워크숍_현장.webp"),
    ],
}


def seed_images():
    db = SessionLocal()
    try:
        # Check if image files already exist
        existing = db.query(FileModel).filter(FileModel.mime_type.like("image/%")).count()
        if existing > 0:
            print(f"  {existing} image files already exist, skipping.")
            return

        # Find the image board
        board = db.query(Board).filter(Board.slug == "image").first()
        if not board:
            print("  Image board not found, skipping.")
            return

        # Determine source and destination directories
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(os.path.dirname(script_dir))
        source_base = os.path.join(project_root, "frontend", "public", "images")

        # In Docker, try /app/../frontend/public/images or the mounted path
        if not os.path.isdir(source_base):
            # Try relative to backend dir
            source_base = os.path.join(os.path.dirname(script_dir), "..", "frontend", "public", "images")
        if not os.path.isdir(source_base):
            print(f"  Source images directory not found: {source_base}")
            print("  Skipping image seeding.")
            return

        upload_dir = os.path.join(settings.storage_base_path, "images")
        os.makedirs(upload_dir, exist_ok=True)

        # Get admin user ID
        from models.user import User
        admin = db.query(User).filter(User.role == "superadmin").first()
        if not admin:
            print("  No superadmin user found.")
            return

        total = 0
        for post_title, images in POST_IMAGES.items():
            post = db.query(Post).filter(
                Post.board_id == board.id,
                Post.title == post_title,
            ).first()
            if not post:
                print(f"  Post not found: {post_title}")
                continue

            for src_rel, original_name in images:
                src_path = os.path.join(source_base, src_rel.replace("/", os.sep))
                if not os.path.exists(src_path):
                    print(f"  Source not found: {src_path}")
                    continue

                # Copy with UUID name
                ext = os.path.splitext(src_path)[1]
                stored_name = f"{uuid.uuid4()}{ext}"
                dest_path = os.path.join(upload_dir, stored_name)
                shutil.copy2(src_path, dest_path)
                file_size = os.path.getsize(dest_path)

                db_file = FileModel(
                    post_id=post.id,
                    user_id=admin.id,
                    original_name=original_name,
                    stored_name=stored_name,
                    file_path=dest_path,
                    file_size=file_size,
                    mime_type="image/webp",
                )
                db.add(db_file)
                print(f"  [{post_title}] {original_name}")
                total += 1

        db.commit()
        print(f"Image seeding complete. Added {total} images.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_images()
