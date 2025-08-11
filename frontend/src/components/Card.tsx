import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = true }: CardProps) {
  const baseClasses = 'bg-white rounded-2xl shadow-soft transition-all duration-300';
  const hoverClasses = hover ? 'hover:shadow-medium hover:-translate-y-1' : '';
  const clickClasses = onClick ? 'cursor-pointer active:scale-95' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
} 