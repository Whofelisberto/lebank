from werkzeug.security import check_password_hash
from app.models.user import User


revoked_tokens: set[str] = set()


def authenticate_user(email: str, password: str) -> bool:
    user = User.query.filter_by(email=email).first()
    return bool(user and check_password_hash(user.password, password))


def revoke_token(jti: str) -> None:
    revoked_tokens.add(jti)


def is_token_revoked(jti: str) -> bool:
    return jti in revoked_tokens
