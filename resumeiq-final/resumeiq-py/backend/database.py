from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime, Text, ForeignKey, func
from datetime import datetime
from config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

class Analysis(Base):
    __tablename__ = "analyses"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_filename: Mapped[str] = mapped_column(String(255), nullable=True)
    job_title: Mapped[str] = mapped_column(String(255), nullable=True)
    overall_score: Mapped[int] = mapped_column(Integer, nullable=True)
    ats_score: Mapped[int] = mapped_column(Integer, nullable=True)
    match_score: Mapped[int] = mapped_column(Integer, nullable=True)
    impact_score: Mapped[int] = mapped_column(Integer, nullable=True)
    skills_score: Mapped[int] = mapped_column(Integer, nullable=True)
    experience_score: Mapped[int] = mapped_column(Integer, nullable=True)
    education_score: Mapped[int] = mapped_column(Integer, nullable=True)
    formatting_score: Mapped[int] = mapped_column(Integer, nullable=True)
    summary_score: Mapped[int] = mapped_column(Integer, nullable=True)
    result_json: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
