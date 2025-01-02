import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';

function App() {
    return (
        <Router>
            <Routes>
                {/* / 경로로 HomePage 렌더링 */}
                {/* <Route path="/" element={<MainPage />} /> */}
                {/* 다른 경로에 대한 Route가 필요하면 추가 */}
                {/* <Route path="/boards" element={<BoardPage />} /> */}
                {/* 동적 경로: path 값에 따라 렌더링할 컴포넌트를 설정 */}
                <Route path="/*" element={<MainPage />} />
            </Routes>
        </Router>
    );
}

export default App;
