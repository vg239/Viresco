import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function Learning() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    if (anonAadhaar?.status !== "logged-in") {
      toast.info("Please log in to access full content", { toastId: "login-prompt" });
    }
  }, [anonAadhaar?.status]);

  return (
    <div>
      <h2>Learning</h2>
      {anonAadhaar?.status === "logged-in" ? (
        <div>
          <p>Welcome to the learning section!</p>
          {/* Add your learning content here */}
        </div>
      ) : (
        <div>
          <p>Sign in to continue and access full learning materials.</p>
          {/* Add a teaser or limited content here */}
        </div>
      )}
    </div>
  );
}

export default Learning;

