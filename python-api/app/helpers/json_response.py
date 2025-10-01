from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from bson import ObjectId


def json_response(data, status_code: int = 200):
    """
    Custom JSON response that automatically converts ObjectId to str
    """
    return JSONResponse(
        content=jsonable_encoder(data, custom_encoder={ObjectId: str}),
        status_code=status_code
    )
