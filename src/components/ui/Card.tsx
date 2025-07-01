import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'gradient';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
}) => {
  const baseStyles = 'rounded-xl p-5 bg-dark-100 text-light-100';
  
  const variantStyles = {
    default: '',
    interactive: 'hover:shadow-glow cursor-pointer transition-all duration-300 hover:scale-[1.01]',
    gradient: 'bg-gradient-to-br from-dark-100 to-dark-200 border border-gray-700',
  };
  
  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;