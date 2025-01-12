import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import Learning from '@/components/Learning';
import Recommendation from '@/components/Recommendation';
import News from '@/components/News';
import Portfolio from '@/components/Portfolio';
import PortfolioView from '@/components/PortfolioView';
import Watchlist from '@/components/Watchlist';
import ChapterView from '@/components/ChapterView';
import LoadingHamster from '@/components/LoadingHamster';
import { createContext, useContext, useState } from 'react';
import { WalletProvider } from '@/context/WalletContext';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <WalletProvider>
        <AnonAadhaarProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Navbar />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/learning" element={<Learning />} />
                  <Route path="/learning/:courseId" element={<Learning />} />
                  <Route path="/learning/:courseId/:chapterId" element={<ChapterView />} />
                  <Route path="/recommendation" element={<Recommendation />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                  <Route path="/portfolio/view" element={<PortfolioView />} />
                  <Route path="/portfolio/create" element={<Portfolio />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                </Routes>
              </main>
              {isLoading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-white p-8 rounded-2xl shadow-xl">
                    <LoadingHamster />
                    <p className="text-center mt-4 text-black/70 text-lg">Loading...</p>
                  </div>
                </div>
              )}
            </div>
            <ToastContainer />
          </Router>
        </AnonAadhaarProvider>
      </WalletProvider>
    </LoadingContext.Provider>
  );
}

export default App; 