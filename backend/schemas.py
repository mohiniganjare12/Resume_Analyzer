from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}

class TokenResponse(BaseModel):
    token: str
    user: UserOut
    message: str


class SectionScore(BaseModel):
    name: str
    score: int
    color: Optional[str] = "#4f46e5"

class ImprovementItem(BaseModel):
    level: str
    title: str
    detail: str

class AnalysisHistoryItem(BaseModel):
    id: int
    resume_filename: Optional[str] = None
    job_title: Optional[str] = None
    overall_score: Optional[int] = None
    ats_score: Optional[int] = None
    match_score: Optional[int] = None
    impact_score: Optional[int] = None
    created_at: datetime

    model_config = {"from_attributes": True}
