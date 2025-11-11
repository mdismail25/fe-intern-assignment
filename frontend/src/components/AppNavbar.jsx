import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Waves, LogIn, UserPlus, LayoutDashboard, User } from "lucide-react";

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className="relative px-3 py-2 rounded-xl text-sm font-medium text-white">
      {children}
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 rounded-xl bg-white/20"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
    </Link>
  );
};

export default function AppNavbar() {
  return (
    <div className="sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3">
        <div className="backdrop-blur-xl bg-black/30 border border-white/15 rounded-2xl shadow-[0_8px_30px_rgba(2,6,23,0.35)]">
          <div className="px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-semibold tracking-wide text-white">
              <Waves className="w-5 h-5" />
              OCEAN APP
            </Link>
            <nav className="flex items-center gap-1">
              <NavLink to="/login"><span className="flex items-center gap-2"><LogIn size={16}/>Login</span></NavLink>
              <NavLink to="/register"><span className="flex items-center gap-2"><UserPlus size={16}/>Register</span></NavLink>
              <NavLink to="/dashboard"><span className="flex items-center gap-2"><LayoutDashboard size={16}/>Dashboard</span></NavLink>
              <NavLink to="/profile"><span className="flex items-center gap-2"><User size={16}/>Profile</span></NavLink>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
