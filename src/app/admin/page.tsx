import { OrdersTable } from '@/components/admin/OrdersTable';
import { StatsCard } from '@/components/admin/StatsCard';
import { Users, Bike, Tag, LineChart } from 'lucide-react';
import Link from 'next/link';
export interface AdminStats {
   totalUsers: number;
   totalBikes: number;
   activeCoupons: number;
   revenue: number;
}

async function getAdminStats(): Promise<AdminStats> {
   return {
      totalUsers: 1250,
      totalBikes: 75,
      activeCoupons: 8,
      revenue: 25000
   };
}

export default async function AdminDashboard() {
   const stats = await getAdminStats();

   return (
      <div className="space-y-8">
         <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <div className="flex items-center space-x-2">
               <Link href="/admin/reports">
                  <span className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                     View Reports
                  </span>
               </Link>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4">
            <StatsCard
               title="Total Users"
               value={stats.totalUsers}
               icon={<Users className="h-4 w-4 text-muted-foreground" />}
               trend="+12.5%"
            />
            <StatsCard
               title="Total Bikes"
               value={stats.totalBikes}
               icon={<Bike className="h-4 w-4 text-muted-foreground" />}
               trend="+4.3%"
            />
            <StatsCard
               title="Active Coupons"
               value={stats.activeCoupons}
               icon={<Tag className="h-4 w-4 text-muted-foreground" />}
               trend="+2"
            />
            <StatsCard
               title="Revenue"
               value={`₹${stats.revenue}`}
               icon={<LineChart className="h-4 w-4 text-muted-foreground" />}
               trend="+15.2%"
            />
         </div>

         {/* Orders Table Component */}
         <OrdersTable />
      </div>
   );
}
