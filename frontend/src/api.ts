import type { Lesson } from "./types";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function fetchLessons(): Promise<Lesson[]> {
  const response = await fetch(`${API_BASE_URL}/lessons`);

  if (!response.ok) {
    throw new Error("Failed to fetch lessons");
  }

  return response.json();
}

export async function fetchLesson(id: number): Promise<Lesson> {
  const response = await fetch(`${API_BASE_URL}/lessons/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch lesson");
  }

  return response.json();
}