import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Profile = () => {
  const { user: contextUser, updateUserProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState({
    id: '',
    name: '',
    email: '',
    dateOfBirth: '',
    profilePicture: '/default-avatar.png',
    coverPhoto: '/default-cover.jpg',
    following: 0,
    followers: 0
  });

  // Helper function to get user-specific localStorage key
  const getUserStorageKey = (key) => {
    return user?.id ? `${key}_${user.id}` : null;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("No token found");
          setIsLoading(false);
          return;
        }

        const response = await axios.get("https://euloges.onrender.com/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Raw response from server:', response.data);

        if (!response.data?.id) {
          throw new Error("User ID not found in response");
        }

        // Get user-specific stored images
        const profileKey = `profilePicture_${response.data.id}`;
        const coverKey = `coverPhoto_${response.data.id}`;
        const storedProfile = localStorage.getItem(profileKey);
        const storedCover = localStorage.getItem(coverKey);

        const userData = {
          ...response.data,
          profilePicture: response.data.profilePicture || storedProfile || '/default-avatar.png',
          coverPhoto: response.data.coverPhoto || storedCover || '/default-cover.jpg'
        };

        console.log('Processed user data with images:', userData);

        // Update both states with the same data
        setUser(userData);
        setEditData({
          id: userData.id,
          name: userData.name || '',
          email: userData.email || '',
          dateOfBirth: userData.dateOfBirth || '',
          profilePicture: userData.profilePicture,
          coverPhoto: userData.coverPhoto,
          following: userData.following || 0,
          followers: userData.followers?.length || 0
        });

        // Store the Cloudinary URLs in localStorage with user-specific keys
        if (userData.profilePicture && !userData.profilePicture.includes('default-avatar')) {
          localStorage.setItem(profileKey, userData.profilePicture);
        }
        if (userData.coverPhoto && !userData.coverPhoto.includes('default-cover')) {
          localStorage.setItem(coverKey, userData.coverPhoto);
        }

      } catch (error) {
        console.error("Error fetching user:", error);
        // Try to use stored URLs if fetch fails
        const profileKey = getUserStorageKey('profilePicture');
        const coverKey = getUserStorageKey('coverPhoto');

        setEditData(prev => ({
          ...prev,
          profilePicture: profileKey ? localStorage.getItem(profileKey) || prev.profilePicture : prev.profilePicture,
          coverPhoto: coverKey ? localStorage.getItem(coverKey) || prev.coverPhoto : prev.coverPhoto
        }));
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const getImageUrl = (url, defaultUrl) => {
    if (!url || url === defaultUrl) {
      return defaultUrl;
    }
    // If it's already a full URL (e.g., Cloudinary), use it as is
    if (url.startsWith('http')) {
      return url;
    }
    // If it's a relative URL from your backend, prepend the backend URL
    return `https://euloges.onrender.com${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'system_uploader_1e2ddab171f769b9_caf184a04c894aa697fa85573829881354');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dhywsn6jz/image/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUploading(false);
      return response.data.secure_url;
    } catch (error) {
      console.error("Upload failed:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      setUploading(false);
      throw error;
    }
  };

  const handleImageChange = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file);
      const fieldName = type === 'profile' ? 'profilePicture' : 'coverPhoto';

      // Update state with the new URL
      setEditData(prev => ({
        ...prev,
        [fieldName]: imageUrl
      }));

      // Update shared context
      updateUserProfile({
        [fieldName]: imageUrl
      });

      // Update localStorage with user-specific key
      if (user?.id) {
        localStorage.setItem(`${fieldName}_${user.id}`, imageUrl);
      }

      if (user) {
        setUser(prev => ({
          ...prev,
          [fieldName]: imageUrl
        }));
      }
    } catch (error) {
      alert(`Upload failed: ${error.response?.data?.error?.message || 'Please try again'}`);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("No authentication token found");
      window.location.href = "/login";
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', editData.email);
      formData.append('name', editData.name);
      formData.append('dateOfBirth', editData.dateOfBirth?.split('T')[0] || '');

      // Handle profile picture
      if (editData.profilePicture && editData.profilePicture !== '/default-avatar.png') {
        try {
          const profileResponse = await fetch(editData.profilePicture);
          const profileBlob = await profileResponse.blob();
          const profileFile = new File([profileBlob], 'profile.jpg', { type: 'image/jpeg' });
          formData.append('profilePicture', profileFile);
          if (user?.id) {
            localStorage.setItem(`profilePicture_${user.id}`, editData.profilePicture);
          }
        } catch (error) {

        }
      }

      // Handle cover photo
      if (editData.coverPhoto && editData.coverPhoto !== '/default-cover.jpg') {
        try {
          const coverResponse = await fetch(editData.coverPhoto);
          const coverBlob = await coverResponse.blob();
          const coverFile = new File([coverBlob], 'cover.jpg', { type: 'image/jpeg' });
          formData.append('coverPhoto', coverFile);
          if (user?.id) {
            localStorage.setItem(`coverPhoto_${user.id}`, editData.coverPhoto);
          }
        } catch (error) {
          console.error('Error processing cover photo:', error);
        }
      }

      console.log('Sending update with form data:', Object.fromEntries(formData.entries()));

      const response = await axios.patch(
        `https://euloges.onrender.com/updateUser/${editData.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Update response:', response.data);

      if (response.status === 200) {
        alert("Profile updated successfully!");
        const updatedData = {
          ...response.data,
          profilePicture: editData.profilePicture,
          coverPhoto: editData.coverPhoto
        };
        setUser(updatedData);
        setEditData(prev => ({
          ...prev,
          ...updatedData
        }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      alert(errorMessage);
    }
  };

  // Helper function to convert data URL to File object
  const urlToFile = async (url, filename) => {
    if (url.startsWith('data:')) {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl h-[67vh] lg:h-[89vh] md:h-[85vh] bg-white mt-16 lg:mt-7 shadow-xl rounded-xl overflow-hidden">

        {/* Header with logo and name */}
        <div className="border-b border-gray-500">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-black text-4xl sm:text-5xl lg:text-6xl" style={{ fontFamily: "fleur" }}>
              E
            </h1>
            <div>
              <p style={{ fontFamily: 'playfair' }} className='font-bold text-lg sm:text-xl text-gray-900'>
                {isLoading ? "Loading..." : (user ? user.name : "User not found")}
              </p>
            </div>
          </div>
        </div>

        {/* Cover photo */}
        <div className="h-40 sm:h-40 md:h-44 lg:h-48 bg-gray-50 relative">
          <img
            src={getImageUrl(editData.coverPhoto, '/default-cover.jpg')}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/default-cover.jpg';
             
            }}
          />
        </div>

        {/* Profile section */}
        <div className="flex items-end justify-between relative px-4 pb-4">

          <div className="relative aspect-square w-24 h-24 sm:w-16 sm:h-16 md:w-20 -mt-12 sm:-mt-16 md:h-20 lg:w-16 lg:h-16 xl:w-20 xl:h-20">
            <img
              src={getImageUrl(editData.profilePicture, '/default-avatar.png')}
              alt="Profile"
              className="absolute inset-0 w-full h-full rounded-full object-cover border-2 border-white/80 shadow-sm"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
          </div>
          {/* <img
            src={getImageUrl(editData.profilePicture, '/default-avatar.png')}
            alt="Profile"
            className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-white relative -mt-12 sm:-mt-16 shadow-md z-10"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
              console.log('Profile photo load error, using default');
            }}
          /> */}

          <div className="flex-1 flex justify-end">
            <button
              className="px-4 py-2 border border-gray-300 md:mt-3 rounded-full font-bold hover:bg-gray-50 text-sky-500"
              onClick={() => setIsEditing(true)}
              disabled={isLoading || !user}
            >
              {isLoading ? "Loading..." : "Edit profile"}
            </button>
          </div>
        </div>

        {/* Profile info */}
        <div className="mt-2 lg:mt-3 px-4 lg:px-6 space-y-2">
          <p style={{ fontFamily: 'playfair' }} className='font-bold text-lg sm:text-xl text-gray-900'>{editData.name}</p>
          <p className="text-sm sm:text-base text-gray-600">{editData.email}</p>

          <div className="flex mt-3 space-x-5">
            <Link to="/following" className="text-sm sm:text-base text-gray-600 hover:underline">
              <span className="font-bold text-gray-900">{editData.following}</span> Following
            </Link>
            <Link to="/followers" className="text-sm sm:text-base text-gray-600 hover:underline">
              <span className="font-bold text-gray-900">{editData.followers}</span> Followers
            </Link>
          </div>
        </div>

        {/* Edit modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-lg sm:max-w-2xl mx-4 sm:mx-auto h-[90vh] sm:h-[96vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>

                {uploading && (
                  <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
                    Uploading image, please wait...
                  </div>
                )}

                <div className='space-y-6 sm:space-y-8'>

                  {/* Cover photo upload */}
                  <div className="relative">
                    <div className="h-32 sm:h-40 md:h-44 lg:h-48 bg-gray-100 rounded-lg overflow-hidden mb-2">
                      <img
                        src={getImageUrl(editData.coverPhoto, '/default-cover.jpg')}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <label className="inline-block bg-blue-500 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md cursor-pointer hover:bg-blue-600 transition-colors duration-200">
                      Change Cover Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'coverPhoto')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Profile picture upload */}
                  <div className="">
                    <img
                      src={getImageUrl(editData.profilePicture, '/default-avatar.png')}
                      alt="Edit Profile"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 mb-4 object-cover"
                    />
                    <label className="inline-block bg-blue-500 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md cursor-pointer hover:bg-blue-600 transition-colors duration-200">
                      Change Profile Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'profile')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Form fields */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:space-x-6">
                    <input
                      type="text"
                      className="w-full p-2 border rounded text-sm sm:text-base"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      className="w-full p-2 border rounded text-sm sm:text-base"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      placeholder="Email"
                    />
                    <input
                      type="date"
                      value={editData.dateOfBirth?.split('T')[0] || ''}
                      onChange={(e) => {
                        setEditData({
                          ...editData,
                          dateOfBirth: e.target.value ? new Date(e.target.value).toISOString() : null
                        });
                      }}
                      className="w-full p-2 border rounded text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                    onClick={handleSave}
                    disabled={uploading || !user?.id}
                  >
                    {uploading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;