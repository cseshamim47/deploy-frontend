interface EmptyStateProps {
   message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
   return (
      <div className="flex flex-col items-center">
         <div className="w-32 h-32  rounded-lg flex items-center justify-center">
            <div className=" text-6xl">📋</div>
         </div>
         <p className="mt-4 bg-yellow-100 dark:bg-yellow-700 text-yellow-600 dark:text-yellow-300 text-sm font-medium px-4 py-2 rounded-lg">
            {message}
         </p>
      </div>
   );
}
