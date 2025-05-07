import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

const Following = () => {
  const { userId, token } = useUser();
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unfollowingId, setUnfollowingId] = useState(null);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await fetch(
          `https://euloges.onrender.com/users/${userId}/following`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch following list');

        const data = await response.json();
        setFollowingList(data.following.map(user => ({
          id: user.id,
          name: user.name,
          avatar: user.profilePicture || 'https://via.placeholder.com/150',
        })));
        
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) fetchFollowing();
  }, [userId, token]);

  const handleUnfollow = async (userIdToUnfollow) => {
    const originalList = [...followingList];
    
    try {
      setUnfollowingId(userIdToUnfollow);
      setFollowingList(prev => prev.filter(user => user.id !== userIdToUnfollow));

      const response = await fetch('https://euloges.onrender.com/unfollow', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userIdToUnfollow }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to unfollow');
      }

      const result = await response.json();
      console.log('Successfully unfollowed:', result);

    } catch (error) {
      setFollowingList(originalList);
      setError(error.message);
    } finally {
      setUnfollowingId(null);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Montserrat' }}>
        People You Follow
      </h1>

      {loading ? (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto text-center">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
          >
            Retry
          </button>
        </div>
      ) : followingList.length === 0 ? (
        <p className="text-center text-gray-600">You are not following anyone yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {followingList.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
                onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
              />
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'Montserrat' }}>
                {user.name}
              </h2>

              <div className="flex gap-3 mt-4">
                <Link to={`/profile/${user.id}`} className=" text-white whitespace-nowrap bg-sky-500 text-sm px-4 py-2 rounded-full">
                  View Profile
                </Link>
                <button
                  onClick={() => handleUnfollow(user.id)}
                  disabled={unfollowingId === user.id}
                  className={`bg-red-400 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-full ${
                    unfollowingId === user.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {unfollowingId === user.id ? 'Processing...' : 'Unfollow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Following;