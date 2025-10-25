
import './App.css'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import DashboardVideos from './pages/DashboardVideos'


const router = createBrowserRouter(
  [
    {
      path: "/",
      element:
     
        <layout />,
        children: [

          {index: true,element: <DashboardVideos/>},
          {path: 'Profile', element: <profile />, },
          {path: 'update-details', element: <updateDetails />},
          {path: 'change-password', element: <changePassword />},
          {path: 'upload-avatar', element: <uploadAvatar />},
          {path: 'upload-cover', element: <uploadCover />},
          {path:' watch-history', element: <watchHistory />},
          {path: 'c/:userName', element: <channelProfile />},
          {path: 'upload', element: <uploadVideo />},
          
          {path: 'video/:videoId', element: <VideoDetails /> },
          {path: 'edit/:videoId', element: <EditVideo />},
          {path: "playlist", element: <createPlaylist />},
          {path:"playlists", element: <userPlaylists />},
          {path:"playlist/:playlistId", element: <playlistDetails />},
          {path:"playlist/edit/:playlistId", element: <editPlaylist />},
          {path: "subscriptions", element: <subscribedChannels/>},
          { path: 'subscribers/:channelId', element: <ChannelSubscribers /> },
          { path: 'liked-videos', element: <LikedVideos /> },
          {path: Profiler, element: <profile />},
          {path: Profiler, element: <profile />},
          {path: Profiler, element: <profile />},
        ]

      
      
    },
    {
       path: "/login",
      element:<Login />
      

    },
    {
       path: "/register",
      element:<Register />
      
    },
    {
       path: "/",
      element:
      <div>

      </div>

    }
  ]
)

function App() {
 

  return (
    <>
     <div><RouterProvider router = {router}/></div>
    </>
  )
}

export default App
