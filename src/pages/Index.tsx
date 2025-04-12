
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import FeatureCard from '../components/FeatureCard';
import { isUserSignedUp, getUserData } from '../services/localStorageService';

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
      title: "AI Financial Advisor",
      description: "Get personalized financial advice based on your unique financial situation and goals.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500",
      linkTo: "/ai-advisor"
    },
    {
      title: "Personality Assessment",
      description: "Discover your investor personality type and receive tailored investment strategies.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=500",
      linkTo: "/personality-test"
    },
    {
      title: "Investment History Analysis",
      description: "Track and analyze your investment performance over time to optimize your strategy.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500",
      linkTo: "/investment-history"
    }
  ];

  return (
    <div className="min-h-screen bg-finbaba-bg flex flex-col">
      <NavigationBar />
      
      {/* Hero Section with Gradient */}
      <section className="bg-gradient-to-b from-finbaba-bg via-finbaba-accent to-finbaba-text py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-finbaba-bg mb-4">
            Welcome {username && <span>{username}</span>} to Fin Baba
          </h1>
          <p className="text-xl md:text-2xl text-finbaba-bg">
            Your Personalized, AI powered Financial Advisor
          </p>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-playfair font-bold text-finbaba-text mb-12 text-center">
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
      
      {/* Daily Tip Section */}
      <section className="py-16 px-4 bg-finbaba-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-playfair font-bold text-finbaba-text mb-8 text-center">
            Daily Financial Wisdom
          </h2>
          
          <div className="p-8 bg-white shadow-lg">
            <blockquote className="text-xl italic text-finbaba-text text-center">
              "{dailyTip}"
            </blockquote>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto bg-gray-200 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-finbaba-text">
            Created by Prakhar, Yathi and Prassanna
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
