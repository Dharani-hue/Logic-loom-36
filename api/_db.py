from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///profiles.db')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ElderlyProfileDB(Base):
    __tablename__ = 'profiles'
    id = Column(String, primary_key=True)
    name = Column(String)
    age = Column(String)
    gender = Column(String)
    location = Column(String)
    familyContact = Column(String)
    appetite = Column(String)
    mood = Column(String)
    mobility = Column(String)
    sleepQuality = Column(String)
    lonelinessScore = Column(Integer)
    meals = Column(String)
    outings = Column(String)
    activities = Column(String)
    interactions = Column(String)
    socialConnections = Column(String)
    notes = Column(String)
    risk = Column(String)
    createdAt = Column(DateTime)

Base.metadata.create_all(bind=engine)

def assess_profile_risk(profile):
    if (profile.lonelinessScore >= 16 or 
        profile.mobility == 'Limited' or 
        profile.appetite == 'Poor' or
        profile.meals == 'Poor' or
        int(profile.interactions or 0) < 3 or
        profile.outings == 'None'):
        return 'High'
    if (profile.lonelinessScore >= 12 or 
        profile.mobility == 'Reduced' or 
        profile.appetite == 'Fair' or
        profile.meals == 'Fair' or
        int(profile.interactions or 0) < 7):
        return 'Medium'
    return 'Low'