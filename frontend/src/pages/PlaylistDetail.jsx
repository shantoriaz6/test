import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { 
  getPlaylistById, 
  updatePlaylist, 
  deletePlaylist, 
  removeVideoFromPlaylist 
} from '../services/playlistService';
import VideoCard from '../components/VideoCard';

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (playlistId) {
      fetchPlaylist();
    }
  }, [playlistId]);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const data = await getPlaylistById(playlistId);
      setPlaylist(data);
      setEditName(data.name);
      setEditDescription(data.description || '');
    } catch (err) {
      setError(err.message || 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = await updatePlaylist(playlistId, {
        name: editName,
        description: editDescription
      });
      setPlaylist(updated);
      setIsEditing(false);
      alert('Playlist updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update playlist');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await deletePlaylist(playlistId);
        alert('Playlist deleted successfully!');
        navigate('/dashboard/playlists');
      } catch (err) {
        alert(err.message || 'Failed to delete playlist');
      }
    }
  };

  const handleRemoveVideo = async (videoId) => {
    if (window.confirm('Remove this video from playlist?')) {
      try {
        const updated = await removeVideoFromPlaylist(videoId, playlistId);
        setPlaylist(updated);
        alert('Video removed from playlist!');
      } catch (err) {
        alert(err.message || 'Failed to remove video');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading playlist...</div>
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

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Playlist not found</div>
      </div>
    );
  }

  const isOwner = currentUser._id === playlist.owner?._id;

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Playlist Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{playlist.name}</h1>
                {playlist.description && (
                  <p className="text-gray-400">{playlist.description}</p>
                )}
                <div className="text-gray-500 text-sm mt-2">
                  <span>{playlist.videos?.length || 0} videos</span>
                  {playlist.owner && (
                    <span className="ml-4">
                      by <Link to={`/dashboard/c/${playlist.owner.userName}`} className="text-blue-500 hover:underline">
                        {playlist.owner.userName}
                      </Link>
                    </span>
                  )}
                </div>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Videos List */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Videos</h2>
        {playlist.videos?.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-gray-400 text-lg">No videos in this playlist yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {playlist.videos?.map((video) => (
              <div key={video._id} className="relative">
                <VideoCard video={video} />
                {isOwner && (
                  <button
                    onClick={() => handleRemoveVideo(video._id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors z-10 shadow-lg"
                    title="Remove from playlist"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
