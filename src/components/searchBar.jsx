import React, { useState, useEffect } from 'react';
import { Plus, SearchIcon, X, Check } from "lucide-react";
import { Link } from 'react-router-dom';

const SearchBar = ({ isOpen, onClose, currentUserId }) => {
    if (!isOpen) return null;

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [followLoading, setFollowLoading] = useState(null);
    const [followedUsers, setFollowedUsers] = useState(new Set());

    // Reload followedUsers from localStorage whenever currentUserId changes
    useEffect(() => {
        try {
            const key = `followedUsers_${currentUserId}`;
            const saved = localStorage.getItem(key);
            setFollowedUsers(saved ? new Set(JSON.parse(saved)) : new Set());
        } catch (e) {
            console.error("Error loading followedUsers:", e);
            setFollowedUsers(new Set());
        }
    }, [currentUserId]);

   

    // Fetch all users when component mounts
    useEffect(() => {
        const fetchAllUsers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://euloges.onrender.com/getUsers', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                setAllUsers(data.filter(user => user?.id));
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllUsers();
    }, [currentUserId]);

    const handleInputChange = (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        handleSearch(searchQuery);
    };

    const handleSearch = (searchQuery) => {
        if (searchQuery) {
            const filteredResults = allUsers.filter((user) =>
                user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setResults(filteredResults);
        } else {
            setResults([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query) {
            handleSearch(query);
        }
    };

    const handleFollow = async (user) => {
        if (!user?.id) {
            setError('Invalid user data');
            return;
        }

        if (followedUsers.has(user.id)) {
            setError(`You are already following ${user.name}`);
            return;
        }

        setFollowLoading(user.id);
        try {
            const response = await fetch('https://euloges.onrender.com/follow', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userIdToFollow: user.id })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to follow user');
            }

            // Update with user-specific key
            setFollowedUsers(prev => {
                const newSet = new Set(prev).add(user.id);
                return newSet;
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setFollowLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 h-full flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

            <div className="relative text-white border-white bg-black p-5 rounded-xl shadow-lg md:w-[65vw] lg:w-[75vw] w-[90vw] max-w-2xl h-[90vh] sm:h-[80vh] overflow-y-auto mt-10 flex flex-col items-center">
                <button onClick={onClose} className="absolute top-2 right-2">
                    <X size={24} />
                </button>

                <form onSubmit={handleSubmit} className="relative w-full max-w-lg pt-7 flex justify-center">
                    <input
                        type="text"
                        id="search"
                        placeholder="Search"
                        value={query}
                        onChange={handleInputChange}
                        autoComplete="Search"
                        className="w-full h-12 rounded-full border outline-none border-gray-400 pl-10 sm:w-3/4 md:w-2/3 lg:w-[29rem] lg:h-[3rem] xl:w-[29rem] xl:h-[2.5rem] md:h-10"
                    />
                    <SearchIcon className="absolute top-[3.3rem] xl:top-[3rem] md:top-[3.1rem] md:left-[5.4rem] lg:left-[2rem] left-3 transform -translate-y-1/2 w-6 h-6 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-6 xl:h-6 text-gray-600" />
                </form>

                {isLoading && <p className="text-gray-400 mt-4">Loading users...</p>}
                {error && <p className="text-red-400 mt-4">Error: {error}</p>}

                <div className="w-full mt-5 px-5">
                    {results.length > 0 ? (
                        <ul className="space-y-4">
                            {results.map((user) => {
                                if (!user?.id) return null;
                                return (
                                    <li key={user.id} className="flex items-center space-x-5 border-b border-slate-400 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                                        <Link
                                            to={`/profile/${user.id}`}
                                            className="flex items-center space-x-3 md:space-x-5 w-full"
                                            onClick={onClose}
                                        >
                                            <div className="aspect-square w-12 h-12 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20">
                                                <img
                                                    src={user.profilePicture}
                                                    alt="profile"
                                                    className="inset-0 w-full h-full rounded-full object-cover border-2 border-white/80 shadow-sm"
                                                />
                                            </div>

                                            <div className="text-sm sm:text-md md:text-lg lg:text-xl xl:text-2xl block">
                                                <span>{user.name}</span>
                                            </div>
                                        </Link>

                                        <button 
                                            onClick={() => handleFollow(user)}
                                            disabled={followedUsers.has(user.id) || followLoading === user.id}
                                            className={`flex items-center lg:text-lg text-md ${
                                                followedUsers.has(user.id) 
                                                    ? "text-green-500 cursor-default" 
                                                    : "text-[#28B4F5] hover:text-[#1da1f2]"
                                            }`}
                                        >
                                            {followLoading === user.id ? (
                                                <span>Processing...</span>
                                            ) : followedUsers.has(user.id) ? (
                                                <>
                                                    <Check size={24} className="mr-1" /> Following
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={24} className="mr-1" /> Follow
                                                </>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : query && !isLoading ? (
                        <p className="text-gray-400 mt-4">No results found.</p>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;