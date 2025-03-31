import React from 'react';
import SideBar from '../components/sidebar';
import PostForm from './postform';
import Post from '../components/post';
import Advertisement from '../components/advertisement';



const MainPage = () => {

  return (
    <div className='bg-[#d8d4d4] w-full h-full  flex flex-col lg:flex-row'>

      <div className='flex flex-col md:flex  xl:flex-row lg:flex-row  w-[90vw] lg:w-full'>

        <SideBar className='w-full lg:w-full xl:w-[35vw] ' />

        <div className='md:flex '>

        <div className="flex mx-5 flex-col justify-center  items-center space-y-10 w-full lg:w-4/4 pt-10 lg:pt-11 lg:ml-60 xl:pt-10 xl:ml-72">
          <PostForm className='w-full' />
          <Post className='w-full ' />
        </div>

         <Advertisement className='w-full  md:w-full'  /> 
        </div>

      </div>

    </div>

  );
};

export default MainPage;
