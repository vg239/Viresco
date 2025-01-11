import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
            <Route 
              path="/learn/:id" 
              element={
                
                  <ChapterView />
                
              } 
            />
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 