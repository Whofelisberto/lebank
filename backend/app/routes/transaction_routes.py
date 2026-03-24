from flask import Blueprint

from app.controllers.transaction_controller import create_transaction, get_transactions_by_account_controller


transaction = Blueprint("transaction", __name__)


@transaction.route("/get-transaction/<int:account_id>", methods=["GET"])
def get_transaction_route(account_id: int):
    return get_transactions_by_account_controller(account_id)


@transaction.route("/criar-transaction", methods=["POST"])
def create_transaction_route():
    return create_transaction()
