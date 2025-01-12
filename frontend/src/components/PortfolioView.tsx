import { useEffect, useState } from 'react';
import { portfolioAPI } from '../lib/api';
import { toast } from 'react-toastify';
import { FaChartLine, FaUniversity, FaBitcoin, FaHistory, FaChartPie } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart, Brush } from 'recharts';
import { CarbonCreditsModal } from './CarbonCreditsModal';

interface PortfolioData {
  name: string;
  age: number;
  Investment_profile: {
    risk_tolerance: string;
    investment_goal: string;
    time_horizon: string;
  };
  Stocks: Array<{
    name: string;
    quantity: number;
    price_bought_at: number;
  }>;
  Mutual_funds: Array<{
    name: string;
    investment_amount: number;
    mf_type: string;
  }>;
  Fixed_deposits: Array<{
    bank_name: string;
    investment_amount: number;
    maturity_value: number;
    tenure_years: number;
    interest_rate: number;
  }>;
  Recent_transactions: Array<{
    date: string;
    action: string;
    asset_type: string;
    quantity: number;
    price: number;
    remarks: string;
  }>;
  Crypto: Array<{
    name: string;
    quantity: number;
    price_bought_at: number;
  }>;
}

const DUMMY_WALLET = "0x1234567890abcdef";

interface StockHistory {
  [date: string]: {
    Open: number;
    Close: number;
    High: number;
    Low: number;
  };
}

interface StockData {
  name: string;
  quantity: number;
  price_bought_at: number;
  current_price?: number;
  history?: StockHistory;
}

const transformHistoryData = (history?: StockHistory) => {
  if (!history) return [];
  
  return Object.entries(history).map(([date, data]) => ({
    date: new Date(date).toLocaleDateString(),
    Open: data.Open,
    Close: data.Close,
    High: data.High,
    Low: data.Low,
  }));
};

const EnhancedStockCharts = ({ history }: { history?: StockHistory }) => {
  const data = transformHistoryData(history);
  
  return (
    <div className="space-y-8">
      {/* Price Trends Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Price Trends</h4>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }}
                labelStyle={{ color: '#374151' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="Close"
                fill="#22c55e"
                stroke="#22c55e"
                fillOpacity={0.2}
              />
              <Line
                type="monotone"
                dataKey="High"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Low"
                stroke="#ef4444"
                dot={false}
                strokeWidth={2}
              />
              <Brush dataKey="date" height={30} stroke="#22c55e" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trading Volume Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Daily Price Range</h4>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }}
                labelStyle={{ color: '#374151' }}
              />
              <Legend />
              <Bar dataKey="Open" fill="#f59e0b" stackId="a" />
              <Bar dataKey="Close" fill="#3b82f6" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Highest Price</p>
          <p className="text-lg font-semibold text-gray-800">
            ₹{Math.max(...data.map(d => d.High)).toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Lowest Price</p>
          <p className="text-lg font-semibold text-gray-800">
            ₹{Math.min(...data.map(d => d.Low)).toLocaleString()}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Average Close</p>
          <p className="text-lg font-semibold text-gray-800">
            ₹{(data.reduce((acc, curr) => acc + curr.Close, 0) / data.length).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Price Range</p>
          <p className="text-lg font-semibold text-gray-800">
            ₹{(Math.max(...data.map(d => d.High)) - Math.min(...data.map(d => d.Low))).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

function PortfolioView() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any[]>([]);
  const [updatedStockPrices, setUpdatedStockPrices] = useState<any>(null);
  const [showCarbonCreditsModal, setShowCarbonCreditsModal] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const data = await portfolioAPI.getPortfolio(DUMMY_WALLET);
      console.log(data);
      setPortfolio(data);
    } catch (error) {
      toast.error('Error fetching portfolio');
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: string) => {
    if (!portfolio) return;
    setEditData(portfolio[section as keyof PortfolioData] as any[]);
    setEditingSection(section);
  };

  const handleSave = async () => {
    if (!editingSection) return;
    
    try {
      await portfolioAPI.updatePortfolioSection(DUMMY_WALLET, editingSection, editData);
      await fetchPortfolio(); // Refresh data
      setEditingSection(null);
      toast.success('Section updated successfully');
    } catch (error) {
      toast.error('Error updating section');
      console.error('Error updating section:', error);
    }
  };

  const handleStockUpdate = async () => {
    try {
      console.log("inside handle stock update")
      const data = await portfolioAPI.getUpdatedStocks(DUMMY_WALLET);
      console.log(data.Stocks);
      setUpdatedStockPrices(data.Stocks);
      toast.success('Stock prices updated successfully');
    } catch (error) {
      toast.error('Error updating stock prices');
      console.error('Error updating stock prices:', error);
    }
  };

  const calculateTotalValue = () => {
    if (!portfolio) return 0;
    
    const stocksValue = portfolio.Stocks.reduce((acc, stock) => 
      acc + (stock.quantity * (updatedStockPrices?.[stock.name]?.current_price || stock.price_bought_at)), 0);
    
    const mfValue = portfolio.Mutual_funds.reduce((acc, mf) => 
      acc + mf.investment_amount, 0);
    
    const fdValue = portfolio.Fixed_deposits.reduce((acc, fd) => 
      acc + fd.investment_amount, 0);
    
    const cryptoValue = portfolio.Crypto.reduce((acc, crypto) => 
      acc + (crypto.quantity * crypto.price_bought_at), 0);
    
    return stocksValue + mfValue + fdValue + cryptoValue;
  };

  const getAssetIcon = (title: string) => {
    switch(title) {
      case "Stocks": return <FaChartLine className="w-6 h-6" />;
      case "Mutual_funds": return <FaChartPie className="w-6 h-6" />;
      case "Fixed_deposits": return <FaUniversity className="w-6 h-6" />;
      case "Crypto": return <FaBitcoin className="w-6 h-6" />;
      case "Recent_transactions": return <FaHistory className="w-6 h-6" />;
      default: return null;
    }
  };

  const renderSectionCard = (title: string, count: number) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100"
      onClick={() => {
        if (title === "Stocks") {
          handleStockUpdate();
        }
        setSelectedSection(title);
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{title.replace('_', ' ')}</h3>
          <p className="text-gray-500">{count} {count === 1 ? 'item' : 'items'}</p>
        </div>
        <div className="text-green-600 bg-green-50 p-3 rounded-2xl">
          {getAssetIcon(title)}
        </div>
      </div>
    </motion.div>
  );

  const renderSectionDetails = () => {
    if (!selectedSection || !portfolio) return null;

    const sectionData = portfolio[selectedSection as keyof PortfolioData];
    if (!Array.isArray(sectionData)) return null;

    const isEditing = editingSection === selectedSection;
    const showUpdatedPrices = selectedSection === "Stocks" && updatedStockPrices;

    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-green-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedSection.replace('_', ' ')}
          </h2>
          <div className="flex flex-wrap gap-3">
            {selectedSection === "Stocks" && !isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStockUpdate}
                className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
              >
                Update Prices
              </motion.button>
            )}
            {isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
                >
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingSection(null)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors shadow-md"
                >
                  Cancel
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(selectedSection)}
                className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
              >
                Edit {selectedSection.replace('_', ' ')}
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSection(null)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
            >
              Back
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(isEditing ? editData : sectionData).map((item: any, index: number) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={index}
              className="bg-green-50 p-6 rounded-3xl shadow-sm border border-green-100"
            >
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label className="text-gray-600 text-sm block mb-1">
                    {key.replace('_', ' ')}
                  </label>
                  {isEditing ? (
                    <input
                      type={typeof value === 'number' ? 'number' : 'text'}
                      value={value}
                      onChange={(e) => {
                        const newData = [...editData];
                        newData[index] = {
                          ...newData[index],
                          [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value
                        };
                        setEditData(newData);
                      }}
                      className="w-full bg-white border border-green-200 rounded-2xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  ) : (
                    <div className="bg-white px-4 py-3 rounded-2xl border border-green-100">
                      <span className="text-gray-800">
                        {typeof value === 'number' ? 
                          (key.includes('price') || key.includes('amount') || key.includes('value') ? 
                            `₹${value.toLocaleString()}` : value.toLocaleString()) 
                          : value}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {showUpdatedPrices && (
                <div className="mt-6 p-4 bg-white rounded-2xl border border-green-100">
                  <p className="text-gray-800 font-medium mb-2">
                    Current Price: ₹{updatedStockPrices[index]?.current_price.toLocaleString() || 'N/A'}
                  </p>
                  <p className={`font-medium ${updatedStockPrices[index]?.price_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Change: {updatedStockPrices[index]?.price_change}%
                  </p>
                </div>
              )}
              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const newData = editData.filter((_, i) => i !== index);
                    setEditData(newData);
                  }}
                  className="mt-4 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors w-full shadow-md"
                >
                  Remove
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
        
        {editingSection && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const emptyItem = Object.fromEntries(
                Object.keys(portfolio[selectedSection as keyof PortfolioData][0]).map(key => [
                  key, 
                  typeof portfolio[selectedSection as keyof PortfolioData][0][key] === 'number' ? 0 : ''
                ])
              );
              setEditData([...editData, emptyItem]);
            }}
            className="mt-8 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors w-full shadow-md"
          >
            Add New Item
          </motion.button>
        )}
      </div>
    );
  };

  const renderStockDetails = (item: any, index: number, isEditing: boolean) => {
    const priceChange = ((updatedStockPrices?.[index]?.current_price - item.price_bought_at)/100).toFixed(2) || 0;
    const currentPrice = updatedStockPrices?.[index]?.current_price;
    const totalValue = item.quantity * (currentPrice || item.price_bought_at);
    const profitLoss = currentPrice ? (currentPrice - item.price_bought_at) * item.quantity : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-3xl shadow-sm border border-green-100 hover:shadow-md transition-all duration-300"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
            <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
          </div>
          {!isEditing && currentPrice && (
            <div className={`px-4 py-2 rounded-full ${priceChange >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange)}%
            </div>
          )}
        </div>

        {isEditing ? (
          Object.entries(item).map(([key, value]) => (
            <div key={key} className="mb-4">
              <label className="text-gray-600 text-sm block mb-1">
                {key.replace('_', ' ')}
              </label>
              <input
                type={typeof value === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => {
                  const newData = [...editData];
                  newData[index] = {
                    ...newData[index],
                    [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value
                  };
                  setEditData(newData);
                }}
                className="w-full bg-white border border-green-200 rounded-2xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
          ))
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-2xl">
                <p className="text-sm text-gray-600 mb-1">Purchase Price</p>
                <p className="text-lg font-semibold text-gray-800">₹{item.price_bought_at.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-2xl">
                <p className="text-sm text-gray-600 mb-1">Current Price</p>
                <p className="text-lg font-semibold text-gray-800">
                  ₹{currentPrice?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-2xl">
                <p className="text-sm text-gray-600 mb-1">Total Value</p>
                <p className="text-lg font-semibold text-gray-800">₹{totalValue.toLocaleString()}</p>
              </div>
              <div className={`p-4 rounded-2xl ${profitLoss >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm text-gray-600 mb-1">Profit/Loss</p>
                <p className={`text-lg font-semibold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profitLoss >= 0 ? '+' : '-'}₹{Math.abs(profitLoss).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const newData = editData.filter((_, i) => i !== index);
              setEditData(newData);
            }}
            className="mt-4 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors w-full shadow-md"
          >
            Remove
          </motion.button>
        )}

        {!isEditing && updatedStockPrices?.[index]?.history && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Price Analysis</h4>
            <EnhancedStockCharts history={updatedStockPrices?.[index]?.history} />
          </div>
        )}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Portfolio</h1>
        {!selectedSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-100 via-green-200 to-green-100 rounded-3xl p-8 mt-4 shadow-lg border border-green-200"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-gray-600 mb-2">Total Portfolio Value</p>
                <p className="text-4xl font-bold text-gray-800">₹{calculateTotalValue().toLocaleString()}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCarbonCreditsModal(true)}
                  className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
                >
                  Redeem Carbon Credits
                </motion.button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">Assets</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {portfolio.Stocks.length + portfolio.Mutual_funds.length + portfolio.Fixed_deposits.length + portfolio.Crypto.length}
                  </p>
                </div>
                <div className="bg-white bg-opacity-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-1">Transactions</p>
                  <p className="text-xl font-semibold text-gray-800">{portfolio.Recent_transactions.length}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {!selectedSection ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {renderSectionCard("Stocks", portfolio.Stocks.length)}
          {renderSectionCard("Mutual_funds", portfolio.Mutual_funds.length)}
          {renderSectionCard("Fixed_deposits", portfolio.Fixed_deposits.length)}
          {renderSectionCard("Crypto", portfolio.Crypto.length)}
          {renderSectionCard("Recent_transactions", portfolio.Recent_transactions.length)}
          
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-green-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Investment Profile</h3>
            <div className="space-y-4">
              {Object.entries(portfolio.Investment_profile).map(([key, value]) => (
                <div key={key} className="bg-green-50 p-4 rounded-2xl">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-800">{key.replace('_', ' ')}:</span>{' '}
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        selectedSection === 'Stocks' ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-green-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedSection.replace('_', ' ')}
              </h2>
              <div className="flex flex-wrap gap-3">
                {selectedSection === "Stocks" && !editingSection && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStockUpdate}
                    className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
                  >
                    Update Prices
                  </motion.button>
                )}
                {editingSection ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
                    >
                      Save Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingSection(null)}
                      className="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors shadow-md"
                    >
                      Cancel
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(selectedSection)}
                    className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
                  >
                    Edit {selectedSection.replace('_', ' ')}
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSection(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Back
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(editingSection ? editData : portfolio[selectedSection as keyof PortfolioData]).map((item: any, index: number) => 
                renderStockDetails(item, index, editingSection)
              )}
            </div>
            
            {editingSection && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const emptyItem = Object.fromEntries(
                    Object.keys(portfolio[selectedSection as keyof PortfolioData][0]).map(key => [
                      key, 
                      typeof portfolio[selectedSection as keyof PortfolioData][0][key] === 'number' ? 0 : ''
                    ])
                  );
                  setEditData([...editData, emptyItem]);
                }}
                className="mt-8 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors w-full shadow-md"
              >
                Add New Item
              </motion.button>
            )}
          </div>
        ) : (
          renderSectionDetails()
        )
      )}

      <CarbonCreditsModal 
        isOpen={showCarbonCreditsModal}
        onClose={() => setShowCarbonCreditsModal(false)}
        portfolioData={portfolio}
      />
    </div>
  );
}

export default PortfolioView;