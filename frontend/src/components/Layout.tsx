import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAnonAadhaar, LogInWithAnonAadhaar } from "@anon-aadhaar/react";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [anonAadhaar] = useAnonAadhaar();

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 w-full bg-[#1C1C1C] border-b border-gray-800 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <nav className="flex items-center space-x-8">
              <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                Dashboard
              </Link>
              <Link to="/learning" className="text-blue-400 hover:text-blue-300 transition-colors">
                Learning
              </Link>
              <Link to="/recommendation" className="text-blue-400 hover:text-blue-300 transition-colors">
                Recommendation
              </Link>
              <Link to="/news" className="text-blue-400 hover:text-blue-300 transition-colors">
                News
              </Link>
              <Link to="/portfolio" className="text-blue-400 hover:text-blue-300 transition-colors">
                Portfolio
              </Link>
              <div className="login-button">
                <LogInWithAnonAadhaar nullifierSeed={1234} fieldsToReveal={["revealAgeAbove18"]} />
              </div>
            </nav>
          </div>
        </div>
      </header>
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}

export default Layout; 