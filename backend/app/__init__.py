from .models import Base, ClinicMaster, ClinicDevice, DeviceMaster  # すべてのモデルをインポート
from .database import engines

def init_db():
    # すべてのデータベースエンジンに対してテーブルを作成
    for engine in engines.values():
        Base.metadata.create_all(bind=engine)

# init_db() 関数をアプリケーションの起動時に呼び出す
init_db()
