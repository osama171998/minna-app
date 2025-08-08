from app.db.database import get_database
from app.models.user import UserCreate, UserInDB
from app.core.security import get_password_hash

async def get_user_by_email(email: str):
    db = await get_database()
    return await db.users.find_one({"email": email})

async def create_user(user: UserCreate):
    db = await get_database()
    hashed_password = get_password_hash(user.password)
    user_in_db = UserInDB(**user.dict(), hashed_password=hashed_password)
    await db.users.insert_one(user_in_db.dict(by_alias=True))
    return user_in_db