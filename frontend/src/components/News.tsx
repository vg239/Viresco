import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { newsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

const DUMMY_WALLET = "0x1234567890abcdef";

function News() {
  const [anonAadhaar] = useAnonAadhaar();
  const [news, setNews] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      console.log("Fetching news for wallet:", DUMMY_WALLET);
      const response = await newsAPI.getNews(DUMMY_WALLET);
      console.log("News response:", response);
      setNews(response.news);
    } catch (error: any) {
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.detail || 'Error fetching news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (anonAadhaar?.status === "logged-out") {
      fetchNews();
    }
  }, [anonAadhaar?.status]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">News</h2>
      {anonAadhaar?.status === "logged-out" ? (
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center">Loading news...</div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="prose max-w-none">
                  {news ? (
                    <div dangerouslySetInnerHTML={{ __html: news }} />
                  ) : (
                    <p>No news available at the moment.</p>
                  )}
                </div>
              </div>
              <Button onClick={fetchNews} className="mt-4">
                Refresh News
              </Button>
            </>
          )}
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