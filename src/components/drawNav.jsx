import React from 'react';
import { useNavigate } from 'react-router-dom';

const DrawNav = ({ 
  path, 
  label, 
  setIsOpen, 
  setIsModalOpen, 
  setIsNotificationModalOpen,
  setIsSearchBarModalOpen 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Close the mobile drawer first
    setIsOpen(false);
    
    // Handle different modal types
    if (label === 'Messages') {
      setIsModalOpen(true);
    } else if (label === 'Notification') {
      setIsNotificationModalOpen(true);
    } else if (label === 'Explore') {
      setIsSearchBarModalOpen(true);
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <div className="px-4 md:px-6 lg:px-10">
      <div 
        className="border-2 border-[#0F6EDB] bg-white shadow rounded-lg p-4 w-full max-w-[250px] sm:max-w-[280px] md:max-w-[300px] lg:max-w-[320px] items-center cursor-pointer transition-all duration-300 hover:shadow-md"
        onClick={handleClick}
      >
        <div className="flex space-x-4">
          <div className="h-4 rounded text-black text-sm sm:text-md md:text-lg">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawNav;