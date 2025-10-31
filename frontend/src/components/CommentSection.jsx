import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaRegThumbsUp, FaEdit, FaTrash } from 'react-icons/fa';
import { getComments, addComment, updateComment, deleteComment } from '../services/commentService';
import { toggleCommentLike } from '../services/likeService';

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await getComments(videoId);
      if (response?.statusCode === 200 && Array.isArray(response.data)) {
        setComments(response.data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err.response?.data?.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await addComment(videoId, newComment);
      if (response?.statusCode === 201) {
        setNewComment('');
        await fetchComments();
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      alert(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      setSubmitting(true);
      const response = await updateComment(commentId, editContent);
      if (response?.statusCode === 200) {
        setEditingId(null);
        setEditContent('');
        await fetchComments();
      }
    } catch (err) {
      console.error('Error updating comment:', err);
      alert(err.response?.data?.message || 'Failed to update comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await deleteComment(commentId);
      if (response?.statusCode === 200) {
        await fetchComments();
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  if (loading) {
    return <div className="text-gray-300">Loading comments...</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-semibold text-lg mb-4">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="mb-6">
        <div className="flex gap-3">
          {currentUser?.avatar && (
            <img
              src={currentUser.avatar}
              alt={currentUser.userName}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              disabled={submitting}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setNewComment('')}
                className="px-4 py-1.5 text-sm text-gray-300 hover:text-white"
                disabled={submitting || !newComment.trim()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            {comment.allcomments?.avatar && (
              <img
                src={comment.allcomments.avatar}
                alt={comment.allcomments.userName}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <div className="bg-gray-700 rounded-lg px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-white font-semibold text-sm">
                      {comment.allcomments?.userName || 'Unknown User'}
                    </span>
                    <span className="text-gray-400 text-xs ml-2">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {currentUser?._id === comment.allcomments?._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(comment)}
                        className="text-gray-400 hover:text-blue-400 text-sm"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-gray-400 hover:text-red-400 text-sm"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                {editingId === comment._id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-gray-600 text-white rounded px-2 py-1 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      disabled={submitting}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-xs text-gray-300 hover:text-white"
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateComment(comment._id)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={submitting || !editContent.trim()}
                      >
                        {submitting ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-200 text-sm whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && !error && (
          <div className="text-gray-400 text-center py-8">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
