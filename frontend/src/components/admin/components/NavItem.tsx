import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem = ({ icon, label, to, active = false }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center p-2 sm:p-3 rounded-lg transition-colors touch-manipulation min-h-[44px] ${
          isActive || active 
            ? 'bg-blue-100 text-blue-600' 
            : 'text-gray-700 hover:bg-gray-200'
        }`
      }
    >
      <span className="mr-2 sm:mr-3 flex-shrink-0">{icon}</span>
      <span className="font-medium text-sm sm:text-base truncate">{label}</span>
    </NavLink>
  );
};

export default NavItem;