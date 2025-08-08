from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import connect_to_mongo, close_mongo_connection
from app.api.v1 import auth, users, instagram, analysis

# Create an API router
api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(instagram.router, prefix="/instagram", tags=["instagram"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])

# Define the health check endpoint
@api_router.get("/health")
def health_check():
    """
    Health check endpoint.
    """
    return {"status": "ok"}

# Create the main FastAPI application
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()


# Include the API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    """
    Root endpoint.
    """
    return {"Hello": "World"}