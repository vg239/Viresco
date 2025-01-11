import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function Dashboard() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    if (anonAadhaar?.status !== "logged-in") {
      // toast.info("Please log in to access full features", { toastId: "login-prompt" });
    }
  }, [anonAadhaar?.status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent bg-300% animate-gradient">
        Welcome to Virseeco
      </h1>
      {anonAadhaar?.status === "logged-in" ? (
        <div className="w-full space-y-6">
          <p className="text-xl text-gray-300">
            Your gateway to sustainable financial growth and eco-conscious investing
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-800 -z-10">
              <h3 className="text-xl font-semibold mb-2 text-blue-400">Portfolio Overview</h3>
              <p className="text-gray-400">Track your sustainable investments and impact metrics</p>
            </div>
            <div className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-800 -z-10">
              <h3 className="text-xl font-semibold mb-2 text-blue-400">Market Insights</h3>
              <p className="text-gray-400">Stay updated with sustainable market trends</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-6">
          <p className="text-xl text-gray-300">
            Sign in to continue and access full dashboard features
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard; 