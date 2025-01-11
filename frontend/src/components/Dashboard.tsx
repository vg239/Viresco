import { useAnonAadhaar } from "@anon-aadhaar/react";
import { useEffect } from 'react';

function Dashboard() {
  const [anonAadhaar] = useAnonAadhaar();

  // useEffect(() => {
  //   if (anonAadhaar?.status !== "logged-in") {
  //     // toast.info("Please log in to access full features", { toastId: "login-prompt" });
  //   }
  // }, [anonAadhaar?.status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-300% animate-gradient">
        Welcome to Virseeco
      </h1>
      {anonAadhaar?.status === "logged-in" ? (
        <div className="w-full space-y-6">
          <p className="text-xl text-gray-600">
            Your gateway to sustainable financial growth and eco-conscious investing
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Portfolio Overview</h3>
              <p className="text-gray-600">Track your sustainable investments and impact metrics</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Market Insights</h3>
              <p className="text-gray-600">Stay updated with sustainable market trends</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-6">
          <p className="text-xl text-gray-600">
            Sign in to continue and access full dashboard features
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard; 