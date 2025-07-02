import { createRoot } from 'react-dom/client'
import React, { useState, useEffect } from 'react'
import App from './App.tsx'
import { LoadingScreen } from './components/layout/LoadingScreen.tsx'
import './index.css'

function Main() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  // Ensure loading screen shows for at least 1.5 seconds
  useEffect(() => {
    const minLoadTime = setTimeout(() => {
      // This timer just keeps the loading screen visible for a minimum time
      // The actual completion is triggered by the LoadingScreen component
    }, 1500);

    return () => clearTimeout(minLoadTime);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingScreen onLoadComplete={handleLoadComplete} />
      ) : (
        <App />
      )}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
