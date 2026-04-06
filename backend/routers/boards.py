from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from deps import get_db
from models.board import Board
from schemas.board import BoardResponse

router = APIRouter(prefix="/api/boards", tags=["boards"])


@router.get("", response_model=list[BoardResponse])
def list_boards(db: Session = Depends(get_db)):
    boards = db.query(Board).filter(Board.is_active == True).all()
    return boards
