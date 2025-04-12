import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import { Card, CardContent } from '@/components/ui/card';
import PrivacyPopup from '../components/PrivacyPopup';
import { savePersonalityResult, getPersonalityResult, isUserSignedUp } from '../services/localStorageService';

type Question = {
  id: string;
  text: string;
  options: Array<{
    text: string;
    value: string;
  }>;
};

type PersonalityType = {
  type: string;
  animal: string;
  emoji: string;
  description: string;
  riskRank: number;
  riskAppetite: string;
  saferGrowthPath: string;
};

const personalityQuestions: Question[] = [
  {
    id: 'saving_money',
    text: 'How do you feel about saving money?',
    options: [
      { text: 'I love saving! I feel secure when I save a lot.', value: 'squirrel' },
      { text: 'I save a small fixed amount regularly, no matter what.', value: 'ant' },
      { text: 'Saving is boring. I\'d rather buy cool stuff!', value: 'peacock' },
      { text: 'I save only after planning and doing full research.', value: 'owl' },
      { text: 'I save, but if my loved ones need anything — I\'ll spend without thinking.', value: 'dog' },
      { text: 'Saving is hard. I prefer enjoying the moment!', value: 'monkey' }
    ]
  },
  {
    id: 'spending_habits',
    text: 'What do you usually spend most of your money on?',
    options: [
      { text: 'Nothing much, I avoid spending.', value: 'squirrel' },
      { text: 'Essentials only. I budget strictly.', value: 'ant' },
      { text: 'Clothes, gadgets, luxury, latest trends.', value: 'peacock' },
      { text: 'Books, courses, or investments.', value: 'owl' },
      { text: 'Food, gifts, outings with friends/family.', value: 'dog' },
      { text: 'Random things — whatever catches my eye!', value: 'monkey' }
    ]
  },
  {
    id: 'windfall',
    text: 'If you suddenly get ₹10,000 — what will you do first?',
    options: [
      { text: 'Straight into savings. No second thought.', value: 'squirrel' },
      { text: 'Divide — 50% save, 50% invest/spend wisely.', value: 'ant' },
      { text: 'Go shopping or upgrade my lifestyle!', value: 'peacock' },
      { text: 'Research where to invest for best returns.', value: 'owl' },
      { text: 'Treat my family/friends with it.', value: 'dog' },
      { text: 'Party or buy something impulsively.', value: 'monkey' }
    ]
  },
  {
    id: 'money_fear',
    text: 'What\'s your biggest fear about money?',
    options: [
      { text: 'Running out of savings in the future.', value: 'squirrel' },
      { text: 'Not being consistent enough with saving.', value: 'ant' },
      { text: 'Missing out on enjoying life while saving too much.', value: 'peacock' },
      { text: 'Making a wrong investment decision.', value: 'owl' },
      { text: 'Not being able to help my loved ones in need.', value: 'dog' },
      { text: 'Being bored because of too much saving or restriction.', value: 'monkey' }
    ]
  },
  {
    id: 'motivation',
    text: 'What motivates you to save or spend?',
    options: [
      { text: 'Fear of uncertainty.', value: 'squirrel' },
      { text: 'Goal-setting and discipline.', value: 'ant' },
      { text: 'Social status & fun.', value: 'peacock' },
      { text: 'Knowledge & strategy.', value: 'owl' },
      { text: 'Emotions & relationships.', value: 'dog' },
      { text: 'Thrill & excitement.', value: 'monkey' }
    ]
  }
];

const personalityTypes: Record<string, PersonalityType> = {
  'squirrel': {
    type: 'The Super Saver',
    animal: 'Squirrel',
    emoji: '🐿',
    description: 'Collects & hoards nuts (money) for the future. Spends very little, always saving for a rainy day. Security-first mindset.',
    riskRank: 6,
    riskAppetite: 'Very Low',
    saferGrowthPath: 'Start investing slowly (even ₹500/month). Use recurring deposits. Learn risk vs reward. Try no-spend challenges. Make saving fun with digital jars (like Jar app).'
  },
  'ant': {
    type: 'The Disciplined Investor',
    animal: 'Ant',
    emoji: '🐜',
    description: 'Consistent and hardworking. Focuses on long-term goals. Small savings/investments daily that grow big with time. Systematic approach.',
    riskRank: 5,
    riskAppetite: 'Low',
    saferGrowthPath: 'Invest monthly in SIPs, PPF, or SGBs. Use goal-based planning apps. Read youth-focused blogs (like ET Money, Groww). Avoid FOMO investments.'
  },
  'peacock': {
    type: 'The Show-off Spender',
    animal: 'Peacock',
    emoji: '🦚',
    description: 'Loves luxury and appearances. Spends a lot on looks, lifestyle, and status. Might ignore savings for instant gratification.',
    riskRank: 1,
    riskAppetite: 'Very High',
    saferGrowthPath: 'Track lifestyle spends, start with fun finance apps (like Fi, Jupiter). Try goal-based SIPs (like vacation fund). Avoid EMI traps. Learn mindful luxury.'
  },
  'owl': {
    type: 'The Smart Planner',
    animal: 'Owl',
    emoji: '🦉',
    description: 'Wise with money. Thinks deeply before investing or spending. Focuses on research, knowledge, and future-proof plans.',
    riskRank: 4,
    riskAppetite: 'Medium',
    saferGrowthPath: 'Explore hybrid mutual funds, budgeting apps with analytics (like Walnut, Moneyfy). Learn tax-saving schemes. Attend webinars on personal finance.'
  },
  'dog': {
    type: 'The Loyal Consumer',
    animal: 'Dog',
    emoji: '🐶',
    description: 'Spends mostly on family, friends, and experiences. Generous but not reckless. Prioritizes relationships over wealth accumulation.',
    riskRank: 3,
    riskAppetite: 'Medium-High',
    saferGrowthPath: 'Use budgeting tools that visualize family goals. Start recurring deposits for festivals, gifts, vacations. Learn family insurance + mutual fund basics.'
  },
  'monkey': {
    type: 'The Impulsive Spender',
    animal: 'Monkey',
    emoji: '🐒',
    description: 'Gets excited easily. Buys trendy stuff, follows the latest fads. Low patience for saving — lives in the moment.',
    riskRank: 2,
    riskAppetite: 'High',
    saferGrowthPath: 'Use UPI wallets with spending limits. Start a guilt-free fund (10% income for YOLO). Try micro-investments like ₹100 SIPs. Learn delayed gratification with short-term goals.'
  },
  'squirrel_owl': {
    type: 'The Overthinking Saver',
    animal: 'Squirrel + Owl',
    emoji: '🐿 + 🦉',
    description: 'Saves a lot but overthinks every money decision. May miss out on investment opportunities due to fear.',
    riskRank: 5,
    riskAppetite: 'Low',
    saferGrowthPath: 'Start with low-risk index funds. Learn about diversification. Set a "research deadline" for decisions. Try automation to overcome overthinking.'
  },
  'ant_owl': {
    type: 'The Ideal Financial Person',
    animal: 'Ant + Owl',
    emoji: '🐜 + 🦉',
    description: 'Balanced, disciplined, smart investor. Saves regularly & invests wisely. Future-focused.',
    riskRank: 4,
    riskAppetite: 'Medium',
    saferGrowthPath: 'Continue balanced approach. Explore slightly higher-risk options. Consider mentoring others. Stay updated on financial literacy.'
  },
  'peacock_monkey': {
    type: 'The Danger Zone Spender',
    animal: 'Peacock + Monkey',
    emoji: '🦚 + 🐒',
    description: 'Spends recklessly for show and fun. High risk of debt or regret later.',
    riskRank: 1,
    riskAppetite: 'Very High',
    saferGrowthPath: 'Implement the 24-hour rule before large purchases. Use envelope budgeting. Find a financial accountability partner. Learn about debt management.'
  },
  'dog_ant': {
    type: 'The Responsible Emotional Spender',
    animal: 'Dog + Ant',
    emoji: '🐶 + 🐜',
    description: 'Saves properly but also keeps loved ones\' needs above all. Balanced heart & mind.',
    riskRank: 3,
    riskAppetite: 'Medium',
    saferGrowthPath: 'Create separate funds for family expenses and personal goals. Learn about family insurance. Practice mindful giving.'
  },
  'squirrel_dog': {
    type: 'The Protective Provider',
    animal: 'Squirrel + Dog',
    emoji: '🐿 + 🐶',
    description: 'Saves heavily but spends for family without hesitation. Focus is security for family.',
    riskRank: 4,
    riskAppetite: 'Medium-Low',
    saferGrowthPath: 'Learn about estate planning. Explore term insurance. Create emergency funds for family members. Diversify investments across risk levels.'
  }
};

const getPersonalityType = (answers: Record<string, string>): PersonalityType => {
  const counts: Record<string, number> = {
    'squirrel': 0,
    'ant': 0,
    'peacock': 0,
    'owl': 0,
    'dog': 0,
    'monkey': 0
  };
  
  Object.values(answers).forEach(value => {
    if (value in counts) {
      counts[value]++;
    }
  });
  
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const primaryType = sorted[0][0];
  const secondaryType = sorted[1][0];
  
  if (primaryType === 'squirrel' && secondaryType === 'owl' || 
      primaryType === 'owl' && secondaryType === 'squirrel') {
    return personalityTypes['squirrel_owl'];
  }
  if (primaryType === 'ant' && secondaryType === 'owl' || 
      primaryType === 'owl' && secondaryType === 'ant') {
    return personalityTypes['ant_owl'];
  }
  if (primaryType === 'peacock' && secondaryType === 'monkey' || 
      primaryType === 'monkey' && secondaryType === 'peacock') {
    return personalityTypes['peacock_monkey'];
  }
  if (primaryType === 'dog' && secondaryType === 'ant' || 
      primaryType === 'ant' && secondaryType === 'dog') {
    return personalityTypes['dog_ant'];
  }
  if (primaryType === 'squirrel' && secondaryType === 'dog' || 
      primaryType === 'dog' && secondaryType === 'squirrel') {
    return personalityTypes['squirrel_dog'];
  }
  
  return personalityTypes[primaryType];
};

const PersonalityTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [personalityResult, setPersonalityResult] = useState<PersonalityType | null>(null);

  useEffect(() => {
    if (!isUserSignedUp()) {
      navigate('/signup');
      return;
    }
    
    const existingResult = getPersonalityResult();
    if (existingResult && existingResult.answers) {
      setAnswers(existingResult.answers);
      const type = getPersonalityType(existingResult.answers);
      setPersonalityResult(type);
      setShowResults(true);
    }
  }, [navigate]);

  const handleAnswer = (value: string) => {
    const question = personalityQuestions[currentQuestion];
    
    setAnswers(prev => ({
      ...prev,
      [question.id]: value
    }));
    
    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const newAnswers = {
        ...answers,
        [question.id]: value
      };
      
      const type = getPersonalityType(newAnswers);
      setPersonalityResult(type);
      
      savePersonalityResult({
        answers: newAnswers,
        type: type.type
      });
      
      setShowResults(true);
    }
  };

  const restartTest = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
  };

  const getSafePathAdvice = () => {
    if (!personalityResult) return "";
    return personalityResult.saferGrowthPath;
  };

  const getRiskyPathAdvice = () => {
    if (!personalityResult) return "";
    
    const riskRank = personalityResult.riskRank;
    
    if (riskRank >= 5) {
      return "Consider slowly expanding your investment horizon beyond just savings. Try a small SIP in a conservative hybrid fund to get comfortable with market fluctuations.";
    } else if (riskRank >= 3) {
      return "You could explore a more aggressive asset allocation with 60-70% in equity funds. Consider adding international exposure through global funds for diversification.";
    } else {
      return "Channel your risk appetite into calculated high-growth opportunities. Research smallcap funds, sectoral plays, or even direct equity investments with a portion of your portfolio.";
    }
  };

  return (
    <div className="min-h-screen bg-finbaba-bg">
      <NavigationBar />
      <PrivacyPopup formName="personality-test" />
      
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-cormorant font-bold text-finbaba-text mb-8 text-center">
          Financial Personality Assessment
        </h1>
        
        <div className="bg-white p-8 shadow-lg">
          {!showResults ? (
            <>
              <div className="mb-6">
                <p className="text-finbaba-text text-sm mb-1 font-raleway">
                  Question {currentQuestion + 1} of {personalityQuestions.length}
                </p>
                <div className="w-full bg-finbaba-bg h-2 rounded-full">
                  <div 
                    className="bg-finbaba-accent h-2 rounded-full"
                    style={{ width: `${((currentQuestion + 1) / personalityQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <h2 className="text-xl font-medium text-finbaba-text mb-6 font-cormorant">
                {personalityQuestions[currentQuestion].text}
              </h2>
              
              <div className="space-y-3">
                {personalityQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full text-left p-4 border border-finbaba-accent hover:bg-finbaba-accent/10 transition text-finbaba-text font-raleway"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>
              <div className="text-center mb-10">
                <h2 className="text-2xl font-cormorant font-bold text-finbaba-text mb-3">
                  Your Financial Spirit Animal is:
                </h2>
                <div className="text-5xl mb-2">{personalityResult?.emoji}</div>
                <p className="text-2xl font-bold text-finbaba-accent mb-4 font-cormorant">{personalityResult?.type}</p>
                <p className="text-lg text-finbaba-text mb-8 font-raleway">{personalityResult?.description}</p>
                
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="bg-finbaba-accent/20 px-3 py-1 text-finbaba-text rounded-full text-sm font-raleway">
                    Risk Appetite: {personalityResult?.riskAppetite}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-finbaba-text mb-4 text-center font-cormorant">
                Your Financial Tarot Suggestion
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-5 border border-finbaba-accent bg-finbaba-accent/10">
                  <h4 className="font-bold text-finbaba-text mb-2 font-cormorant">The Risk-Taker Path</h4>
                  <p className="text-finbaba-text font-raleway">{getRiskyPathAdvice()}</p>
                </div>
                
                <div className="p-5 border border-finbaba-accent bg-finbaba-accent/10">
                  <h4 className="font-bold text-finbaba-text mb-2 font-cormorant">The Safe Path</h4>
                  <p className="text-finbaba-text font-raleway">{getSafePathAdvice()}</p>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={restartTest}
                  className="bg-finbaba-text text-finbaba-bg py-2 px-6 hover:bg-opacity-90 transition font-raleway"
                >
                  Retake Test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalityTestPage;
