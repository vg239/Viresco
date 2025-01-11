import { useAnonAadhaar } from "@anon-aadhaar/react";
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { portfolioAPI } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Plus, Trash2, Wallet, Target, Clock, Building, History, Bitcoin, TrendingUp } from 'lucide-react';

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
      icon: Wallet,
      description: "Basic information about you",
      component: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-black/60 mb-2">Name</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                placeholder="Enter your name"
                value={portfolio.name}
                onChange={(e) => setPortfolio(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-black/60 mb-2">Age</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                placeholder="Enter your age"
                value={portfolio.age}
                onChange={(e) => setPortfolio(prev => ({ ...prev, age: parseInt(e.target.value) }))}
              />
            </div>
          </div>
        </motion.div>
      )
    },
    {
      title: "Investment Profile",
      icon: Target,
      description: "Your investment preferences and goals",
      component: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border"
        >
          <div className="grid grid-cols-1 gap-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-black/60 mb-2">Risk Tolerance</label>
              <select
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                value={portfolio.Investment_profile.risk_tolerance}
                onChange={(e) => setPortfolio(prev => ({
                  ...prev,
                  Investment_profile: { ...prev.Investment_profile, risk_tolerance: e.target.value }
                }))}
              >
                <option value="">Select Risk Tolerance</option>
                <option value="low">Conservative</option>
                <option value="medium">Moderate</option>
                <option value="high">Aggressive</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-black/60 mb-2">Investment Goal</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                placeholder="e.g., Retirement, Education, Wealth Creation"
                value={portfolio.Investment_profile.investment_goal}
                onChange={(e) => setPortfolio(prev => ({
                  ...prev,
                  Investment_profile: { ...prev.Investment_profile, investment_goal: e.target.value }
                }))}
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-black/60 mb-2">Time Horizon</label>
              <select
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                value={portfolio.Investment_profile.time_horizon}
                onChange={(e) => setPortfolio(prev => ({
                  ...prev,
                  Investment_profile: { ...prev.Investment_profile, time_horizon: e.target.value }
                }))}
              >
                <option value="">Select Time Horizon</option>
                <option value="short">Short Term (0-3 years)</option>
                <option value="medium">Medium Term (3-7 years)</option>
                <option value="long">Long Term (7+ years)</option>
              </select>
            </div>
          </div>
        </motion.div>
      )
    },
    {
      title: "Stocks",
      icon: TrendingUp,
      description: "Your stock investments",
      component: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {portfolio.Stocks.map((stock, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 group hover:shadow-xl hover:border-green-500/20 transition-all duration-300"
            >
              <div className="grid grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="block text-base font-medium text-gray-600 mb-2">Stock Name</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 placeholder:text-gray-400"
                    placeholder="Enter stock name (e.g., AAPL)"
                    value={stock.name}
                    onChange={(e) => {
                      const newStocks = [...portfolio.Stocks];
                      newStocks[index].name = e.target.value;
                      setPortfolio(prev => ({ ...prev, Stocks: newStocks }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-base font-medium text-gray-600 mb-2">Quantity</label>
                  <input
                    type="number"
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 placeholder:text-gray-400"
                    placeholder="Enter quantity (e.g., 100)"
                    value={stock.quantity}
                    onChange={(e) => {
                      const newStocks = [...portfolio.Stocks];
                      newStocks[index].quantity = parseInt(e.target.value);
                      setPortfolio(prev => ({ ...prev, Stocks: newStocks }));
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-base font-medium text-gray-600 mb-2">Price Bought At</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      className="w-full p-3 pl-7 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 placeholder:text-gray-400"
                      placeholder="Enter price (e.g., 150.00)"
                      value={stock.price_bought_at}
                      onChange={(e) => {
                        const newStocks = [...portfolio.Stocks];
                        newStocks[index].price_bought_at = parseFloat(e.target.value);
                        setPortfolio(prev => ({ ...prev, Stocks: newStocks }));
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Total Value: <span className="font-medium text-gray-900">${(stock.quantity * stock.price_bought_at).toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300"
                  onClick={() => {
                    const newStocks = portfolio.Stocks.filter((_, i) => i !== index);
                    setPortfolio(prev => ({ ...prev, Stocks: newStocks }));
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Stock</span>
                </button>
              </div>
            </motion.div>
          ))}
          <motion.button
            type="button"
            className="w-full p-6 bg-white/80 backdrop-blur-sm border border-dashed border-gray-300 rounded-2xl text-gray-600 hover:text-green-600 hover:border-green-500 hover:bg-green-50/50 transition-all duration-300 flex items-center justify-center gap-3 group"
            onClick={() => setPortfolio(prev => ({
              ...prev,
              Stocks: [...prev.Stocks, { ...emptyStock }]
            }))}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            <span className="font-medium">Add New Stock</span>
          </motion.button>
        </motion.div>
      )
    },
    {
      title: "Mutual Funds",
      icon: Building,
      description: "Your mutual fund investments",
      component: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border"
        >
          <div className="space-y-4">
            {portfolio.Mutual_funds.map((fund, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Fund Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter fund name"
                      value={fund.name}
                      onChange={(e) => {
                        const newFunds = [...portfolio.Mutual_funds];
                        newFunds[index].name = e.target.value;
                        setPortfolio(prev => ({ ...prev, Mutual_funds: newFunds }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Investment Amount</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter investment amount"
                      value={fund.investment_amount}
                      onChange={(e) => {
                        const newFunds = [...portfolio.Mutual_funds];
                        newFunds[index].investment_amount = parseFloat(e.target.value);
                        setPortfolio(prev => ({ ...prev, Mutual_funds: newFunds }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Fund Type</label>
                    <select
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
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
                  className="mt-4 inline-flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                  onClick={() => {
                    const newFunds = portfolio.Mutual_funds.filter((_, i) => i !== index);
                    setPortfolio(prev => ({ ...prev, Mutual_funds: newFunds }));
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Fund</span>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="w-full p-4 bg-white border border-dashed border-gray-300 rounded-2xl text-black/60 hover:text-green-500 hover:border-green-500 transition-all duration-200 flex items-center justify-center gap-2 group"
              onClick={() => setPortfolio(prev => ({
                ...prev,
                Mutual_funds: [...prev.Mutual_funds, { ...emptyMutualFund }]
              }))}
            >
              <Plus className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
              Add New Mutual Fund
            </button>
          </div>
        </motion.div>
      )
    },
    {
      title: "Fixed Deposits",
      icon: Clock,
      description: "Your fixed deposit investments",
      component: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border"
        >
          <div className="space-y-4">
            {portfolio.Fixed_deposits.map((fd, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Bank Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter bank name"
                      value={fd.bank_name}
                      onChange={(e) => {
                        const newFDs = [...portfolio.Fixed_deposits];
                        newFDs[index].bank_name = e.target.value;
                        setPortfolio(prev => ({ ...prev, Fixed_deposits: newFDs }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Investment Amount</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter investment amount"
                      value={fd.investment_amount}
                      onChange={(e) => {
                        const newFDs = [...portfolio.Fixed_deposits];
                        newFDs[index].investment_amount = parseFloat(e.target.value);
                        setPortfolio(prev => ({ ...prev, Fixed_deposits: newFDs }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Maturity Value</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter maturity value"
                      value={fd.maturity_value}
                      onChange={(e) => {
                        const newFDs = [...portfolio.Fixed_deposits];
                        newFDs[index].maturity_value = parseFloat(e.target.value);
                        setPortfolio(prev => ({ ...prev, Fixed_deposits: newFDs }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Tenure (Years)</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter tenure"
                      value={fd.tenure_years}
                      onChange={(e) => {
                        const newFDs = [...portfolio.Fixed_deposits];
                        newFDs[index].tenure_years = parseInt(e.target.value);
                        setPortfolio(prev => ({ ...prev, Fixed_deposits: newFDs }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter interest rate"
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
                  className="mt-4 inline-flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                  onClick={() => {
                    const newFDs = portfolio.Fixed_deposits.filter((_, i) => i !== index);
                    setPortfolio(prev => ({ ...prev, Fixed_deposits: newFDs }));
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Fixed Deposit</span>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="w-full p-4 bg-white border border-dashed border-gray-300 rounded-2xl text-black/60 hover:text-green-500 hover:border-green-500 transition-all duration-200 flex items-center justify-center gap-2 group"
              onClick={() => setPortfolio(prev => ({
                ...prev,
                Fixed_deposits: [...prev.Fixed_deposits, { ...emptyFixedDeposit }]
              }))}
            >
              <Plus className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
              Add New Fixed Deposit
            </button>
          </div>
        </motion.div>
      )
    },
    {
      title: "Recent Transactions",
      icon: History,
      description: "Your recent transactions",
      component: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border"
        >
          <div className="space-y-4">
            {portfolio.Recent_transactions.map((transaction, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter date"
                      value={transaction.date}
                      onChange={(e) => {
                        const newTransactions = [...portfolio.Recent_transactions];
                        newTransactions[index].date = e.target.value;
                        setPortfolio(prev => ({ ...prev, Recent_transactions: newTransactions }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Action</label>
                    <select
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
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
                    <label className="block text-sm font-medium text-black/60 mb-2">Asset Type</label>
                    <select
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
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
                    <label className="block text-sm font-medium text-black/60 mb-2">Quantity</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter quantity"
                      value={transaction.quantity}
                      onChange={(e) => {
                        const newTransactions = [...portfolio.Recent_transactions];
                        newTransactions[index].quantity = parseInt(e.target.value);
                        setPortfolio(prev => ({ ...prev, Recent_transactions: newTransactions }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Price</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter price"
                      value={transaction.price}
                      onChange={(e) => {
                        const newTransactions = [...portfolio.Recent_transactions];
                        newTransactions[index].price = parseFloat(e.target.value);
                        setPortfolio(prev => ({ ...prev, Recent_transactions: newTransactions }));
                      }}
                    />
                  </div>
                  <div className="form-group col-span-2">
                    <label className="block text-sm font-medium text-black/60 mb-2">Remarks</label>
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter remarks"
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
                  className="mt-4 inline-flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                  onClick={() => {
                    const newTransactions = portfolio.Recent_transactions.filter((_, i) => i !== index);
                    setPortfolio(prev => ({ ...prev, Recent_transactions: newTransactions }));
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Transaction</span>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="w-full p-4 bg-white border border-dashed border-gray-300 rounded-2xl text-black/60 hover:text-green-500 hover:border-green-500 transition-all duration-200 flex items-center justify-center gap-2 group"
              onClick={() => setPortfolio(prev => ({
                ...prev,
                Recent_transactions: [...prev.Recent_transactions, { ...emptyTransaction }]
              }))}
            >
              <Plus className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
              Add New Transaction
            </button>
          </div>
        </motion.div>
      )
    },
    {
      title: "Crypto",
      icon: Bitcoin,
      description: "Your cryptocurrency investments",
      component: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border"
        >
          <div className="space-y-4">
            {portfolio.Crypto.map((crypto, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Cryptocurrency Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter cryptocurrency name"
                      value={crypto.name}
                      onChange={(e) => {
                        const newCryptos = [...portfolio.Crypto];
                        newCryptos[index].name = e.target.value;
                        setPortfolio(prev => ({ ...prev, Crypto: newCryptos }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Quantity</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter quantity"
                      value={crypto.quantity}
                      onChange={(e) => {
                        const newCryptos = [...portfolio.Crypto];
                        newCryptos[index].quantity = parseInt(e.target.value);
                        setPortfolio(prev => ({ ...prev, Crypto: newCryptos }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-black/60 mb-2">Price Bought At</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                      placeholder="Enter purchase price"
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
                  className="mt-4 inline-flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                  onClick={() => {
                    const newCryptos = portfolio.Crypto.filter((_, i) => i !== index);
                    setPortfolio(prev => ({ ...prev, Crypto: newCryptos }));
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Cryptocurrency</span>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="w-full p-4 bg-white border border-dashed border-gray-300 rounded-2xl text-black/60 hover:text-green-500 hover:border-green-500 transition-all duration-200 flex items-center justify-center gap-2 group"
              onClick={() => setPortfolio(prev => ({
                ...prev,
                Crypto: [...prev.Crypto, { ...emptyCrypto }]
              }))}
            >
              <Plus className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
              Add New Cryptocurrency
            </button>
          </div>
        </motion.div>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100">
            {/* Header */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Portfolio Management
                  </h2>
                  <p className="mt-1 text-base text-gray-600">Create and manage your investment portfolio</p>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-green-500/20 font-medium"
                >
                  Save Portfolio
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="border-b border-gray-100">
              <div className="px-8 py-6">
                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                  {sections.map((section, index) => (
                    <button
                      key={index}
                      className={`flex items-center gap-3 px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 ${
                        currentSection === index
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20 scale-105'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => setCurrentSection(index)}
                    >
                      <section.icon className="w-5 h-5" />
                      <span className="font-medium">{section.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            {anonAadhaar?.status === "logged-out" ? (
              <div className="p-8">
                <div className="mb-6">
                  <p className="text-base text-gray-600 font-medium">{sections[currentSection].description}</p>
                </div>

                <form className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {sections[currentSection].component}
                  </motion.div>

                  <div className="flex justify-between pt-6 border-t border-gray-100">
                    {currentSection > 0 && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 font-medium"
                        onClick={() => setCurrentSection(prev => prev - 1)}
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Previous Section
                      </button>
                    )}
                    {currentSection < sections.length - 1 && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 ml-auto font-medium shadow-lg shadow-green-500/20"
                        onClick={() => setCurrentSection(prev => prev + 1)}
                      >
                        Next Section
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-2xl text-gray-600 font-medium">
                    Sign in to create and manage your portfolio.
                  </p>
                </motion.div>
              </div>
            )}

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-base text-gray-600">
                  <span className="font-medium">Section {currentSection + 1} of {sections.length}</span>
                  <span className="text-gray-400">•</span>
                  <span>{sections[currentSection].title}</span>
                </div>
                <div className="flex items-center gap-6">
                  {currentSection > 0 && (
                    <button
                      type="button"
                      className="text-base text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
                      onClick={() => setCurrentSection(prev => prev - 1)}
                    >
                      Previous
                    </button>
                  )}
                  {currentSection < sections.length - 1 && (
                    <button
                      type="button"
                      className="text-base text-green-600 hover:text-green-700 transition-colors duration-300 font-medium"
                      onClick={() => setCurrentSection(prev => prev + 1)}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio; 