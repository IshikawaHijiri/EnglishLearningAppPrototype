from fastapi import APIRouter, HTTPException

from models import LessonResponse
from repository import get_lesson, list_lessons


router = APIRouter(prefix="/lessons", tags=["lessons"])

@router.get("", response_model=list[LessonResponse])
def get_lessons():
    return list_lessons()


@router.get("/{lesson_id}", response_model=LessonResponse)
def get_lesson_by_id(lesson_id: int):
    lesson = get_lesson(lesson_id)

    if lesson is None:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found",
        )

    return lesson