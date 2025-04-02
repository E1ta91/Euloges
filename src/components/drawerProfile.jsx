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
            <div className="relative aspect-square w-14 h-14 md:h-16 md:w-16">
            <img
              src={user?.profilePicture || (user?.id && localStorage.getItem(`profilePicture_${user.id}`)) || '/default-avatar.png'}
              alt="Profile"
              className="absolute inset-0 w-full h-full rounded-full object-cover border-2 border-white/80 shadow-sm"
            />
          </div>
            <p style={{ fontFamily: 'playfair' }} className='pt-4 text-lg whitespace-nowrap'> {user ? user.name : "Loading..."} </p>
        </Link>
    );
};

export default DrawerProfile