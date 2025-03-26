"use client"
import React, { useState } from 'react';

interface ProfileDetailsProps {
   profileData: {
      name: string;
      email: string;
      mobile: string;
      address: string;
   };
   onUpdate: (field: string, value: string) => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profileData, onUpdate }) => {
   const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({
      name: false,
      email: false,
      mobile: false,
      address: false,
   });

   const handleEditToggle = (field: string) => {
      setIsEditing((prevState) => ({
         ...prevState,
         [field]: !prevState[field],
      }));
   };

   return (
      <div className="bg-card rounded-lg shadow p-6 w-full">
         <h2 className="text-xl font-semibold mb-2">Profile</h2>
         <p className=" mb-6">Basic Details</p>
         <div className="space-y-6">
            {['name', 'email', 'mobile', 'address'].map((field) => (
               <div key={field} className="flex justify-between items-center border-b pb-4">
                  <div>
                     <p className=" capitalize">
                        {field === 'mobile' ? 'Mobile Number' : field}
                     </p>
                     {isEditing[field] ? (
                        <input
                           type="text"
                           value={profileData[field as keyof typeof profileData]}
                           onChange={(e) => onUpdate(field, e.target.value)}
                           className="mt-1 block w-full border  rounded-md p-2 "
                        />
                     ) : (
                        <p className="">
                           {profileData[field as keyof typeof profileData]}{' '}
                           {field === 'mobile' && (
                              <span className="text-green-600 dark:text-green-400 text-sm ml-2">
                                 &#10003; Verified
                              </span>
                           )}
                        </p>
                     )}
                  </div>
                  <button
                     onClick={() => handleEditToggle(field)}
                     className="text-primary-light dark:text-primary-dark font-medium"
                  >
                     {isEditing[field] ? 'Save' : 'Edit'}
                  </button>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ProfileDetails;
