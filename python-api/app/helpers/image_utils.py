import base64
from io import BytesIO
from PIL import Image
import uuid

def base64_to_webp(image_base64, max_size_bytes=5_000_000):
    """
    Convert a Base64 image string to WebP bytes safely.
    Limits size to prevent DoS.
    """
    if "," in image_base64:
        _, encoded = image_base64.split(",", 1)
    else:
        encoded = image_base64

    image_data = base64.b64decode(encoded)
    if len(image_data) > max_size_bytes:
        raise ValueError(f"Image too large: {len(image_data)} bytes")

    webp_io = BytesIO()
    Image.open(BytesIO(image_data)).convert("RGB").save(webp_io, format="WEBP")
    webp_io.seek(0)
    return webp_io

def generate_filename(admin_id):
    """
    Generate a unique WebP filename for the image.
    """
    return f"{admin_id}_{uuid.uuid4().hex}.webp"
