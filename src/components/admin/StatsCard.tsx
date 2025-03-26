import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
   title: string;
   value: string | number;
   icon: React.ReactNode;
   trend: string;
   className?: string;
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
   return (
      <Card className={className}>
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
         </CardHeader>
         <CardContent>
            <div className="flex flex-col space-y-1">
               <div className="text-2xl font-bold">{value}</div>
            </div>
         </CardContent>
      </Card>
   );
}
