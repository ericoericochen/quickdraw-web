from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import base64
import io
import torch
import numpy as np
from model import MiniAlexNet
from inference import predict
from labels import labels

app = Flask(__name__)
CORS(app)

device = "cpu"
if torch.backends.mps.is_available() and torch.backends.mps.is_built():
    device = torch.device("mps")


def load_model(pth_file: str, device="cpu") -> torch.nn.Module:
    num_labels = len(labels)
    model = MiniAlexNet(labels=num_labels)
    model = model.to(device)

    # load weights and biases from .pth file
    model.load_state_dict(torch.load(pth_file))

    return model


IMAGE_WIDTH = 28
IMAGE_HEIGHT = 28


@app.route("/inference", methods=["POST"])
def inference():
    # convert image uri to image bytes to PIL Image to numpy array to tensor
    image_uri: str = request.json.get("image")
    image_data = image_uri.split(",")[1]
    image_bytes = io.BytesIO(base64.b64decode(image_data))

    # open with PIL, resize and convert to black-white image
    image = Image.open(image_bytes).resize((IMAGE_WIDTH, IMAGE_HEIGHT)).convert("L")

    # convert to numpy and normalize
    image = np.array(image) / 255
    image = np.expand_dims(image, axis=0)

    # convert tensor
    image = torch.from_numpy(image).type(torch.float32)

    # model: minialexnet
    model = load_model("./minialexnet.pth", device=device)

    # inference
    probabilities = predict(model, image, labels=labels, k=5, device=device)

    return jsonify({"probabilities": probabilities})


@app.route("/")
def hello():
    return "Hello, World!"


if __name__ == "__main__":
    app.run(debug=True)
