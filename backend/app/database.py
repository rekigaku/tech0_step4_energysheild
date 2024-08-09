from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# データベースへの接続設定
DATABASE_PATHS = {
    "user_master": "sqlite:///../database/user_master.db",
    "device_master": "sqlite:///../database/device_master.db",
    "clinic_device": "sqlite:///../database/clinic_device.db",
    "clinic_device_rental": "sqlite:///../database/clinic_device_rental.db",
    "clinic_master": "sqlite:///../database/clinic_master.db",
    "effect": "sqlite:///../database/effects.db",
    "reservation_records": "sqlite:///../database/reservation_records.db",
    "symptoms": "sqlite:///../database/symptoms.db"
}

# デバッグ用: パスを出力
for name, path in DATABASE_PATHS.items():
    print(f"{name}: {path}")

# エンジンとセッションの設定
engines = {
    name: create_engine(path, connect_args={"check_same_thread": False})
    for name, path in DATABASE_PATHS.items()
}
SessionLocals = {
    name: sessionmaker(autocommit=False, autoflush=False, bind=engine)
    for name, engine in engines.items()
}
Base = declarative_base()

def get_db_connection(db_name: str) -> Session:
    """指定したデータベースのセッションを取得"""
    if db_name not in SessionLocals:
        raise ValueError(f"Database {db_name} not configured.")
    
    session = SessionLocals[db_name]()
    engine = engines[db_name]
    
    print(f"Using engine: {engine}")  # エンジンが正しく設定されているか確認
    print(f"Session: {session}")  # セッションが正しく設定されているか確認
    
    # デバッグ用: テーブル一覧を出力して確認
    metadata = MetaData()
    metadata.reflect(bind=engine)
    tables = metadata.tables.keys()
    print(f"Tables in {db_name}: {list(tables)}")
    
    return session

def get_db() -> Session:
    """デフォルトのデータベース（例: user_master）に接続するセッションを取得"""
    return get_db_connection("user_master")
