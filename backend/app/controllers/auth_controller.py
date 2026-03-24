from flask import request, jsonify
from app.models.user import User
from app.models.account import Account
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_jwt
from werkzeug.security import check_password_hash, generate_password_hash
from app.database.db import db
from app.services.auth_service import revoke_token
from app.services.account_service import gerar_numero_conta


def registrar():
  try:
      data = request.get_json()

      username = data.get("username")
      cpf = data.get("cpf")
      email = data.get("email")
      password = data.get("password")

      if not username or not cpf or not email or not password:
          return jsonify({"error": "todos os campos são obrigatórios"}), 400

      if User.query.filter_by(username=username).first():
          return jsonify({"error": "nome de usuário já registrado"}), 400

      if User.query.filter_by(email=email).first():
          return jsonify({"error": "email já registrado"}), 400

      hashed_password = generate_password_hash(password)

      Novo_usuario = User(username=username, cpf=cpf, email=email, password=hashed_password) # type: ignore

      numero_conta = gerar_numero_conta()
      nova_conta = Account(account_number=numero_conta) # type: ignore
      Novo_usuario.accounts.append(nova_conta)

      db.session.add(Novo_usuario)
      db.session.commit()

      return jsonify({
          "message": "Usuário registrado com sucesso!",
          "account_number": numero_conta
      }), 201

  except Exception as e:
        return jsonify({"error": f"Erro ao registrar o usuário: {str(e)}"}), 500



def login():
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"message": "Preencha todos os campos!" }), 400

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return jsonify({"message": "Credenciáis inválidas"}), 401

        token = create_access_token(identity=str(user.id))

        return jsonify({"message": "Login realizado com sucesso!",
          "token": token,
          "User":
                  {
                  "id": user.id,
                  "username": user.username,
                  "email": user.email }
        }), 200
    except Exception as e:
        return jsonify({"error": f"Erro ao buscar usuário: {str(e)}"}), 500



@jwt_required()
def logout():
    try:
        jwt_data = get_jwt()
        token_jti = jwt_data.get("jti")

        if not token_jti:
            return jsonify({"message": "token inválido"}), 400

        revoke_token(token_jti)
        return jsonify({"message": "Logout realizado com sucesso"}), 200
    except Exception as e:
        return jsonify({"error": f"Erro ao realizar logout: {str(e)}"}), 500

@jwt_required()
def me():
    try:
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)

        if not current_user:
            return jsonify({"message": "Usuário não encontrado!"}), 404

        conta_principal = current_user.accounts[0] if current_user.accounts else None

        return jsonify({
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "cpf": current_user.cpf,
            "account_number": conta_principal.account_number if conta_principal else None
        }), 200

    except Exception as e:
        return jsonify({"error": f"Erro ao buscar usuário atual: {str(e)}"}), 500


def users_id(user_id):
    try:
        user = User.query.get(user_id)
        if user:
            conta_principal = user.accounts[0] if user.accounts else None

            return jsonify({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "cpf": user.cpf,
                "account_number": conta_principal.account_number if conta_principal else None
            }), 200

        return jsonify({"message": "user não encontrado!"}), 404

    except Exception as e:
        return jsonify({"error": f"Erro ao buscar usuário por id: {str(e)}"}), 500



