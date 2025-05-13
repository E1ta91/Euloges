import React, { useState } from 'react';
import SideBar from '../components/sidebar';
import PostForm from './postform';
import Post from '../components/post';
import Advertisement from '../components/advertisement';
import { useParams } from 'react-router-dom';



const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const { postId } = useParams();
  console.log('Post ID from URL:', postId); 

  // Callback when a new post is created
  const handleNewPost = (newPost) => {
    setTriggerRefresh(prev => !prev); // Toggle to trigger refresh
  };


  return (
    <div className='bg-[#e4f3f2] w-full h-full  flex flex-col lg:flex-row'>

      <div className='flex flex-col md:flex  xl:flex-row lg:flex-row  w-[90vw] lg:w-full'>

        <SideBar className='w-full lg:w-full xl:w-[35vw] ' />

        <div className='md:flex '>

          <div className="flex mx-5 flex-col justify-center  items-center space-y-10 w-full lg:w-4/4 pt-10 lg:pt-8.5 lg:ml-60 xl:pt-10 xl:ml-72">
            <PostForm onNewPost={handleNewPost} className='w-full ' />
            <Post posts={posts}
              setPosts={setPosts}
              triggerRefresh={triggerRefresh} className='w-full ' />
          </div>

          <Advertisement className='w-full  md:w-full' />
        </div>

      </div>

    </div>

  );
};

export default MainPage;
