
import React from 'react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  linkTo: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, image, linkTo }) => {
  return (
    <div className="bg-finbaba-accent p-6 flex flex-col h-full">
      <div className="mb-4 h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-playfair text-finbaba-text font-bold mb-2">{title}</h3>
      <p className="text-finbaba-text mb-4 flex-grow">{description}</p>
      <Link 
        to={linkTo}
        className="mt-auto bg-finbaba-text text-finbaba-bg py-2 px-4 inline-block text-center hover:bg-opacity-90 transition"
      >
        Click Here
      </Link>
    </div>
  );
};

export default FeatureCard;
