import json

from models import Article, Lesson, LessonResponse, Quiz
from db import get_connection
    

def save_lesson(lesson: Lesson) -> int:
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO lessons (
                title,
                url,
                source,
                published_at,
                content,
                summary_en,
                translation_ja,
                quizzes_json
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                lesson.article.title,
                lesson.article.url,
                lesson.article.source,
                lesson.article.published_at,
                lesson.article.content,
                lesson.summary_en,
                lesson.translation_ja,
                json.dumps(
                    [quiz.model_dump() for quiz in lesson.quizzes],
                    ensure_ascii=False,
                ),
            ),
        )

        return cursor.lastrowid


def row_to_lesson(row) -> LessonResponse:
    article = Article(
        title=row["title"],
        url=row["url"],
        source=row["source"],
        published_at=row["published_at"],
        content=row["content"],
    )

    quizzes = [
        Quiz(**quiz)
        for quiz in json.loads(row["quizzes_json"])
    ]

    return LessonResponse(
        id=row["id"],
        article=article,
        summary_en=row["summary_en"],
        translation_ja=row["translation_ja"],
        quizzes=quizzes,
    )


def get_lesson(lesson_id: int) -> LessonResponse | None:
    with get_connection() as conn:
        row = conn.execute(
            """
            SELECT *
            FROM lessons
            WHERE id = ?
            """,
            (lesson_id,),
        ).fetchone()

    if row is None:
        return None

    return row_to_lesson(row)


def list_lessons() -> list[LessonResponse]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT *
            FROM lessons
            ORDER BY created_at DESC
            """
        ).fetchall()

    return [row_to_lesson(row) for row in rows]
