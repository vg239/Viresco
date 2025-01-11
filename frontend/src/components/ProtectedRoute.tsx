import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [anonAadhaar] = useAnonAadhaar();

  if (anonAadhaar?.status !== "logged-in") {
    toast.error("Please log in to access this page.");
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute; 