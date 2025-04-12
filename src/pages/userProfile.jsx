import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const UserProfile = () => {
    const { id: userIdParam } = useParams();
    const { user: contextUser } = useUser();
    const [profileUser, setProfileUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        profilePicture: '/default-avatar.png',
        coverPhoto: '/default-cover.jpg',
        following: 0,
        followers: 0
    });

    const accessToken = localStorage.getItem('accessToken');

    const getImageUrl = (url, defaultUrl) => {
        if (!url || url === defaultUrl) {
            return defaultUrl;
        }
        if (url.startsWith('http')) {
            return url;
        }
        return `https://euloges.onrender.com${url.startsWith('/') ? '' : '/'}${url}`;
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                const userIdToFetch = userIdParam || (contextUser?.id || '');
                if (!userIdToFetch) {
                    throw new Error("No user ID available");
                }

                console.log('Fetching profile for user ID:', userIdToFetch); // Debug log
                console.log('Using access token:', accessToken); // Debug log

                const endpoint = `https://euloges.onrender.com/getUser/${userIdToFetch}`;
                
                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                console.log('API Response:', response.data); // Debug log

                if (!response.data?.id) {
                    throw new Error("User data not found in response");
                }

                const userData = response.data;
                
                setProfileUser(userData);
                setProfileData({
                    name: userData.name || '',
                    email: userData.email || '',
                    profilePicture: userData.profilePicture || '/default-avatar.png',
                    coverPhoto: userData.coverPhoto || '/default-cover.jpg',
                    following: userData.following?.length || 0,
                    followers: userData.followers?.length || 0
                });

                console.log('Profile data set:', { // Debug log
                    name: userData.name,
                    email: userData.email,
                    profilePicture: userData.profilePicture,
                    coverPhoto: userData.coverPhoto,
                    following: userData.following?.length,
                    followers: userData.followers?.length
                });

            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [userIdParam, contextUser, accessToken]);

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
                        src={getImageUrl(profileData.coverPhoto, '/default-cover.jpg')}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex items-end justify-between relative px-4 pb-4">
                    <div className="relative aspect-square w-24 h-24 sm:w-16 sm:h-16 md:w-20 -mt-12 sm:-mt-16 md:h-20 lg:w-28 lg:h-28">
                        <img
                            src={getImageUrl(profileData.profilePicture, '/default-avatar.png')}
                            alt="Profile"
                            className="absolute inset-0 w-full h-full rounded-full object-cover border-2 border-white/80 shadow-sm"
                        />
                    </div>
                </div>

                <div className="mt-2 lg:mt-3 px-4 lg:px-6 space-y-2">
                    <p style={{ fontFamily: 'playfair' }} className='font-bold text-lg sm:text-xl text-gray-900'>{profileData.name}</p>
                    <p className="text-sm sm:text-base text-gray-600">{profileData.email}</p>

                    <div className="flex mt-3 space-x-5">
                        <Link to={`/profile/${profileUser?.id}/following`} className="text-sm sm:text-base text-gray-600 hover:underline">
                            <span className="font-bold text-gray-900">{profileData.following}</span> Following
                        </Link>
                        <Link to={`/profile/${profileUser?.id}/followers`} className="text-sm sm:text-base text-gray-600 hover:underline">
                            <span className="font-bold text-gray-900">{profileData.followers}</span> Followers
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;