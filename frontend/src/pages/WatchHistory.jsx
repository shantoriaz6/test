import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/v1/users/history', {
        withCredentials: true
      });

      console.log('History response:', response.data);

      if (response.data?.statusCode === 200) {
        setHistory(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.response?.data?.message || 'Failed to load watch history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading watch history...</div>
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
      <h1 className="text-3xl font-bold text-white mb-6">Watch History</h1>
      
      {history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No watch history yet</p>
          <p className="text-gray-500 text-sm mt-2">Videos you watch will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {history.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
