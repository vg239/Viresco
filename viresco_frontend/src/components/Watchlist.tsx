import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect } from 'react';

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  sustainabilityRating: number;
}

function Watchlist() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    if (anonAadhaar?.status !== "logged-in") {
      toast.info("Please log in to access watchlist", { toastId: "login-prompt" });
    }
  }, [anonAadhaar?.status]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Watchlist</h2>
      {anonAadhaar?.status === "logged-in" ? (
        <div className="grid gap-6">
          <p className="text-xl text-gray-600">Track your favorite sustainable investments</p>
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Add your watchlist content here */}
            <p className="text-gray-600">Your watchlist items will appear here</p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl text-gray-600">
            Sign in to create and manage your watchlist
          </p>
        </div>
      )}
    </div>
  );
}

export default Watchlist; 