import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

function News() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    if (anonAadhaar?.status !== "logged-out") {
      toast.info("Please log in to access full content", { toastId: "login-prompt" });
    }
  }, [anonAadhaar?.status]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">News</h2>
      {anonAadhaar?.status === "logged-out" ? (
        <div className="grid gap-6">
          <p className="text-xl text-gray-300">Stay updated with the latest news!
          <Button>Click me</Button>
          </p>
          {/* Add your news content here */}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl text-gray-300">
            Sign in to access full news articles and updates.
          </p>
        </div>
      )}
    </div>
  );
}

export default News; 