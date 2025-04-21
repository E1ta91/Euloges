import React from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

const DrawerProfile = () => {
    const { user, loading } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Link to={'/profile'} className='text-black flex space-x-5 pt-12 pl-5 '>
            <div className="aspect-square w-14 h-14 md:h-16 md:w-16">
                        {loading ? (
                            <div className="w-full h-full rounded-full bg-gray-200 animate-pulse"></div>
                        ) : (
                            <img
                                src={user.profilePicture || '/default-avatar.png'}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-2 border-white/80 shadow-sm"
                            />
                        )}
                    </div>
                    <p style={{ fontFamily: 'playfair' }} className='text-base pt-4 lg:text-lg'>
                        {loading ? "Loading..." : user.name || "Guest"}
                    </p>
        </Link>
    );
};

export default DrawerProfile