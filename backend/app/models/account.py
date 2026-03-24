from app.database.db import db


class Account(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    account_number = db.Column(db.String(20), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    balance = db.Column(db.Numeric(10, 2), nullable=False, default=100.00)
    type = db.Column(db.String(50), nullable=False, default='corrente')
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    user = db.relationship('User', back_populates='accounts')
