import React from "react";

const RightInfoBlocks: React.FC = () => {
   const blocks = [
      {
         icon: "🔒",
         text: "Details Gobikes uses to verify your identity can’t be changed. Some personal details can be edited, but we may ask you to verify your identity the next time you book or create a listing.",
      },
      {
         icon: "👤",
         text: "Personal info that you’ve shared with us, like email, address, and options to manage it. This info is private to you.",
      },
   ];

   return (
      <div className="bg-accent rounded-lg shadow p-6 space-y-6">
         {blocks.map((block, index) => (
            <div
               key={index}
               className="w-full flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0"
            >
               <div className="p-3 bg-secondary rounded-full flex items-center justify-center">
                  <span role="img" aria-label="Icon" className="text-xl">
                     {block.icon}
                  </span>
               </div>
               <p className="text-card-foreground text-sm md:text-base">
                  {block.text}
               </p>
            </div>
         ))}
      </div>
   );
};

export default RightInfoBlocks;
