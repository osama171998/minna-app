from fastapi import APIRouter, Depends
from app.models.user import User
from app.core.security import get_current_user
from app.services import analysis_service
from app.models.post import Post
from typing import List, Dict

router = APIRouter()

@router.post("/", response_model=Dict)
async def analyze_posts(
    posts: List[Post], current_user: User = Depends(get_current_user)
):
    """
    Analyze a list of posts.
    """
    analysis = await analysis_service.analyze_engagement(
        user_id=current_user["_id"], posts=posts
    )
    return analysis