from sqlalchemy.orm import Session
from . import models

def get_symptoms(db: Session):
    return db.query(models.Symptom).all()

# 他の関数も同様に定義できます
