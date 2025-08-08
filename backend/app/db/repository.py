from app.db.database import get_database
from app.models.user import UserCreate, UserInDB, UserUpdate
from app.core.security import get_password_hash
from bson import ObjectId
from datetime import datetime

DB_NAME = "minna_ai"

async def get_user_by_email(email: str):
    client = await get_database()
    db = client[DB_NAME]
    return await db.users.find_one({"email": email})

async def create_user(user: UserCreate):
    client = await get_database()
    db = client[DB_NAME]
    hashed_password = get_password_hash(user.password)
    
    user_doc = {
        "email": user.email,
        "hashed_password": hashed_password,
        "createdAt": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_doc)
    created_user = await db.users.find_one({"_id": result.inserted_id})
    return created_user

async def update_user(user_id: str, user_update: UserUpdate):
    client = await get_database()
    db = client[DB_NAME]
    user_update_data = user_update.dict(exclude_unset=True)

    if "password" in user_update_data:
        user_update_data["hashed_password"] = get_password_hash(
            user_update_data.pop("password")
        )

    await db.users.update_one(
        {"_id": ObjectId(user_id)}, {"$set": user_update_data}
    )
    return await db.users.find_one({"_id": ObjectId(user_id)})

async def delete_user(user_id: str):
    client = await get_database()
    db = client[DB_NAME]
    await db.users.delete_one({"_id": ObjectId(user_id)})