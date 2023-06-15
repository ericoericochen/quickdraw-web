from flask import Flask, request

app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello, World!"


@app.route("/boom", methods=["POST"])
def boom():
    return "Boom!"


if __name__ == "__main__":
    app.run(debug=True)
