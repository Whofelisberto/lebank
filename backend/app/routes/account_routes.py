from flask import Blueprint
from app.controllers.account_controller import get_my_account_controller


account = Blueprint("account", __name__)


@account.route("/my-account", methods=["GET"])
def get_my_account_route():
    return get_my_account_controller()
