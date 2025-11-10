import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import { createPlaylist } from '../services/playlistService';

const CreatePlaylist = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name) {
      setError('Playlist name is required');
      return;
    }
    setLoading(true);
    try {
      await createPlaylist({ name, description });
      alert('Playlist created successfully!');
      navigate('/dashboard/playlists');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-white text-2xl font-bold mb-4">Create Playlist</h2>
        {error && <div className="bg-red-500 text-white p-2 rounded mb-2 text-sm">{error}</div>}
        <div className="mb-4">
          <label className="block text-white mb-1">Playlist Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            maxLength={100}
            placeholder="My Playlist"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-1">Description (optional)</label>
          <textarea
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={500}
            placeholder="Describe your playlist"
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-1">Thumbnail Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="w-full px-2 py-1.5 border border-gray-600 bg-gray-700 text-white text-xs file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer"
          />
          {thumbnailPreview && (
            <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 h-24 w-full object-cover rounded" />
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : <><FaUpload className="mr-2" /> Create Playlist</>}
        </button>
      </form>
    </div>
  );
};

export default CreatePlaylist;