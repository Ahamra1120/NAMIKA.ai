import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { SavingsPage } from './pages/SavingsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/kalkulator" element={<CalculatorPage />} />
            <Route path="/nabung" element={<SavingsPage />} />
            <Route path="/curhat" element={<ChatbotPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
