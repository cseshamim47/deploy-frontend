import Link from "next/link"

import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/admin/data-table"

async function getUsers() {
   //fetch users.
   return [
      { id: 1, name: "John Doe", email: "john@example.com", role: "user" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin" },
   ]
}

export default async function UsersPage() {
   const users = await getUsers()

   return (
      <div className="space-y-4">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Users</h1>
            {/* <Link href="/admin/users/add">
               <Button>Add New User</Button>
            </Link> */}
         </div>
         <DataTable columns={columns} data={users} />
      </div>
   )
}
