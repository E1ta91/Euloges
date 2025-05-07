import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { GiBookmark, GiCandleLight, GiTwirlyFlower } from "react-icons/gi";
import { Cross } from 'lucide-react';
import ShareButton from '../components/shareButton.jsx';
import DonateModal from '../components/donateModal.jsx';
import { BsThreeDots } from "react-icons/bs";
import PostActionsDropdown from '../components/postActionsDropdown.jsx';

const Profile = () => {
  const { user: updateUserProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feeds, setFeeds] = useState([]);
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
  const [editData, setEditData] = useState({
    id: '',
    name: '',
    email: '',
    dateOfBirth: '',
    profilePicture: '/default-avatar.png',
    coverPhoto: '/default-cover.jpg',
    following: 0,
    followers: 0
  });

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

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.log('No token found');
          return;
        }

        const response = await axios.get('https://euloges.onrender.com/get-user-feeds', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('User feeds:', response.data);
        setFeeds(response.data.feeds);
      } catch (error) {
        console.error('Error fetching feeds:', error);
        alert('Failed to fetch user feeds');
      }
    };

    fetchFeeds();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("No token found");
          setIsLoading(false);
          return;
        }

        const response = await axios.get("https://euloges.onrender.com/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Raw response from server:', response.data);

        if (!response.data?.id) {
          throw new Error("User ID not found in response");
        }

        const userData = {
          ...response.data,
          profilePicture: response.data.profilePicture || '/default-avatar.png',
          coverPhoto: response.data.coverPhoto || '/default-cover.jpg'
        };

        console.log('Processed user data with images:', userData);

        setUser(userData);
        setEditData({
          id: userData.id,
          name: userData.name || '',
          email: userData.email || '',
          dateOfBirth: userData.dateOfBirth || '',
          profilePicture: userData.profilePicture,
          coverPhoto: userData.coverPhoto,
          following: userData.following?.length,
          followers: userData.followers?.length,
        });

      } catch (error) {
        console.error("Error fetching user:", error);
        setEditData(prev => ({
          ...prev,
          profilePicture: '/default-avatar.png',
          coverPhoto: '/default-cover.jpg'
        }));
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('https://euloges.onrender.com/count-post', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then(res => res.json())
      .then(data => setCount(data.userFeed));
  }, []);

  const getImageUrl = (url, defaultUrl) => {
    if (!url || url === defaultUrl) {
      return defaultUrl;
    }
    if (url.startsWith('http')) {
      return url;
    }
    return `https://euloges.onrender.com${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'system_uploader_1e2ddab171f769b9_caf184a04c894aa697fa85573829881354');
      formData.append('folder', 'profile_pictures');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dhywsn6jz/image/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUploading(false);
      return response.data.secure_url;
    } catch (error) {
      console.error("Upload failed:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      setUploading(false);
      throw error;
    }
  };

  const handleImageChange = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file);
      const fieldName = type === 'profile' ? 'profilePicture' : 'coverPhoto';

      setEditData(prev => ({
        ...prev,
        [fieldName]: imageUrl
      }));

      updateUserProfile({
        [fieldName]: imageUrl
      });

      if (user) {
        setUser(prev => ({
          ...prev,
          [fieldName]: imageUrl
        }));
      }
    } catch (error) {
      alert(`Upload failed: ${error.response?.data?.error?.message || 'Please try again'}`);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("No authentication token found");
      window.location.href = "/login";
      return;
    }

    try {
      const updateData = {
        email: editData.email,
        name: editData.name,
        dateOfBirth: editData.dateOfBirth?.split('T')[0] || '',
        profilePicture: editData.profilePicture !== '/default-avatar.png' ? editData.profilePicture : null,
        coverPhoto: editData.coverPhoto !== '/default-cover.jpg' ? editData.coverPhoto : null
      };

      console.log('Sending update with data:', updateData);

      const response = await axios.patch(
        `https://euloges.onrender.com/updateUser/${editData.id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Update response:', response.data);

      if (response.status === 200) {
        alert("Profile updated successfully!");
        const updatedData = {
          ...response.data,
          profilePicture: editData.profilePicture,
        };
        setUser(updatedData);
        setEditData(prev => ({
          ...prev,
          ...updatedData
        }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      alert(errorMessage);
    }
  };
  
  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No token found');
        return;
      }
  
      // Delete the post
      const response = await fetch(`https://euloges.onrender.com/delete-post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        console.log('Post deleted successfully');
  
        // Fetch updated posts with the access token
        const updatedResponse = await fetch('https://euloges.onrender.com/get-posts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (updatedResponse.ok) {
          const updatedPosts = await updatedResponse.json();
          setFeeds(updatedPosts);
          setCount(updatedPosts.length);
        } else {
          console.error('Failed to fetch updated posts');
        }
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  

  const handleUpdatePost = (postId) => {
    // Implement your update logic here
    console.log('Update post with ID:', postId);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header with logo and name */}
        <div className="border-b border-gray-500">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-black text-4xl sm:text-5xl lg:text-6xl" style={{ fontFamily: "fleur" }}>
              E
            </h1>
            <div>
              <p style={{ fontFamily: 'playfair' }} className='font-bold text-lg sm:text-xl text-gray-900'>
                {isLoading ? "Loading..." : (user ? user.name : "User not found")}
              </p>
            </div>
          </div>
        </div>
        {/* Cover photo */}
        <div className="h-48 md:h-56 bg-gray-200 relative">
          <img
            src={getImageUrl(editData.coverPhoto, '/default-cover.jpg')}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile section */}
        <div className="px-6 pb-6 relative">
          {/* Profile picture */}
          <div className="absolute -top-16 left-6">
            <div className="relative">
              <img
                src={getImageUrl(editData.profilePicture, '/default-avatar.png')}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
            </div>
          </div>

          {/* Edit profile button */}
          <div className="flex justify-end pt-4">
            <button
              className="px-5 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
              onClick={() => setIsEditing(true)}
              disabled={isLoading || !user}
            >
              {isLoading ? "Loading..." : "Edit Profile"}
            </button>
          </div>

          {/* Profile info */}
          <div className="mt-16 space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">{editData.name}</h2>
            <p className="text-gray-600">{editData.email}</p>

            {/* {editData.dateOfBirth && (
              <p className="text-gray-600">
                {new Date(editData.dateOfBirth).toLocaleDateString()}
              </p>
            )} */}

            <div className="flex space-x-6 pt-2">
              <Link to="/following" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <span className="font-bold text-blue-600">{editData.following}</span> Following
              </Link>
              <Link to="/followers" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <span className="font-bold text-blue-600">{editData.followers}</span> Followers
              </Link>
            </div>
          </div>
        </div>

        {/* User Feeds */}
        <div className="border-t border-gray-200 px-6 py-6 space-y-7">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Posts</h2>
          <h1 className=' text-blue-600'>You have made {count} posts</h1>

          {feeds.length > 0 ? (
            <div className="space-y-6">
              {feeds.map((feed) => (
                <div key={feed.id} className="bg-white border space-y-5 border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">

                  <div className="flex justify-between ">
                    <div className='flex  space-x-6'>
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow">
                        <img
                          src={feed.user.profilePicture || '/default-avatar.png'}
                          alt={feed.user.name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{feed.user.name}</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(feed.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>


                    <div>
                      <PostActionsDropdown
                        postId={feed.id}
                        onDelete={handleDeletePost}
                        onUpdate={handleUpdatePost}
                      />
                    </div>

                  </div>

                  <p className="mt-2 text-gray-700 text-lg">{feed.content}</p>

                  {feed.uploadUrl && (
                    <div className="mt-4">
                      <img
                        src={feed.uploadUrl}
                        alt="Feed media"
                        className="w-full h-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  )}



                  {/* Icons and Actions */}
                  <div className="flex items-center space-x-8 md:space-x-10 lg:space-x-10 border-t border-b border-gray-100 py-3 mt-4">
                    <button
                      onClick={() => handleLightClick(feed.id)}
                      className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                    >
                      <GiCandleLight className="text-xl" />
                      <span>{postStates[feed.id]?.light || 0}</span>
                    </button>

                    <button
                      onClick={() => toggleCommentSection(feed.id)}
                      className="hover:text-blue-500 transition-colors"
                    >
                      <Cross className="text-xl" />
                    </button>

                    <button
                      onClick={() => toggleGuestbookSection(feed.id)}
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

                    <ShareButton
                      url={window.location.href}
                      text={feed.content}
                      className="hover:text-blue-500 transition-colors"
                    />
                  </div>

                  {/* Comments Section */}
                  {commentVisibility[feed.id] && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Share Your Tributes</h4>
                      {feed.comments?.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          {feed.comments.map((comment, i) => (
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
                          value={newComment[feed.id] || ""}
                          onChange={(e) => setNewComment(prev => ({
                            ...prev,
                            [feed.id]: e.target.value
                          }))}
                          placeholder="Write a tribute..."
                          className="flex-1 border rounded px-3 py-2 text-sm"
                        />
                        <button
                          onClick={() => handleCommentSubmit(feed.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded text-sm min-w-[80px]"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Guestbook Section */}
                  {guestbookVisibility[feed.id] && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Share Your Condolences</h4>
                      {feed.guestbook?.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          {feed.guestbook.map((comment, i) => (
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
                          value={newGuestbookComment[feed.id] || ""}
                          onChange={(e) => setNewGuestbookComment(prev => ({
                            ...prev,
                            [feed.id]: e.target.value
                          }))}
                          placeholder="Write your condolences..."
                          className="flex-1 border rounded px-3 py-2 text-sm"
                        />
                        <button
                          onClick={() => handleGuestbookSubmit(feed.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded text-sm min-w-[80px]"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No Post yet</p>
              <p className="text-gray-500 mt-1">Start posting to see your activity here.</p>
            </div>
          )}
        </div>

        <DonateModal isOpen={isDonateModalOpen} onClose={handleCloseModal} />


        {/* Edit modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                {uploading && (
                  <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg">
                    Uploading image, please wait...
                  </div>
                )}

                <div className="space-y-6">
                  {/* Cover photo upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo</label>
                    <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={getImageUrl(editData.coverPhoto, '/default-cover.jpg')}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute bottom-4 right-4 bg-white text-[#00A6F4] px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-100">
                        Change Cover Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'coverPhoto')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Profile picture upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                    <div className="flex items-center space-x-6">
                      <div className="aspect-square w-20 h-20 md:h-20 md:w-20 lg:w-24 lg:h-24 relative">
                        <img
                          src={getImageUrl(editData.profilePicture, '/default-avatar.png')}
                          alt="Edit Profile"
                          className="inset-0 w-full h-full rounded-full object-cover border-2 border-white/80 shadow-sm"
                        />
                        <label className="absolute bottom-0 left-14 border-[#00A6F4] border-[1px] bg-white text-[#00A6F4] px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-gray-100">
                          Change
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'profile')}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="text-sm text-gray-500">
                        Click "Change" to upload a new profile picture
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        placeholder="Your email"
                      />
                    </div>

                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        id="dob"
                        value={editData.dateOfBirth?.split('T')[0] || ''}
                        onChange={(e) => {
                          setEditData({
                            ...editData,
                            dateOfBirth: e.target.value ? new Date(e.target.value).toISOString() : null
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-5 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
                      onClick={handleSave}
                      disabled={uploading || !user?.id}
                    >
                      {uploading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;