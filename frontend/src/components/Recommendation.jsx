import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function Recommendation() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    if (anonAadhaar?.status !== "logged-in") {
      toast.info("Please log in to access full content", { toastId: "login-prompt" });
    }
  }, [anonAadhaar?.status]);

  return (
    <div>
      <h2>Recommendation</h2>
      {anonAadhaar?.status === "logged-in" ? (
        <div>
          <p>Here are your personalized recommendations!</p>
          {/* Add your recommendation content here */}
        </div>
      ) : (
        <div>
          <p>Sign in to view your personalized recommendations.</p>
          {/* Add a teaser or limited content here */}
        </div>
      )}
    </div>
  );
}

export default Recommendation;

