
import React from 'react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  linkTo: string;
  buttonText?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  image, 
  linkTo,
  buttonText = "Click Here" 
}) => {
  return (
    <div className="bg-finbaba-accent p-6 flex flex-col h-full">
      <div className="mb-4 h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-cormorant text-finbaba-text font-bold mb-2">{title}</h3>
      <p className="text-finbaba-text mb-4 flex-grow font-raleway">{description}</p>
      <Link 
        to={linkTo}
        className="mt-auto bg-finbaba-text text-finbaba-bg py-2 px-4 inline-block text-center hover:bg-opacity-90 transition"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default FeatureCard;
