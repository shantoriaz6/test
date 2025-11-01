import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaVideo, FaImage, FaUpload } from 'react-icons/fa';

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }
      
      // Validate file size (e.g., max 500MB)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        setError('Video file size must be less than 500MB');
        return;
      }

      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file for thumbnail');
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('Thumbnail file size must be less than 5MB');
        return;
      }

      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    if (!thumbnail) {
      setError('Please select a thumbnail image');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Create FormData
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('videoFile', videoFile);
      uploadData.append('thumbnail', thumbnail);

      console.log('Uploading video with data:', {
        title: formData.title,
        description: formData.description,
        videoFileName: videoFile.name,
        thumbnailFileName: thumbnail.name
      });

      // Upload to backend
      const response = await axios.post(
        'http://localhost:8000/api/v1/videos',
        uploadData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      console.log('Upload response:', response.data);

      if (response.data?.statusCode === 200) {
        alert('Video uploaded successfully!');
        navigate('/dashboard');
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to upload video. Please try again.'
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All data will be lost.')) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Upload Video</h1>

      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Title <span className="text-red-500"></span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter video title"
            className="w-full bg-gray-700 text-white font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={uploading}
            maxLength={100}
          />
          <p className="text-gray-400 text-xs mt-1">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Description <span className="text-red-500"></span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter video description"
            rows="5"
            className="w-full bg-gray-700 text-white font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={uploading}
            maxLength={5000}
          />
          <p className="text-gray-400 text-xs mt-1">
            {formData.description.length}/5000 characters
          </p>
        </div>

        {/* Video File Upload */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Video File <span className="text-red-500"></span>
          </label>
          <div className="border-4 border-solid border-gray-700 bg-gray-700 rounded-lg p-6">
            {videoPreview ? (
              <div className="space-y-3">
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-h-64 rounded-lg bg-black"
                />
                <div className="flex items-center justify-between">
                  <p className="text-gray-300 text-sm">{videoFile.name}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview(null);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                    disabled={uploading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer">
                <FaVideo className="text-gray-400 text-5xl mb-3" />
                <span className="text-gray-300 font-bold mb-2">Click to select video file</span>
                <span className="text-gray-300 font-boldtext-sm">MP4, AVI, MOV (Max 500MB)</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Thumbnail <span className="text-red-500">*</span>
          </label>
          <div className="border-4 border-solid border-gray-700 bg-gray-700 rounded-lg p-6">
            {thumbnailPreview ? (
              <div className="space-y-3">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full max-h-64 object-contain rounded-lg bg-gray-800"
                />
                <div className="flex items-center justify-between">
                  <p className="text-gray-300 text-sm">{thumbnail.name}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview(null);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                    disabled={uploading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer">
                <FaImage className="text-gray-400 text-5xl mb-3" />
                <span className="text-gray-300 font-bold mb-2">Click to select thumbnail</span>
                <span className="text-gray-300 text-sm font-bold">JPG, PNG (Max 5MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            <FaUpload />
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={uploading}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadVideo;