import { useEffect, useState } from 'react';
import { portfolioAPI } from '../lib/api';
import { toast } from 'react-toastify';

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

function PortfolioView() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any[]>([]);
  const [updatedStockPrices, setUpdatedStockPrices] = useState<any>(null);

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
      const data = await portfolioAPI.getUpdatedStocks(DUMMY_WALLET);
      console.log(data);
      setUpdatedStockPrices(data);
      toast.success('Stock prices updated successfully');
    } catch (error) {
      toast.error('Error updating stock prices');
      console.error('Error updating stock prices:', error);
    }
  };

  const renderSectionCard = (title: string, count: number) => (
    <div
      className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => {
        if (title === "Stocks") {
          handleStockUpdate();
        }
        setSelectedSection(title);
      }}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{count} items</p>
    </div>
  );

  const renderSectionDetails = () => {
    if (!selectedSection || !portfolio) return null;

    const sectionData = portfolio[selectedSection as keyof PortfolioData];
    if (!Array.isArray(sectionData)) return null;

    const isEditing = editingSection === selectedSection;
    const showUpdatedPrices = selectedSection === "Stocks" && updatedStockPrices;

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{selectedSection}</h2>
          <div className="space-x-2">
            {selectedSection === "Stocks" && !isEditing && (
              <button
                onClick={handleStockUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update Prices
              </button>
            )}
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEdit(selectedSection)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit {selectedSection}
              </button>
            )}
            <button
              onClick={() => setSelectedSection(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {(isEditing ? editData : sectionData).map((item: any, index: number) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <span className="font-medium">{key}: </span>
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
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    <span>{value}</span>
                  )}
                </div>
              ))}
              {showUpdatedPrices && (
                <div className="mt-2 p-2 bg-green-50 rounded">
                  <p className="text-green-700">
                    Current Price: ${updatedStockPrices[index]?.current_price || 'N/A'}
                  </p>
                  <p className={${updatedStockPrices[index]?.price_change >= 0 ? 'text-green-600' : 'text-red-600'}}>
                    Change: {updatedStockPrices[index]?.price_change}%
                  </p>
                </div>
              )}
              {isEditing && (
                <button
                  onClick={() => {
                    const newData = editData.filter((_, i) => i !== index);
                    setEditData(newData);
                  }}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() => {
                const emptyItem = Object.fromEntries(
                  Object.keys(sectionData[0]).map(key => [key, typeof sectionData[0][key] === 'number' ? 0 : ''])
                );
                setEditData([...editData, emptyItem]);
              }}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add New Item
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!portfolio) {
    return <div className="text-center py-8">No portfolio found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Portfolio</h1>
      
      {!selectedSection ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderSectionCard("Stocks", portfolio.Stocks.length)}
          {renderSectionCard("Mutual_funds", portfolio.Mutual_funds.length)}
          {renderSectionCard("Fixed_deposits", portfolio.Fixed_deposits.length)}
          {renderSectionCard("Crypto", portfolio.Crypto.length)}
          {renderSectionCard("Recent_transactions", portfolio.Recent_transactions.length)}
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Investment Profile</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Risk Tolerance:</span> {portfolio.Investment_profile.risk_tolerance}</p>
              <p><span className="font-medium">Goal:</span> {portfolio.Investment_profile.investment_goal}</p>
              <p><span className="font-medium">Time Horizon:</span> {portfolio.Investment_profile.time_horizon}</p>
            </div>
          </div>
        </div>
      ) : (
        renderSectionDetails()
      )}
    </div>
  );
}

export default PortfolioView;