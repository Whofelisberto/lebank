import random
from app.models.account import Account


def gerar_numero_conta() -> str:
    while True:
        numero = str(random.randint(100000, 999999))
        if not Account.query.filter_by(account_number=numero).first():
            return numero


def get_account_balance(account_id: int) -> float:
    return 0.0
