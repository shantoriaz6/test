import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const UserPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (currentUser?._id) {
      fetchPlaylists();
    }
  }, [currentUser?._id]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/v1/playlists/user/${currentUser._id}`,
        { withCredentials: true }
      );

      console.log('Playlists response:', response.data);

      if (response.data?.statusCode === 200) {
        setPlaylists(response.data.data || []);
        setError('');
      } else {
        setPlaylists([]);
        setError('');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // No playlists found for user
        setPlaylists([]);
        setError('');
      } else {
        console.error('Error fetching playlists:', err);
        setError(err.response?.data?.message || 'Failed to load playlists');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading playlists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">My Playlists</h1>
        <Link
          to="/dashboard/playlist"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Create Playlist
        </Link>
      </div>
      
      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No playlists yet</p>
          <p className="text-gray-500 text-sm mt-2">Create a playlist to organize your videos</p>
          <Link
            to="/dashboard/playlist"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Playlist
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <Link
              key={playlist._id}
              to={`/dashboard/playlist/${playlist._id}`}
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
            >
              <div className="aspect-video bg-gray-700 relative">
                {playlist.videos && playlist.videos.length > 0 ? (
                  <>
                    <img
                      src={playlist.videos[0].thumbnail}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                      {playlist.videos.length} video{playlist.videos.length !== 1 ? 's' : ''}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No videos</p>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-white font-semibold text-lg mb-1">{playlist.name}</h3>
                {playlist.description && (
                  <p className="text-gray-400 text-sm line-clamp-2">{playlist.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPlaylists;
