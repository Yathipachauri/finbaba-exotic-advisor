
import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import { getUserData } from '../services/localStorageService';

const AIAdvisorPage: React.FC = () => {
  const userData = getUserData();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sample financial tips
  const financialTips = [
    "Consider diversifying your portfolio across different asset classes.",
    "Emergency funds should typically cover 3-6 months of expenses.",
    "Review your investment strategy at least once a year.",
    "Tax-advantaged accounts can significantly boost your long-term returns.",
    "Dollar-cost averaging can help reduce the impact of market volatility.",
    "Consider rebalancing your portfolio periodically to maintain your target asset allocation.",
    "High interest debt should typically be paid off before investing heavily.",
    "Insurance is an important part of a comprehensive financial plan."
  ];

  const getRandomTip = () => {
    return financialTips[Math.floor(Math.random() * financialTips.length)];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI response with a delay
    setTimeout(() => {
      // Generate a simple contextual response based on the question
      let aiResponse = '';
      
      if (question.toLowerCase().includes('invest')) {
        aiResponse = "Based on your profile and current savings of ₹" + userData.currentSavings.toLocaleString('en-IN') + 
        ", I would suggest considering a diversified portfolio with exposure to both equity and debt instruments.";
      } else if (question.toLowerCase().includes('save')) {
        aiResponse = "With your current salary of ₹" + userData.currentSalary.toLocaleString('en-IN') + 
        ", you could aim to save approximately 20-30% of your income. Consider automating your savings.";
      } else if (question.toLowerCase().includes('debt') || question.toLowerCase().includes('loan')) {
        aiResponse = "When considering loans, ensure the EMI doesn't exceed 40% of your monthly income. Always prioritize high-interest debt repayment.";
      } else {
        aiResponse = "Thank you for your question. As your financial advisor, I recommend creating a balanced financial plan that aligns with your goals. " + getRandomTip();
      }
      
      setResponse(aiResponse);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-finbaba-bg">
      <NavigationBar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-playfair font-bold text-finbaba-text mb-2 text-center">
          AI Financial Advisor
        </h1>
        <p className="text-center text-finbaba-text/80 mb-12">
          Ask any question about your personal finances
        </p>
        
        <div className="bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="question" className="block text-finbaba-text mb-2 font-medium">
                What would you like to know about your finances?
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-3 border border-finbaba-accent focus:outline-none focus:ring-1 focus:ring-finbaba-text min-h-[120px]"
                placeholder="e.g., How should I invest my savings? How much should I save each month?"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="bg-finbaba-text text-finbaba-bg py-3 px-6 hover:bg-opacity-90 transition font-medium disabled:opacity-70"
            >
              {isLoading ? 'Thinking...' : 'Get Advice'}
            </button>
          </form>
          
          {response && (
            <div className="p-6 bg-finbaba-accent/10 border-l-4 border-finbaba-accent">
              <h3 className="font-playfair text-lg font-bold text-finbaba-text mb-2">Fin Baba says:</h3>
              <p className="text-finbaba-text">{response}</p>
            </div>
          )}
          
          <div className="mt-8 p-4 bg-finbaba-bg/50">
            <h3 className="font-medium text-finbaba-text mb-2">Daily Financial Tip:</h3>
            <p className="text-finbaba-text italic">{getRandomTip()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisorPage;
