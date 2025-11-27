import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
      top: 'bottom-[-4px] left-1/2 -translate-x-1/2',
      bottom: 'top-[-4px] left-1/2 -translate-x-1/2',
      left: 'right-[-4px] top-1/2 -translate-y-1/2',
      right: 'left-[-4px] top-1/2 -translate-y-1/2',
  }

  return (
    <div 
      className={`relative inline-flex items-center ${className}`} 
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-sm whitespace-nowrap dark:bg-gray-700 ${positionClasses[position]}`}>
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45 ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  );
};