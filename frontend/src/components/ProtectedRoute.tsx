import { useAnonAadhaar } from "@anon-aadhaar/react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [anonAadhaar] = useAnonAadhaar();

  if (anonAadhaar?.status !== "logged-in") {
    return <Navigate to="/news" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 