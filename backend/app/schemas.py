from pydantic import BaseModel

class UserLogin(BaseModel):
    login_id: str
    password: str

class Device(BaseModel):
    device_name: str
    manufacture: str
    basic_price: float
    picture_code: str
    symptoms_description: str
    effect_description: str

    class Config:
        orm_mode = True
