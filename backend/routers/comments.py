from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from deps import get_db, require_active
from models.post import Post
from models.comment import Comment
from models.board import Board
from models.user import User
from schemas.comment import CommentCreateRequest, CommentUpdateRequest, CommentResponse

router = APIRouter(prefix="/api", tags=["comments"])


@router.get("/posts/{post_id}/comments", response_model=list[CommentResponse])
def list_comments(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    comments = (
        db.query(Comment)
        .options(joinedload(Comment.user), joinedload(Comment.replies).joinedload(Comment.user))
        .filter(Comment.post_id == post_id, Comment.parent_id == None, Comment.is_hidden == False)
        .order_by(Comment.is_adopted.desc(), Comment.created_at.asc())
        .all()
    )

    def build_comment(c: Comment) -> CommentResponse:
        return CommentResponse(
            id=c.id,
            post_id=c.post_id,
            user={"id": c.user.id, "nickname": c.user.nickname, "profile_image": c.user.profile_image},
            parent_id=c.parent_id,
            content=c.content,
            is_adopted=c.is_adopted,
            is_hidden=c.is_hidden,
            created_at=c.created_at,
            replies=[build_comment(r) for r in c.replies if not r.is_hidden],
        )

    return [build_comment(c) for c in comments]


@router.post("/posts/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    post_id: int,
    req: CommentCreateRequest,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    post = db.query(Post).filter(Post.id == post_id, Post.is_hidden == False).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    if req.parent_id:
        parent = db.query(Comment).filter(Comment.id == req.parent_id, Comment.post_id == post_id).first()
        if not parent:
            raise HTTPException(status_code=404, detail="상위 댓글을 찾을 수 없습니다")

    comment = Comment(
        post_id=post_id,
        user_id=current_user.id,
        parent_id=req.parent_id,
        content=req.content,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return CommentResponse(
        id=comment.id,
        post_id=comment.post_id,
        user={"id": current_user.id, "nickname": current_user.nickname, "profile_image": current_user.profile_image},
        parent_id=comment.parent_id,
        content=comment.content,
        is_adopted=comment.is_adopted,
        is_hidden=comment.is_hidden,
        created_at=comment.created_at,
        replies=[],
    )


@router.patch("/comments/{comment_id}")
def update_comment(
    comment_id: int,
    req: CommentUpdateRequest,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="댓글을 찾을 수 없습니다")
    if comment.user_id != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="수정 권한이 없습니다")
    comment.content = req.content
    db.commit()
    return {"message": "수정되었습니다"}


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="댓글을 찾을 수 없습니다")
    if comment.user_id != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="삭제 권한이 없습니다")
    db.delete(comment)
    db.commit()


@router.post("/comments/{comment_id}/adopt")
def adopt_comment(
    comment_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="댓글을 찾을 수 없습니다")
    post = db.query(Post).filter(Post.id == comment.post_id).first()
    board = db.query(Board).filter(Board.id == post.board_id).first()
    if board.board_type != "qna":
        raise HTTPException(status_code=400, detail="Q&A 게시판에서만 채택이 가능합니다")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="질문 작성자만 채택할 수 있습니다")
    db.query(Comment).filter(Comment.post_id == post.id, Comment.is_adopted == True).update({"is_adopted": False})
    comment.is_adopted = True
    db.commit()
    return {"message": "답변이 채택되었습니다", "adopted_comment_id": comment.id}
