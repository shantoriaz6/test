import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import VideoCard from './VideoCard';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchVideos();
  }, [searchQuery]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortType: 'desc'
      };
      
      // Add search query if present
      if (searchQuery) {
        params.query = searchQuery;
      }
      
      const response = await axios.get('http://localhost:8000/api/v1/videos', {
        params,
        withCredentials: true
      });

      console.log('Videos response:', response.data);

      if (response.data && response.data.statusCode === 200) {
        setVideos(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      // If it's a 404 (no videos found), show empty state instead of error
      if (err.response?.status === 404) {
        setVideos([]);
      } else {
        setError(err.response?.data?.message || 'Failed to load videos');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading videos...</div>
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
      <h1 className="text-3xl font-bold text-white mb-6">
        {searchQuery ? `Search Results for "${searchQuery}"` : 'Dashboard'}
      </h1>
      
      {videos.length === 0 ? (
        <div className="text-center text-gray-400 text-xl mt-10">
          {searchQuery 
            ? `No videos found for "${searchQuery}". Try a different search term.`
            : 'No videos found. Upload your first video!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;