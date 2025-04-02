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

  const { user, } = useUser(); // Use the shared context
  return (
    <div className="space-y-9 w-full">
      {K.POST.map((post, index) => (
        <div key={index} className="w-full flex justify-center">

          <div className="bg-white w-full lg:max-w-[50vw] md:max-w-[65vw] h-auto rounded-lg space-y-6 p-4">

            <div className="flex space-x-4 pt-4 ">
              <div className="aspect-square w-14 h-14  md:h-20 md:w-20">
                <img
                  src={user?.profilePicture || (user?.id && localStorage.getItem(`profilePicture_${user.id}`)) || '/default-avatar.png'}
                  alt="Profile"
                  className=" inset-0 w-full h-full rounded-full object-cover border-2 border-white/80 shadow-sm"
                />
              </div>
              <h1 className="text-lg font font-semibold pt-6">{user ? user.name : "Loading..."}</h1>
            </div>

            <p className="pl-6 ">{post.comment}</p>

            <img src={post.image} className="w-full max-w-[700px] " alt="" />

            <div className="flex flex-wrap items-center justify-center md:justify-start space-x-4 md:space-x-8 lg:space-x-9 px-2 md:px-0">
              {/* Views */}
              <span className="text-sm md:text-base">{post.views}</span>

              {/* Light Button */}
              <button
                onClick={() => handleIconClick(index, "light")}
                className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
              >
                <GiCandleLight className="text-xl md:text-2xl" />
                <span className="text-black text-xs md:text-sm">
                  {postStates[index]?.light || 0}
                </span>
              </button>

              {/* Tribute */}
              <button
                onClick={() => toggleComment(index)}
                className="text-sm md:text-base hover:underline px-1"
              >
                {post.tribute}
              </button>

              {/* Guestbook */}
              <button
                onClick={() => toggleGuestbook(index)}
                className="text-sm md:text-base hover:underline px-1"
              >
                {post.Guestbook}
              </button>

              {/* Donate */}
              <div className="">
                <button
                  onClick={handleOpenDonateModal}
                  className="text-sm md:text-base hover:underline px-1"
                >
                  {post.donate}
                </button>
                <DonateModal isOpen={isDonateModalOpen} onClose={handleCloseModal} />
              </div>

              {/* Share Button */}
              <div className="flex items-center px-1">
                <ShareButton
                  url={window.location.href}
                  text={post.text}
                  className="text-sm md:text-base"
                />
              </div>

              {/* Comment Section */}
              {commentVisibility[index] && (
                <div className="mt-3 border-t border-gray-200 pt-3 w-full">
                  <h2 className="text-base md:text-lg font-semibold mb-2">Share Your Tributes</h2>
                  {comments[index]?.length > 0 ? (
                    comments[index].map((c, i) => (
                      <p key={i} className="text-sm text-gray-700 mb-1">{c}</p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No comments yet.</p>
                  )}
                  <div className="mt-2 flex items-center space-x-2">
                    <input
                      type="text"
                      value={newComment[index] || ""}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className="border rounded-lg p-2 flex-grow text-sm"
                      placeholder="Write a comment..."
                    />
                    <button
                      onClick={() => handleCommentSubmit(index)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm min-w-[80px]"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}

              {/* Guestbook Section */}
              {guestbookVisibility[index] && (
                <div className="mt-3 border-t border-gray-200 pt-3 w-full">
                  <h2 className="text-base md:text-lg font-semibold mb-2">Share Your Condolences</h2>
                  {guestbookComments[index]?.length > 0 ? (
                    guestbookComments[index].map((c, i) => (
                      <p key={i} className="text-sm text-gray-700 mb-1">{c}</p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No condolences yet.</p>
                  )}
                  <div className="mt-2 flex items-center space-x-2">
                    <input
                      type="text"
                      value={newGuestbookComment[index] || ""}
                      onChange={(e) => handleGuestbookInputChange(index, e.target.value)}
                      className="border rounded-lg p-2 flex-grow text-sm"
                      placeholder="Write your condolences here..."
                    />
                    <button
                      onClick={() => handleGuestbookSubmit(index)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm min-w-[80px]"
                    >
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