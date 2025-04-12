
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { savePersonalityResult, getPersonalityResult, isUserSignedUp } from '../services/localStorageService';

type Question = {
  id: string;
  text: string;
  options: string[];
};

const personalityQuestions: Question[] = [
  {
    id: 'risk_tolerance',
    text: 'How do you react when your investments decrease in value?',
    options: [
      'I panic and consider selling',
      'I get concerned but hold steady',
      'I see it as a buying opportunity',
      'I don\'t worry at all'
    ]
  },
  {
    id: 'investment_horizon',
    text: 'How long are you planning to hold your investments?',
    options: [
      'Less than 1 year',
      '1-3 years',
      '3-10 years',
      'More than 10 years'
    ]
  },
  {
    id: 'financial_knowledge',
    text: 'How would you rate your investment knowledge?',
    options: [
      'Beginner',
      'Somewhat knowledgeable',
      'Knowledgeable',
      'Expert'
    ]
  },
  {
    id: 'goal_orientation',
    text: 'What is your primary financial goal?',
    options: [
      'Preserving capital',
      'Generating income',
      'Growing assets moderately',
      'Growing assets aggressively'
    ]
  },
  {
    id: 'decision_making',
    text: 'How do you typically make financial decisions?',
    options: [
      'I consult with professionals',
      'I do extensive research',
      'I follow my intuition',
      'I make quick decisions based on trends'
    ]
  }
];

// Personality types based on answers
const getPersonalityType = (answers: Record<string, string>): string => {
  // Simple algorithm to determine personality type based on risk and horizon
  const riskIndex = personalityQuestions[0].options.indexOf(answers.risk_tolerance || '');
  const horizonIndex = personalityQuestions[1].options.indexOf(answers.investment_horizon || '');
  
  if (riskIndex <= 1 && horizonIndex <= 1) return "Conservative Investor";
  if (riskIndex >= 2 && horizonIndex >= 2) return "Aggressive Growth Investor";
  return "Balanced Investor";
};

const PersonalityTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [personalityType, setPersonalityType] = useState('');

  useEffect(() => {
    // Check if user is signed up
    if (!isUserSignedUp()) {
      navigate('/signup');
      return;
    }
    
    // Check if test has already been taken
    const existingResult = getPersonalityResult();
    if (existingResult) {
      setAnswers(existingResult.answers);
      setPersonalityType(existingResult.type || '');
      setShowResults(true);
    }
  }, [navigate]);

  const handleAnswer = (answer: string) => {
    const question = personalityQuestions[currentQuestion];
    
    setAnswers(prev => ({
      ...prev,
      [question.id]: answer
    }));
    
    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate personality type
      const type = getPersonalityType({
        ...answers,
        [question.id]: answer
      });
      
      setPersonalityType(type);
      
      // Save results
      savePersonalityResult({
        answers: {
          ...answers,
          [question.id]: answer
        },
        type
      });
      
      setShowResults(true);
    }
  };

  const restartTest = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-finbaba-bg">
      <NavigationBar />
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-playfair font-bold text-finbaba-text mb-8 text-center">
          Investor Personality Test
        </h1>
        
        <div className="bg-white p-8 shadow-lg">
          {!showResults ? (
            <>
              <div className="mb-6">
                <p className="text-finbaba-text text-sm mb-1">
                  Question {currentQuestion + 1} of {personalityQuestions.length}
                </p>
                <div className="w-full bg-finbaba-bg h-2 rounded-full">
                  <div 
                    className="bg-finbaba-accent h-2 rounded-full"
                    style={{ width: `${((currentQuestion + 1) / personalityQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <h2 className="text-xl font-medium text-finbaba-text mb-6">
                {personalityQuestions[currentQuestion].text}
              </h2>
              
              <div className="space-y-3">
                {personalityQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left p-4 border border-finbaba-accent hover:bg-finbaba-accent/10 transition text-finbaba-text"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-playfair font-bold text-finbaba-text mb-4">
                Your Investor Personality:
              </h2>
              <p className="text-2xl font-bold text-finbaba-accent mb-8">{personalityType}</p>
              
              <h3 className="text-xl font-medium text-finbaba-text mb-4">Your Answers</h3>
              <div className="text-left space-y-4 mb-8">
                {personalityQuestions.map(question => (
                  <div key={question.id} className="p-4 bg-finbaba-bg/50">
                    <p className="font-medium text-finbaba-text">{question.text}</p>
                    <p className="text-finbaba-accent">{answers[question.id]}</p>
                  </div>
                ))}
              </div>
              
              <button
                onClick={restartTest}
                className="bg-finbaba-text text-finbaba-bg py-2 px-6 hover:bg-opacity-90 transition"
              >
                Retake Test
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalityTestPage;
