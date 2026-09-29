import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

from models import Article, Lesson, GeneratedLesson

model= "gpt-5.6"

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY is not set")

client = OpenAI(api_key=api_key)


def fetch_article(topic: str) -> Article:
    response = client.responses.parse(
        model=model,
        tools=[
            {
                "type": "web_search"
            }
        ],
        input=f"""
                    Find one recent English-language news article about {topic}.

                    Choose an article suitable for an English learner:
                    - general-interest rather than extremely niche
                    - enough factual content to make comprehension questions
                    - avoid opinion pieces
                    - prefer a reputable source

                    Return:
                    - title
                    - article URL
                    - source name
                    - publication date if available
                    - a concise reconstruction of the factual article content sufficient
                    for creating an English-learning lesson

                    Do not invent facts that are not supported by the sources you found.
                """,
        text_format=Article,
    )

    return response.output_parsed


def generate_lesson(article: Article) -> Lesson:
    response = client.responses.parse(
        model="gpt-5.6",
        input=f"""
                    Create an English-learning lesson from the following news article.

                    Title:
                    {article.title}

                    Source:
                    {article.source}

                    Article content:
                    {article.content}

                    Requirements:
                    - summary_en: concise English summary
                    - translation_ja: natural Japanese translation of the important content
                    - quizzes: exactly 3 multiple-choice comprehension questions
                    - each quiz must have exactly 4 choices
                    - answer_index must be 0, 1, 2, or 3
                    - explanation should briefly explain why the answer is correct
                    - questions must be answerable from the article
                    - do not add facts not present in the article
                """,
        text_format=GeneratedLesson,
    )

    generated = response.output_parsed

    return Lesson(
        article=article,
        **generated.model_dump(),
    )