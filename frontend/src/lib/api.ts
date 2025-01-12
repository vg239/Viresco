import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const learnAPI = {
  generateCourse: async (query: string) => {
    const response = await api.post('/api/learn', { query });
    return response.data;
  },
};

export const portfolioAPI = {
  createPortfolio: async (walletAddress: string, portfolioData: any) => {
    const response = await api.post('/news/portfolio', {
      wallet_address: walletAddress,
      portfolio_data: portfolioData
    });
    return response.data;
  },
  
  getPortfolio: async (walletAddress: string) => {
    const response = await api.get(`/news/portfolio/${walletAddress}`);
    return response.data;
  },
  
  updatePortfolioSection: async (walletAddress: string, section: string, sectionData: any[]) => {
    const response = await api.put('/news/portfolio/section', {
      wallet_address: walletAddress,
      section: section,
      section_data: sectionData
    });
    return response.data;
  },
  
  getUpdatedStocks: async (walletAddress: string) => {
    console.log("Fetching updated stock prices for wallet:", walletAddress);
    const response = await api.get(`/news/portfolio/${walletAddress}/stocks`);
    return response.data;
  }
};

export const newsAPI = {
  getNews: async (walletAddress: string) => {
    console.log("Sending request with wallet:", walletAddress);
    const response = await api.post('/news/news', {
      wallet_address: walletAddress
    });
    return response.data;
  }
};

export const recommendationAPI = {
  getRecommendations: async (walletAddress: string) => {
    console.log("Sending recommendation request with wallet:", walletAddress);
    const response = await api.post('/news/recommendations', {
      wallet_address: walletAddress
    });
    return response.data;
  }
};

export const callAPI = {
  startCall: async () => {
    try {
      console.log("Starting call...");
      const response = await axios.get('http://localhost:5000/start-call', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log("Call response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }
};

export default api;