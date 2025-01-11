import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAnonAadhaar, LogInWithAnonAadhaar } from "@anon-aadhaar/react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [anonAadhaar] = useAnonAadhaar();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/learning', label: 'Learning' },
    { path: '/recommendation', label: 'Recommendation' },
    { path: '/news', label: 'News' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/watchlist', label: 'Watchlist' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-blue-600",
                    "relative py-2",
                    "after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-blue-600 after:transition-transform hover:after:scale-x-100",
                    location.pathname === item.path 
                      ? "text-blue-600 after:scale-x-100" 
                      : "text-gray-600"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center">
              <LogInWithAnonAadhaar 
                nullifierSeed={1234} 
                fieldsToReveal={["revealAgeAbove18"]} 
              />
            </div>
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