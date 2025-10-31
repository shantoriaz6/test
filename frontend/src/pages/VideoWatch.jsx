import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import SuggestedVideos from '../components/SuggestedVideos';
import CommentSection from '../components/CommentSection';
import { toggleVideoLike } from '../services/likeService';

const VideoWatch = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchVideo();
    fetchLikeStatus();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      console.log('Fetching video with ID:', videoId);
      
      const response = await axios.get(`http://localhost:8000/api/v1/videos/${videoId}`, {
        withCredentials: true
      });

      console.log('Full video response:', response);
      console.log('Video data:', response.data);

      if (response.data && response.data.statusCode === 200) {
        console.log('Video object:', response.data.data);
        console.log('Video file URL:', response.data.data.videoFile);
        setVideo(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching video:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      // Fetch all liked videos to check if current video is liked
      const response = await axios.get('http://localhost:8000/api/v1/likes/videos', {
        withCredentials: true
      });
      if (response.data?.statusCode === 200 && Array.isArray(response.data.data)) {
        const liked = response.data.data.some(v => v._id === videoId);
        setIsLiked(liked);
      }
    } catch (err) {
      console.error('Error fetching like status:', err);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const response = await toggleVideoLike(videoId);
      if (response?.statusCode === 200) {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? Math.max(0, prev - 1) : prev + 1);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      alert(err.response?.data?.message || 'Failed to toggle like');
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
    <div className="min-h-screen bg-gray-900">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left: main video and details */}
          <div className="lg:col-span-8 xl:col-span-9 bg-gray-900">
            <div className="bg-black overflow-hidden">
              <video
                controls
                autoPlay
                className="w-full h-auto sm:max-h-[420px] md:max-h-[480px] lg:max-h-[540px] xl:max-h-[600px]"
                src={video.videoFile}
                onError={(e) => {
                  console.error('Video playback error:', e);
                  console.error('Video source:', video.videoFile);
                  setError('Failed to load video file. The video may be in an unsupported format.');
                }}
                onLoadStart={() => console.log('Video loading started...')}
                onLoadedData={() => console.log('Video data loaded successfully')}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="bg-gray-800 p-4 px-6">
              <h1 className="text-white text-xl font-bold mb-3">{video.title}</h1>

              {video.owner && (
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <img
                      src={video.owner.avatar}
                      alt={video.owner.userName}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <div>
                      <p className="text-white font-semibold text-sm">{video.owner.userName}</p>
                      <p className="text-gray-400 text-xs">
                        {video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={handleLikeToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      isLiked
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    <span className="text-sm font-semibold">
                      {isLiked ? 'Liked' : 'Like'}
                    </span>
                  </button>
                </div>
              )}

              <div className="bg-gray-700 rounded-lg p-3">
                <h3 className="text-white font-semibold text-sm mb-2">Description</h3>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{video.description}</p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="px-6 pb-6">
              <CommentSection videoId={video._id} />
            </div>
          </div>

          {/* Right: suggested/related videos */}
          <div className="lg:col-span-4 xl:col-span-3 bg-gray-900">
            <div className="bg-gray-800 p-3 h-full sticky top-16">
              <h2 className="text-white font-semibold text-sm mb-3">Suggested videos</h2>
              <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
                <SuggestedVideos currentVideoId={video._id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoWatch;
