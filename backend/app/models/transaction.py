from app.database.db import db
from sqlalchemy import CheckConstraint


class Transaction(db.Model):
    __table_args__ = (CheckConstraint('amount > 0', name='check_amount_positive'),)

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)
    target_account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    transaction_type = db.Column(db.Enum('deposit', 'withdrawal', 'transfer', name='transaction_type'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    account = db.relationship('Account', foreign_keys=[account_id], backref=db.backref('transactions', lazy=True))
    target_account = db.relationship('Account', foreign_keys=[target_account_id], lazy=True)
  