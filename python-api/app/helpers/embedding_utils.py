import tempfile
from PIL import Image

def get_embedding(image_file):
    """
    Convert image file to .webp and generate an embedding.
    (Dummy embedding in this example — replace with real model.)
    """

    # Convert to RGB to avoid palette issues
    img = Image.open(image_file).convert("RGB")

    # Fix Windows locking issue: use delete=False
    with tempfile.NamedTemporaryFile(suffix=".webp", delete=False) as tmp:
        temp_path = tmp.name

    img.save(temp_path, format="WEBP")

    # TODO: Replace this with your real embedding model
    # Example: embedding = model.encode(temp_path)
    embedding = [0.1, 0.2, 0.3]  # dummy data

    return embedding
