from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId
from datetime import datetime

class Comment(BaseModel):
    id: Optional[str] = Field(alias='_id')
    postId: str
    instagramCommentId: str
    text: str
    author: dict
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class Post(BaseModel):
    id: Optional[str] = Field(alias='_id')
    userId: str
    instagramPostId: str
    caption: str
    likes: int
    shares: int
    viewCount: int
    scrapedAt: datetime = Field(default_factory=datetime.utcnow)
    comments: List[Comment] = []

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}