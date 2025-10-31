import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import { FaSearch } from 'react-icons/fa'
import { FaBell } from 'react-icons/fa'
import { FaUserCircle } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import ChannelProfile from '../pages/ChannelProfile'


const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className='bg-gray-800 px-4 py-3 flex justify-between fixed top-0 left-64 right-0 z-50'>
      <div className='flex items-center text-xl'>
        <FaBars className='text-white me-4 cursor-pointer'/>          
        <span className='text-white font font-semibold'>Video tube</span>

      </div>
      <div className='flex items center gap-x-5'>

        <div className='relative md:65'>
          <span className='relative md:absolute inset-y-0 left-0 flex items-center pl-2'>
            <button className='p-1 focus:outline-none text-white md:text-black'>
             <FaSearch/>
            </button>
          </span>
          <input type="text" className='w-full px-4 py-1 pl-12 rounded shadow outline-none hidden md:block' />
        </div>

        <div className='text-white'>
          <FaBell className='w-6 h-6 mt-1'/>
        </div>

        <div className='relative'>
          <button 
            className='text-white group'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FaUserCircle className='w-6 h-6 mt-1'/>
          </button>

          {isDropdownOpen && (
            <div className='z-10 absolute bg-white rounded-lg shadow w-32 top-full right-0'>
              <ul className='py-2 text-sm text-gray-950'>
                <li>
                  <NavLink to={`/c/${ChannelProfile}`} className="block px-4 py-2 hover:bg-gray-100">Profile</NavLink>
                </li>
                <li>
                  <NavLink to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</NavLink>
                </li>
                <li>
                  <NavLink to="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</NavLink>
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