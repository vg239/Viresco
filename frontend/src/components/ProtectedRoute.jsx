import { Navigate } from 'react-router-dom';
import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';

function ProtectedRoute({ children }) {
  const [anonAadhaar] = useAnonAadhaar();

  if (anonAadhaar?.status !== "logged-in") {
    toast.error("Please log in to access this page.");
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;

