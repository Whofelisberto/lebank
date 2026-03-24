from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from decimal import Decimal, InvalidOperation
from app.models.transaction import Transaction
from app.models.account import Account
from app.database.db import db


@jwt_required()
def get_transactions_by_account_controller(account_id: int):
    try:
        current_user_id = int(get_jwt_identity())

        account = Account.query.filter_by(id=account_id).first()

        if not account:
            return jsonify({"message": "Conta não encontrada"}), 404

        if account.user_id != current_user_id:
            return jsonify({"message": "Acesso negado"}), 403

        transactions = (
            Transaction.query.filter_by(account_id=account_id)
            .order_by(Transaction.created_at.desc())
            .all()
        )

        data = [
            {
                "id": transaction.id,
                "account_id": transaction.account_id,
                "target_account_id": transaction.target_account_id,
                "amount": str(transaction.amount),
                "transaction_type": transaction.transaction_type,
                "created_at": transaction.created_at.isoformat() if transaction.created_at else None,
            }
            for transaction in transactions
        ]

        return jsonify({"account_id": account_id, "transactions": data}), 200
    except Exception as e:
        return jsonify({"message": "Erro ao buscar transações", "details": str(e)}), 500

@jwt_required()
def create_transaction():
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()

        account_id = data.get("account_id")
        transaction_type = data.get("transaction_type")

        if not account_id or not transaction_type:
            return jsonify({"message": "Dados inválidos"}), 400

        amount_value = data.get("amount")

        if amount_value is None:
            return jsonify({"message": "Valor é obrigatório"}), 400

        try:
            amount = Decimal(str(amount_value))
        except (InvalidOperation, ValueError):
            return jsonify({"message": "Valor inválido"}), 400

        if amount <= 0:
            return jsonify({"message": "O valor deve ser positivo"}), 400

        if transaction_type not in ("deposit", "withdrawal", "transfer"):
            return jsonify({"message": "Tipo de transação inválido"}), 400


        account = Account.query.filter_by(id=account_id).with_for_update().first()

        if not account:
            return jsonify({"message": "Conta não encontrada"}), 404

        if account.user_id != current_user_id:
            return jsonify({"message": "Acesso negado"}), 403


        if transaction_type == "deposit":
            account.balance += amount
            db.session.add(Transaction(account_id=account_id,amount=amount,transaction_type=transaction_type))# type: ignore

        elif transaction_type == "withdrawal":
            if account.balance < amount:
                return jsonify({"message": "Saldo insuficiente"}), 400
            account.balance -= amount
            db.session.add(Transaction(account_id=account_id,amount=amount,transaction_type=transaction_type))# type: ignore

        elif transaction_type == "transfer":
            target_account_id = data.get("target_account_id")

            if not target_account_id:
                return jsonify({"message": "Conta de destino é obrigatória"}), 400

            target_account = Account.query.filter_by(id=target_account_id).with_for_update().first()

            if not target_account:
                return jsonify({"message": "Conta de destino não encontrada"}), 404

            if account.balance < amount:
                return jsonify({"message": "Saldo insuficiente"}), 400

            account.balance -= amount
            target_account.balance += amount

            db.session.add(Transaction(account_id=account_id,amount=amount,transaction_type=transaction_type,target_account_id=target_account_id))   # type: ignore

            db.session.add(Transaction(account_id=target_account_id,amount=amount,transaction_type=transaction_type,target_account_id=account_id))# type: ignore

        db.session.commit()

        return jsonify({"message": "Transação realizada com sucesso", "balance": str(account.balance)}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Erro ao criar transação", "details": str(e)}), 500
