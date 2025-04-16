// components/RateLimitAlert.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface RateLimitAlertProps {
  message: string;
  resetTime?: Date;
  onClose?: () => void;
}

const RateLimitAlert: React.FC<RateLimitAlertProps> = ({ 
  message, 
  resetTime,
  onClose 
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    // If we have a reset time, calculate and update the countdown
    if (resetTime) {
      const calculateTimeRemaining = () => {
        const now = new Date();
        const diffMs = resetTime.getTime() - now.getTime();
        const diffSec = Math.max(0, Math.ceil(diffMs / 1000));
        
        setTimeRemaining(diffSec);
        
        // If time is up, dismiss the alert
        if (diffSec <= 0) {
          setVisible(false);
          if (onClose) onClose();
        }
      };
      
      // Calculate initial time
      calculateTimeRemaining();
      
      // Set up interval to update the countdown
      const interval = setInterval(calculateTimeRemaining, 1000);
      
      // Clean up on unmount
      return () => clearInterval(interval);
    }
  }, [resetTime, onClose]);
  
  // Helper to format the time remaining
  const formatTimeRemaining = (): string => {
    if (timeRemaining === null) return '';
    
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };
  
  // Don't render if not visible
  if (!visible) return null;
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Rate Limit Reached</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>{message}</p>
            {timeRemaining !== null && (
              <p className="mt-1 font-medium">
                Please try again in {formatTimeRemaining()}
              </p>
            )}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={() => {
                  setVisible(false);
                  onClose();
                }}
                className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RateLimitAlert;