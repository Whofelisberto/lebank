from app import create_app


app = create_app()

@app.route("/", methods=["GET"])
def home():
  return "API do lebank"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
