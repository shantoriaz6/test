
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
import PlaylistDetail from './pages/PlaylistDetail'
import Layout from './services/Layout'
import DashboardLayout from './services/DashboardLayout'
import ChannelProfile from './pages/ChannelProfile'
import SubscribedChannels from './pages/SubscribedChannels'
import WatchHistory from './pages/WatchHistory'
import UserPlaylists from './pages/UserPlaylists'
import TweetFeed from './pages/TweetFeed'




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
          {path: 'history', element: <WatchHistory />},
          {path: 'subscriptions', element: <SubscribedChannels />},
          {path: 'subscribers/:channelId', element: <ChannelSubscribers />},
          {path: 'tweets', element: <TweetFeed />},
          {path: 'playlists', element: <UserPlaylists />},
          {path: 'playlist', element: <CreatePlaylist />},
          {path: 'playlist/:playlistId', element: <PlaylistDetail />},
          {path: 'liked-videos', element: <LikedVideos />},
          {path: 'c/:userName', element: <ChannelProfile />},
          {path: 'upload', element: <UploadVideo />},
          {path: 'videos/:videoId', element: <VideoWatch /> },
          {path: 'edit/:videoId', element: <EditVideo />},
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
