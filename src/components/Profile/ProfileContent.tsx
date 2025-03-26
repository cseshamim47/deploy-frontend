"use client"

import RightInfoBlocks from '@/components/Profile/RightInfoBlocks';
import React, { useState } from 'react';
import ProfileDetails from './ProfileDetails';


const ProfileContent: React.FC = () => {
   const [profileData, setProfileData] = useState({
      name: 'Shourav Rahman',
      email: 'shourav360d@gmail.com',
      mobile: '+880 1818740883',
      address: 'Not Provided',
   });

   const handleUpdate = (field: string, value: string) => {
      setProfileData((prevState) => ({
         ...prevState,
         [field]: value,
      }));
   };

   return (

      <div className=" mx-auto  grid  gap-6">
         <ProfileDetails profileData={profileData} onUpdate={handleUpdate} />
         <RightInfoBlocks />
      </div>

   );
};

export default ProfileContent;
