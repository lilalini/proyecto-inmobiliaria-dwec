// src/components/common/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'gray';
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  icon,
  color = 'gray',
  trend,
  className = ''
}) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' }
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-lg border ${colors.border} p-5 shadow-sm hover:shadow transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
          
          {description && (
            <p className="text-sm text-gray-600 mt-2">{description}</p>
          )}
          
          {trend && (
            <div className={`text-xs mt-2 ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value >= 0 ? '↗' : '↘'} {Math.abs(trend.value)}% {trend.label}
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`${colors.bg} p-2 rounded-lg`}>
            <div className={colors.text}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;