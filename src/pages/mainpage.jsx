import React, { useEffect, useState } from 'react'
import SideBar from '../components/sidebar'
import PostForm from './postform'
import K from '../constants'
import ad from '../assets/images/ad1.png'
import ad1 from '../assets/images/ad2.png'
import ShareButton from '../components/shareButton'

const MainPage = () => {
  // Load the initial post states from localStorage or use default values if not available
  const savedPostStates = JSON.parse(localStorage.getItem("postStates")) || K.POST.map(() => ({
    light: 0,

  }));


  const [postStates, setPostStates] = useState(savedPostStates);

  useEffect(() => {
    // Save the post states to localStorage whenever they change
    localStorage.setItem("postStates", JSON.stringify(postStates));
  }, [postStates]); // This effect runs every time postStates change

  const handleIconClick = (postId, icon) => {
    setPostStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[postId] = {
        ...newStates[postId],
        [icon]: newStates[postId][icon] + 1, // Increment the count for the clicked icon
      };
      return newStates;
    });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className='bg-[#d8d4d4] w-full   pt-10 h-full  '>

      <div className='border-2 fixed w-[17vw] h-[85vh] ml-10 bg-white text-white space-y-5 rounded-xl '>
        <h1 className="text-black pl-7 pt-3 text-5xl" style={{ fontFamily: 'fleur' }}>E</h1>

        <SideBar />

        <div className='text-black flex space-x-5 pt-32 pl-5 '>
          <h1 style={{ fontFamily: 'playfair' }} className='border w-12 h-12 pt-2 text-xl bg-sky-400 outline-none border-none font-semibold text-center rounded-full'>P</h1>

          <p style={{ fontFamily: 'playfair' }} className='pt-2 text-lg'>Philip Adaezale</p>
        </div>

      </div>

      <div className='flex space-x-10 ml-[19rem]'>
        <div className='flex flex-col justify-center items-center space-y-10'>
          <PostForm />

          <div className='space-y-9'>
            {
              K.POST.map((post, index) => {
                return (
                  <div key={index} className=''>
                    <div className='bg-white w-[50vw] h-[90vh] rounded-lg space-y-6'>

                      <div className='flex space-x-7 pt-4 pl-8'>
                        <img src={post.pf} className='w-[50px] rounded-full' alt="" />
                        <h1 className='text-lg font font-semibold pt-3'>{post.name}</h1>
                      </div>

                      <p className='pl-28'>{post.comment}</p>
                      <img src={post.image} className='w-[650px] pl-8  ' alt="" />

                      <div className='flex mx-10 space-x-9'>
                        <span>{post.views}</span>

                        <button onClick={() => handleIconClick(index, "light")} className="relative">
                          <div className="relative inline-block">
                            <img className="" src={post.light} alt="" />
                            <span className="absolute -top-4 -right-3 text-black text-sm  p-1">
                              {postStates[index]?.light || 0}
                            </span>
                          </div>
                        </button>


                        <span>{post.tribute}</span>
                        <span>{post.Guestbook}</span>
                        <span>{post.donate}</span>

                        <div className="relative inline-block">
                          <div onClick={() => handleIconClick(index, "share")} className="relative">
                            {/* <div onClick={toggleDropdown} className="relative inline-block">
                              {post.share}
                            </div> */}
                            <ShareButton url={window.location.href} text={post.text} />
                          </div>
                         
                        </div>


                      </div>

                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>


        <div className='space-y-7 h-fit'>

          <h1 style={{ fontFamily: 'playfair' }} className='text-xl'>Advertisement</h1>

          <div className='space-y-10 '>
            <img className='w-[280px] rounded-lg shadow-lg' src={ad} alt="" />
            <img className='w-[280px] rounded-lg shadow-lg' src={ad1} alt="" />
          </div>


          <div className='bg-white w-[20.5vw] h-[60vh] rounded-lg'>
            <h1 style={{ fontFamily: 'playfair' }} className='text-black text-2xl text-center pt-2 '>Live on Euloges</h1>
          </div>

        </div>




      </div>



    </div>
  )
}

export default MainPage