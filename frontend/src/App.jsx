
import './App.css'

import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'

import DashboardVideos from './pages/DashboardVideos'
import VideoWatch from './pages/VideoWatch'
import EditVideo from './pages/EditVideo'
import ChannelSubscribers from './pages/ChannelSubscribers'
import LikedVideos from './pages/LikedVideos'
import Login from './pages/Login'

import Register from './pages/Register'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'

import UploadVideo from './pages/UploadVideo'
import CreatePlaylist from './pages/CreatePlaylist'
import Layout from './services/Layout'
import DashboardLayout from './services/DashboardLayout'

import ChannelProfile from './pages/ChannelProfile'




const router = createBrowserRouter(
  [
    {
      path: "/",
      element:
     
        <Layout />,
        children: [

      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'c/:userName', element: <ChannelProfile /> },
      { path: 'subscribers/:channelId', element: <ChannelSubscribers /> },
      { path: 'liked-videos', element: <LikedVideos />},
      
       

      ]
    },


    {

    path: '/dashboard',
    element: <DashboardLayout />, // dashboard layout
    children: [

          {index: true,element: <Dashboard/>},
         
          {path: 'update-details', element: <updateDetails />},
          {path: 'change-password', element: <changePassword />},
          {path: 'upload-avatar', element: <uploadAvatar />},
          {path: 'upload-cover', element: <uploadCover />},
          {path:'watch-history', element: <watchHistory />},
          {path: 'c/:userName', element: <channelProfile />},
          {path: 'upload', element: <UploadVideo />},
          
          {path: 'videos/:videoId', element: <VideoWatch /> },
          {path: 'edit/:videoId', element: <EditVideo />},
          {path: "playlist", element: <CreatePlaylist />},
          {path:"playlists", element: <userPlaylists />},
          {path:"playlist/:playlistId", element: <playlistDetails />},
          {path:"playlist/edit/:playlistId", element: <editPlaylist />},
          {path: "subscriptions", element: <subscribedChannels/>},
         
          { path: 'dashboard', element: <Dashboard /> },

          {path: "upload", element: <UploadVideo />},
        
        ]

      
      
    },
   
    
   
  ]
)

function App() {
 

  return (
    <>
     <div className='flex'>
      <RouterProvider router = {router}/>
      </div>
    </>
  )
}

export default App
