from fastapi import FastAPI, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from .database import SessionLocal, engine
from . import models, schemas
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from .schemas import Device



models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# DB接続用の依存関係
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 許可するオリジン
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login")
def login(user_id: str = Body(...), password: str = Body(...), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == user_id, models.User.password == password).first()
    if user:
        return {"user_name": user.user_name}
    else:
        raise HTTPException(status_code=404, detail="User not found")

@app.get("/search_devices", response_model=List[schemas.Device])
def search_devices(symptoms_id: int, effect_id: int, area: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(
        models.ClinicDevice.device_id,
        models.ClinicDevice.clinic_id,
        models.ClinicDevice.device_name,
        models.ClinicDevice.description,
        models.ClinicDevice.price,
        models.ClinicDevice.duration,
        models.ClinicMaster.address,
        models.ClinicMaster.tel
    ).join(models.ClinicMaster, models.ClinicMaster.clinic_id == models.ClinicDevice.clinic_id
    ).join(models.DeviceMaster, models.DeviceMaster.device_id == models.ClinicDevice.device_id
    ).filter(
        models.DeviceMaster.effect_id == effect_id,
        models.DeviceMaster.symptoms_id == symptoms_id,
    )

    if area:
        query = query.filter(models.ClinicMaster.area == area)

    results = query.all()
    if not results:
        raise HTTPException(status_code=404, detail="Devices not found")

    return results

@app.post("/reserve_device")
def reserve_device(
    reservation: schemas.ReservationCreate,  # Pydanticモデルとしてデータを受け取る
    db: Session = Depends(get_db)
):
    reservation_data = models.ReservationRecord(
        user_id=reservation.user_id,
        clinic_id=reservation.clinic_id,
        device_id=reservation.device_id,
        reservation_date=datetime.strptime(reservation.reservation_date, "%Y-%m-%d"),
        start_time=datetime.strptime(reservation.start_time, "%H:%M"),
        end_time=datetime.strptime(reservation.end_time, "%H:%M"),
        price=reservation.price
    )
    db.add(reservation_data)
    db.commit()
    db.refresh(reservation_data)
    return {"reservation_id": reservation_data.reservation_id}


@app.get("/get_device_by_tel", response_model=schemas.Device)
def get_device_by_tel(tel: str, db: Session = Depends(get_db)):
    device = db.query(models.Device).filter(models.Device.tel == tel).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return device


@app.get("/get_reservation_details", response_model=schemas.ReservationDetails)
def get_reservation_details(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(models.ReservationRecord).filter(models.ReservationRecord.reservation_id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation
