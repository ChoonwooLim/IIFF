"""Create the 6 default boards. Run once after migration."""
import sys
sys.path.insert(0, ".")

from database import SessionLocal
from models.board import Board

BOARDS = [
    {"slug": "notice", "name": "공지사항", "description": "공식 공지사항 게시판입니다.", "board_type": "general"},
    {"slug": "suggestion", "name": "건의사항", "description": "건의사항을 자유롭게 남겨주세요.", "board_type": "general"},
    {"slug": "image", "name": "이미지 게시판", "description": "이미지를 공유하는 게시판입니다.", "board_type": "image"},
    {"slug": "video", "name": "동영상 게시판", "description": "YouTube 영상을 공유하는 게시판입니다.", "board_type": "video"},
    {"slug": "archive", "name": "자료실", "description": "파일을 공유하는 자료실입니다.", "board_type": "archive"},
    {"slug": "qna", "name": "Q&A", "description": "질문과 답변 게시판입니다.", "board_type": "qna"},
]

def seed_boards():
    db = SessionLocal()
    try:
        for board_data in BOARDS:
            existing = db.query(Board).filter(Board.slug == board_data["slug"]).first()
            if existing:
                print(f"  Board '{board_data['slug']}' already exists, skipping.")
                continue
            board = Board(**board_data)
            db.add(board)
            print(f"  Created board: {board_data['name']} ({board_data['slug']})")
        db.commit()
        print("Board seeding complete.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_boards()
