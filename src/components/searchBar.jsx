import React, { useState } from 'react';
import { SearchIcon, X } from "lucide-react";
import pic from '../assets/images/pic.jpg'

const SearchBar = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    // Array with names and images
    const people = [
        { name: "Alice Johnson", image: pic },
        { name: "Bob Smith", image: pic },
        { name: "Charlie Brown", image: pic },
        { name: "Diana Prince", image: pic },
        { name: "Edward Norton", image: pic },
    ];

    // Handle search input change
    const handleInputChange = (e) => {
        setQuery(e.target.value);
        handleSearch(e.target.value);
    };

    // Perform search
    const handleSearch = (searchQuery) => {
        if (searchQuery) {
            const filteredResults = people.filter((person) =>
                person.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setResults(filteredResults);
        } else {
            setResults([]);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (query) {
            console.log("Search query:", query);
            fetch(`https://your-backend-url.com/search?query=${query}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then((response) => response.json())
                .then((data) => console.log("Search results:", data))
                .catch((error) => console.error("Error:", error));
        } else {
            console.log("No search query entered");
        }
    };

    return (
        <div className="fixed inset-0 h-full flex items-center justify-center z-50">
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

            {/* Modal content */}
            <div className="relative  text-white border-white bg-black p-5 rounded-xl shadow-lg md:w-[65vw] lg:w-[75vw] w-[90vw] max-w-2xl h-[90vh] sm:h-[80vh] overflow-y-auto mt-10 flex flex-col items-center ">

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

                {/* Search Results */}
                <div className="w-full mt-5 px-5">
                    {results.length > 0 ? (
                        <ul className="space-y-4">
                            {results.map((person, index) => (
                                <li key={index} className="flex items-center border-b border-slate-400  p-3 rounded-lg">
                                    <img src={person.image} alt={person.name} className="w-12 h-12 rounded-full mr-3" />
                                    <span className="text-lg">{person.name}</span>
                                </li>
                            ))}
                        </ul>
                    ) : query ? (
                        <p className="text-gray-400 mt-4">No results found.</p>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
