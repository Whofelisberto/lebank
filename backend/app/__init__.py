from flask import Flask
from flask_jwt_extended import JWTManager
from werkzeug.datastructures import Authorization
from app.config.config import Config
from app.database.db import db
from app.models.user import User
from app.models.account import Account
from app.models.transaction import Transaction
from app.routes.account_routes import account
from app.routes.auth_routes import auth
from app.routes.transaction_routes import transaction
from app.services.auth_service import is_token_revoked
from flask_cors import CORS


def create_app() -> Flask:
    app = Flask(__name__)

    app.config.from_object(Config)
    db.init_app(app)

    jwt = JWTManager(app)

    CORS(app, supports_credentials=True, origins=["http://localhost:5173"], allow_headers=["Content-type", "Authorization"])

    @jwt.token_in_blocklist_loader
    def check_if_token_is_revoked(_jwt_header, jwt_payload):
        return is_token_revoked(jwt_payload["jti"])

    app.register_blueprint(auth)
    app.register_blueprint(account)
    app.register_blueprint(transaction)

    with app.app_context():
        db.create_all()

    return app
