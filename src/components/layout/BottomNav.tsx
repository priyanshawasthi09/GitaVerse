import React from "react";
import { NavLink } from "react-router-dom";
import { Home, BookOpen, Bookmark, MessageCircle, Timer } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/practice", label: "Practice", icon: Timer },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: BookOpen },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t flex justify-around py-2 z-50">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center p-2 ${
              isActive
                ? "text-primary relative after:content-[''] after:absolute after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full after:bottom-0"
                : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          <Icon size={22} />
          <span className="text-xs mt-1">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
