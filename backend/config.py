# from pydantic_settings import BaseSettings

# class Settings(BaseSettings):
#     SECRET_KEY: str = "fallback_secret_change_me"
#     ALGORITHM: str = "HS256"
#     ACCESS_TOKEN_EXPIRE_DAYS: int = 7
#     OLLAMA_BASE_URL: str = "http://localhost:11434"
#     OLLAMA_MODEL: str = "llama3"
#     DATABASE_URL: str = "sqlite+aiosqlite:///./resumeiq.db"

#     class Config:
#         env_file = ".env"

# settings = Settings()


from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: str
    GROQ_API_KEY: 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
    OLLAMA_MODEL: str = "llama3-8b-8192"

    class Config:
        env_file = ".env"

settings = Settings()