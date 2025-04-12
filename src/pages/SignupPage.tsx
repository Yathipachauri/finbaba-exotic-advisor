
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserData } from '../services/localStorageService';
import NavigationBar from '../components/NavigationBar';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    currentSalary: '',
    currentSavings: '',
    currentInvestment: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }
    
    if (!formData.currentSalary.trim()) {
      newErrors.currentSalary = "Current salary is required";
    } else if (isNaN(Number(formData.currentSalary)) || Number(formData.currentSalary) < 0) {
      newErrors.currentSalary = "Please enter a valid amount";
    }
    
    if (!formData.currentSavings.trim()) {
      newErrors.currentSavings = "Current savings is required";
    } else if (isNaN(Number(formData.currentSavings)) || Number(formData.currentSavings) < 0) {
      newErrors.currentSavings = "Please enter a valid amount";
    }
    
    if (!formData.currentInvestment.trim()) {
      newErrors.currentInvestment = "Current investment is required";
    } else if (isNaN(Number(formData.currentInvestment)) || Number(formData.currentInvestment) < 0) {
      newErrors.currentInvestment = "Please enter a valid amount";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save user data
      saveUserData({
        name: formData.name,
        mobileNumber: formData.mobileNumber,
        currentSalary: Number(formData.currentSalary),
        currentSavings: Number(formData.currentSavings),
        currentInvestment: Number(formData.currentInvestment),
        isSignedUp: true
      });
      
      // Redirect to home page
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-finbaba-bg">
      <NavigationBar />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-3xl font-playfair font-bold text-finbaba-text mb-8 text-center">
          Join Fin Baba
        </h1>
        
        <div className="bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-finbaba-text mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-finbaba-accent focus:outline-none focus:ring-1 focus:ring-finbaba-text"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="mobileNumber" className="block text-finbaba-text mb-1">Mobile Number</label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10 digit number"
                className="w-full p-2 border border-finbaba-accent focus:outline-none focus:ring-1 focus:ring-finbaba-text"
              />
              {errors.mobileNumber && <p className="text-red-600 text-sm mt-1">{errors.mobileNumber}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="currentSalary" className="block text-finbaba-text mb-1">Current Salary (approx.)</label>
              <input
                type="number"
                id="currentSalary"
                name="currentSalary"
                value={formData.currentSalary}
                onChange={handleChange}
                placeholder="₹"
                className="w-full p-2 border border-finbaba-accent focus:outline-none focus:ring-1 focus:ring-finbaba-text"
              />
              {errors.currentSalary && <p className="text-red-600 text-sm mt-1">{errors.currentSalary}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="currentSavings" className="block text-finbaba-text mb-1">Current Savings (approx.)</label>
              <input
                type="number"
                id="currentSavings"
                name="currentSavings"
                value={formData.currentSavings}
                onChange={handleChange}
                placeholder="₹"
                className="w-full p-2 border border-finbaba-accent focus:outline-none focus:ring-1 focus:ring-finbaba-text"
              />
              {errors.currentSavings && <p className="text-red-600 text-sm mt-1">{errors.currentSavings}</p>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="currentInvestment" className="block text-finbaba-text mb-1">Current Investment (approx.)</label>
              <input
                type="number"
                id="currentInvestment"
                name="currentInvestment"
                value={formData.currentInvestment}
                onChange={handleChange}
                placeholder="₹"
                className="w-full p-2 border border-finbaba-accent focus:outline-none focus:ring-1 focus:ring-finbaba-text"
              />
              {errors.currentInvestment && <p className="text-red-600 text-sm mt-1">{errors.currentInvestment}</p>}
            </div>
            
            <button
              type="submit"
              className="w-full bg-finbaba-text text-finbaba-bg py-3 px-4 hover:bg-opacity-90 transition font-medium"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
