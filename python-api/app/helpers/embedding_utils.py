from PIL import Image
import torch
import clip

# Load CLIP model once globally
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

def get_embedding(image_file):
    """
    Generate a real embedding using CLIP.
    """
    # Convert to RGB
    img = Image.open(image_file).convert("RGB")

    # Preprocess image for CLIP
    img_input = preprocess(img).unsqueeze(0).to(device)

    # Generate embedding
    with torch.no_grad():
        embedding = model.encode_image(img_input)
        embedding = embedding.cpu().numpy().flatten().tolist()  # Convert to list

    return embedding
