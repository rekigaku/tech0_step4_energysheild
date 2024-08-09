from sqlalchemy import Column, Integer, String, ForeignKey, Float
from .database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "user_master"
    user_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, index=True)
    login_id = Column(String, unique=True, index=True)
    password = Column(String)

class Effect(Base):
    __tablename__ = "effect"
    effect_id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)

class Symptoms(Base):
    __tablename__ = "symptoms"
    symptoms_id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)

class ClinicMaster(Base):
    __tablename__ = 'clinic_master'
    clinic_id = Column(Integer, primary_key=True, index=True)
    clinic_name = Column(String)
    register_date = Column(String)
    address = Column(String)
    building = Column(String)
    area = Column(String)
    email = Column(String)
    tel = Column(String)
    # 他のカラムの定義

class ClinicDevice(Base):
    __tablename__ = 'clinic_device'
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey('device_master.device_id'))
    clinic_id = Column(Integer, ForeignKey('clinic_master.clinic_id'))
    # 他のカラムの定義

class DeviceMaster(Base):
    __tablename__ = 'device_master'
    device_id = Column(Integer, primary_key=True, index=True)
    device_name = Column(String)
    manufacture = Column(String)
    basic_price = Column(Float)
    picture_code = Column(String)
    symptoms_id = Column(Integer, ForeignKey('symptoms.symptoms_id'))
    effect_id = Column(Integer, ForeignKey('effect.effect_id'))

    # Relationship
    symptoms = relationship("Symptoms", back_populates="devices")
    effect = relationship("Effect", back_populates="devices")

# Relationship definitions
Symptoms.devices = relationship("DeviceMaster", order_by=DeviceMaster.device_id, back_populates="symptoms")
Effect.devices = relationship("DeviceMaster", order_by=DeviceMaster.device_id, back_populates="effect")
