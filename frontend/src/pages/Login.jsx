import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.emailOrUsername || !formData.password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      // Determine if input is email or username
      const isEmail = formData.emailOrUsername.includes('@');
      const loginData = {
        password: formData.password,
        ...(isEmail ? { email: formData.emailOrUsername } : { userName: formData.emailOrUsername })
      };

      console.log('Sending login data:', loginData);

      const response = await axios.post('http://localhost:8000/api/v1/users/login', loginData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Login response:', response.data);

      // Backend returns data in response.data.data
      if (response.data && response.data.statusCode === 200) {
        alert('Login successful!');
        // Store user data or token if needed
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-xl font-extrabold text-white">
            Welcome back
          </h2>
          <p className="mt-1 text-center text-xs text-white font-bold">
            Sign in to your VideoTube account
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
              <label htmlFor="emailOrUsername" className="text-white text-xs font-medium block mb-1">
                Email or Username
              </label>
              <input
                id="emailOrUsername"
                name="emailOrUsername"
                type="text"
                required
                className="appearance-none rounded-md block w-full px-3 py-1.5 border border-gray-600 bg-gray-700 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="riaz1@example.com or riazshanto"
                value={formData.emailOrUsername}
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
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <div className="text-center pt-1">
            <p className="text-xs text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-500 hover:text-blue-400">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;