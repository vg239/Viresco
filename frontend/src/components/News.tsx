import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { newsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { useLoading } from '@/App';
import { TrendingUp, Globe, DollarSign, Leaf, RefreshCw, Clock, ArrowUpRight, ExternalLink } from 'lucide-react';

const DUMMY_WALLET = "0x1234567890abcdef";

interface NewsSection {
  title: string;
  content: string;
  link?: string;
  category?: string;
}

interface NewsResponse {
  news: string;
}

function News() {
  const [anonAadhaar] = useAnonAadhaar();
  const [newsSections, setNewsSections] = useState<NewsSection[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { setIsLoading } = useLoading();

  const parseNewsContent = (content: string): NewsSection[] => {
    // Remove summary lines
    const cleanContent = content
      .replace(/^Okay,.*?investors:$/m, '')
      .replace(/^Overall Summary:.*$/m, '')
      .replace(/^Implications for Investors:.*$/m, '')
      .replace(/^Here's a structured summary.*$/m, '')
      .replace(/^Summary:.*$/m, '')
      .trim();

    const sections: NewsSection[] = [];
    const lines = cleanContent.split('\n');
    let currentSection: Partial<NewsSection> = {};

    lines.forEach(line => {
      const headlineMatch = line.match(/Headline:\s*(.*)/i);
      const contentMatch = line.match(/Content:\s*(.*)/i);
      const linkMatch = line.match(/Link:\s*(.*)/i);

      if (headlineMatch) {
        // If we have a previous section, save it
        if (currentSection.title) {
          sections.push(currentSection as NewsSection);
        }
        // Start a new section
        currentSection = {
          title: headlineMatch[1].trim(),
          content: '',
          category: determineCategory(headlineMatch[1])
        };
      } else if (contentMatch) {
        currentSection.content = contentMatch[1].trim();
      } else if (linkMatch) {
        currentSection.link = linkMatch[1].trim();
      }
    });

    // Add the last section
    if (currentSection.title) {
      sections.push(currentSection as NewsSection);
    }

    return sections;
  };

  const determineCategory = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('policy') || lowerTitle.includes('rbi')) {
      return 'Policy News';
    } else if (lowerTitle.includes('market') || lowerTitle.includes('stock')) {
      return 'Market Update';
    } else if (lowerTitle.includes('impact') || lowerTitle.includes('effect')) {
      return 'Impact Analysis';
    } else if (lowerTitle.includes('election')) {
      return 'Political News';
    }
    return 'Market Update';
  };

  const fetchNews = async () => {
    try {
      setIsRefreshing(true);
      setIsLoading(true);
      console.log("Fetching news for wallet:", DUMMY_WALLET);
      const response: NewsResponse = await newsAPI.getNews(DUMMY_WALLET);
      console.log("News response:", response);
      
      const sections = parseNewsContent(response.news);
      setNewsSections(sections);
      toast.success('News updated successfully');
    } catch (error: any) {
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.detail || 'Error fetching news');
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (anonAadhaar?.status === "logged-out") {
      fetchNews();
    }
  }, [anonAadhaar?.status]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Policy News':
        return <Globe className="w-5 h-5 text-purple-500" />;
      case 'Market Update':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'Impact Analysis':
        return <DollarSign className="w-5 h-5 text-orange-500" />;
      default:
        return <Leaf className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-black">Latest News</h2>
            <p className="text-black/60 mt-2">Stay updated with the latest market insights and trends</p>
          </div>
          <Button 
            onClick={fetchNews}
            disabled={isRefreshing}
            className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-6 flex items-center gap-2 min-w-[140px] justify-center h-11 rounded-full shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-70 group"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-700 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            {isRefreshing ? 'Updating...' : 'Refresh News'}
          </Button>
        </div>

        {anonAadhaar?.status === "logged-out" ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {newsSections.length > 0 ? (
              newsSections.map((section, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(section.category)}
                      <div>
                        <span className="text-sm font-medium text-black/60">{section.category}</span>
                        <h3 className="text-2xl font-semibold text-black group-hover:text-green-600 transition-colors duration-200">
                          {section.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="prose prose-lg max-w-none mb-6">
                    <p className="text-black/80 leading-relaxed">{section.content}</p>
                  </div>
                  {section.link && (
                    <a 
                      href={section.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-200 group/link"
                    >
                      <span>Read Full Article</span>
                      <ExternalLink className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </a>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={item}
                className="text-center py-12 bg-white rounded-2xl shadow-sm border"
              >
                <p className="text-xl text-black/60">
                  No news available at the moment.
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-white rounded-2xl shadow-sm border"
          >
            <p className="text-xl text-black/60">
              Sign in to access full news articles and updates.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default News;