import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function News() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    if (anonAadhaar?.status !== "logged-in") {
      toast.info("Please log in to access full content", { toastId: "login-prompt" });
    }
  }, [anonAadhaar?.status]);

  return (
    <div>
      <h2>News</h2>
      {anonAadhaar?.status === "logged-in" ? (
        <div>
          <p>Stay updated with the latest news!</p>
          {/* Add your news content here */}
        </div>
      ) : (
        <div>
          <p>Sign in to access full news articles and updates.</p>
          {/* Add a teaser or limited content here */}
        </div>
      )}
    </div>
  );
}

export default News;

