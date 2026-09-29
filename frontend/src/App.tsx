import { BrowserRouter, Route, Routes } from "react-router-dom";

import LessonListPage from "./pages/LessonListPage";
import LessonDetailPage from "./pages/LessonDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LessonListPage />} />
        <Route path="/lessons" element={<LessonListPage />} />
        <Route path="/lessons/:id" element={<LessonDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;