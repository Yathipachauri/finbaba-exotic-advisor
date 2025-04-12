
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { Card, CardContent } from '@/components/ui/card';
import PrivacyPopup from '../components/PrivacyPopup';
import { isUserSignedUp, getUserData } from '../services/localStorageService';

type GoalQuestion = {
  id: string;
  text: string;
  type: 'text' | 'select' | 'number';
  options?: string[];
};

type GoalData = {
  goal: string;
  goalType: string;
  goalAmount: number;
  timeFrame: number;
  currentSavings: number;
  monthlySalary: number;
};

const goalQuestions: GoalQuestion[] = [
  {
    id: 'goal',
    text: 'What\'s your goal?',
    type: 'text'
  },
  {
    id: 'goalType',
    text: 'What type of goal do you have?',
    type: 'select',
    options: [
      'Save for something',
      'Invest for future',
      'Purchase something'
    ]
  },
  {
    id: 'goalAmount',
    text: 'Goal target amount?',
    type: 'number'
  },
  {
    id: 'timeFrame',
    text: 'Time frame to achieve the goal (in months)?',
    type: 'number'
  },
  {
    id: 'currentSavings',
    text: 'Your current savings?',
    type: 'number'
  },
  {
    id: 'monthlySalary',
    text: 'Your current monthly salary?',
    type: 'number'
  }
];

const generateTaskPlan = (goalData: GoalData) => {
  const { goalAmount, timeFrame, currentSavings, monthlySalary } = goalData;
  const requiredMonthlyAmount = (goalAmount - currentSavings) / timeFrame;
  const savingPercentage = (requiredMonthlyAmount / monthlySalary) * 100;
  
  const tasks = [];
  
  // Task 1: Based on savings & goal
  if (savingPercentage > 40) {
    tasks.push("Cut down on non-essential expenses to meet your ambitious saving target");
  } else if (savingPercentage > 25) {
    tasks.push("Review your monthly budget to ensure you can consistently save the required amount");
  } else {
    tasks.push("Set up an automatic transfer to your savings account on salary day");
  }
  
  // Task 2: Practical saving habit
  tasks.push("Track all expenses for one month to identify potential savings opportunities");
  
  // Task 3: Spending control tip
  if (savingPercentage > 30) {
    tasks.push("Try the 30-day rule: wait 30 days before making any non-essential purchase over ₹2,000");
  } else {
    tasks.push("Implement a 'no-spend' day each week to boost your savings");
  }
  
  // Task 4: Optional income boost
  if (savingPercentage > 40) {
    tasks.push("Explore side hustle opportunities like freelancing, tutoring, or selling skills online");
  } else {
    tasks.push("Consider selling items you no longer need to boost your initial savings amount");
  }
  
  // Task 5: Behavioral trick
  tasks.push("Visualize your goal daily - create a vision board or set a phone wallpaper to stay motivated");
  
  return tasks;
};

const generateSuggestion = (goalData: GoalData) => {
  const { goalType, timeFrame } = goalData;
  
  if (goalType === 'Save for something') {
    return "Small consistent steps add up to big wins! You got this! 💪💰";
  } else if (goalType === 'Invest for future') {
    return timeFrame > 24 
      ? "Time is your superpower in investing - let compound interest do its magic! ✨📈" 
      : "Short-term investments need focus - stay consistent and avoid impulsive decisions! 🔍💼";
  } else {
    return "Your dream purchase is just a disciplined savings plan away! 🛍️💯";
  }
};

const GoalSettingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({
    goal: '',
    goalType: 'Save for something',
    goalAmount: 0,
    timeFrame: 0,
    currentSavings: 0,
    monthlySalary: 0
  });
  
  // Results data
  const [monthlyTarget, setMonthlyTarget] = useState(0);
  const [tasks, setTasks] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState('');
  
  useEffect(() => {
    // Check if user is signed up
    if (!isUserSignedUp()) {
      navigate('/signup');
      return;
    }
    
    // Pre-fill current savings and monthly salary from user data
    const userData = getUserData();
    if (userData) {
      setAnswers(prev => ({
        ...prev,
        currentSavings: userData.currentSavings || 0,
        monthlySalary: userData.currentSalary / 12 || 0
      }));
    }
  }, [navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setAnswers(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };
  
  const handleNext = () => {
    // Simple validation
    const currentQ = goalQuestions[currentQuestion];
    const currentAnswer = answers[currentQ.id];
    
    if ((currentQ.type === 'text' && !currentAnswer) || 
        (currentQ.type === 'number' && (isNaN(currentAnswer) || currentAnswer <= 0))) {
      alert('Please provide a valid answer to continue');
      return;
    }
    
    if (currentQuestion < goalQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate and show results
      const goalData: GoalData = {
        goal: answers.goal,
        goalType: answers.goalType,
        goalAmount: answers.goalAmount,
        timeFrame: answers.timeFrame,
        currentSavings: answers.currentSavings,
        monthlySalary: answers.monthlySalary
      };
      
      const requiredMonthlyAmount = (goalData.goalAmount - goalData.currentSavings) / goalData.timeFrame;
      setMonthlyTarget(requiredMonthlyAmount);
      setTasks(generateTaskPlan(goalData));
      setSuggestion(generateSuggestion(goalData));
      
      setShowResults(true);
    }
  };
  
  const resetForm = () => {
    setAnswers({
      goal: '',
      goalType: 'Save for something',
      goalAmount: 0,
      timeFrame: 0,
      currentSavings: 0,
      monthlySalary: 0
    });
    setCurrentQuestion(0);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-finbaba-bg">
      <NavigationBar />
      <PrivacyPopup formName="goal-setting" />
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-cormorant font-bold text-finbaba-text mb-8 text-center">
          Set Your Financial Goal
        </h1>
        
        <div className="bg-white p-8 shadow-lg">
          {!showResults ? (
            <>
              <div className="mb-6">
                <p className="text-finbaba-text text-sm mb-1 font-raleway">
                  Question {currentQuestion + 1} of {goalQuestions.length}
                </p>
                <div className="w-full bg-finbaba-bg h-2 rounded-full">
                  <div 
                    className="bg-finbaba-accent h-2 rounded-full"
                    style={{ width: `${((currentQuestion + 1) / goalQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-medium text-finbaba-text mb-4 font-cormorant">
                  {goalQuestions[currentQuestion].text}
                </h2>
                
                {goalQuestions[currentQuestion].type === 'text' && (
                  <input
                    type="text"
                    name={goalQuestions[currentQuestion].id}
                    value={answers[goalQuestions[currentQuestion].id] || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-finbaba-accent focus:outline-none focus:ring-1 focus:ring-finbaba-text font-raleway"
                    placeholder="Enter your goal"
                  />
                )}
                
                {goalQuestions[currentQuestion].type === 'select' && (
                  <select
                    name={goalQuestions[currentQuestion].id}
                    value={answers[goalQuestions[currentQuestion].id] || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-finbaba-accent focus:outline-none focus:ring-1 focus:ring-finbaba-text font-raleway"
                  >
                    {goalQuestions[currentQuestion].options?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                )}
                
                {goalQuestions[currentQuestion].type === 'number' && (
                  <input
                    type="number"
                    name={goalQuestions[currentQuestion].id}
                    value={answers[goalQuestions[currentQuestion].id] || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-finbaba-accent focus:outline-none focus:ring-1 focus:ring-finbaba-text font-raleway"
                    placeholder="0"
                    min="0"
                  />
                )}
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => currentQuestion > 0 && setCurrentQuestion(prev => prev - 1)}
                  className={`py-2 px-6 transition font-raleway ${
                    currentQuestion > 0 
                      ? 'bg-gray-200 text-finbaba-text hover:bg-gray-300' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </button>
                
                <button
                  onClick={handleNext}
                  className="bg-finbaba-text text-finbaba-bg py-2 px-6 hover:bg-opacity-90 transition font-raleway"
                >
                  {currentQuestion === goalQuestions.length - 1 ? 'Submit' : 'Next'}
                </button>
              </div>
            </>
          ) : (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-cormorant font-bold text-finbaba-text mb-4">
                  Your Goal Plan
                </h2>
                
                <div className="bg-finbaba-accent/20 p-4 inline-block rounded-lg">
                  <p className="text-lg font-bold text-finbaba-text mb-1 font-cormorant">
                    🎯 Goal: {answers.goal} (₹{answers.goalAmount.toLocaleString('en-IN')})
                  </p>
                  <p className="text-md text-finbaba-text mb-1 font-raleway">
                    📅 Timeline: {answers.timeFrame} months
                  </p>
                  <p className="text-md text-finbaba-text font-bold font-raleway">
                    💡 Monthly Target: ₹{monthlyTarget.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                  </p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-medium text-finbaba-text mb-4 font-cormorant">
                  �� Your 5-Task Plan:
                </h3>
                
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <div key={index} className="flex items-start">
                      <input 
                        type="checkbox" 
                        id={`task-${index}`} 
                        className="mt-1 mr-3 h-4 w-4 accent-finbaba-accent"
                      />
                      <label htmlFor={`task-${index}`} className="text-finbaba-text font-raleway">
                        {task}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-finbaba-text text-finbaba-bg mb-6 text-center">
                <p className="text-lg font-raleway">
                  ✨ {suggestion}
                </p>
              </div>
              
              <div className="text-center">
                <button
                  onClick={resetForm}
                  className="bg-finbaba-accent text-finbaba-text py-2 px-6 hover:bg-opacity-90 transition font-raleway"
                >
                  Set Another Goal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalSettingPage;
