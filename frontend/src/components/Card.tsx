import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
} 