import { Link, NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import K from '../constants';
import Drawer from './drawer';
import DrawNav from './drawNav';
import DrawerProfile from './drawerProfile';
import MessageModal from './messageModal';
import NotificationModal from './notificationModal';
import SearchBar from './searchBar';
import { useUser } from '../context/UserContext';

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const [isSearchBarModalOpen, setIsSearchBarModalOpen] = useState(false);
    const { user, loading } = useUser(); // Get user and loading from context

    return (
        <div>
            {/* Large screens view */}
            <div className='hidden lg:flex flex-col fixed lg:w-[20vw] xl:w-[18vw] 2xl:w-[14vw] mt-5 lg:mt-8 xl:mt-10 ml-2 lg:ml-3 bg-white space-y-6 lg:space-y-8 rounded-xl shadow-sm'>

                <h1 className="text-black pl-5 lg:pl-7 pt-3 text-4xl lg:text-5xl" style={{ fontFamily: 'fleur' }}>E</h1>

                {K.NAVLINKS.map((navlink, index) => (
                    <div key={index} className='pl-5 lg:pl-7'>
                        <div className='space-x-5 lg:space-x-7 flex items-center'>
                            <span className='w-3 h-3 text-[#b8b5b5]'>{navlink.icon}</span>
                            {
                                navlink.text === 'Messages' ? (
                                    <Link onClick={() => setIsModalOpen(true)} className='text-[#464444] text-md lg:text-md hover:text-black transition-colors'>
                                        {navlink.text}
                                    </Link>
                                ) : navlink.text === 'Notification' ? (
                                    <Link onClick={() => setIsNotificationModalOpen(true)} className='text-[#464444] text-md lg:text-md hover:text-black transition-colors'>
                                        {navlink.text}
                                    </Link>
                                ) : navlink.text === 'Explore' ? (
                                    <Link onClick={() => setIsSearchBarModalOpen(true)} className='text-[#464444] text-md lg:text-md hover:text-black transition-colors'>
                                        {navlink.text}
                                    </Link>
                                ) : (
                                    <NavLink to={navlink.path} className='text-[#464444] text-md lg:text-md hover:text-black transition-colors'>
                                        {navlink.text}
                                    </NavLink>
                                )}
                        </div>
                    </div>
                ))}
                
                {/* Modals */}
                {isModalOpen && <MessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
                {isNotificationModalOpen && <NotificationModal isOpen={isNotificationModalOpen} onClose={() => setIsNotificationModalOpen(false)} />}
                {isSearchBarModalOpen && <SearchBar isOpen={isSearchBarModalOpen} onClose={() => setIsSearchBarModalOpen(false)} />}

                {/* User Info - Desktop */}
                <Link to={'/profile'} className='text-black flex space-x-3 lg:space-x-5 pt-8 lg:pt-12 pl-4 lg:pl-5 items-center'>
                    <div className="aspect-square w-14 h-14 md:h-16 md:w-16">
                        {loading ? (
                            <div className="w-full h-full rounded-full bg-gray-200 animate-pulse"></div>
                        ) : (
                            <img
                                src={user?.profilePicture || '/default-avatar.png'}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-2 border-white/80 shadow-sm"
                            />
                        )}
                    </div>
                    <p style={{ fontFamily: 'playfair' }} className='text-base lg:text-lg'>
                        {loading ? "Loading..." : user?.name || "Guest"}
                    </p>
                </Link>
            </div>

            {/* Mobile screen view */}
            <div className="lg:hidden w-[100vw] overflow-y-hidden flex justify-between items-center bg-black text-white p-4">
                <div className="flex items-center space-x-3">
                    <h1 className="text-5xl text-white" style={{ fontFamily: 'fleur' }}>E</h1>
                </div>
                
                <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                    </svg>
                </button>

                <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
                    <DrawNav path="/main" label="Home" setIsOpen={setIsOpen} />
                    <DrawNav label="Explore" setIsOpen={setIsOpen} setIsSearchBarModalOpen={setIsSearchBarModalOpen} />
                    <DrawNav label="Notification" setIsOpen={setIsOpen} setIsNotificationModalOpen={setIsNotificationModalOpen} />
                    <DrawNav label="Messages" setIsOpen={setIsOpen} setIsModalOpen={setIsModalOpen} />
                    <DrawNav path="/" label="Logout" setIsOpen={setIsOpen} />
                    <DrawerProfile />
                </Drawer>

                {/* Modals */}
                {isModalOpen && <MessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
                {isNotificationModalOpen && <NotificationModal isOpen={isNotificationModalOpen} onClose={() => setIsNotificationModalOpen(false)} />}
                {isSearchBarModalOpen && <SearchBar isOpen={isSearchBarModalOpen} onClose={() => setIsSearchBarModalOpen(false)} />}
            </div>
        </div>
    );
};

export default SideBar;