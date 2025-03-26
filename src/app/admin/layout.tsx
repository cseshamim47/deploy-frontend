
import { Sidebar } from "@/components/admin/sidebar"



export default function AdminLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <div className="min-h-screen bg-background flex">
         <Sidebar />
         <div className="flex-1 flex flex-col">
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
               <div className="max-w-7xl mx-auto">
                  {children}
               </div>
            </main>
         </div>
      </div>
   )
}
