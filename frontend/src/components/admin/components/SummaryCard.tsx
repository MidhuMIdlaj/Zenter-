import React from 'react';
import { SummaryItem as SummaryItemType } from '../../../types/dashboard';

interface SummaryItemProps {
  title: string;
  value: string;
  subtitle: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ title, value, subtitle }) => (
  <div className="text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="font-bold text-lg">{value}</p>
    <p className="text-xs text-gray-500">{subtitle}</p>
  </div>
);

interface SummaryCardProps {
  items: SummaryItemType[];
}

const SummaryCard: React.FC<SummaryCardProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold mb-4">Sales Summary</h3>
      <div className="grid grid-cols-4 gap-6">
        {items.map((item, index) => (
          <SummaryItem 
            key={index}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
          />
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;