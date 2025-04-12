
// User data interface
export interface UserData {
  name: string;
  mobileNumber: string;
  dob?: string;
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
const GOAL_SETTING_KEY = "finbaba_goal_setting";

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

// Goal setting interface
export interface GoalSetting {
  goal: string;
  goalType: string;
  goalAmount: number;
  timeFrame: number;
  currentSavings: number;
  monthlySalary: number;
  monthlyTarget: number;
  tasks: string[];
  suggestion: string;
}

// Get goal setting data
export const getGoalSetting = (): GoalSetting | null => {
  const storedData = localStorage.getItem(GOAL_SETTING_KEY);
  if (storedData) {
    return JSON.parse(storedData);
  }
  return null;
};

// Save goal setting data
export const saveGoalSetting = (goalData: GoalSetting): void => {
  localStorage.setItem(GOAL_SETTING_KEY, JSON.stringify(goalData));
};
