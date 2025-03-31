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
            <div className="relative aspect-square w-14 h-14 sm:w-16 sm:h-16 md:w-14 md:h-14 lg:w-24 lg:h-24 xl:w-28 xl:h-28">
            <img
              src={user?.profilePicture || (user?.id && localStorage.getItem(`profilePicture_${user.id}`)) || '/default-avatar.png'}
              alt="Profile"
              className="absolute inset-0 w-full h-full rounded-full object-cover border-2 border-white/80 shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
          </div>
            <p style={{ fontFamily: 'playfair' }} className='pt-2 text-lg whitespace-nowrap'> {user ? user.name : "Loading..."} </p>
        </Link>
    );
};

export default DrawerProfile