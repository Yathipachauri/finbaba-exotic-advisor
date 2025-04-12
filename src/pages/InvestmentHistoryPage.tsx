
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { saveInvestmentHistory, getInvestmentHistory, isUserSignedUp } from '../services/localStorageService';

const InvestmentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: 7 }, (_, i) => currentYear - i); // Last 7 years
  
  const [investmentHistory, setInvestmentHistory] = useState<Array<{
    year: number;
    amount: string;
    wasProfit: boolean;
  }>>([]);
  
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Check if user is signed up
    if (!isUserSignedUp()) {
      navigate('/signup');
      return;
    }
    
    // Check if history exists
    const existingHistory = getInvestmentHistory();
    if (existingHistory && existingHistory.length > 0) {
      setInvestmentHistory(existingHistory.map(item => ({
        ...item,
        amount: item.amount.toString()
      })));
      setShowResults(true);
    } else {
      // Initialize form with last 7 years
      setInvestmentHistory(
        yearsArray.map(year => ({
          year,
          amount: '',
          wasProfit: false
        }))
      );
    }
  }, [navigate]);

  const handleInputChange = (index: number, field: 'amount' | 'wasProfit', value: string | boolean) => {
    const updatedHistory = [...investmentHistory];
    updatedHistory[index] = {
      ...updatedHistory[index],
      [field]: value
    };
    setInvestmentHistory(updatedHistory);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate and save
    const formattedHistory = investmentHistory.map(item => ({
      year: item.year,
      amount: Number(item.amount) || 0,
      wasProfit: item.wasProfit
    }));
    
    saveInvestmentHistory(formattedHistory);
    setShowResults(true);
  };

  const editHistory = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-finbaba-bg">
      <NavigationBar />
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-playfair font-bold text-finbaba-text mb-8 text-center">
          Your Investment History
        </h1>
        
        <div className="bg-white p-8 shadow-lg">
          {!showResults ? (
            <form onSubmit={handleSubmit}>
              <p className="text-finbaba-text mb-6">
                Please provide information about your investments over the past 7 years.
              </p>
              
              <div className="space-y-6">
                {investmentHistory.map((item, index) => (
                  <div key={index} className="p-4 border border-finbaba-accent/30">
                    <h3 className="text-lg font-medium text-finbaba-text mb-3">Year {item.year}</h3>
                    
                    <div className="mb-3">
                      <label className="block text-finbaba-text mb-1">
                        Net Investment Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                        className="w-full p-2 border border-finbaba-accent focus:outline-none focus:ring-1 focus:ring-finbaba-text"
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <label className="flex items-center text-finbaba-text">
                        <input
                          type="checkbox"
                          checked={item.wasProfit}
                          onChange={(e) => handleInputChange(index, 'wasProfit', e.target.checked)}
                          className="mr-2 h-5 w-5 accent-finbaba-accent"
                        />
                        Was this investment profitable?
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                type="submit"
                className="mt-8 w-full bg-finbaba-text text-finbaba-bg py-3 px-4 hover:bg-opacity-90 transition font-medium"
              >
                Save Investment History
              </button>
            </form>
          ) : (
            <div>
              <h2 className="text-xl font-playfair font-bold text-finbaba-text mb-6">
                Your Investment Summary
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-finbaba-accent/20">
                      <th className="p-3 text-finbaba-text">Year</th>
                      <th className="p-3 text-finbaba-text">Amount (₹)</th>
                      <th className="p-3 text-finbaba-text">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investmentHistory.map((item, index) => (
                      <tr key={index} className="border-b border-finbaba-accent/10">
                        <td className="p-3 text-finbaba-text">{item.year}</td>
                        <td className="p-3 text-finbaba-text">
                          {Number(item.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 ${item.wasProfit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.wasProfit ? 'Profit' : 'Loss'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={editHistory}
                  className="bg-finbaba-text text-finbaba-bg py-2 px-6 hover:bg-opacity-90 transition"
                >
                  Edit History
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentHistoryPage;
