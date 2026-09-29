from datetime import datetime

from pydantic import BaseModel, Field, HttpUrl


class Article(BaseModel):
    title: str
    url: str
    source: str
    published_at: datetime | None = None
    content: str


class Quiz(BaseModel):
    question: str
    choices: list[str] = Field(min_length=4, max_length=4)
    answer_index: int = Field(ge=0, le=3)
    explanation: str


class GeneratedLesson(BaseModel):
    summary_en: str
    translation_ja: str
    quizzes: list[Quiz] = Field(min_length=3, max_length=3)


class Lesson(GeneratedLesson):
    article: Article


class LessonResponse(Lesson):
    id: int