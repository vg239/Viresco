import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect } from 'react';

interface PortfolioItem {
  id: string;
  name: string;
  value: number;
  change: number;
  sustainabilityScore: number;
}

function Portfolio() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    if (anonAadhaar?.status !== "logged-in") {
      toast.info("Please log in to access full content", { toastId: "login-prompt" });
    }
  }, [anonAadhaar?.status]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Portfolio</h2>
      {anonAadhaar?.status === "logged-in" ? (
        <div className="grid gap-6">
          <p className="text-xl text-gray-300">Welcome to your portfolio!</p>
          {/* Add your portfolio content here */}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl text-gray-300">
            Sign in to view and manage your portfolio.
          </p>
        </div>
      )}
    </div>
  );
}

export default Portfolio; 