from pydantic import BaseModel

class Device(BaseModel):
    device_id: int
    clinic_id: int
    device_name: str
    description: str
    price: float
    duration: str 
    address: str
    tel: str

    class Config:
        orm_mode = True
