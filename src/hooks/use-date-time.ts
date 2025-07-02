
import { useState, useEffect } from 'react';

export function useDateTime() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return currentDate;
}
