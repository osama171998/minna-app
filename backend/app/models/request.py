from pydantic import BaseModel
from typing import List

class ScrapeByDateRequest(BaseModel):
    start_date: str
    end_date: str

class ScrapeByLinksRequest(BaseModel):
    post_links: List[str]