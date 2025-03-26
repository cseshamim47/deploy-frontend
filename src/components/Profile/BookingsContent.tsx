import { useState } from 'react';
import EmptyState from './EmptyState';
import { Button } from '../ui/button';

export default function BookingsContent() {
   const [activeTab, setActiveTab] = useState<'Confirmed' | 'Pending' | 'Cancelled'>('Confirmed');

   const tabs = ['Confirmed', 'Pending', 'Cancelled'];

   return (
      <div>
         <h3 className="text-lg font-medium">Bookings</h3>
         <p className="text-sm mb-6">Manage your bookings.</p>
         <nav className="border-b ">
            <div className="flex space-x-4">
               {tabs.map((tab) => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab as typeof activeTab)}
                     className={`text-sm py-2 px-4 bg-transparent border-b-2 ${activeTab === tab
                        ? 'border-primary-dark '
                        : 'border-transparent hover:border-gray-500'
                        }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
         </nav>
         <div className="mt-8">
            {activeTab === 'Confirmed' && <EmptyState message="No confirmed bookings!" />}
            {activeTab === 'Pending' && <EmptyState message="No pending bookings!" />}
            {activeTab === 'Cancelled' && <EmptyState message="No cancelled bookings!" />}
         </div>
      </div>
   );
}
