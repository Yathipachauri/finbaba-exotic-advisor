import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import { Card, CardContent } from '@/components/ui/card';
import PrivacyPopup from '../components/PrivacyPopup';
import { saveInvestmentHistory, getInvestmentHistory, isUserSignedUp } from '../services/localStorageService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
  const [analysis, setAnalysis] = useState({
    riskAppetite: '',
    successRate: 0,
    averageInvestment: 0,
    timeFactor: ''
  });

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
      
      // Generate analysis
      const analysis = generateAnalysis(existingHistory);
      setAnalysis(analysis);
      
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
    
    // Generate analysis
    const analysis = generateAnalysis(formattedHistory);
    setAnalysis(analysis);
    
    // Save the history
    saveInvestmentHistory(formattedHistory);
    setShowResults(true);
  };

  const generateAnalysis = (history: Array<{year: number; amount: number; wasProfit: boolean}>) => {
    // Sort history by year (ascending)
    const sortedHistory = [...history].sort((a, b) => a.year - b.year);
    
    // Risk Appetite Trend
    const firstHalfAverage = sortedHistory.slice(0, Math.floor(sortedHistory.length / 2))
      .reduce((sum, item) => sum + item.amount, 0) / Math.floor(sortedHistory.length / 2) || 0;
    
    const secondHalfAverage = sortedHistory.slice(Math.floor(sortedHistory.length / 2))
      .reduce((sum, item) => sum + item.amount, 0) / (sortedHistory.length - Math.floor(sortedHistory.length / 2)) || 0;
    
    const riskTrend = secondHalfAverage > firstHalfAverage * 1.2 
      ? "Your investments are becoming more aggressive over time." 
      : secondHalfAverage < firstHalfAverage * 0.8 
        ? "Your investments are becoming more conservative over time."
        : "Your investment approach has remained consistent over time.";
    
    // Success Rate
    const totalInvestments = sortedHistory.filter(item => item.amount > 0).length;
    const profitableInvestments = sortedHistory.filter(item => item.amount > 0 && item.wasProfit).length;
    const successRate = totalInvestments > 0 ? (profitableInvestments / totalInvestments) * 100 : 0;
    
    // Average Investment Amount
    const totalAmount = sortedHistory.reduce((sum, item) => sum + item.amount, 0);
    const averageInvestment = totalInvestments > 0 ? totalAmount / totalInvestments : 0;
    
    // Time Factor Analysis
    const earlyYears = sortedHistory.slice(0, Math.floor(sortedHistory.length / 2));
    const recentYears = sortedHistory.slice(Math.floor(sortedHistory.length / 2));
    
    const earlyProfitRate = earlyYears.filter(item => item.amount > 0).length > 0
      ? earlyYears.filter(item => item.amount > 0 && item.wasProfit).length / earlyYears.filter(item => item.amount > 0).length
      : 0;
      
    const recentProfitRate = recentYears.filter(item => item.amount > 0).length > 0
      ? recentYears.filter(item => item.amount > 0 && item.wasProfit).length / recentYears.filter(item => item.amount > 0).length
      : 0;
    
    let timeFactor = "";
    if (recentProfitRate > earlyProfitRate * 1.2) {
      timeFactor = "Your investment success has improved significantly in recent years, showing a positive learning curve.";
    } else if (recentProfitRate < earlyProfitRate * 0.8) {
      timeFactor = "Your earlier investments were more successful than recent ones. Consider reviewing your recent strategy.";
    } else {
      timeFactor = "Your investment success rate has remained relatively consistent over time.";
    }
    
    return {
      riskAppetite: riskTrend,
      successRate,
      averageInvestment,
      timeFactor
    };
  };

  const editHistory = () => {
    setShowResults(false);
  };

  const generateSuggestions = () => {
    const { successRate, averageInvestment } = analysis;
    
    const suggestions = [];
    
    if (successRate < 50) {
      suggestions.push("Consider diversifying your investments to reduce risk and improve success rate.");
      suggestions.push("Research investment options more thoroughly before committing funds.");
    } else {
      suggestions.push("Your investment strategy is working well. Consider gradually increasing your investment amounts.");
    }
    
    if (averageInvestment < 10000) {
      suggestions.push("Try to increase your average investment amount to benefit from economies of scale.");
    } else if (averageInvestment > 50000) {
      suggestions.push("With your substantial investment amounts, consider consulting a professional advisor for optimization.");
    }
    
    return suggestions;
  };

  // Prepare chart data
  const chartData = investmentHistory.map(item => ({
    year: item.year,
    amount: Number(item.amount) || 0,
    profit: item.wasProfit ? Number(item.amount) || 0 : 0,
    loss: !item.wasProfit ? Number(item.amount) || 0 : 0
  })).sort((a, b) => a.year - b.year);
  
  const pieData = [
    { name: 'Profitable', value: investmentHistory.filter(item => item.wasProfit && Number(item.amount) > 0).length },
    { name: 'Loss', value: investmentHistory.filter(item => !item.wasProfit && Number(item.amount) > 0).length }
  ];
  
  const COLORS = ['#4CAF50', '#F44336'];

  return (
    <div className="min-h-screen bg-finbaba-bg">
      <NavigationBar />
      <PrivacyPopup formName="investment-history" />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-cormorant font-bold text-finbaba-text mb-8 text-center">
          Your Investment History
        </h1>
        
        <div className="bg-white p-8 shadow-lg">
          {!showResults ? (
            <form onSubmit={handleSubmit}>
              <p className="text-finbaba-text mb-6 font-raleway">
                Please provide information about your investments over the past 7 years.
              </p>
              
              <div className="space-y-6">
                {investmentHistory.map((item, index) => (
                  <div key={index} className="p-4 border border-finbaba-accent/30">
                    <h3 className="text-lg font-medium text-finbaba-text mb-3 font-cormorant">Year {item.year}</h3>
                    
                    <div className="mb-3">
                      <label className="block text-finbaba-text mb-1 font-raleway">
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
                      <label className="flex items-center text-finbaba-text font-raleway">
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
                className="mt-8 w-full bg-finbaba-text text-finbaba-bg py-3 px-4 hover:bg-opacity-90 transition font-medium font-raleway"
              >
                Save Investment History
              </button>
            </form>
          ) : (
            <div>
              <h2 className="text-2xl font-cormorant font-bold text-finbaba-text mb-6">
                Your Investment Analysis
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="h-80">
                  <h3 className="text-lg font-medium text-finbaba-text mb-3 font-cormorant">Investment History by Year</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
                      <Legend />
                      <Bar dataKey="profit" name="Profitable Investment" fill="#4CAF50" />
                      <Bar dataKey="loss" name="Loss Investment" fill="#F44336" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-80">
                  <h3 className="text-lg font-medium text-finbaba-text mb-3 font-cormorant">Success Rate</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Number of Investments']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="p-4 bg-finbaba-accent/10">
                  <h3 className="text-lg font-medium text-finbaba-text mb-2 font-cormorant">1. Risk Appetite Trend</h3>
                  <p className="text-finbaba-text font-raleway">{analysis.riskAppetite}</p>
                </div>
                
                <div className="p-4 bg-finbaba-accent/10">
                  <h3 className="text-lg font-medium text-finbaba-text mb-2 font-cormorant">2. Success Rate</h3>
                  <p className="text-finbaba-text font-raleway">
                    Your investment success rate is {analysis.successRate.toFixed(1)}%.
                    {analysis.successRate >= 70 
                      ? " This is an excellent rate of success!"
                      : analysis.successRate >= 50
                        ? " This is a good success rate."
                        : " There's room for improvement in your investment strategy."}
                  </p>
                </div>
                
                <div className="p-4 bg-finbaba-accent/10">
                  <h3 className="text-lg font-medium text-finbaba-text mb-2 font-cormorant">3. Average Investment Amount</h3>
                  <p className="text-finbaba-text font-raleway">
                    Your average investment amount is ₹{analysis.averageInvestment.toLocaleString('en-IN', {maximumFractionDigits: 0})}.
                    {analysis.averageInvestment > 50000 
                      ? " This suggests you are a substantial investor."
                      : analysis.averageInvestment > 10000
                        ? " This indicates a moderate investment approach."
                        : " This suggests a cautious approach to investing."}
                  </p>
                </div>
                
                <div className="p-4 bg-finbaba-accent/10">
                  <h3 className="text-lg font-medium text-finbaba-text mb-2 font-cormorant">4. Time Factor Analysis</h3>
                  <p className="text-finbaba-text font-raleway">{analysis.timeFactor}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-finbaba-text mb-3 font-cormorant">Suggestions</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {generateSuggestions().map((suggestion, index) => (
                    <li key={index} className="text-finbaba-text font-raleway">{suggestion}</li>
                  ))}
                </ul>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <h3 className="text-lg font-medium text-finbaba-text mb-3 font-cormorant">Investment Summary</h3>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-finbaba-accent/20">
                      <th className="p-3 text-finbaba-text font-cormorant">Year</th>
                      <th className="p-3 text-finbaba-text font-cormorant">Amount (₹)</th>
                      <th className="p-3 text-finbaba-text font-cormorant">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investmentHistory
                      .sort((a, b) => b.year - a.year) // Sort by year descending
                      .map((item, index) => (
                        <tr key={index} className="border-b border-finbaba-accent/10">
                          <td className="p-3 text-finbaba-text font-raleway">{item.year}</td>
                          <td className="p-3 text-finbaba-text font-raleway">
                            {Number(item.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 ${item.wasProfit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} font-raleway`}>
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
                  className="bg-finbaba-text text-finbaba-bg py-2 px-6 hover:bg-opacity-90 transition font-raleway"
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
