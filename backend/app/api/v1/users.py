from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User, UserUpdate
from app.core.security import get_current_user
from app.db import repository

router = APIRouter()

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=User)
async def update_user_me(
    user_update: UserUpdate, current_user: User = Depends(get_current_user)
):
    """
    Update current user.
    """
    updated_user = await repository.update_user(
        user_id=current_user["_id"], user_update=user_update
    )
    if updated_user:
        return updated_user
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
    )

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_me(current_user: User = Depends(get_current_user)):
    """
    Delete current user.
    """
    await repository.delete_user(user_id=current_user["_id"])
    return