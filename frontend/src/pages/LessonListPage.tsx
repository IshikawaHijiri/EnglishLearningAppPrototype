import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchLessons } from "../api";
import type { Lesson } from "../types";

import "./LessonListPage.css";

const SUMMARY_LENGTH = 140;

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function LessonListPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLessons()
      .then(setLessons)
      .catch(() => setError("Failed to load lessons"));
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="lesson-list-page">
      <h1>English News Lessons</h1>

      <div className="lesson-list">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/lessons/${lesson.id}`}
            className="lesson-card"
          >
            <article>
              <h2>{lesson.article.title}</h2>

              <div className="lesson-meta">
                <span>{lesson.article.source}</span>

                {lesson.article.published_at && (
                  <>
                    <span>·</span>
                    <time dateTime={lesson.article.published_at}>
                      {formatDate(lesson.article.published_at)}
                    </time>
                  </>
                )}
              </div>

              <p>{truncate(lesson.summary_en, SUMMARY_LENGTH)}</p>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}