import { Link } from 'react-router-dom';
import { useAnonAadhaar } from "@anon-aadhaar/react";

function Navbar() {
  const [anonAadhaar] = useAnonAadhaar();

  const isAuthenticated = anonAadhaar?.status === "logged-in";

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {isAuthenticated && (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/learning">Learning</Link></li>
            <li><Link to="/recommendation">Recommendation</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

