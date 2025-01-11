import { Link } from 'react-router-dom';
import { useAnonAadhaar } from "@anon-aadhaar/react";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink = ({ to, children }: NavLinkProps) => (
  <li>
    <Link 
      to={to} 
      className="text-blue-400 hover:text-blue-300 transition-colors px-4 py-2"
    >
      {children}
    </Link>
  </li>
);

function Navbar() {
  const [anonAadhaar] = useAnonAadhaar();

  const isAuthenticated = anonAadhaar?.status === "logged-in";

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center space-x-4 h-16">
          <NavLink to="/">Home</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/learning">Learning</NavLink>
              <NavLink to="/recommendation">Recommendation</NavLink>
              <NavLink to="/news">News</NavLink>
              <NavLink to="/portfolio">Portfolio</NavLink>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar; 