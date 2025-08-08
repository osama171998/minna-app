from fastapi import APIRouter, Depends
from app.models.user import User
from app.core.security import get_current_user
from app.services import instagram_service
from app.models.post import Post
from app.models.request import ScrapeByDateRequest, ScrapeByLinksRequest
from typing import List

router = APIRouter()

@router.post("/scrape-by-date", response_model=List[Post])
async def scrape_by_date(
    request: ScrapeByDateRequest, current_user: User = Depends(get_current_user)
):
    """
    Scrape Instagram posts by date range.
    """
    posts = await instagram_service.scrape_posts_by_date_range(
        user_id=current_user["_id"],
        start_date=request.start_date,
        end_date=request.end_date,
    )
    return posts

@router.post("/scrape-by-links", response_model=List[Post])
async def scrape_by_links(
    request: ScrapeByLinksRequest, current_user: User = Depends(get_current_user)
):
    """
    Scrape Instagram posts by links.
    """
    posts = await instagram_service.scrape_posts_by_links(
        user_id=current_user["_id"], post_links=request.post_links
    )
    return posts