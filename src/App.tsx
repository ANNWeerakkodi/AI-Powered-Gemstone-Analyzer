import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { GemAnalyzerPage } from './pages/GemAnalyzerPage';
import { GemMarketPricesPage } from './pages/GemMarketPricesPage';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<GemAnalyzerPage />} />
          <Route path="/market" element={<GemMarketPricesPage />} />
          <Route path="/market-prices" element={<GemMarketPricesPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}


