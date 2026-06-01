from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db, User
from schemas import UserRegister, UserLogin, TokenResponse, UserOut
from auth_utils import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(body: UserRegister, db: AsyncSession = Depends(get_db)):
    if len(body.password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(409, "An account with this email already exists")
    user = User(name=body.name, email=body.email, password=hash_password(body.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    token = create_access_token({"sub": str(user.id), "email": user.email, "name": user.name})
    return TokenResponse(token=token, user=UserOut.model_validate(user), message="Account created successfully")

@router.post("/login", response_model=TokenResponse)
async def login(body: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.password):
        raise HTTPException(401, "Invalid email or password")
    token = create_access_token({"sub": str(user.id), "email": user.email, "name": user.name})
    return TokenResponse(token=token, user=UserOut.model_validate(user), message="Login successful")

@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)
