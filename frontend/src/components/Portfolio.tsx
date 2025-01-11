import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { portfolioAPI } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface PortfolioFormData {
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

const emptyStock = {
  name: "",
  quantity: 0,
  price_bought_at: 0
};

const emptyMutualFund = {
  name: "",
  investment_amount: 0,
  mf_type: ""
};

const emptyFixedDeposit = {
  bank_name: "",
  investment_amount: 0,
  maturity_value: 0,
  tenure_years: 0,
  interest_rate: 0
};

const emptyTransaction = {
  date: "",
  action: "",
  asset_type: "",
  quantity: 0,
  price: 0,
  remarks: ""
};

const emptyCrypto = {
  name: "",
  quantity: 0,
  price_bought_at: 0
};

function Portfolio() {
  const [anonAadhaar] = useAnonAadhaar();
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [portfolio, setPortfolio] = useState<PortfolioFormData>({
    name: "",
    age: 0,
    Investment_profile: {
      risk_tolerance: "",
      investment_goal: "",
      time_horizon: ""
    },
    Stocks: [emptyStock],
    Mutual_funds: [emptyMutualFund],
    Fixed_deposits: [emptyFixedDeposit],
    Recent_transactions: [emptyTransaction],
    Crypto: [emptyCrypto]
  });

  const navigate = useNavigate();

  const sections = [
    {
      title: "Personal Details",
      component: (
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 w-full p-2 border rounded"
              value={portfolio.name}
              onChange={(e) => setPortfolio(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              className="mt-1 w-full p-2 border rounded"
              value={portfolio.age}
              onChange={(e) => setPortfolio(prev => ({ ...prev, age: parseInt(e.target.value) }))}
            />
          </div>
        </div>
      )
    },
    {
      title: "Investment Profile",
      component: (
        <div className="grid grid-cols-1 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Risk Tolerance</label>
            <select
              className="mt-1 w-full p-2 border rounded"
              value={portfolio.Investment_profile.risk_tolerance}
              onChange={(e) => setPortfolio(prev => ({
                ...prev,
                Investment_profile: { ...prev.Investment_profile, risk_tolerance: e.target.value }
              }))}
            >
              <option value="">Select Risk Tolerance</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Investment Goal</label>
            <input
              type="text"
              className="mt-1 w-full p-2 border rounded"
              value={portfolio.Investment_profile.investment_goal}
              onChange={(e) => setPortfolio(prev => ({
                ...prev,
                Investment_profile: { ...prev.Investment_profile, investment_goal: e.target.value }
              }))}
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Time Horizon</label>
            <input
              type="text"
              className="mt-1 w-full p-2 border rounded"
              value={portfolio.Investment_profile.time_horizon}
              onChange={(e) => setPortfolio(prev => ({
                ...prev,
                Investment_profile: { ...prev.Investment_profile, time_horizon: e.target.value }
              }))}
            />
          </div>
        </div>
      )
    },
    {
      title: "Stocks",
      component: (
        <div className="space-y-4">
          {portfolio.Stocks.map((stock, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Stock Name</label>
                  <input
                    type="text"
                    className="mt-1 w-full p-2 border rounded"
                    value={stock.name}
                    onChange={(e) => {
                      const newStocks = [...portfolio.Stocks];
                      newStocks[index].name = e.target.value;
                      setPortfolio(prev => ({ ...prev, Stocks: newStocks }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    className="mt-1 w-full p-2 border rounded"
                    value={stock.quantity}
                    onChange={(e) => {
                      const newStocks = [...portfolio.Stocks];
                      newStocks[index].quantity = parseInt(e.target.value);
                      setPortfolio(prev => ({ ...prev, Stocks: newStocks }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Price Bought At</label>
                  <input
                    type="number"
                    className="mt-1 w-full p-2 border rounded"
                    value={stock.price_bought_at}
                    onChange={(e) => {
                      const newStocks = [...portfolio.Stocks];
                      newStocks[index].price_bought_at = parseFloat(e.target.value);
                      setPortfolio(prev => ({ ...prev, Stocks: newStocks }));
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  const newStocks = portfolio.Stocks.filter((_, i) => i !== index);
                  setPortfolio(prev => ({ ...prev, Stocks: newStocks }));
                }}
              >
                Remove Stock
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => setPortfolio(prev => ({
              ...prev,
              Stocks: [...prev.Stocks, { ...emptyStock }]
            }))}
          >
            Add New Stock
          </button>
        </div>
      )
    },
    {
      title: "Mutual Funds",
      component: (
        <div className="space-y-4">
          {portfolio.Mutual_funds.map((fund, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Fund Name</label>
                  <input
                    type="text"
                    className="mt-1 w-full p-2 border rounded"
                    value={fund.name}
                    onChange={(e) => {
                      const newFunds = [...portfolio.Mutual_funds];
                      newFunds[index].name = e.target.value;
                      setPortfolio(prev => ({ ...prev, Mutual_funds: newFunds }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Investment Amount</label>
                  <input
                    type="number"
                    className="mt-1 w-full p-2 border rounded"
                    value={fund.investment_amount}
                    onChange={(e) => {
                      const newFunds = [...portfolio.Mutual_funds];
                      newFunds[index].investment_amount = parseFloat(e.target.value);
                      setPortfolio(prev => ({ ...prev, Mutual_funds: newFunds }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Fund Type</label>
                  <select
                    className="mt-1 w-full p-2 border rounded"
                    value={fund.mf_type}
                    onChange={(e) => {
                      const newFunds = [...portfolio.Mutual_funds];
                      newFunds[index].mf_type = e.target.value;
                      setPortfolio(prev => ({ ...prev, Mutual_funds: newFunds }));
                    }}
                  >
                    <option value="">Select Type</option>
                    <option value="equity">Equity</option>
                    <option value="debt">Debt</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  const newFunds = portfolio.Mutual_funds.filter((_, i) => i !== index);
                  setPortfolio(prev => ({ ...prev, Mutual_funds: newFunds }));
                }}
              >
                Remove Fund
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => setPortfolio(prev => ({
              ...prev,
              Mutual_funds: [...prev.Mutual_funds, { ...emptyMutualFund }]
            }))}
          >
            Add New Mutual Fund
          </button>
        </div>
      )
    },
    {
      title: "Fixed Deposits",
      component: (
        <div className="space-y-4">
          {portfolio.Fixed_deposits.map((fd, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    className="mt-1 w-full p-2 border rounded"
                    value={fd.bank_name}
                    onChange={(e) => {
                      const newFDs = [...portfolio.Fixed_deposits];
                      newFDs[index].bank_name = e.target.value;
                      setPortfolio(prev => ({ ...prev, Fixed_deposits: newFDs }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Investment Amount</label>
                  <input
                    type="number"
                    className="mt-1 w-full p-2 border rounded"
                    value={fd.investment_amount}
                    onChange={(e) => {
                      const newFDs = [...portfolio.Fixed_deposits];
                      newFDs[index].investment_amount = parseFloat(e.target.value);
                      setPortfolio(prev => ({ ...prev, Fixed_deposits: newFDs }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Maturity Value</label>
                  <input
                    type="number"
                    className="mt-1 w-full p-2 border rounded"
                    value={fd.maturity_value}
                    onChange={(e) => {
                      const newFDs = [...portfolio.Fixed_deposits];
                      newFDs[index].maturity_value = parseFloat(e.target.value);
                      setPortfolio(prev => ({ ...prev, Fixed_deposits: newFDs }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Tenure (Years)</label>
                  <input
                    type="number"
                    className="mt-1 w-full p-2 border rounded"
                    value={fd.tenure_years}
                    onChange={(e) => {
                      const newFDs = [...portfolio.Fixed_deposits];
                      newFDs[index].tenure_years = parseInt(e.target.value);
                      setPortfolio(prev => ({ ...prev, Fixed_deposits: newFDs }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                  <input
                    type="number"
                    className="mt-1 w-full p-2 border rounded"
                    value={fd.interest_rate}
                    onChange={(e) => {
                      const newFDs = [...portfolio.Fixed_deposits];
                      newFDs[index].interest_rate = parseFloat(e.target.value);
                      setPortfolio(prev => ({ ...prev, Fixed_deposits: newFDs }));
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  const newFDs = portfolio.Fixed_deposits.filter((_, i) => i !== index);
                  setPortfolio(prev => ({ ...prev, Fixed_deposits: newFDs }));
                }}
              >
                Remove Fixed Deposit
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => setPortfolio(prev => ({
              ...prev,
              Fixed_deposits: [...prev.Fixed_deposits, { ...emptyFixedDeposit }]
            }))}
          >
            Add New Fixed Deposit
          </button>
        </div>
      )
    },
    {
      title: "Recent Transactions",
      component: (
        <div className="space-y-4">
          {portfolio.Recent_transactions.map((transaction, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    className="mt-1 w-full p-2 border rounded"
                    value={transaction.date}
                    onChange={(e) => {
                      const newTransactions = [...portfolio.Recent_transactions];
                      newTransactions[index].date = e.target.value;
                      setPortfolio(prev => ({ ...prev, Recent_transactions: newTransactions }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Action</label>
                  <select
                    className="mt-1 w-full p-2 border rounded"
                    value={transaction.action}
                    onChange={(e) => {
                      const newTransactions = [...portfolio.Recent_transactions];
                      newTransactions[index].action = e.target.value;
                      setPortfolio(prev => ({ ...prev, Recent_transactions: newTransactions }));
                    }}
                  >
                    <option value="">Select Action</option>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Asset Type</label>
                  <select
                    className="mt-1 w-full p-2 border rounded"
                    value={transaction.asset_type}
                    onChange={(e) => {
                      const newTransactions = [...portfolio.Recent_transactions];
                      newTransactions[index].asset_type = e.target.value;
                      setPortfolio(prev => ({ ...prev, Recent_transactions: newTransactions }));
                    }}
                  >
                    <option value="">Select Asset Type</option>
                    <option value="stock">Stock</option>
                    <option value="mutual_fund">Mutual Fund</option>
                    <option value="fixed_deposit">Fixed Deposit</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    className="mt-1 w-full p-2 border rounded"
                    value={transaction.quantity}
                    onChange={(e) => {
                      const newTransactions = [...portfolio.Recent_transactions];
                      newTransactions[index].quantity = parseInt(e.target.value);
                      setPortfolio(prev => ({ ...prev, Recent_transactions: newTransactions }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full p-2 border rounded"
                    value={transaction.price}
                    onChange={(e) => {
                      const newTransactions = [...portfolio.Recent_transactions];
                      newTransactions[index].price = parseFloat(e.target.value);
                      setPortfolio(prev => ({ ...prev, Recent_transactions: newTransactions }));
                    }}
                  />
                </div>
                <div className="form-group col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Remarks</label>
                  <textarea
                    className="mt-1 w-full p-2 border rounded"
                    value={transaction.remarks}
                    onChange={(e) => {
                      const newTransactions = [...portfolio.Recent_transactions];
                      newTransactions[index].remarks = e.target.value;
                      setPortfolio(prev => ({ ...prev, Recent_transactions: newTransactions }));
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  const newTransactions = portfolio.Recent_transactions.filter((_, i) => i !== index);
                  setPortfolio(prev => ({ ...prev, Recent_transactions: newTransactions }));
                }}
              >
                Remove Transaction
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => setPortfolio(prev => ({
              ...prev,
              Recent_transactions: [...prev.Recent_transactions, { ...emptyTransaction }]
            }))}
          >
            Add New Transaction
          </button>
        </div>
      )
    },
    {
      title: "Crypto",
      component: (
        <div className="space-y-4">
          {portfolio.Crypto.map((crypto, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Cryptocurrency Name</label>
                  <input
                    type="text"
                    className="mt-1 w-full p-2 border rounded"
                    value={crypto.name}
                    onChange={(e) => {
                      const newCryptos = [...portfolio.Crypto];
                      newCryptos[index].name = e.target.value;
                      setPortfolio(prev => ({ ...prev, Crypto: newCryptos }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    className="mt-1 w-full p-2 border rounded"
                    value={crypto.quantity}
                    onChange={(e) => {
                      const newCryptos = [...portfolio.Crypto];
                      newCryptos[index].quantity = parseInt(e.target.value);
                      setPortfolio(prev => ({ ...prev, Crypto: newCryptos }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700">Price Bought At</label>
                  <input
                    type="number"
                    className="mt-1 w-full p-2 border rounded"
                    value={crypto.price_bought_at}
                    onChange={(e) => {
                      const newCryptos = [...portfolio.Crypto];
                      newCryptos[index].price_bought_at = parseFloat(e.target.value);
                      setPortfolio(prev => ({ ...prev, Crypto: newCryptos }));
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  const newCryptos = portfolio.Crypto.filter((_, i) => i !== index);
                  setPortfolio(prev => ({ ...prev, Crypto: newCryptos }));
                }}
              >
                Remove Cryptocurrency
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => setPortfolio(prev => ({
              ...prev,
              Crypto: [...prev.Crypto, { ...emptyCrypto }]
            }))}
          >
            Add New Cryptocurrency
          </button>
        </div>
      )
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await portfolioAPI.createPortfolio(DUMMY_WALLET, portfolio);
      toast.success('Portfolio saved successfully!');
      navigate('/portfolio/view', { replace: true });
    } catch (error) {
      toast.error('Error saving portfolio');
      console.error('Error saving portfolio:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Portfolio Management</h2>
      {anonAadhaar?.status === "logged-out" ? (
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {sections.map((section, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded ${
                    currentSection === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setCurrentSection(index)}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {sections[currentSection].component}

            <div className="flex justify-between mt-8">
              {currentSection > 0 && (
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={() => setCurrentSection(prev => prev - 1)}
                >
                  Previous
                </button>
              )}
              {currentSection < sections.length - 1 ? (
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setCurrentSection(prev => prev + 1)}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save Portfolio
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl text-gray-300">
            Sign in to view and manage your portfolio.
          </p>
        </div>
      )}
    </div>
  );
}

export default Portfolio; 