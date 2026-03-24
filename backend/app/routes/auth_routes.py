from flask import Blueprint
from app.controllers.auth_controller import login, logout, registrar, me , users_id


auth = Blueprint("auth",__name__)


@auth.route("/registrar", methods=["POST"])
def registrar_route():
    return registrar()


@auth.route("/login", methods=["POST"])
def login_route():
    return login()


@auth.route("/logout", methods=["POST"])
def logout_route():
    return logout()

@auth.route("/me", methods=["GET"])
def me_route():
    return me()

@auth.route("/user/<int:user_id>", methods=["GET"])
def users_id_route(user_id):
    return users_id(user_id)
