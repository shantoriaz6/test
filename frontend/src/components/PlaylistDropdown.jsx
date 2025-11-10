import React, { useEffect, useState } from 'react';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { getUserPlaylists, addVideoToPlaylist, removeVideoFromPlaylist } from '../services/playlistService';

const PlaylistDropdown = ({ videoId, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const data = await getUserPlaylists(currentUser._id);
      setPlaylists(data);
    } catch (err) {
      console.error('Error fetching playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVideo = async (playlistId, isInPlaylist) => {
    try {
      if (isInPlaylist) {
        await removeVideoFromPlaylist(videoId, playlistId);
        alert('Video removed from playlist!');
      } else {
        await addVideoToPlaylist(videoId, playlistId);
        alert('Video added to playlist!');
      }
      // Refresh playlists
      await fetchPlaylists();
    } catch (err) {
      alert(err.message || 'Failed to update playlist');
    }
  };

  const isVideoInPlaylist = (playlist) => {
    return playlist.videos?.some(v => v._id === videoId);
  };

  return (
    <div className="absolute top-full right-0 mt-2 bg-gray-800 rounded-lg shadow-lg p-4 w-64 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-semibold">Save to Playlist</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
      </div>
      
      {loading ? (
        <div className="text-gray-400 text-sm">Loading playlists...</div>
      ) : playlists.length === 0 ? (
        <div className="text-gray-400 text-sm">No playlists yet</div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {playlists.map((playlist) => {
            const isInPlaylist = isVideoInPlaylist(playlist);
            return (
              <button
                key={playlist._id}
                onClick={() => handleToggleVideo(playlist._id, isInPlaylist)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-700 text-left transition-colors"
              >
                <span className="text-white text-sm">{playlist.name}</span>
                {isInPlaylist && <FaCheck className="text-blue-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlaylistDropdown;
