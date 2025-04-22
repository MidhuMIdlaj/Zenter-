import React, { useState } from 'react';
import { 
  Users, Package, ShoppingCart, 
  Layers, FileText, CreditCard, BarChart2, 
  ChevronDown, Plus, ChevronRight, 
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearAdminAuth } from '../../../store/AdminAuthSlice';


interface NavItemData {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  section?: string;
  subItems?: string[];
  path?: string;
  onClick?: () => void; 
}
const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate  = useNavigate()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const  handleLogout =async () => {
    try {
      console.log("Logout function called");
      let res = await dispatch(clearAdminAuth());
      console.log("Logout successful, redirecting to login page" ,res);
      navigate('/admin-login');
    } catch (error) {
      console.error( error, "Error while logging out");
    }
  }
  const navItems: NavItemData[] = [
    { 
      icon: <BarChart2 size={20} />, 
      label: 'Dashboard', 
      active: true,
      path : "/admin/dashboard"
    },
    { 
      icon: <Users size={20} />, 
      label: 'Customers Management', 
      path : "/admin/customers"
    },
    { 
      icon: <Layers size={20} />, 
      label: 'Employee management ',
      path : "/admin/employees"
    },
    { 
      icon: <ShoppingCart size={20} />, 
      label: 'Orders' 
    },
    { 
      icon: <FileText size={20} />, 
      label: 'Invoices' 
    },
    { 
      icon: <Package size={20} />, 
      label: 'Delivery',
    },
    { 
      icon: <CreditCard size={20} />, 
      label: 'Billing' 
    },
    { 
      icon: <LogOut size={20} />,
      label: 'Logout',
      onClick: handleLogout,
    }
  ];

  const goToPath = (item: NavItemData) => {
    if (item.onClick) {
      item.onClick();
      if (!item.path) return; // Don't navigate if there's no path
    }
    if (item.path) {
      console.log(item.path);
      navigate(item.path);
    }
  };

  return (
    <div className="fixed h-screen flex flex-col w-72 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 font-poppins shadow-xl z-50">
      {/* Logo/Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white"
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg"
          >
            A
          </motion.div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">argen</span>
        </div>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 180 }}
          className="text-gray-500 cursor-pointer p-1 rounded-lg hover:bg-gray-200 transition-all"
        >
          <ChevronDown size={20} strokeWidth={2} />
        </motion.div>
      </motion.div>
      
      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto sidebar-scroll">
        <nav className="px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <div key={item.label} className="mb-1">
              {item.section && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-4 mt-6 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {item.section}
                </motion.p>
              )}
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoveredItem(item.label)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <div 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200
                    ${item.active ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-700'}
                    ${hoveredItem === item.label ? 'shadow-md' : ''}
                  `}
                  onClick={() => goToPath(item)}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{
                        color: item.active ? '#2563eb' : hoveredItem === item.label ? '#3b82f6' : '#4b5563'
                      }}
                    >
                      {item.icon}
                    </motion.div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.subItems && (
                    <motion.div
                      animate={{ 
                        rotate: expandedItems[item.label] ? 90 : 0,
                        color: item.active ? '#2563eb' : '#6b7280'
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={18} />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {item.subItems && (
                <AnimatePresence>
                  {expandedItems[item.label] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-12 pt-1 space-y-1"
                    >
                      {item.subItems.map(subItem => (
                        <motion.div
                          key={subItem}
                          whileHover={{ x: 5 }}
                          className="py-2 px-3 text-sm text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
                        >
                          {subItem}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>
      </div>
      
      {/* Sticky Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-shrink-0 p-5 border-t border-gray-200 bg-white sticky bottom-0"
      >
        <motion.button
          whileHover={{ 
            scale: 1.03,
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
          }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center space-x-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>New Product</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Sidebar;