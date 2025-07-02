import React from "react";
import { MoonStar, Sun, User } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useNavigate } from "react-router-dom";

export function PageHeader() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  return (
    <div className="sticky top-0 z-10 backdrop-blur-md flex items-center justify-between p-4 border-b border-amber-900/20" 
         style={{ backgroundColor: 'rgba(245, 230, 211, 0.8)' }}>
      <div className="flex items-center gap-2">
        <span className="text-2xl text-amber-900">ॐ</span>
        <h1 className="text-lg font-bold text-amber-900">Gita Wisdom</h1>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-amber-900/10 transition-colors text-amber-900"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <MoonStar size={18} />}
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className="p-2 rounded-full hover:bg-amber-900/10 transition-colors text-amber-900"
          aria-label="Open profile"
        >
          <User size={18} />
        </button>
      </div>
    </div>
  );
}
