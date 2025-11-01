import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEllipsisV, FaPlus } from 'react-icons/fa';
import PlaylistDropdown from './PlaylistDropdown';

const VideoCard = ({ video }) => {
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views;
  };

  return (
    <div className="group relative">
      <Link to={`/dashboard/videos/${video._id}`} className="block">
        <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-gray-700">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            {video.duration && (
              <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </span>
            )}
            
            {/* Add to Playlist Button - Shows on hover */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPlaylistDropdown(!showPlaylistDropdown);
              }}
              className="absolute top-2 right-2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white font-bold p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Add to playlist"
            >
              <FaPlus />
            </button>
          </div>

        {/* Video Info */}
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>
          
          {video.owner && (
            <div className="flex items-center mt-2">
              <img
                src={video.owner.avatar}
                alt={video.owner.userName}
                className="w-6 h-6 rounded-full mr-2"
              />
              <p className="text-gray-400 text-xs">{video.owner.userName}</p>
            </div>
          )}

          <div className="flex items-center text-gray-400 text-xs mt-2">
            <span>{formatViews(video.views || 0)} views</span>
            <span className="mx-2">•</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        </div>
      </Link>
      
      {/* Playlist Dropdown - Outside Link to prevent navigation */}
      {showPlaylistDropdown && (
        <div className="relative">
          <PlaylistDropdown
            videoId={video._id}
            onClose={() => setShowPlaylistDropdown(false)}
          />
        </div>
      )}
    </div>
  );
};

export default VideoCard;