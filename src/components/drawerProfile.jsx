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
            <img src={user?.profilePicture || (user?.id && localStorage.getItem(`profilePicture_${user.id}`)) || '/default-avatar.png'} alt='img' onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                    }}  className=' w-12 h-12 bg-gray-100 rounded-full'/>
            <p style={{ fontFamily: 'playfair' }} className='pt-2 text-lg whitespace-nowrap'> {user ? user.name : "Loading..."} </p>
        </Link>
    );
};

export default DrawerProfile