import { Button } from "../ui/button";

interface SidebarProps {
   activeSection: 'Profile' | 'Bookings';
   setActiveSection: (section: 'Profile' | 'Bookings') => void;
}

export default function ProfileSidebar({ activeSection, setActiveSection }: SidebarProps) {
   return (
      <aside className="w-full md:w-1/3 bg-primary-light dark:bg-primary-dark p-6">
         <div className="bg-card h-[300px] rounded-md justify-center flex flex-col items-center">
            <div className=" rounded-full w-24 h-24 flex items-center justify-center">
               <span className="text-4xl ">👤</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold">Shourav Rahman</h2>
         </div>
         <nav className="mt-6 space-y-4">
            {['Profile', 'Bookings'].map((section) => (
               <Button
                  key={section}
                  onClick={() => setActiveSection(section as 'Profile' | 'Bookings')}
                  className={`block w-full border text-center py-2 px-4 rounded-lg font-medium ${activeSection === section
                     ? ' shadow-md'
                     : ' bg-card'
                     }`}
               >
                  {section}
               </Button>
            ))}
         </nav>
      </aside>
   );
}
