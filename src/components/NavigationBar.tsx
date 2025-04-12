
import React from 'react';
import { Link } from 'react-router-dom';
import { getUserData } from '../services/localStorageService';

const NavigationBar: React.FC = () => {
  const userData = getUserData();
  const isLoggedIn = userData.isSignedUp;
  
  return (
    <nav className="sticky top-0 z-50 py-4 px-6 md:px-12 bg-finbaba-bg/80 backdrop-blur-md border-b border-finbaba-accent/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="font-poppins text-2xl font-bold text-finbaba-text">
            Fin Baba
          </Link>
        </div>
        
        <div className="flex gap-6 items-center">
          {isLoggedIn && (
            <>
              <Link to="/personality-test" className="text-finbaba-text hover:text-finbaba-accent transition font-raleway">
                Personality Assessment
              </Link>
              <Link to="/investment-history" className="text-finbaba-text hover:text-finbaba-accent transition font-raleway">
                Investment History
              </Link>
              <Link to="/goal-setting" className="text-finbaba-text hover:text-finbaba-accent transition font-raleway">
                Goal Setting
              </Link>
            </>
          )}
          <Link to="/privacy-policy" className="text-finbaba-text hover:text-finbaba-accent transition font-raleway">
            Privacy Policy
          </Link>
          <Link to="/ai-advisor" className="text-finbaba-text hover:text-finbaba-accent transition font-medium font-raleway">
            AI Financial Advisor
          </Link>
          {isLoggedIn ? (
            <span className="text-finbaba-text font-raleway">
              Hi, {userData.name.split(' ')[0]}
            </span>
          ) : (
            <Link 
              to="/signup" 
              className="px-4 py-2 bg-finbaba-text text-finbaba-bg font-medium hover:bg-opacity-90 transition font-raleway"
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
