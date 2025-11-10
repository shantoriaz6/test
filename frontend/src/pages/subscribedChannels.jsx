import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toggleSubscription } from '../services/subscriptionService';

const SubscribedChannels = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (currentUser?._id) {
      fetchSubscribedChannels();
    }
  }, [currentUser?._id]);

  const fetchSubscribedChannels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/v1/subscriptions/u/${currentUser._id}`,
        { withCredentials: true }
      );

      console.log('Subscribed channels response:', response.data);

      if (response.data?.statusCode === 200) {
        setChannels(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError(err.response?.data?.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading subscriptions...</div>
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
      <h1 className="text-3xl font-bold text-white mb-6">Subscriptions</h1>
      
      {channels.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No subscriptions yet</p>
          <p className="text-gray-500 text-sm mt-2">Subscribe to channels to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl-grid-cols-4 gap-6">
          {channels.map((channel) => (
            <Link
              key={channel._id}
              to={`/dashboard/c/${channel.userName}`}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
            >
              <div className="flex flex-col items-center">
                <img
                  src={channel.avatar}
                  alt={channel.userName}
                  className="w-24 h-24 rounded-full object-cover mb-3"
                />
                <h3 className="text-white font-semibold text-lg mb-1">
                  {channel.fullName || channel.userName}
                </h3>
                <p className="text-gray-400 text-sm">@{channel.userName}</p>
                {channel.subscribersCount !== undefined && (
                  <p className="text-gray-500 text-xs mt-2">
                    {channel.subscribersCount} subscribers
                  </p>
                )}
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await toggleSubscription(channel._id);
                      // Optimistically remove from list (since this page shows channels the user is subscribed to)
                      setChannels(prev => prev.filter(c => c._id !== channel._id));
                    } catch (err) {
                      alert(err.message || 'Failed to update subscription');
                    }
                  }}
                  className="mt-3 px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 text-sm font-medium"
                >
                  Unsubscribe
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscribedChannels;