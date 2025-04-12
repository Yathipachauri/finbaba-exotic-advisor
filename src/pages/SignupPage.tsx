
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserData } from '../services/localStorageService';
import NavigationBar from '../components/NavigationBar';
import PrivacyPopup from '../components/PrivacyPopup';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    dob: ''
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
    
    if (!formData.dob.trim()) {
      newErrors.dob = "Date of birth is required";
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
        dob: formData.dob,
        currentSalary: 0,
        currentSavings: 0,
        currentInvestment: 0,
        isSignedUp: true
      });
      
      // Redirect to home page
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-finbaba-bg">
      <NavigationBar />
      <PrivacyPopup formName="signup" />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-3xl font-cormorant font-bold text-finbaba-text mb-8 text-center">
          Join Fin Baba
        </h1>
        
        <div className="bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-finbaba-text mb-1 font-raleway">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-finbaba-accent focus:outline-none focus:ring-1 focus:ring-finbaba-text"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1 font-raleway">{errors.name}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="mobileNumber" className="block text-finbaba-text mb-1 font-raleway">Mobile Number</label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10 digit number"
                className="w-full p-2 border border-finbaba-accent focus:outline-none focus:ring-1 focus:ring-finbaba-text"
              />
              {errors.mobileNumber && <p className="text-red-600 text-sm mt-1 font-raleway">{errors.mobileNumber}</p>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="dob" className="block text-finbaba-text mb-1 font-raleway">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-2 border border-finbaba-accent focus:outline-none focus:ring-1 focus:ring-finbaba-text"
              />
              {errors.dob && <p className="text-red-600 text-sm mt-1 font-raleway">{errors.dob}</p>}
            </div>
            
            <button
              type="submit"
              className="w-full bg-finbaba-text text-finbaba-bg py-3 px-4 hover:bg-opacity-90 transition font-medium font-raleway"
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
