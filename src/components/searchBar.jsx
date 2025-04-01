import React, { useState, useEffect } from 'react';
import { SearchIcon, X } from "lucide-react";
import pic from '../assets/images/pic.jpg'

const SearchBar = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all users when component mounts
    useEffect(() => {
        const fetchAllUsers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://euloges.onrender.com/getUsers', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // or your auth token
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setAllUsers(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching users:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllUsers();
    }, []);
    // Handle search input change
    const handleInputChange = (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        handleSearch(searchQuery);
    };

    // Perform search on local data (already fetched)
    const handleSearch = (searchQuery) => {
        if (searchQuery) {
            const filteredResults = allUsers.filter((user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setResults(filteredResults);
        } else {
            setResults([]);
        }
    };

    // Handle form submission (optional - if you want to do server-side search)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (query) {
            handleSearch(query);
        }
    };

    return (
        <div className="fixed inset-0 h-full flex items-center justify-center z-50">
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

            {/* Modal content */}
            <div className="relative text-white border-white bg-black p-5 rounded-xl shadow-lg md:w-[65vw] lg:w-[75vw] w-[90vw] max-w-2xl h-[90vh] sm:h-[80vh] overflow-y-auto mt-10 flex flex-col items-center">
                <button onClick={onClose} className="absolute top-2 right-2">
                    <X size={24} />
                </button>

                {/* Search Input */}
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

                {/* Loading and error states */}
                {isLoading && <p className="text-gray-400 mt-4">Loading users...</p>}
                {error && <p className="text-red-400 mt-4">Error: {error}</p>}

                {/* Search Results */}
                <div className="w-full mt-5 px-5">
                    {results.length > 0 ? (
                        <ul className="space-y-4">
                            {results.map((user, index) => (
                                <li key={index} className="flex items-center space-x-5 border-b border-slate-400 p-3 rounded-lg">

                                    <div className=" aspect-square w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-16 lg:h-16 xl:w-20 xl:h-20">
                                        <img
                                            src={user?.profilePicture || (user?.id && localStorage.getItem(`profilePicture_${user.id}`)) || '/default-avatar.png'}
                                            alt="profile"
                                            className="inset-0 w-full h-full rounded-full object-cover border-2 border-white/80 shadow-sm"
                                           
                                        />
                                    </div>

                                    <div>
                                        <span className="text-lg block">{user.name}</span>
                                        <span className="text-sm text-gray-400">
                                            Followers: {user.fc1Lioners?.length || 0} • Following: {user.fc2Lioning?.length || 0}
                                        </span>
                                    </div>
                                </li>
                            ))}
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