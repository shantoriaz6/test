import React from 'react'
import { FaTachometerAlt, FaVideo, FaTwitter } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { MdSubscriptions } from 'react-icons/md';
import { MdHistory } from 'react-icons/md';
import { MdPlaylistPlay } from 'react-icons/md'; 
import { AiOutlineLike } from 'react-icons/ai'; 

const Sidebar = () => {
  return (
    <div className='w-64 bg-gray-800 fixed left-0 top-0 h-full px-4 py-2'>
       <div className="my-2 mb-4">
        <h1 className='text-2x text-white font-bold'>VideoTube</h1>
       </div>

         <hr/>

       <ul className='mt-3 text-white font-bold'>
        <li className='mb-2 rounded hover:bg-blue-500 py-2'>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                isActive ? 'px-3 text-blue-300' : 'px-3'
              }
            >
              <FaVideo className="inline-block w-6 h-6 mr-2 -mt-2" />
              Videos
            </NavLink>
        </li>

          <li className='mb-2 rounded hover:bg-blue-500 py-2'>
              <NavLink 
                to="/dashboard/tweets" 
                className={({ isActive }) => 
                  isActive ? 'px-3 text-blue-300' : 'px-3'
                }
              >
                <FaTwitter className="inline-block w-6 h-6 mr-2 -mt-2" />
                Tweets
              </NavLink>
          </li>

        <li className='mb-2 rounded hover:bg-blue-500 py-2'>
            <NavLink 
              to="/dashboard/subscriptions" 
              className={({ isActive }) => 
                isActive ? 'px-3 text-blue-300' : 'px-3'
              }
            >
              <MdSubscriptions className="inline-block w-6 h-6 mr-2 -mt-2" />
              Subscriptions
            </NavLink>
        </li>

        <li className='mb-2 rounded hover:bg-blue-500 py-2'>
            <NavLink 
              to="/dashboard/history" 
              className={({ isActive }) => 
                isActive ? 'px-3 text-blue-300' : 'px-3'
              }
            >
              <MdHistory className="inline-block w-6 h-6 mr-2 -mt-2" />
              History
            </NavLink>
        </li>

        <li className='mb-2 rounded hover:bg-blue-500 py-2'>
            <NavLink 
              to="/dashboard/playlists" 
              className={({ isActive }) => 
                isActive ? 'px-3 text-blue-300' : 'px-3'
              }
            >
              <MdPlaylistPlay className="inline-block w-6 h-6 mr-2 -mt-2" />
              Playlists
            </NavLink>
        </li>

        <li className='mb-2 rounded hover:bg-blue-500 py-2'>
            <NavLink 
              to="/dashboard/liked-videos" 
              className={({ isActive }) => 
                isActive ? 'px-3 text-blue-300' : 'px-3'
              }
            >
              <AiOutlineLike className="inline-block w-6 h-6 mr-2 -mt-2" />
              Liked Videos
            </NavLink>
        </li>
       </ul>
    </div>
  )
}

export default Sidebar