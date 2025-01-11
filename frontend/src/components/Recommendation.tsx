import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect } from 'react';

interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  score: number;
  risk: 'low' | 'medium' | 'high';
}

function Recommendation() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    if (anonAadhaar?.status !== "logged-in") {
      toast.info("Please log in to access full content", { toastId: "login-prompt" });
    }
  }, [anonAadhaar?.status]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Recommendation</h2>
      {anonAadhaar?.status === "logged-in" ? (
        <div className="grid gap-6">
          <p className="text-xl text-gray-300">Here are your personalized recommendations!</p>
          {/* Add your recommendation content here */}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl text-gray-300">
            Sign in to view your personalized recommendations.
          </p>
        </div>
      )}
    </div>
  );
}

export default Recommendation; 