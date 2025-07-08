import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#007bff' 
}) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div 
        className="spinner-circle" 
        style={{ borderTopColor: color }}
      />
      <span className="loading-text">Cargando...</span>
    </div>
  );
};

export default LoadingSpinner;
