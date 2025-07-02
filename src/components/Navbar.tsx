
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Home, User, MessageSquare } from "lucide-react";

export default function Navbar() {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/chat", icon: MessageSquare, label: "chat" },
    { path: "/profile", icon: User, label: "profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{t(item.label)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
