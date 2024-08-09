from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from .database import get_db_connection, get_db
from .models import User, Base
from .schemas import UserLogin, Device
from sqlalchemy import text
from .database import engines

# アプリケーションの起動時にデータベースを初期化
def init_db():
    for engine in engines.values():
        Base.metadata.create_all(bind=engine)

init_db()

app = FastAPI()

# CORS設定
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ログインエンドポイント
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.login_id == user.login_id, User.password == user.password).first()
    if db_user is None:
        raise HTTPException(status_code=400, detail="Invalid login credentials")
    return {"user_name": db_user.user_name}

@app.get("/devices", response_model=List[Device])
def get_devices(symptoms_id: int, effect_id: int, area: str, db: Session = Depends(get_db_connection)):
    print(f"Using database connection: {db.bind}")  # 使用中のデータベースを確認
    print(f"Executing query with symptoms_id: {symptoms_id}, effect_id: {effect_id}, area: {area}")
    query = text("""
        SELECT dm.device_name, dm.manufacture, dm.basic_price, dm.picture_code, s.description AS symptoms_description, e.description AS effect_description
        FROM device_master dm
        JOIN symptoms s ON dm.symptoms_id = s.symptoms_id
        JOIN effect e ON dm.effect_id = e.effect_id
        JOIN clinic_device cd ON dm.device_id = cd.device_id
        JOIN clinic_master cm ON cd.clinic_id = cm.clinic_id
        WHERE dm.symptoms_id = :symptoms_id AND dm.effect_id = :effect_id AND cm.area = :area
    """)
    try:
        devices = db.execute(query, {"symptoms_id": symptoms_id, "effect_id": effect_id, "area": area}).fetchall()
        print(f"Devices found: {devices}")  # デバッグ用出力
    except Exception as e:
        print(f"Error executing query: {e}")  # デバッグ用出力
        raise HTTPException(status_code=500, detail=str(e))
    
    if not devices:
        raise HTTPException(status_code=404, detail="No devices found matching the criteria")
    
    # デバイスデータを整形して返す
    return [{"device_name": d.device_name, "manufacture": d.manufacture, "basic_price": d.basic_price, "picture_code": d.picture_code, "description": d.symptoms_description} for d in devices]
