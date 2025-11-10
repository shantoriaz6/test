import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toggleSubscription as toggleSubscriptionApi } from '../services/subscriptionService';
import { FaUserCheck, FaUserPlus, FaCamera, FaEdit } from 'react-icons/fa';
import VideoCard from '../components/VideoCard';

const ChannelProfile = () => {
  const { userName } = useParams();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [activeTab, setActiveTab] = useState('videos');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwnChannel = currentUser?.userName === userName;

  useEffect(() => {
    if (userName) {
      fetchChannelProfile();
    }
  }, [userName]);

  useEffect(() => {
    if (channel?._id) {
      fetchChannelVideos();
    }
  }, [channel?._id]);

  const fetchChannelProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/v1/users/c/${userName}`,
        { withCredentials: true }
      );

      console.log('Channel profile response:', response.data);

      if (response.data?.statusCode === 200) {
        setChannel(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching channel profile:', err);
      setError(err.response?.data?.message || 'Failed to load channel profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelVideos = async () => {
    try {
      setVideosLoading(true);
      // Fetch videos by this channel owner
      const response = await axios.get(
        `http://localhost:8000/api/v1/videos`,
        {
          params: { userId: channel?._id },
          withCredentials: true
        }
      );

      console.log('Channel videos response:', response.data);

      if (response.data?.statusCode === 200) {
        setVideos(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching channel videos:', err);
      // Don't show error for videos, just keep empty array
    } finally {
      setVideosLoading(false);
    }
  };

  const handleSubscribeToggle = async () => {
    if (!channel?._id) return;

    try {
      setSubscribing(true);
      const response = await toggleSubscriptionApi(channel._id);

      console.log('Subscribe toggle response:', response);

      if (response?.statusCode === 200) {
        // Update local state
        setChannel(prev => ({
          ...prev,
          isSubscribed: !prev.isSubscribed,
          subscribersCount: prev.isSubscribed 
            ? prev.subscribersCount - 1 
            : prev.subscribersCount + 1
        }));
      }
    } catch (err) {
      console.error('Error toggling subscription:', err);
      alert(err.response?.data?.message || 'Failed to toggle subscription');
    } finally {
      setSubscribing(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.patch(
        'http://localhost:8000/api/v1/users/avatar',
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data?.statusCode === 200) {
        // Update local state and localStorage
        const updatedChannel = { ...channel, avatar: URL.createObjectURL(file) };
        setChannel(updatedChannel);
        
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.avatar = response.data.data?.avatar || URL.createObjectURL(file);
        localStorage.setItem('user', JSON.stringify(user));
        
        alert('Avatar updated successfully!');
        // Refresh to get the actual Cloudinary URL
        fetchChannelProfile();
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Cover image must be less than 5MB');
      return;
    }

    try {
      setUploadingCover(true);
      const formData = new FormData();
      formData.append('coverImage', file);

      console.log('Uploading cover image...');

      const response = await axios.patch(
        'http://localhost:8000/api/v1/users/cover-Image',
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      console.log('Cover upload response:', response.data);

      if (response.data?.statusCode === 200) {
        alert('Cover image updated successfully!');
        // Refresh to get the actual Cloudinary URL
        await fetchChannelProfile();
      }
    } catch (err) {
      console.error('Error uploading cover image:', err);
      console.error('Error details:', err.response?.data);
      alert(err.response?.data?.message || 'Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading channel...</div>
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

  if (!channel) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Channel not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-700 w-full">
      <div className="bg-gray-800 rounded-lg">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gray-800 w-full rounded-t-lg overflow-hidden">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-900 to-purple-900" />
        )}
        
        {/* Edit Cover Button - Only for own channel */}
        {isOwnChannel && (
          <div className="absolute bottom-4 right-4">
            <label className="cursor-pointer bg-gray-900 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
              <FaCamera />
              <span className="text-sm font-semibold">
                {uploadingCover ? 'Uploading...' : 'Edit Cover'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
                disabled={uploadingCover}
              />
            </label>
          </div>
        )}
      </div>

      {/* Channel Info */}
  <div className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-20 md:-mt-24 relative">
          {/* Avatar */}
          <div className="relative z-10">
            <img
              src={channel.avatar}
              alt={channel.userName}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-900 object-cover bg-gray-800"
            />
            
            {/* Edit Avatar Button - Only for own channel */}
            {isOwnChannel && (
              <label className="absolute bottom-0 right-0 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors shadow-lg">
                <FaEdit className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </label>
            )}
          </div>

          {/* Channel Details */}
          <div className="flex-1 md:mb-4 mt-4 md:mt-0">
            <h1 className="text-white text-3xl font-bold mb-1">
              {channel.fullName}
            </h1>
            <p className="text-gray-400 text-lg mb-2">@{channel.userName}</p>
            
            <div className="flex flex-wrap gap-4 text-gray-300 text-sm mb-4 pt-6 md:pt-8">
              <Link
                to={`/dashboard/subscribers/${channel._id}`}
                className="hover:text-white"
                title="View subscribers"
              >
                <strong className="text-white">{channel.subscribersCount || 0}</strong> subscribers
              </Link>
              <span>
                <strong className="text-white">{channel.channelsSubscribedToCount || 0}</strong> subscriptions
              </span>
              <span>
                <strong className="text-white">{videos.length}</strong> videos
              </span>
            </div>

            {channel.email && (
              <p className="text-gray-400 text-sm">{channel.email}</p>
            )}
          </div>

          {/* Subscribe Button */}
          {!isOwnChannel && (
            <button
              onClick={handleSubscribeToggle}
              disabled={subscribing}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors ${
                channel.isSubscribed
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-red-600 text-white hover:bg-red-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {channel.isSubscribed ? (
                <>
                  <FaUserCheck />
                  Subscribed
                </>
              ) : (
                <>
                  <FaUserPlus />
                  Subscribe
                </>
              )}
            </button>
          )}

          {isOwnChannel && (
            <button
              onClick={() => navigate('/dashboard/upload')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Upload Video
            </button>
          )}
        </div>

        {/* Tabs */}
  <div className="border-b border-gray-700 mt-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('videos')}
              className={`pb-3 px-2 font-semibold transition-colors relative ${
                activeTab === 'videos'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Videos
              {activeTab === 'videos' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 px-2 font-semibold transition-colors relative ${
                activeTab === 'about'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              About
              {activeTab === 'about' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
  <div className="mt-6">
          {activeTab === 'videos' && (
            <div>
              {videosLoading ? (
                <div className="text-gray-400 text-center py-12">Loading videos...</div>
              ) : videos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No videos uploaded yet</p>
                  {isOwnChannel && (
                    <button
                      onClick={() => navigate('/dashboard/upload')}
                      className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Upload Your First Video
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-gray-800 rounded-lg p-6 w-full">
              <h3 className="text-white text-xl font-semibold mb-4">About</h3>
              <div className="space-y-3 text-gray-300">
                <div>
                  <span className="text-gray-400">Username:</span>{' '}
                  <span className="text-white">@{channel.userName}</span>
                </div>
                <div>
                  <span className="text-gray-400">Full Name:</span>{' '}
                  <span className="text-white">{channel.fullName}</span>
                </div>
                {channel.email && (
                  <div>
                    <span className="text-gray-400">Email:</span>{' '}
                    <span className="text-white">{channel.email}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Subscribers:</span>{' '}
                  <span className="text-white">{channel.subscribersCount || 0}</span>
                </div>
                <div>
                  <span className="text-gray-400">Total Videos:</span>{' '}
                  <span className="text-white">{videos.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ChannelProfile;