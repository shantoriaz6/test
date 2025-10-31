import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.userName || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!avatar) {
      setError('Avatar image is required');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('userName', formData.userName);
      data.append('password', formData.password);
      data.append('avatar', avatar);
      if (coverImage) {
        data.append('coverImage', coverImage);
      }

      const response = await axios.post('http://localhost:8000/api/v1/users/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Backend returns data in response.data with statusCode
      if (response.data && response.data.statusCode === 200) {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-1 text-center text-xs text-white font-bold">
            Join VideoTube today
          </p>
        </div>

        <form className="mt-3 space-y-2" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500 text-white p-2 rounded-md text-xs">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <div>
              <label htmlFor="fullName" className="text-white text-xs font-medium block mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="appearance-none rounded-md block w-full px-3 py-1.5 border border-gray-600 bg-gray-700 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Riaz Uddin Shanto"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="userName" className="text-white text-xs font-medium block mb-1">
                Username
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                required
                className="appearance-none rounded-md block w-full px-3 py-1.5 border border-gray-600 bg-gray-700 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="riazshanto"
                value={formData.userName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="text-white text-xs font-medium block mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md block w-full px-3 py-1.5 border border-gray-600 bg-gray-700 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="riaz2@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-white text-xs font-medium block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-md block w-full px-3 py-1.5 pr-10 border border-gray-600 bg-gray-700 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-white text-xs font-medium block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-md block w-full px-3 py-1.5 pr-10 border border-gray-600 bg-gray-700 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="avatar" className="text-white text-xs font-medium block mb-1">
                Avatar Image 
              </label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                required
                onChange={handleAvatarChange}
                className="appearance-none rounded-md block w-full px-2 py-1.5 border border-gray-600 bg-gray-700 text-white text-xs file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer"
              />
              {avatarPreview && (
                <img src={avatarPreview} alt="Avatar Preview" className="mt-1 h-12 w-12 rounded-full object-cover" />
              )}
            </div>

            <div>
              <label htmlFor="coverImage" className="text-white text-xs font-medium block mb-1">
                Cover Image (Optional)
              </label>
              <input
                id="coverImage"
                name="coverImage"
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="appearance-none rounded-md block w-full px-2 py-1.5 border border-gray-600 bg-gray-700 text-white text-xs file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer"
              />
              {coverPreview && (
                <img src={coverPreview} alt="Cover Preview" className="mt-1 h-20 w-full rounded object-cover" />
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Registering...' : 'Register yourself'}
            </button>
          </div>

          <div className="text-center pt-1">
            <p className="text-xs text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-500 hover:text-blue-400">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;