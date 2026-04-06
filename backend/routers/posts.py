import math
import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File as FastAPIFile, Form, status
from fastapi.responses import FileResponse as FastAPIFileResponse
from sqlalchemy.orm import Session, joinedload

from deps import get_db, get_current_user, require_active
from models.board import Board
from models.post import Post
from models.comment import Comment
from models.file import File
from models.user import User
from schemas.post import (
    PostDetailResponse,
    PostListResponse,
    PaginatedPostResponse,
    PostUserResponse,
    PostFileResponse,
)
from services.storage import get_storage, validate_file, get_upload_directory

router = APIRouter(prefix="/api", tags=["posts"])


@router.get("/boards/{board_slug}/posts", response_model=PaginatedPostResponse)
def list_posts(
    board_slug: str,
    page: int = 1,
    per_page: int = 20,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    board = db.query(Board).filter(Board.slug == board_slug, Board.is_active == True).first()
    if not board:
        raise HTTPException(status_code=404, detail="게시판을 찾을 수 없습니다")

    query = db.query(Post).filter(Post.board_id == board.id, Post.is_hidden == False)

    if search:
        query = query.filter(Post.title.ilike(f"%{search}%"))

    total = query.count()
    pages = math.ceil(total / per_page) if total > 0 else 1

    posts = (
        query
        .options(joinedload(Post.user), joinedload(Post.comments), joinedload(Post.files))
        .order_by(Post.is_pinned.desc(), Post.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    items = []
    for post in posts:
        items.append(PostListResponse(
            id=post.id,
            board_id=post.board_id,
            title=post.title,
            youtube_url=post.youtube_url,
            is_pinned=post.is_pinned,
            view_count=post.view_count,
            comment_count=len([c for c in post.comments if not c.is_hidden]),
            file_count=len(post.files),
            user=PostUserResponse.model_validate(post.user),
            created_at=post.created_at,
        ))

    return PaginatedPostResponse(items=items, total=total, page=page, pages=pages)


@router.post("/posts", status_code=status.HTTP_201_CREATED)
def create_post(
    board_id: int = Form(...),
    title: str = Form(...),
    content: str = Form(...),
    youtube_url: str | None = Form(None),
    files: list[UploadFile] = FastAPIFile(default=[]),
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="게시판을 찾을 수 없습니다")

    if board.slug == "notice" and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="공지사항은 관리자만 작성할 수 있습니다")

    if board.board_type == "video" and not youtube_url:
        raise HTTPException(status_code=400, detail="동영상 게시판은 YouTube URL이 필요합니다")

    if len(files) > 10:
        raise HTTPException(status_code=400, detail="파일은 최대 10개까지 첨부할 수 있습니다")

    if len(title.strip()) < 1 or len(title) > 200:
        raise HTTPException(status_code=400, detail="제목은 1~200자여야 합니다")

    post = Post(
        board_id=board_id,
        user_id=current_user.id,
        title=title.strip(),
        content=content,
        youtube_url=youtube_url,
    )
    db.add(post)
    db.flush()

    storage = get_storage()
    for upload_file in files:
        if not upload_file.filename:
            continue
        validate_file(upload_file, board.board_type)
        ext = upload_file.filename.rsplit(".", 1)[-1].lower() if "." in upload_file.filename else ""
        directory = get_upload_directory(board.board_type, f".{ext}")
        stored_name, file_path, file_size = storage.upload(upload_file, directory)

        db_file = File(
            post_id=post.id,
            user_id=current_user.id,
            original_name=upload_file.filename,
            stored_name=stored_name,
            file_path=file_path,
            file_size=file_size,
            mime_type=upload_file.content_type or "application/octet-stream",
        )
        db.add(db_file)

    db.commit()
    db.refresh(post)

    return {"id": post.id, "title": post.title, "message": "게시글이 작성되었습니다"}


@router.get("/posts/{post_id}", response_model=PostDetailResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = (
        db.query(Post)
        .options(joinedload(Post.user), joinedload(Post.files))
        .filter(Post.id == post_id, Post.is_hidden == False)
        .first()
    )
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    post.view_count += 1
    db.commit()

    return post


@router.patch("/posts/{post_id}")
def update_post(
    post_id: int,
    title: str | None = None,
    content: str | None = None,
    youtube_url: str | None = None,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    if post.user_id != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="수정 권한이 없습니다")

    if title is not None:
        post.title = title.strip()
    if content is not None:
        post.content = content
    if youtube_url is not None:
        post.youtube_url = youtube_url

    db.commit()
    return {"message": "수정되었습니다"}


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    current_user: User = Depends(require_active),
    db: Session = Depends(get_db),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    if post.user_id != current_user.id and current_user.role not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="삭제 권한이 없습니다")

    storage = get_storage()
    for file in post.files:
        storage.delete(file.file_path)

    db.delete(post)
    db.commit()


@router.get("/files/{file_id}/download")
def download_file(file_id: int, db: Session = Depends(get_db)):
    file = db.query(File).filter(File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다")

    storage = get_storage()
    path = storage.get_path(file.file_path)

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="파일이 존재하지 않습니다")

    return FastAPIFileResponse(
        path=path,
        filename=file.original_name,
        media_type=file.mime_type,
    )
