from app.database.db import db

class User(db.Model):

  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(80), unique=True, nullable=False)
  email = db.Column(db.String(120), unique=True, nullable=False)
  password = db.Column(db.String(255), nullable=False)
  cpf = db.Column(db.String(14), unique=True, nullable=False)
  created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

  accounts = db.relationship("Account", back_populates="user", lazy=True)
