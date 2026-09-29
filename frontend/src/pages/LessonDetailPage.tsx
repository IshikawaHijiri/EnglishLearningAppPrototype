import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { fetchLesson } from "../api";
import type { Lesson } from "../types";

import "./LessonDetailPage.css";

export default function LessonDetailPage() {
  const { id } = useParams();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!id) return;

    fetchLesson(Number(id))
      .then(setLesson)
      .catch(() => setError("Failed to load lesson"));
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!lesson) {
    return <p>Loading...</p>;
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  return (
    <main className="lesson-detail-page">
      <Link to="/lessons" className="back-link">
        ← Lessons
      </Link>

      <header className="article-header">
        <h1>{lesson.article.title}</h1>

        <div className="article-meta">
          <span>{lesson.article.source}</span>

          {lesson.article.published_at && (
            <>
              <span>·</span>
              <time dateTime={lesson.article.published_at}>
                {formatDate(lesson.article.published_at)}
              </time>
            </>
          )}

          <span>·</span>

          <a
            href={lesson.article.url}
            target="_blank"
            rel="noreferrer"
          >
            Original article ↗
          </a>
        </div>
      </header>

      <section className="content-section summary-section">
        <p className="section-label">SUMMARY</p>
        <p className="summary-text">{lesson.summary_en}</p>
      </section>

      <details className="translation-section">
        <summary>日本語訳を表示</summary>
        <div className="translation-content">
          <p>{lesson.translation_ja}</p>
        </div>
      </details>

      <section className="quiz-section">
        <div className="quiz-header">
          <p className="section-label">QUIZ</p>
          <h2>Comprehension Check</h2>
        </div>

        <div className="quiz-list">
          {lesson.quizzes.map((quiz, quizIndex) => {
            const selected = answers[quizIndex];
            const answered = selected !== undefined;
            const isCorrect = selected === quiz.answer_index;

            return (
              <article className="quiz-card" key={quizIndex}>
                <div className="quiz-number">
                  Question {quizIndex + 1}
                </div>

                <h3>{quiz.question}</h3>

                <div className="choice-list">
                  {quiz.choices.map((choice, choiceIndex) => {
                    const isSelected = selected === choiceIndex;

                    return (
                      <label
                        key={choiceIndex}
                        className={`choice ${
                          isSelected ? "selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${quizIndex}`}
                          checked={isSelected}
                          onChange={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [quizIndex]: choiceIndex,
                            }))
                          }
                        />

                        <span>{choice}</span>
                      </label>
                    );
                  })}
                </div>

                {answered && (
                  <div
                    className={`quiz-result ${
                      isCorrect ? "correct" : "incorrect"
                    }`}
                  >
                    <strong>
                      {isCorrect ? "Correct" : "Incorrect"}
                    </strong>

                    <p>{quiz.explanation}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}