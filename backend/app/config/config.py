import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:

    SECRET_KEY = os.getenv("SECRET_KEY", "sua-secret-key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://admin:admin@localhost:5433/lebank")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_TOKEN_LOCATION = ["headers"]
    JWT_TOKEN_NAME = "Authorization"
    JWT_TOKEN_TYPE = "Bearer"
    JWT_TOKEN_EXPIRES = timedelta(hours=1)
