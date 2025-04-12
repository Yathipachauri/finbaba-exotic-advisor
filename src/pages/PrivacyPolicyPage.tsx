
import React from 'react';
import NavigationBar from '../components/NavigationBar';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-finbaba-bg">
      <NavigationBar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-playfair font-bold text-finbaba-text mb-8 text-center">
          Privacy Policy
        </h1>
        
        <div className="bg-white p-8 shadow-lg">
          <div className="prose prose-lg max-w-none text-finbaba-text">
            <h2 className="font-playfair text-finbaba-text text-2xl mb-4">Information We Collect</h2>
            <p>
              Fin Baba collects personal information that you voluntarily provide when using our services. 
              This includes your name, contact information, financial details, and investment history. 
              All data is stored locally on your device and is not transmitted to our servers.
            </p>
            
            <h2 className="font-playfair text-finbaba-text text-2xl mb-4 mt-8">How We Use Your Information</h2>
            <p>
              The information you provide is used solely to personalize your experience with Fin Baba's AI financial advisor.
              Your data helps us tailor investment suggestions and financial advice to your specific circumstances.
            </p>
            
            <h2 className="font-playfair text-finbaba-text text-2xl mb-4 mt-8">Data Security</h2>
            <p>
              Since your data is stored locally on your device using browser local storage, you maintain control over your information.
              We recommend using a secure device and keeping your browser updated to ensure data protection.
            </p>
            
            <h2 className="font-playfair text-finbaba-text text-2xl mb-4 mt-8">Your Rights</h2>
            <p>
              You can access, modify, or delete your personal information at any time by clearing your browser's local storage.
              This application does not track your usage or share your data with third parties.
            </p>
            
            <h2 className="font-playfair text-finbaba-text text-2xl mb-4 mt-8">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact our team at privacy@finbaba.example.com.
            </p>
            
            <div className="mt-8 text-sm">
              <p>Last updated: April 12, 2025</p>
              <p>Created by Prakhar, Yathi and Prassanna</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
