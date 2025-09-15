import cv2
import numpy as np
from PIL import Image
import io

# Load OpenCV Haar Cascade for face detection (ships with opencv)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def detect_and_crop_face(image_bytes):
    """
    Detect the largest face in the image and return a cropped PIL image.
    If no face found, return the original.
    """
    # Convert bytes → numpy array
    file_bytes = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Invalid image data")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    if len(faces) == 0:
        # No face detected → return original
        return Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

    # Pick the largest face
    x, y, w, h = max(faces, key=lambda box: box[2] * box[3])

    # Crop & convert back to PIL
    face_crop = img[y:y+h, x:x+w]
    pil_face = Image.fromarray(cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB))

    return pil_face
