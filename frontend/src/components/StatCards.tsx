import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Waves, IndianRupee } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const dataPop = [
  { value: 40 }, { value: 30 }, { value: 45 }, { value: 60 }, { value: 55 }, { value: 70 }, { value: 85 }
];
const dataFlood = [
  { value: 20 }, { value: 15 }, { value: 25 }, { value: 40 }, { value: 35 }, { value: 50 }, { value: 45 }
];
const dataEcon = [
  { value: 100 }, { value: 120 }, { value: 90 }, { value: 150 }, { value: 200 }, { value: 180 }, { value: 250 }
];

interface StatCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  icon: LucideIcon;
  data: { value: number }[];
  colorClass: string;
  gradientFrom: string;
  gradientTo: string;
  patternId: string;
  patternType: 'dots' | 'stripes' | 'solid';
  delay: number;
}

const StatCard = ({ title, value, trend, trendValue, icon: Icon, data, colorClass, gradientFrom, gradientTo, patternId, patternType, delay }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative overflow-hidden glass-panel p-6 flex flex-col justify-between min-h-[220px]`}
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-20 pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, var(--color-${gradientFrom}), var(--color-${gradientTo}))` }}></div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-5 h-5 ${colorClass}`} />
            <h3 className="text-slate-600 font-medium">{title}</h3>
          </div>
          <div className="flex items-end gap-3">
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
              className="text-4xl font-bold text-slate-900 tracking-tight"
            >
              {value}
            </motion.span>
            <div className={`flex items-center text-sm font-medium mb-1 ${trend === 'up' ? 'text-red-400' : 'text-emerald-400'}`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {trendValue}
            </div>
          </div>
        </div>
      </div>

      <div className="h-24 w-full mt-4 -ml-2 -mr-2 -mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              {patternType === 'dots' && (
                <pattern id={patternId} patternUnits="userSpaceOnUse" width="4" height="4">
                  <circle cx="2" cy="2" r="1" fill="currentColor" className="text-slate-900/10" />
                </pattern>
              )}
              {patternType === 'stripes' && (
                <pattern id={patternId} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                  <rect width="4" height="8" fill="currentColor" className="text-slate-900/10" />
                </pattern>
              )}
              {patternType === 'solid' && (
                <linearGradient id={patternId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="currentColor" stopOpacity={0.2} />
                </linearGradient>
              )}
            </defs>
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]} 
              fill={`url(#${patternId})`}
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} className={colorClass} style={{ color: colorClass.includes('amber') ? '#F59E0B' : colorClass.includes('blue') ? '#3B82F6' : '#E11D48' }} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const StatCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard 
        title="Affected Population" 
        value="1.2M" 
        trend="up" 
        trendValue="+24% vs baseline" 
        icon={Users}
        data={dataPop}
        colorClass="text-amber-400"
        gradientFrom="amber-500/20"
        gradientTo="transparent"
        patternId="popPattern"
        patternType="dots"
        delay={0.2}
      />
      <StatCard 
        title="Avg Flood Risk" 
        value="45%" 
        trend="up" 
        trendValue="+14% this week" 
        icon={Waves}
        data={dataFlood}
        colorClass="text-blue-400"
        gradientFrom="blue-500/20"
        gradientTo="transparent"
        patternId="floodPattern"
        patternType="solid"
        delay={0.3}
      />
      <StatCard 
        title="Economic Loss Est." 
        value="₹500 Cr" 
        trend="down" 
        trendValue="-5% due to prep" 
        icon={IndianRupee}
        data={dataEcon}
        colorClass="text-rose-400"
        gradientFrom="rose-500/20"
        gradientTo="transparent"
        patternId="econPattern"
        patternType="stripes"
        delay={0.4}
      />
    </div>
  );
};

export default StatCards;
