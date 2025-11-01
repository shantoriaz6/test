import React, { useState, useEffect } from 'react'
import { FaBars, FaSearch, FaBell, FaUserCircle, FaTimes } from 'react-icons/fa'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user:', err);
      }
    }
    
    // Sync search query with URL
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/v1/users/logout', {}, {
        withCredentials: true
      });
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout even if API fails
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    navigate('/dashboard');
  };

  return (
    <nav className='bg-gray-800 px-4 h-16 flex items-center justify-between fixed top-0 left-64 right-0 z-50'>
      <div className='flex items-center text-xl'>
        <FaBars className='text-white me-4 cursor-pointer'/>          
        <NavLink to="/dashboard" className='text-white font font-semibold hover:text-blue-400'>
          VideoTube
        </NavLink>
      </div>
      
      <div className='flex items-center gap-x-5'>
        <form onSubmit={handleSearch} className='relative md:w-65'>
          <span className='relative md:absolute inset-y-0 left-0 flex items-center pl-2'>
            <button type="submit" className='p-1 focus:outline-none text-white md:text-black'>
              <FaSearch/>
            </button>
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos..."
            className='w-full px-4 py-1 pl-12 pr-10 rounded shadow outline-none hidden md:block' 
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className='absolute inset-y-0 right-0 hidden md:flex items-center pr-3 text-gray-500 hover:text-gray-700'
            >
              <FaTimes />
            </button>
          )}
        </form>

        <div className='text-white cursor-pointer hover:text-blue-400'>
          <FaBell className='w-6 h-6 mt-1'/>
        </div>

        <div className='relative'>
          <button 
            className='text-white group flex items-center gap-2'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.userName} 
                className='w-8 h-8 rounded-full object-cover'
              />
            ) : (
              <FaUserCircle className='w-6 h-6 mt-1'/>
            )}
          </button>

          {isDropdownOpen && (
            <div className='z-10 absolute bg-white rounded-lg shadow w-48 top-full right-0 mt-2'>
              <ul className='py-2 text-sm text-gray-950'>
                {user && (
                  <>
                    <li className='px-4 py-2 border-b border-gray-200'>
                      <p className='font-semibold'>{user.userName}</p>
                      <p className='text-xs text-gray-600'>{user.email}</p>
                    </li>
                    <li>
                      <NavLink 
                        to={`/dashboard/c/${user.userName}`} 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Channel
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="/dashboard/upload" 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Upload Video
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="/dashboard/playlists" 
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Playlists
                      </NavLink>
                    </li>
                  </>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-semibold"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;