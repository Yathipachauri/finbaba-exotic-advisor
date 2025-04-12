
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import FeatureCard from '../components/FeatureCard';
import { isUserSignedUp, getUserData } from '../services/localStorageService';
import { Shield } from 'lucide-react';

const financialTips = [
  "The best time to start investing was yesterday. The second best time is today.",
  "An emergency fund is your financial safety net. Aim for 3-6 months of expenses.",
  "Pay yourself first: automate your savings and investments.",
  "Compound interest is the eighth wonder of the world. Start early to maximize its benefits.",
  "Diversification is key to reducing risk in your investment portfolio.",
  "Review your financial plan regularly and adjust as your life circumstances change.",
  "Tax planning should be a year-round activity, not just at tax filing time.",
  "Invest in yourself through education and skill development for the highest ROI."
];

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [dailyTip, setDailyTip] = useState('');
  
  useEffect(() => {
    // Check if user is signed up
    if (!isUserSignedUp()) {
      navigate('/signup');
    } else {
      const userData = getUserData();
      setUsername(userData.name.split(' ')[0]);
    }
    
    // Set a random daily tip
    const randomTip = financialTips[Math.floor(Math.random() * financialTips.length)];
    setDailyTip(randomTip);
  }, [navigate]);

  const features = [
    {
      title: "Investment Analysis",
      description: "Analyze your past investments to discover patterns and improve your future investment decisions.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=500",
      linkTo: "/investment-history"
    },
    {
      title: "Personality Assessment",
      description: "Discover your investor personality type and receive tailored investment strategies.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500",
      linkTo: "/personality-test"
    },
    {
      title: "Set Your Goal",
      description: "Define your financial goals and get a customized plan to achieve them.",
      image: "https://images.unsplash.com/photo-1589666564459-93cdd3ab856a?auto=format&fit=crop&q=80&w=500",
      linkTo: "/goal-setting"
    }
  ];

  return (
    <div className="min-h-screen bg-finbaba-bg flex flex-col">
      <NavigationBar />
      
      {/* Hero Section with Dark Green Background */}
      <section 
        className="bg-finbaba-text py-24 px-4 text-center bg-cover bg-center"
        style={{ backgroundImage: 'linear-gradient(rgba(52, 78, 65, 0.85), rgba(52, 78, 65, 0.95)), url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1500)' }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-cormorant font-bold text-finbaba-bg mb-4 text-shadow-glow">
            Welcome {username && <span>{username}</span>} to Fin Baba
          </h1>
          <p className="text-xl md:text-2xl text-finbaba-bg font-raleway text-shadow-sm">
            Your Personalized, AI powered Financial Advisor
          </p>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-cormorant font-bold text-finbaba-text mb-12 text-center">
            Our Flagship Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                image={feature.image}
                linkTo={feature.linkTo}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* AI Advisor Feature Section */}
      <section className="py-16 px-4 bg-finbaba-text text-finbaba-bg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-3xl font-cormorant font-bold mb-4">
              Our AI Financial Advisor
            </h2>
            <p className="text-lg font-raleway mb-6">
              Our state-of-the-art AI financial advisor analyzes your financial situation and goals to provide personalized recommendations tailored to your needs. Whether you're saving for retirement, planning a major purchase, or just want to optimize your investments, our AI advisor has you covered.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <a 
              href="/ai-advisor" 
              className="bg-finbaba-accent text-finbaba-text py-4 px-8 rounded-full text-lg font-medium hover:bg-opacity-90 transition font-raleway"
            >
              Try Now
            </a>
          </div>
        </div>
      </section>
      
      {/* Why Us Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-cormorant font-bold text-finbaba-text mb-8 text-center">
            Why Us?
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-center">
                <Shield size={120} className="text-finbaba-text" />
              </div>
            </div>
            <div className="md:w-2/3">
              <p className="text-lg font-raleway text-finbaba-text mb-4">
                At Fin Baba, we take your privacy and data security seriously. Unlike other financial platforms, we don't sell your data to any third-party financial firms for processing.
              </p>
              <p className="text-lg font-raleway text-finbaba-text mb-4">
                All your financial information remains secure and is analyzed locally, ensuring the highest level of privacy protection. We believe that your financial journey should be personal, private, and protected.
              </p>
              <p className="text-lg font-raleway text-finbaba-text">
                With Fin Baba, you can trust that your data is solely used to provide you with personalized financial insights and recommendations, helping you achieve your financial goals with peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Daily Tip Section */}
      <section className="py-16 px-4 bg-finbaba-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-cormorant font-bold text-finbaba-text mb-8 text-center">
            Daily Financial Wisdom
          </h2>
          
          <div className="p-8 bg-white shadow-lg">
            <blockquote className="text-xl italic text-finbaba-text text-center font-raleway">
              "{dailyTip}"
            </blockquote>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto bg-gray-200 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-finbaba-text font-raleway">
            Created by Prakhar, Yathi and Prasanna
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
