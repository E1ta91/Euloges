import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await axios.get("https://euloges.onrender.com/getUser", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser({
        ...response.data,
        token // Include the token in the user object
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      fetchUser();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUserProfile = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  // Provide both the user object AND direct access to userId/token
  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      fetchUser, 
      updateUserProfile,
      // Direct accessors your Following component needs:
      userId: user?._id || user?.id, // Use whichever field your backend returns
      token: user?.token || localStorage.getItem("accessToken")
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);