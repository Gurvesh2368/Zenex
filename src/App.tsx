import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ConsentBanner } from './components/ConsentBanner';
import { Home } from './pages/Home';
import { WizardPage } from './pages/WizardPage';
import { ResultsPage } from './pages/ResultsPage';
import { SchemePage } from './pages/SchemePage';
import { ShortlistPage } from './pages/ShortlistPage';
import { LoginPage } from './pages/LoginPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AboutPage } from './pages/AboutPage';
import { useAuthStore } from './store/auth';
import { fetchCatalogue } from './data/catalogue';

export const App: React.FC = () => {
  const { initAuth } = useAuthStore();
  const [catalogueInfo, setCatalogueInfo] = useState<{
    lastVerified: string;
    source: 'supabase' | 'fallback';
  }>({
    lastVerified: '2026-09-15',
    source: 'fallback',
  });

  useEffect(() => {
    initAuth();
    fetchCatalogue().then((res) => {
      setCatalogueInfo({
        lastVerified: res.lastVerified,
        source: res.source,
      });
    });
  }, [initAuth]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Header />
        <ConsentBanner />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/find" element={<WizardPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/scheme/:slug" element={<SchemePage />} />
            <Route path="/shortlist" element={<ShortlistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        <Footer
          lastVerified={catalogueInfo.lastVerified}
          source={catalogueInfo.source}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
