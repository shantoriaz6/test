import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getChannelSubscribers, getSubscribedChannels, toggleSubscription } from '../services/subscriptionService';

const ChannelSubscribers = () => {
  const { channelId } = useParams();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [subscribedSet, setSubscribedSet] = useState(new Set());

  useEffect(() => {
    if (channelId) {
      fetchSubscribers();
      if (currentUser?._id) fetchMySubscriptions();
    }
  }, [channelId, currentUser?._id]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const data = await getChannelSubscribers(channelId);
      setSubscribers(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const fetchMySubscriptions = async () => {
    try {
      const channels = await getSubscribedChannels(currentUser._id);
      const ids = new Set(channels.map(c => c._id));
      setSubscribedSet(ids);
    } catch (e) {
      // Non-fatal
      console.warn('Could not load my subscriptions');
    }
  };

  const onToggle = async (userId) => {
    try {
      await toggleSubscription(userId);
      setSubscribedSet(prev => {
        const next = new Set(prev);
        if (next.has(userId)) next.delete(userId); else next.add(userId);
        return next;
      });
    } catch (e) {
      alert(e.message || 'Failed to toggle');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading subscribers...</div>
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
      <h1 className="text-3xl font-bold text-white mb-6">Subscribers</h1>

      {subscribers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No subscribers yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subscribers.map((user) => (
            <Link
              key={user._id}
              to={`/dashboard/c/${user.userName}`}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.userName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-white font-semibold">{user.fullName || user.userName}</h3>
                  <p className="text-gray-400 text-sm">@{user.userName}</p>
                </div>
                {/* Subscribe button (skip self) */}
                {currentUser?._id && currentUser._id !== user._id && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); onToggle(user._id); }}
                    className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${subscribedSet.has(user._id) ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
                  >
                    {subscribedSet.has(user._id) ? 'Subscribed' : 'Subscribe'}
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelSubscribers;