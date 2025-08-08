from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import DATABASE_URL

class DataBase:
    client: AsyncIOMotorClient = None

db = DataBase()

async def get_database() -> AsyncIOMotorClient:
    return db.client

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(DATABASE_URL)

async def close_mongo_connection():
    db.client.close()