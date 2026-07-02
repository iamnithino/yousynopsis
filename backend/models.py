from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import declarative_base, relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=True)
    role = Column(String, default="User")
    location = Column(String, nullable=True)
    bio = Column(Text, nullable=True)

    summaries = relationship("Summary", back_populates="owner")
    comparisons = relationship("Comparison", back_populates="owner")
    presentations = relationship("Presentation", back_populates="owner")

class Summary(Base):
    __tablename__ = 'summaries'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    youtube_url = Column(String, nullable=False)
    title = Column(String, nullable=True)
    channel = Column(String, nullable=True)
    duration = Column(Integer, nullable=True)
    thumbnail = Column(String, nullable=True)
    transcript = Column(Text, nullable=True)
    caption_segments = Column(JSON, nullable=True)
    caption_summaries = Column(JSON, nullable=True)
    summary_text = Column(Text, nullable=True)
    keywords = Column(JSON, nullable=True)
    chapters = Column(JSON, nullable=True)
    key_points = Column(JSON, nullable=True)
    questions = Column(JSON, nullable=True)
    action_items = Column(JSON, nullable=True)
    language = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="summaries")

class Comparison(Base):
    __tablename__ = 'comparisons'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    youtube_url_1 = Column(String, nullable=False)
    youtube_url_2 = Column(String, nullable=False)
    goal = Column(Text, nullable=True)
    language = Column(String, nullable=True)
    video_1 = Column(JSON, nullable=True)
    video_2 = Column(JSON, nullable=True)
    combined_summary = Column(Text, nullable=True)
    common_points = Column(JSON, nullable=True)
    differences = Column(JSON, nullable=True)
    best_takeaways = Column(JSON, nullable=True)
    verdict = Column(JSON, nullable=True)
    best_overall_video = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="comparisons")

class Presentation(Base):
    __tablename__ = 'presentations'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    title = Column(String, nullable=False)
    source_type = Column(String, nullable=True)
    source_id = Column(Integer, nullable=True)
    slides_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="presentations")
    slides = relationship("Slide", back_populates="presentation", cascade="all, delete-orphan")

class Slide(Base):
    __tablename__ = 'slides'

    id = Column(Integer, primary_key=True, index=True)
    presentation_id = Column(Integer, ForeignKey('presentations.id'))
    slide_index = Column(Integer, nullable=False)
    title = Column(String, nullable=True)
    content = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    presentation = relationship("Presentation", back_populates="slides")
