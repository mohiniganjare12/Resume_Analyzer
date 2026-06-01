from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "fallback_secret_change_me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"
    DATABASE_URL: str = "sqlite+aiosqlite:///./resumeiq.db"

    class Config:
        env_file = ".env"

settings = Settings()
