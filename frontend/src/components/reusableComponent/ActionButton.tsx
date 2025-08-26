import { motion } from "framer-motion";
import { FC } from "react";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ElementType;
  className?: string;
}

const ActionButton: FC<ActionButtonProps> = ({ label, onClick, icon: Icon, className = "" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all ${className}`}
    >
      {Icon && <Icon size={18} strokeWidth={2.5} />}
      <span>{label}</span>
    </motion.button>
  );
};

export default ActionButton;
