import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const UserProfile = () => {
    const { id: userIdParam } = useParams();
    const { user: contextUser, updateUserProfile } = useUser();
    const [profileUser, setProfileUser] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [editData, setEditData] = useState({
        name: '',
        email: '',
        dateOfBirth: '',
        profilePicture: '/default-avatar.png',
        coverPhoto: '/default-cover.jpg',
        following: 0,
        followers: 0
    });

    // Determine if we're viewing our own profile
    const isCurrentUser = !userIdParam || (contextUser && contextUser.id === userIdParam);

    const getImageUrl = (url, defaultUrl) => {
        if (!url || url === defaultUrl) {
            return defaultUrl;
        }
        if (url.startsWith('http')) {
            return url;
        }
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

            setEditData(prev => ({
                ...prev,
                [fieldName]: imageUrl
            }));

            updateUserProfile({
                [fieldName]: imageUrl
            });

            if (profileUser?.id) {
                localStorage.setItem(`${fieldName}_${profileUser.id}`, imageUrl);
            }

            setProfileUser(prev => ({
                ...prev,
                [fieldName]: imageUrl
            }));
        } catch (error) {
            alert(`Upload failed: ${error.response?.data?.error?.message || 'Please try again'}`);
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    console.log("No token found");
                    setIsLoading(false);
                    return;
                }

                const userIdToFetch = userIdParam || (contextUser?.id || '');
                if (!userIdToFetch) {
                    throw new Error("No user ID available");
                }

                const endpoint = `https://euloges.onrender.com/getUser/${userIdToFetch}`;
                
                const response = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.data?.id) {
                    throw new Error("User data not found in response");
                }

                const userData = response.data;
                const profileKey = `profilePicture_${userData.id}`;
                const coverKey = `coverPhoto_${userData.id}`;
                const storedProfile = localStorage.getItem(profileKey);
                const storedCover = localStorage.getItem(coverKey);

                setProfileUser(userData);
                setEditData({
                    name: userData.name || '',
                    email: userData.email || '',
                    dateOfBirth: userData.dateOfBirth || '',
                    profilePicture: userData.profilePicture || storedProfile || '/default-avatar.png',
                    coverPhoto: userData.coverPhoto || storedCover || '/default-cover.jpg',
                    following: userData.following?.length || 0,
                    followers: userData.followers?.length || 0
                });

                if (userData.profilePicture && !userData.profilePicture.includes('default-avatar')) {
                    localStorage.setItem(profileKey, userData.profilePicture);
                }
                if (userData.coverPhoto && !userData.coverPhoto.includes('default-cover')) {
                    localStorage.setItem(coverKey, userData.coverPhoto);
                }

            } catch (error) {
                console.error("Error fetching user profile:", error);
                alert(`Failed to load profile: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [userIdParam, contextUser]);

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl h-[67vh] lg:h-[89vh] md:h-[85vh] bg-white mt-16 lg:mt-7 shadow-xl rounded-xl overflow-hidden">

                <div className="border-b border-gray-500">
                    <div className="flex justify-between items-center p-4">
                        <h1 className="text-black text-4xl sm:text-5xl lg:text-6xl" style={{ fontFamily: "fleur" }}>
                            E
                        </h1>
                        <div>
                            <p style={{ fontFamily: 'playfair' }} className='font-bold text-lg sm:text-xl text-gray-900'>
                                {isLoading ? "Loading..." : (profileUser ? profileUser.name : "User not found")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-40 md:h-52 bg-gray-50 relative">
                    <img
                        src={getImageUrl(editData.coverPhoto, '/default-cover.jpg')}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    {isCurrentUser && (
                        <label className="absolute bottom-2 right-2 bg-white/80 rounded-full p-2 cursor-pointer">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleImageChange(e, 'cover')} 
                                className="hidden"
                            />
                            📷
                        </label>
                    )}
                </div>

                <div className="flex items-end justify-between relative px-4 pb-4">
                    <div className="relative aspect-square w-24 h-24 sm:w-16 sm:h-16 md:w-20 -mt-12 sm:-mt-16 md:h-20 lg:w-28 lg:h-28">
                        <img
                            src={getImageUrl(editData.profilePicture, '/default-avatar.png')}
                            alt="Profile"
                            className="absolute inset-0 w-full h-full rounded-full object-cover border-2 border-white/80 shadow-sm"
                        />
                        {isCurrentUser && (
                            <label className="absolute bottom-0 right-0 bg-white/80 rounded-full p-1 cursor-pointer">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleImageChange(e, 'profile')} 
                                    className="hidden"
                                />
                                📷
                            </label>
                        )}
                    </div>
                </div>

                <div className="mt-2 lg:mt-3 px-4 lg:px-6 space-y-2">
                    <p style={{ fontFamily: 'playfair' }} className='font-bold text-lg sm:text-xl text-gray-900'>{editData.name}</p>
                    <p className="text-sm sm:text-base text-gray-600">{editData.email}</p>

                    <div className="flex mt-3 space-x-5">
                        <Link to={`/profile/${profileUser?.id}/following`} className="text-sm sm:text-base text-gray-600 hover:underline">
                            <span className="font-bold text-gray-900">{editData.following}</span> Following
                        </Link>
                        <Link to={`/profile/${profileUser?.id}/followers`} className="text-sm sm:text-base text-gray-600 hover:underline">
                            <span className="font-bold text-gray-900">{editData.followers}</span> Followers
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;