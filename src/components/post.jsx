import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GiBookmark, GiCandleLight, GiTwirlyFlower } from "react-icons/gi";
import ShareButton from '../components/shareButton.jsx';
import DonateModal from '../components/donateModal.jsx';
import { useUser } from '../context/UserContext.jsx';
import { Cross } from 'lucide-react';

const Post = ({ triggerRefresh }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useUser();

  const [userCache, setUserCache] = useState({});
  const [postStates, setPostStates] = useState(
    JSON.parse(localStorage.getItem("postStates")) || {}
  );
  const [comments, setComments] = useState(
    JSON.parse(localStorage.getItem("comments")) || {}
  );
  const [guestbookComments, setGuestbookComments] = useState(
    JSON.parse(localStorage.getItem("guestbookComments")) || {}
  );

  const [commentVisibility, setCommentVisibility] = useState({});
  const [newComment, setNewComment] = useState({});
  const [guestbookVisibility, setGuestbookVisibility] = useState({});
  const [newGuestbookComment, setNewGuestbookComment] = useState({});
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const fetchUserDetails = async (userId) => {
    if (!userId) {
      return {
        id: 'anonymous',
        name: 'Anonymous',
        profilePicture: '/default-avatar.png'
      };
    }

    try {
      if (currentUser?.id === userId) {
        const userData = {
          ...currentUser,
          profilePicture: currentUser.profilePicture || localStorage.getItem(`profilePicture_${currentUser.id}`) || '/default-avatar.png'
        };
        localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
        setUserCache(prev => ({ ...prev, [userId]: userData }));
        return userData;
      }

      if (userCache[userId]) {
        return userCache[userId];
      }

      const cachedUser = JSON.parse(localStorage.getItem(`user_${userId}`));
      if (cachedUser) {
        setUserCache(prev => ({ ...prev, [userId]: cachedUser }));
        return cachedUser;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`https://euloges.onrender.com/getUser?id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      });

      if (!response.data) {
        throw new Error('No user data returned from server');
      }

      const userData = {
        ...response.data,
        profilePicture: response.data.profilePicture || localStorage.getItem(`profilePicture_${userId}`) || '/default-avatar.png'
      };

      localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
      setUserCache(prev => ({ ...prev, [userId]: userData }));

      return userData;
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        id: userId,
        name: 'Anonymous',
        profilePicture: localStorage.getItem(`profilePicture_${userId}`) || '/default-avatar.png'
      };
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchPostsAndUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get('https://euloges.onrender.com/get-posts', {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        });

        if (!isMounted) return;

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid posts data received');
        }

        const postsWithUsers = await Promise.all(
          response.data.map(async (post) => {
            try {
              if (post.user === currentUser?.id) {
                return {
                  ...post,
                  userData: {
                    ...currentUser,
                    profilePicture: currentUser.profilePicture || localStorage.getItem(`profilePicture_${currentUser.id}`) || '/default-avatar.png'
                  }
                };
              }

              const userData = await fetchUserDetails(post.user);
              return { ...post, userData };
            } catch (error) {
              console.error(`Error processing post ${post.id}:`, error);
              return {
                ...post,
                userData: {
                  id: post.user,
                  name: 'Anonymous',
                  profilePicture: '/default-avatar.png'
                }
              };
            }
          })
        );

        if (isMounted) {
          setPosts(postsWithUsers);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Failed to load posts');
          console.error('Error fetching posts:', err);
          setLoading(false);
        }
      }
    };

    fetchPostsAndUsers();

    return () => {
      isMounted = false;
    };
  }, [triggerRefresh, currentUser]);

  useEffect(() => {
    localStorage.setItem("postStates", JSON.stringify(postStates));
  }, [postStates]);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem("guestbookComments", JSON.stringify(guestbookComments));
  }, [guestbookComments]);

  const handleLightClick = (postId) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        light: (prev[postId]?.light || 0) + 1
      }
    }));
  };

  const toggleCommentSection = (postId) => {
    setCommentVisibility(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleGuestbookSection = (postId) => {
    setGuestbookVisibility(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentSubmit = (postId) => {
    if (!newComment[postId]?.trim()) return;

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment[postId]]
    }));

    setNewComment(prev => ({ ...prev, [postId]: "" }));
  };

  const handleGuestbookSubmit = (postId) => {
    if (!newGuestbookComment[postId]?.trim()) return;

    setGuestbookComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newGuestbookComment[postId]]
    }));

    setNewGuestbookComment(prev => ({ ...prev, [postId]: "" }));
  };

  const handleOpenDonateModal = () => setIsDonateModalOpen(true);
  const handleCloseModal = () => setIsDonateModalOpen(false);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8 text-red-500">
      Error loading posts: {error}
    </div>
  );

  if (posts.length === 0) return (
    <div className="text-center py-8 text-gray-500">
      No posts found. Be the first to share!
    </div>
  );

  return (
    <div className="space-y-8 w-full max-w-2xl mx-auto">

      {posts.slice().reverse().map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow">
              <img
                src={post.user.profilePicture || '/default-avatar.png'}
                alt={post.user.name || 'User'}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold" style={{ fontFamily: 'playfair' }}>
                {post.user.name}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>

          <div className="mb-4 rounded-lg overflow-hidden">
            {post.uploadUrl && (
              post.uploadUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  controls
                  className="w-full max-h-96 object-contain"
                >
                  <source src={post.uploadUrl} type={`video/${post.uploadUrl.split('.').pop()}`} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={post.uploadUrl}
                  alt="Post content"
                  className="w-full max-h-96 object-contain"
                />
              )
            )}
          </div>

          <div className="flex items-center space-x-10 border-t border-b border-gray-100 py-3">
            <button
              onClick={() => handleLightClick(post.id)}
              className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
            >
              <GiCandleLight className="text-xl" />
              <span>{postStates[post.id]?.light || 0}</span>
            </button>

            <button
              onClick={() => toggleCommentSection(post.id)}
              className="hover:text-blue-500 transition-colors"
            >
              <Cross className="text-xl" />
            </button>

            <button
              onClick={() => toggleGuestbookSection(post.id)}
              className="hover:text-blue-500 transition-colors"
            >
              <GiBookmark className="text-xl" />
            </button>

            <button
              onClick={handleOpenDonateModal}
              className="hover:text-blue-500 transition-colors"
            >
              <GiTwirlyFlower className="text-xl" />
            </button>

            <div>
              {/* <h1>{post.title}</h1> */}
          
              <ShareButton
                url={`https://euloges.netlify.app/main/${post.id}`} />
            </div>
          </div>

          {commentVisibility[post.id] && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Share Your Tributes</h4>
              {comments[post.id]?.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {comments[post.id].map((comment, i) => (
                    <div key={i} className="text-sm p-2 bg-gray-50 rounded">
                      {comment}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-3">No tributes yet.</p>
              )}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newComment[post.id] || ""}
                  onChange={(e) => setNewComment(prev => ({
                    ...prev,
                    [post.id]: e.target.value
                  }))}
                  placeholder="Write a tribute..."
                  className="flex-1 border rounded px-3 py-2 text-sm"
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded text-sm min-w-[80px]"
                >
                  Post
                </button>
              </div>
            </div>
          )}

          {guestbookVisibility[post.id] && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Share Your Condolences</h4>
              {guestbookComments[post.id]?.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {guestbookComments[post.id].map((comment, i) => (
                    <div key={i} className="text-sm p-2 bg-gray-50 rounded">
                      {comment}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-3">No condolences yet.</p>
              )}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newGuestbookComment[post.id] || ""}
                  onChange={(e) => setNewGuestbookComment(prev => ({
                    ...prev,
                    [post.id]: e.target.value
                  }))}
                  placeholder="Write your condolences..."
                  className="flex-1 border rounded px-3 py-2 text-sm"
                />
                <button
                  onClick={() => handleGuestbookSubmit(post.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded text-sm min-w-[80px]"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <DonateModal isOpen={isDonateModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Post;