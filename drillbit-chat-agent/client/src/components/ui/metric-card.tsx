import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./card";

interface MetricCardProps {
   className?: string;
   title: string;
   value: string | number;
   icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
   className = '', 
   title, 
   value, 
   icon 
}) => {
   // Format number values with commas if needed
   const formattedValue = typeof value === 'number' 
       ? value.toLocaleString()
       : value;

   return (
       <Card className={`${className} p-6 text-white text-center rounded-md`}>
           <CardHeader className="flex flex-col items-center justify-between space-y-0 pb-2">
               {icon}
               <CardTitle className="text-sm font-medium pt-2">{title}</CardTitle>
           </CardHeader>
           <CardContent className="p-6 pt-0 pb-3">
               <div className="text-2xl font-bold">{formattedValue}</div>
           </CardContent>
       </Card>
   );
};

export { MetricCard };

// Usage example:
// import { Users } from 'lucide-react';
//
// <MetricCard
//     title="Total Users"
//     value={1234}
//     icon={<Users className="h-4 w-4" />}
//     className="bg-primary"
// />