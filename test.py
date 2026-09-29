from db import init_db
from openai_service import fetch_article, generate_lesson
from repository import save_lesson, get_lesson, list_lessons


def main():
    init_db()

    print("=== fetch_article ===")
    article = fetch_article("technology")
    print(article.model_dump_json(indent=2))

    print("\n=== generate_lesson ===")
    lesson = generate_lesson(article)
    print(lesson.model_dump_json(indent=2))

    print("\n=== save_lesson ===")
    lesson_id = save_lesson(lesson)
    print(f"saved lesson_id: {lesson_id}")

    print("\n=== get_lesson ===")
    saved_lesson = get_lesson(lesson_id)

    if saved_lesson is None:
        raise RuntimeError("saved lesson was not found")

    print(saved_lesson.model_dump_json(indent=2))

    print("\n=== list_lessons ===")
    lessons = list_lessons()

    print(f"count: {len(lessons)}")

    for item in lessons:
        print(f"id={item.id}, title={item.article.title}")


if __name__ == "__main__":
    main()