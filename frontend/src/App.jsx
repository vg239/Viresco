import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnonAadhaarProvider } from '@anon-aadhaar/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Learning from './components/Learning';
import Recommendation from './components/Recommendation';
import News from './components/News';
import Portfolio from './components/Portfolio';
import './App.css';

function App() {
  return (
    <AnonAadhaarProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/news" element={<News />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Router>
    </AnonAadhaarProvider>
  );
}

export default App;

