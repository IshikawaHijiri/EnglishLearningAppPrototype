export type Article = {
    title: string;
    url: string;
    source: string;
    published_at: string | null;
    content: string;
  };
  
  export type Quiz = {
    question: string;
    choices: string[];
    answer_index: number;
    explanation: string;
  };
  
  export type Lesson = {
    id: number;
    article: Article;
    summary_en: string;
    translation_ja: string;
    quizzes: Quiz[];
  };