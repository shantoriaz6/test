import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// A compact list of suggested videos shown on the right side of the watch page
// Fetches a small set of videos and excludes the currently playing video
const SuggestedVideos = ({ currentVideoId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(
          'http://localhost:8000/api/v1/videos',
          {
            params: { limit: 12, sortBy: 'createdAt', sortType: 'desc' },
            withCredentials: true,
          }
        );
        if (resp?.data?.statusCode === 200 && Array.isArray(resp.data.data)) {
          const list = resp.data.data.filter((v) => v?._id !== currentVideoId);
          setVideos(list);
        } else {
          setError('Failed to load suggestions');
        }
      } catch (err) {
        console.error('Suggestions fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [currentVideoId]);

  if (loading) {
    return (
      <div className="text-gray-300 text-sm">Loading suggestions…</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-sm">{error}</div>
    );
  }

  if (!videos.length) {
    return (
      <div className="text-gray-400 text-sm">No suggestions available</div>
    );
  }

  const formatDurationHMS = (val) => {
    const n = typeof val === 'number' ? val : parseFloat(val);
    if (!Number.isFinite(n)) return null;
    const total = Math.floor(n);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      {videos.slice(0, 8).map((v) => (
        <Link
          key={v._id}
          to={`/dashboard/videos/${v._id}`}
          className="flex gap-3 group"
        >
          <div className="relative w-40 h-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-800">
            <img
              src={v.thumbnail}
              alt={v.title}
              className="w-full h-full object-cover transform transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
            {v.duration !== undefined && v.duration !== null && (
              <span className="absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-black/80 text-white">
                {formatDurationHMS(v.duration)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-white text-sm font-semibold leading-snug truncate" title={v.title}>
              {v.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              {v.owner?.avatar && (
                <img
                  src={v.owner.avatar}
                  alt={v.owner?.userName}
                  className="w-5 h-5 rounded-full"
                  loading="lazy"
                />
              )}
              <span className="text-gray-400 text-xs truncate">
                {v.owner?.userName || 'Unknown'}
              </span>
            </div>
            <p className="text-gray-500 text-[11px] mt-0.5">
              {(v.views || 0).toLocaleString()} views • {new Date(v.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SuggestedVideos;
