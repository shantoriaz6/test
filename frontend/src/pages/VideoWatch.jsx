import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VideoWatch = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/v1/videos/${videoId}`, {
        withCredentials: true
      });

      if (response.data && response.data.statusCode === 200) {
        setVideo(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching video:', err);
      setError(err.response?.data?.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading video...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Video not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black rounded-lg overflow-hidden mb-6">
          <video
            controls
            autoPlay
            className="w-full"
            src={video.videoFile}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h1 className="text-white text-2xl font-bold mb-4">{video.title}</h1>

          {video.owner && (
            <div className="flex items-center mb-4">
              <img
                src={video.owner.avatar}
                alt={video.owner.userName}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <p className="text-white font-semibold">{video.owner.userName}</p>
                <p className="text-gray-400 text-sm">
                  {video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Description</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoWatch;
