import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { recommendationAPI } from '@/lib/api';

interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  score: number;
  risk: 'low' | 'medium' | 'high';
}

const DUMMY_WALLET = "0x1234567890abcdef";

function Recommendation() {
  const [anonAadhaar] = useAnonAadhaar();
  const [recommendations, setRecommendations] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      console.log("Fetching recommendations for wallet:", DUMMY_WALLET);
      const response = await recommendationAPI.getRecommendations(DUMMY_WALLET);
      console.log("Recommendations response:", response);
      setRecommendations(response.recommendations);
    } catch (error: any) {
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.detail || 'Error fetching recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (anonAadhaar?.status === "logged-out") {
      fetchRecommendations();
    }
  }, [anonAadhaar?.status]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Recommendations</h2>
      {anonAadhaar?.status === "logged-out" ? (
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center">Loading recommendations...</div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="prose max-w-none">
                {recommendations ? (
                  <div dangerouslySetInnerHTML={{ __html: recommendations }} />
                ) : (
                  <p>No recommendations available at the moment.</p>
                )}
              </div>
              <button
                onClick={fetchRecommendations}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Refresh Recommendations
              </button>
            </div>
          )}
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