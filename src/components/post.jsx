import React, { useEffect, useState } from 'react'
import K from '../constants';
import ShareButton from '../components/shareButton.jsx'
import DonateModal from '../components/donateModal.jsx';
import { GiCandleLight } from "react-icons/gi";
import { useUser } from '../context/UserContext.jsx';


const Post = () => {
    // Load the initial post states from localStorage or use default values if not available
  const savedPostStates = JSON.parse(localStorage.getItem("postStates")) || K.POST.map(() => ({
    light: 0,
  }));
  const [guestbookComments, setGuestbookComments] = useState(JSON.parse(localStorage.getItem("guestbookComments")) || {});

  const [postStates, setPostStates] = useState(savedPostStates);

  useEffect(() => {
    // Save the post states to localStorage whenever they change
    localStorage.setItem("postStates", JSON.stringify(postStates));
  }, [postStates]); // This effect runs every time postStates change



  useEffect(() => {
    // Save the guestbook comments to localStorage whenever they change
    localStorage.setItem("guestbookComments", JSON.stringify(guestbookComments));
  }, [guestbookComments]); // This effect runs every time guestbook comments change

  // Load comments from localStorage or use an empty object if not available
  const savedComments = JSON.parse(localStorage.getItem("comments")) || {};
  const [comments, setComments] = useState(savedComments);
  const [commentVisibility, setCommentVisibility] = useState({});
  const [newComment, setNewComment] = useState({});

  const [guestbookVisibility, setGuestbookVisibility] = useState({});
  const [newGuestbookComment, setNewGuestbookComment] = useState({});

  useEffect(() => {
    // Save the comments to localStorage whenever they change
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]); // This effect runs every time comments change

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



  // Toggle comment section
  const toggleComment = (index) => {
    setCommentVisibility((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle visibility
    }));
  };

  // Toggle guestbook section
  const toggleGuestbook = (index) => {
    setGuestbookVisibility((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle visibility
    }));
  };

  // Handle input change
  const handleInputChange = (index, value) => {
    setNewComment((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  // Handle input change for guestbook comments
  const handleGuestbookInputChange = (index, value) => {
    setNewGuestbookComment((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  // Handle comment submission
  const handleCommentSubmit = (index) => {
    if (!newComment[index]) return; // Prevent empty comments

    setComments((prev) => ({
      ...prev,
      [index]: [...(prev[index] || []), newComment[index]], // Append new comment
    }));

    setNewComment((prev) => ({
      ...prev,
      [index]: "", // Clear input field
    }));
  };

  // Handle guestbook comment submission
  const handleGuestbookSubmit = (index) => {
    if (!newGuestbookComment[index]) return; // Prevent empty guestbook comments

    setGuestbookComments((prev) => ({
      ...prev,
      [index]: [...(prev[index] || []), newGuestbookComment[index]], // Append new guestbook comment
    }));

    setNewGuestbookComment((prev) => ({
      ...prev,
      [index]: "", // Clear input field
    }));
  };

  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const handleOpenDonateModal = () => {
    setIsDonateModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsDonateModalOpen(false);

  };

   const { user,  } = useUser(); // Use the shared context
  return (
    <div className="space-y-9 w-full">
    {K.POST.map((post, index) => (
      <div key={index} className="w-full flex justify-center">

        <div className="bg-white w-full lg:max-w-[50vw] md:max-w-[65vw] h-auto rounded-lg space-y-6 p-4">

          <div className="flex space-x-4 pt-4 ">
          <div className="relative aspect-square w-14 h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24">
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
            <h1 className="text-lg font font-semibold pt-3">{user ? user.name : "Loading..."}</h1>
          </div>

          <p className="pl-6 ">{post.comment}</p>

          <img src={post.image} className="w-full max-w-[600px] mx-auto" alt="" />

          <div className="flex flex-wrap justify-center md:justify-start mx-4 md:mx-10 space-x-7 md:space-x-8">

          <span className='  '>{post.views}</span>

          <button onClick={() => handleIconClick(index, "light")}className="flex items-center pb-2 " >
              <GiCandleLight className="text-2xl" />

              {/* Count next to the icon */}
              <span className="text-black text-sm ">
                {postStates[index]?.light || 0}
              </span>
            </button>

          
              <span onClick={() => toggleComment(index)} className="pb-1">{post.tribute}</span>
      

              <span onClick={() => toggleGuestbook(index)} className="pb-1">{post.Guestbook}</span>
            

            <div>
              <span onClick={handleOpenDonateModal}>{post.donate}</span>
              <DonateModal isOpen={isDonateModalOpen} onClose={handleCloseModal} />
            </div>

          
             <ShareButton url={window.location.href} text={post.text}  />
          

            {commentVisibility[index] && (
              <div className="mt-4 border-t border-black pt-4 w-full md:w-[90%] lg:w-[80%] mx-auto">
                <h2 className="text-lg font-semibold">Share Your Tributes</h2>
                {comments[index]?.map((c, i) => (
                  <p key={i} className="text-sm text-gray-700">{c}</p>
                )) || <p className="text-sm text-gray-500">No comments yet.</p>}
                <div className="mt-3 flex items-center space-x-2">
                  <input
                    type="text"
                    value={newComment[index] || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="border rounded-lg p-2 w-full md:w-[80%] lg:w-[90%] text-sm"
                    placeholder="Write a comment..."
                  />
                  <button onClick={() => handleCommentSubmit(index)} className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">
                    Post
                  </button>
                </div>
              </div>
            )}
            {guestbookVisibility[index] && (
              <div className="mt-4 border-t border-black pt-4 w-full md:w-[90%] lg:w-[80%] mx-auto">
                <h2 className="text-lg font-semibold">Share Your Condolences</h2>
                {guestbookComments[index]?.map((c, i) => (
                  <p key={i} className="text-sm text-gray-700">{c}</p>
                )) || <p className="text-sm text-gray-500">No condolence yet.</p>}
                <div className="mt-3 flex items-center space-x-2">
                  <input
                    type="text"
                    value={newGuestbookComment[index] || ""}
                    onChange={(e) => handleGuestbookInputChange(index, e.target.value)}
                    className="border rounded-lg p-2 w-full md:w-[80%] lg:w-[90%] text-sm"
                    placeholder="Write your condolences here..."
                  />
                  <button onClick={() => handleGuestbookSubmit(index)} className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">
                    Post
                  </button>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    ))}
  </div>
  )
}

export default Post