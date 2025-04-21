import axios from 'axios';
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
  const handleLogout = async () => {
    try {
        // Retrieve the access token from localStorage (or wherever it's stored)
        const accessToken = localStorage.getItem('accessToken');
    
        // Send a request to the logout endpoint with the access token in the headers
        await axios.post(
            'https://euloges.onrender.com/logout',
            {}, // Request body (empty in this case)
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Add the token to the Authorization header
                },
            }
        );

        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        localStorage.removeItem("user_[object Object]")

        // Log success message to the console
        console.log('Logout successful');

        // Show a success message to the user
        alert('Logout successfully');

        // Redirect to the login page or home page
        navigate('/');
    } catch (error) {
        console.error('Logout failed:', error);
        alert('Failed to logout. Please try again.');
    }
};

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
    } else if (label=== "Home") {
      navigate(path);
    } else if (label === 'Logout') {
      handleLogout();
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