// components/RefreshButton.tsx
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { FC } from "react";

interface RefreshButtonProps {
  onClick: () => void;
  isRefreshing: boolean;
  title?: string;
}

const RefreshButton: FC<RefreshButtonProps> = ({ onClick, isRefreshing, title }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      title={title}
      className={`flex items-center gap-2 p-2 rounded-full ${
        isRefreshing
          ? "text-blue-600"
          : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
      }`}
    >
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : {}}
        transition={{
          duration: 1,
          repeat: isRefreshing ? Infinity : 0,
          ease: "linear",
        }}
      >
        <RefreshCw size={18} />
      </motion.div>
    </motion.button>
  );
};

export default RefreshButton;
