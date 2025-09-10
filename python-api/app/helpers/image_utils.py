import base64
from io import BytesIO
from PIL import Image
import uuid

def base64_to_webp(image_base64):
    """
    Convert Base64 image string to WebP bytes
    """
    header, encoded = image_base64.split(",", 1)
    image_data = base64.b64decode(encoded)
    
    img = Image.open(BytesIO(image_data))
    webp_io = BytesIO()
    img.save(webp_io, format="WEBP")
    webp_io.seek(0)
    return webp_io

def generate_filename(admin_id):
    """
    Generate a unique filename for the image
    """
    return f"{admin_id}_{uuid.uuid4().hex}.webp"
