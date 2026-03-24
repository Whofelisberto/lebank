from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_login import current_user
from app.models.user import User
from app.models.account import Account


@jwt_required()
def get_my_account_controller():
    try:
        current_user_id = int(get_jwt_identity())

        account = (
            Account.query.filter_by(user_id=current_user_id).order_by(Account.created_at.asc()).first()
        )

        if not account:
            return jsonify({"message": "Conta não encontrada"}), 404

        current_user = User.query.get(account.user_id)

        return (
            jsonify(
                {
                    "id": account.id,
                    "account_number": account.account_number,
                    "user_id": account.user_id,
                    "username": current_user.username if current_user else None,
                    "balance": str(account.balance),
                    "type": account.type,
                    "created_at": account.created_at.isoformat() if account.created_at else None,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": "Erro ao buscar conta", "details": str(e)}), 500
