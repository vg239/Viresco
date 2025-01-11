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
import Watchlist from '@/components/Watchlist';
import ChapterView from '@/components/ChapterView';

function App() {
  return (
    <AnonAadhaarProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/learning" element={<Learning />} />
              <Route path="/recommendation" element={<Recommendation />} />
              <Route path="/news" element={<News />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
          </main>
        </div>
        <ToastContainer />
      </Router>
    </AnonAadhaarProvider>
  );
}

export default App; 