import React, { useEffect, useState } from 'react';
import { createTweet, getTweets, updateTweet, deleteTweet } from '../services/tweetService';

const TweetFeed = () => {
	const [tweets, setTweets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [newContent, setNewContent] = useState('');
	const [editingId, setEditingId] = useState(null);
	const [editingContent, setEditingContent] = useState('');
	const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

	useEffect(() => {
		fetchTweets();
	}, [page]);

	const fetchTweets = async () => {
		try {
			setLoading(true);
			const data = await getTweets({ page, limit });
			setTweets(data);
			setError('');
		} catch (err) {
			setError(err.message || 'Failed to load tweets');
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = async (e) => {
		e.preventDefault();
		const content = newContent.trim();
		if (!content) return;
		try {
			const created = await createTweet(content);
			setTweets((prev) => [created, ...prev]);
			setNewContent('');
		} catch (err) {
			alert(err.message || 'Failed to create tweet');
		}
	};

	const startEdit = (tweet) => {
		setEditingId(tweet._id);
		setEditingContent(tweet.content);
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditingContent('');
	};

	const handleUpdate = async (tweetId) => {
		const content = editingContent.trim();
		if (!content) return;
		try {
			const updated = await updateTweet(tweetId, content);
			setTweets((prev) => prev.map((t) => (t._id === tweetId ? updated : t)));
			cancelEdit();
		} catch (err) {
			alert(err.message || 'Failed to update tweet');
		}
	};

	const handleDelete = async (tweetId) => {
		if (!window.confirm('Delete this tweet?')) return;
		try {
			await deleteTweet(tweetId);
			setTweets((prev) => prev.filter((t) => t._id !== tweetId));
		} catch (err) {
			alert(err.message || 'Failed to delete tweet');
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-white text-xl">Loading tweets...</div>
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
      <h1 className="text-3xl font-bold text-white mb-6">Tweet Feed</h1>			{/* Create Tweet */}
			<form onSubmit={handleCreate} className="mb-6 bg-gray-800 p-4 rounded-lg">
				<textarea
					value={newContent}
					onChange={(e) => setNewContent(e.target.value)}
					placeholder="What's happening?"
					className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					rows={3}
					maxLength={280}
				/>
				<div className="flex justify-between mt-2 text-gray-400 text-sm">
					<span>{newContent.length}/280</span>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
						disabled={!newContent.trim()}
					>
						Tweet
					</button>
				</div>
			</form>

			{/* Tweets List */}
			<div className="space-y-4">
				{tweets.map((tweet) => {
					const isOwner = currentUser?._id === tweet.owner?._id;
					return (
						<div key={tweet._id} className="bg-gray-800 p-4 rounded-lg">
							<div className="flex items-center gap-3 mb-3">
								<img
									src={tweet.owner?.avatar}
									alt={tweet.owner?.userName}
									className="w-10 h-10 rounded-full object-cover"
								/>
								<div>
									<div className="text-white font-semibold">{tweet.owner?.fullName || tweet.owner?.userName}</div>
									<div className="text-gray-400 text-sm">@{tweet.owner?.userName}</div>
								</div>
								<div className="ml-auto text-gray-500 text-sm">
									{new Date(tweet.createdAt).toLocaleString()}
								</div>
							</div>

							{editingId === tweet._id ? (
								<div>
									<textarea
										value={editingContent}
										onChange={(e) => setEditingContent(e.target.value)}
										className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
										rows={3}
										maxLength={280}
									/>
									<div className="flex gap-2 mt-2">
										<button
											onClick={() => handleUpdate(tweet._id)}
											className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
										>
											Save
										</button>
										<button
											onClick={cancelEdit}
											className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
										>
											Cancel
										</button>
									</div>
								</div>
							) : (
								<p className="text-white whitespace-pre-wrap">{tweet.content}</p>
							)}

							{isOwner && editingId !== tweet._id && (
								<div className="flex gap-4 mt-3 text-sm">
									<button
										onClick={() => startEdit(tweet)}
										className="text-blue-400 hover:text-blue-300"
									>
										Edit
									</button>
									<button
										onClick={() => handleDelete(tweet._id)}
										className="text-red-400 hover:text-red-300"
									>
										Delete
									</button>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Pagination */}
			<div className="flex justify-center gap-3 mt-6">
				<button
					onClick={() => setPage((p) => Math.max(1, p - 1))}
					className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
					disabled={page === 1}
				>
					Previous
				</button>
				<span className="text-gray-300 px-3 py-2">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TweetFeed;