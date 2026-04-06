from pydantic import BaseModel


class BoardResponse(BaseModel):
    id: int
    slug: str
    name: str
    description: str | None
    board_type: str
    is_active: bool

    model_config = {"from_attributes": True}
