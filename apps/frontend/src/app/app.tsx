import { Navigate, Route, Routes } from 'react-router-dom';
import { ClassicPage } from './pages/ClassicPage';
import { Home } from './pages/Home';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/classic" element={<ClassicPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
