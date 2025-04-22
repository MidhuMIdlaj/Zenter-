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
        `flex items-center p-3 rounded-lg transition-colors ${
          isActive || active 
            ? 'bg-blue-100 text-blue-600' 
            : 'text-gray-700 hover:bg-gray-200'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

export default NavItem;