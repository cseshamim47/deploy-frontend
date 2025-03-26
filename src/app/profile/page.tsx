"use client"
import BookingsContent from '@/components/Profile/BookingsContent';
import ProfileContent from '@/components/Profile/ProfileContent';

import ProfileSidebar from '@/components/Profile/ProfileSidebar';
import { useState } from 'react';


export default function ProfilePage() {
   const [activeSection, setActiveSection] = useState<'Profile' | 'Bookings'>('Profile');

   return (
      <div className="min-h-screen  md:p-6">
         <div className=" mx-auto rounded-lg  overflow-hidden">
            <div className="flex flex-col md:flex-row">
               <ProfileSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
               <main className="w-full md:w-2/3 p-6">
                  {activeSection === 'Profile' && <ProfileContent />}
                  {activeSection === 'Bookings' && <BookingsContent />}
               </main>
            </div>
         </div>
      </div>
   );
}
