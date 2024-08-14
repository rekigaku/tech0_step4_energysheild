from pydantic import BaseModel



# 新たに追加する ReservationCreate スキーマ
class ReservationCreate(BaseModel):
    user_id: int
    clinic_id: int
    device_id: int
    reservation_date: str
    start_time: str
    end_time: str
    price: float
    
class ReservationDetails(BaseModel):
    reservation_id: int
    user_id: int
    clinic_id: int
    device_id: int
    reservation_date: str
    start_time: str
    end_time: str
    price: float

    

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
        from_attributes = True