import { NavLink, useLocation } from "react-router-dom";
import { Home, List, Heart, BookImage } from "lucide-react";

const items = [
  { to: "/dashboard", icon: Home, label: "Accueil" },
  { to: "/challenges", icon: List, label: "Défis" },
  { to: "/feed", icon: Heart, label: "Souvenirs" },
  { to: "/album", icon: BookImage, label: "Album" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50">
      <div className="max-w-lg mx-auto flex justify-around py-2">
        {items.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "fill-primary/20" : ""}`} />
              <span className="text-[10px] font-body">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
