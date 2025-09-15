import cv2
import numpy as np
from PIL import Image

# Load OpenCV Haar Cascade once
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

def detect_and_crop_face(image_bytes):
    """
    Detect the largest face in the image and return a cropped PIL image.
    If no face is found, return the original.
    """
    # Decode image bytes → OpenCV BGR
    img = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid image data")

    # Detect faces in grayscale
    faces = face_cascade.detectMultiScale(
        cv2.cvtColor(img, cv2.COLOR_BGR2GRAY),
        scaleFactor=1.1,
        minNeighbors=5,
    )

    # If no face → return original
    if len(faces) == 0:
        return Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

    # Crop largest detected face
    x, y, w, h = max(faces, key=lambda box: box[2] * box[3])
    face_crop = img[y:y+h, x:x+w]

    # Convert BGR → RGB → PIL
    return Image.fromarray(cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB))
