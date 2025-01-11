import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAnonAadhaar, LogInWithAnonAadhaar } from "@anon-aadhaar/react";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [anonAadhaar] = useAnonAadhaar();

  return (
    <div className="w-full bg-white">
      <header className="fixed top-0 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <nav className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/learning" className="text-gray-700 hover:text-blue-600 transition-colors">
                Learning
              </Link>
              <Link to="/recommendation" className="text-gray-700 hover:text-blue-600 transition-colors">
                Recommendation
              </Link>
              <Link to="/news" className="text-gray-700 hover:text-blue-600 transition-colors">
                News
              </Link>
              <Link to="/portfolio" className="text-gray-700 hover:text-blue-600 transition-colors">
                Portfolio
              </Link>
              <Link to="/watchlist" className="text-gray-700 hover:text-blue-600 transition-colors">
                Watchlist
              </Link>
              <div className="login-button">
                <LogInWithAnonAadhaar nullifierSeed={1234} fieldsToReveal={["revealAgeAbove18"]} />
              </div>
            </nav>
          </div>
        </div>
      </header>
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout; 