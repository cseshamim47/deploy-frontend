import Link from 'next/link'
import { Users, Bike, LocateIcon, Tag, Home } from 'lucide-react'
import { FaGears } from 'react-icons/fa6'

export function Sidebar() {
   return (
      <aside className="w-64 bg-card text-card-foreground p-4">
         <nav className="space-y-2">
            <Link href="/admin" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary hover:text-primary-foreground">
               <Home size={20} />
               <span>Dashboard</span>
            </Link>
            <Link href="/admin/users" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary hover:text-primary-foreground">
               <Users size={20} />
               <span>Users</span>
            </Link>
            <Link href="/admin/bikes" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary hover:text-primary-foreground">
               <Bike size={20} />
               <span>Bikes</span>
            </Link>
            <Link href="/admin/coupons" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary hover:text-primary-foreground">
               <Tag size={20} />
               <span>Coupons</span>
            </Link>
            <Link href="/admin/locations" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary hover:text-primary-foreground">
               <LocateIcon size={20} />
               <span>Locations</span>
            </Link>
            <Link href="/admin/services" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary hover:text-primary-foreground">
               <FaGears size={20} />
               <span>Service</span>
            </Link>
         </nav>
      </aside>
   )
}
