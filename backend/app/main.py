from fastapi import FastAPI, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from .database import SessionLocal, engine
from . import models, schemas
from fastapi.middleware.cors import CORSMiddleware

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
