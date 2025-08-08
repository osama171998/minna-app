import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import DATABASE_URL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataBase:
    client: AsyncIOMotorClient = None

db = DataBase()

async def get_database() -> AsyncIOMotorClient:
    logger.info("Getting database client...")
    return db.client

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    db.client = AsyncIOMotorClient(DATABASE_URL)
    try:
        await db.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB.")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")


async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    db.client.close()