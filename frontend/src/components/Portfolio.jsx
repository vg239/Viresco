import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function Portfolio() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    if (anonAadhaar?.status !== "logged-in") {
      toast.info("Please log in to access full content", { toastId: "login-prompt" });
    }
  }, [anonAadhaar?.status]);

  return (
    <div>
      <h2>Portfolio</h2>
      {anonAadhaar?.status === "logged-in" ? (
        <div>
          <p>Welcome to your portfolio!</p>
          {/* Add your portfolio content here */}
        </div>
      ) : (
        <div>
          <p>Sign in to view and manage your portfolio.</p>
          {/* Add a teaser or limited content here */}
        </div>
      )}
    </div>
  );
}

export default Portfolio;

