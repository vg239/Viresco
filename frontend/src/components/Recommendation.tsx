import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { recommendationAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { TrendingUp, Leaf, LineChart, PieChart, BarChart3, ArrowRight, RefreshCw } from 'lucide-react';
import { useLoading } from '@/App';

const DUMMY_WALLET = "0x1234567890abcdef";

interface RecommendationCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  recommendations: string[];
  metrics?: {
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
  }[];
}

function Recommendation() {
  const [anonAadhaar] = useAnonAadhaar();
  const [recommendations, setRecommendations] = useState<RecommendationCategory[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { setIsLoading } = useLoading();

  const fetchRecommendations = async () => {
    try {
      setIsRefreshing(true);
      setIsLoading(true);
      console.log("Fetching recommendations for wallet:", DUMMY_WALLET);
      const response = await recommendationAPI.getRecommendations(DUMMY_WALLET);
      console.log("Recommendations response:", response);
      
      // Transform API response into categories (adjust based on your actual API response)
      const categories: RecommendationCategory[] = [
        {
          title: "Portfolio Optimization",
          description: "Suggestions to optimize your investment portfolio",
          icon: <PieChart className="w-6 h-6 text-purple-500" />,
          recommendations: [
            "Consider increasing exposure to renewable energy sector",
            "Rebalance portfolio to maintain target allocation",
            "Review and adjust risk tolerance"
          ],
          metrics: [
            {
              label: "Current Risk Score",
              value: "7.5",
              change: "+0.5",
              isPositive: true
            },
            {
              label: "Diversification",
              value: "85%",
              change: "+5%",
              isPositive: true
            }
          ]
        },
        {
          title: "ESG Opportunities",
          description: "Sustainable and responsible investment opportunities",
          icon: <Leaf className="w-6 h-6 text-green-500" />,
          recommendations: [
            "Explore green bonds in emerging markets",
            "Consider ESG-focused ETFs",
            "Monitor carbon credit investments"
          ],
          metrics: [
            {
              label: "ESG Score",
              value: "82",
              change: "+12",
              isPositive: true
            }
          ]
        },
        {
          title: "Market Trends",
          description: "Current market trends and potential opportunities",
          icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
          recommendations: [
            "Monitor clean energy sector momentum",
            "Watch for opportunities in carbon markets",
            "Track sustainable infrastructure projects"
          ]
        },
        {
          title: "Performance Analysis",
          description: "Analysis of your portfolio's performance",
          icon: <BarChart3 className="w-6 h-6 text-orange-500" />,
          recommendations: [
            "Review underperforming assets",
            "Analyze sector allocation",
            "Monitor risk metrics"
          ],
          metrics: [
            {
              label: "Return Rate",
              value: "12.3%",
              change: "+2.1%",
              isPositive: true
            }
          ]
        }
      ];
      
      setRecommendations(categories);
      toast.success('Recommendations updated successfully');
    } catch (error: any) {
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.detail || 'Error fetching recommendations');
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (anonAadhaar?.status === "logged-out") {
      fetchRecommendations();
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

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-black">Smart Recommendations</h2>
            <p className="text-black/60 mt-2">Personalized insights to optimize your investment strategy</p>
          </div>
          <Button 
            onClick={fetchRecommendations}
            disabled={isRefreshing}
            className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-6 flex items-center gap-2 min-w-[140px] justify-center h-11 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-70 group"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-700 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            {isRefreshing ? 'Updating...' : 'Refresh'}
          </Button>
        </div>

        {anonAadhaar?.status === "logged-out" ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {recommendations.length > 0 ? (
              recommendations.map((category, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {category.icon}
                    <div>
                      <h3 className="text-2xl font-semibold text-black group-hover:text-green-600 transition-colors duration-200">{category.title}</h3>
                      <p className="text-black/60 text-sm">{category.description}</p>
                    </div>
                  </div>

                  {category.metrics && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {category.metrics.map((metric, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-black/60">{metric.label}</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-black">{metric.value}</span>
                            <span className={`text-sm ${metric.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                              {metric.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <ul className="space-y-3">
                    {category.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ArrowRight className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-black/80">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={item}
                className="col-span-full text-center py-12 bg-white rounded-2xl shadow-sm border"
              >
                <p className="text-xl text-black/60">
                  No recommendations available at the moment.
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
              Sign in to access personalized investment recommendations.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Recommendation;