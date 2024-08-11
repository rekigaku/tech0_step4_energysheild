from sqlalchemy import Column, Integer, String, ForeignKey, Float
from .database import Base

class User(Base):
    __tablename__ = 'user_master'

    user_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, index=True)
    password = Column(String)

class Symptom(Base):
    __tablename__ = 'symptoms'

    symptom_id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)

class Effect(Base):
    __tablename__ = 'effects'

    effect_id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)

class ClinicMaster(Base):
    __tablename__ = 'clinic_master'

    clinic_id = Column(Integer, primary_key=True, index=True)
    clinic_name = Column(String)
    address = Column(String)
    tel = Column(String)
    area = Column(String)

class ClinicDevice(Base):
    __tablename__ = 'clinic_device'

    device_id = Column(Integer, primary_key=True, index=True)
    clinic_id = Column(Integer, ForeignKey('clinic_master.clinic_id'))
    device_name = Column(String)
    description = Column(String)
    price = Column(Float)
    duration = Column(Integer)

class DeviceMaster(Base):
    __tablename__ = 'device_master'

    device_id = Column(Integer, primary_key=True, index=True)
    device_name = Column(String)
    manufacture = Column(String)
    basic_price = Column(Float)
    symptoms_id = Column(Integer, ForeignKey('symptoms.symptom_id'))
    effect_id = Column(Integer, ForeignKey('effects.effect_id'))
    picture_code = Column(String)
