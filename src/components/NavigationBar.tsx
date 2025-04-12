
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserData } from '../services/localStorageService';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const NavigationBar: React.FC = () => {
  const userData = getUserData();
  const isLoggedIn = userData.isSignedUp;
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <nav className="sticky top-0 z-50 py-4 px-6 md:px-12 bg-finbaba-bg/80 backdrop-blur-md border-b border-finbaba-accent/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="font-poppins text-2xl font-bold text-finbaba-text">
            {isMobile ? "FAS SABAR" : "Fin Baba"}
          </Link>
        </div>
        
        {isMobile ? (
          <>
            <button 
              onClick={toggleMenu}
              className="text-finbaba-text p-1"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {isMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-finbaba-bg shadow-lg z-50">
                <div className="flex flex-col p-4">
                  {isLoggedIn && (
                    <>
                      <Link 
                        to="/personality-test" 
                        className="py-2 text-finbaba-text hover:text-finbaba-accent transition font-raleway"
                        onClick={toggleMenu}
                      >
                        Personality Assessment
                      </Link>
                      <Link 
                        to="/investment-history" 
                        className="py-2 text-finbaba-text hover:text-finbaba-accent transition font-raleway"
                        onClick={toggleMenu}
                      >
                        Investment History
                      </Link>
                      <Link 
                        to="/goal-setting" 
                        className="py-2 text-finbaba-text hover:text-finbaba-accent transition font-raleway"
                        onClick={toggleMenu}
                      >
                        Goal Setting
                      </Link>
                    </>
                  )}
                  <Link 
                    to="/privacy-policy" 
                    className="py-2 text-finbaba-text hover:text-finbaba-accent transition font-raleway"
                    onClick={toggleMenu}
                  >
                    Privacy Policy
                  </Link>
                  <Link 
                    to="/ai-advisor" 
                    className="py-2 text-finbaba-text hover:text-finbaba-accent transition font-medium font-raleway"
                    onClick={toggleMenu}
                  >
                    AI Financial Advisor
                  </Link>
                  {isLoggedIn ? (
                    <span className="py-2 text-finbaba-text font-raleway">
                      Hi, {userData.name.split(' ')[0]}
                    </span>
                  ) : (
                    <Link 
                      to="/signup" 
                      className="py-2 px-4 mt-2 bg-finbaba-text text-finbaba-bg font-medium hover:bg-opacity-90 transition font-raleway inline-block"
                      onClick={toggleMenu}
                    >
                      Sign Up
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
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
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
