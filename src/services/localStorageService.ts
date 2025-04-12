
// User data interface
export interface UserData {
  name: string;
  mobileNumber: string;
  currentSalary: number;
  currentSavings: number;
  currentInvestment: number;
  isSignedUp: boolean;
}

// Personality test result interface
export interface PersonalityResult {
  answers: Record<string, string>;
  type?: string;
}

// Investment history interface
export interface InvestmentHistory {
  year: number;
  amount: number;
  wasProfit: boolean;
}

// Default empty user
const defaultUser: UserData = {
  name: "",
  mobileNumber: "",
  currentSalary: 0,
  currentSavings: 0,
  currentInvestment: 0,
  isSignedUp: false
};

// Local storage keys
const USER_DATA_KEY = "finbaba_user_data";
const PERSONALITY_DATA_KEY = "finbaba_personality_data";
const INVESTMENT_HISTORY_KEY = "finbaba_investment_history";

// Get user data from local storage
export const getUserData = (): UserData => {
  const storedData = localStorage.getItem(USER_DATA_KEY);
  if (storedData) {
    return JSON.parse(storedData);
  }
  return defaultUser;
};

// Save user data to local storage
export const saveUserData = (userData: UserData): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify({
    ...userData,
    isSignedUp: true
  }));
};

// Check if user is signed up
export const isUserSignedUp = (): boolean => {
  const userData = getUserData();
  return userData.isSignedUp;
};

// Get personality test results
export const getPersonalityResult = (): PersonalityResult | null => {
  const storedData = localStorage.getItem(PERSONALITY_DATA_KEY);
  if (storedData) {
    return JSON.parse(storedData);
  }
  return null;
};

// Save personality test results
export const savePersonalityResult = (result: PersonalityResult): void => {
  localStorage.setItem(PERSONALITY_DATA_KEY, JSON.stringify(result));
};

// Get investment history
export const getInvestmentHistory = (): InvestmentHistory[] => {
  const storedData = localStorage.getItem(INVESTMENT_HISTORY_KEY);
  if (storedData) {
    return JSON.parse(storedData);
  }
  return [];
};

// Save investment history
export const saveInvestmentHistory = (history: InvestmentHistory[]): void => {
  localStorage.setItem(INVESTMENT_HISTORY_KEY, JSON.stringify(history));
};
