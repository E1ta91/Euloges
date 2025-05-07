import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId, token } = useUser();



  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await fetch(
          `https://euloges.onrender.com/users/${userId}/followers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch following list');

        const data = await response.json();
        setFollowers(data.followers.map(user => ({
          id: user.id,
          name: user.name,
          avatar: user.profilePicture || 'https://via.placeholder.com/150',
        })));

        console.log("Followers", data)

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) fetchFollowers();
  }, [userId, token]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center p-6 max-w-md mx-auto bg-red-50 rounded-lg">
        <h2 className="text-xl font-semibold text-red-600 mt-4">Error loading followers</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Your Followers
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            {followers.length} people followed you
          </p>
        </div>

        {followers.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-4 text-lg font-medium text-gray-900">No followers yet</h3>
            <p className="mt-1 text-gray-500">When people follow you, they'll appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {followers.map((followers) => (
              <div
                key={followers.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <img
                      className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm"
                      src={followers.avatar}
                      alt={followers.username}
                    />
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900">{followers.name}</h3>

                      </div>

                    </div>
                   
                    <div className="ml-auto flex">
  <Link
    to={`/profile/${followers.id}`}
    className="px-4 py-2 bg-sky-500 text-white rounded-full text-sm font-medium transition-colors 
              hover:bg-sky-600 focus:ring focus:ring-sky-300 whitespace-nowrap 
              w-full text-center sm:w-auto md:px-6 md:py-3 lg:text-base"
  >
    View Profile
  </Link>
</div>


                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Followers;