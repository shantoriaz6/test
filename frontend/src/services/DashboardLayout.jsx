import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ScrollToTop from '../components/ScrollToTop'

const DashboardLayout = () => {
  return (
    <div className='min-h-screen w-full overflow-x-hidden'>
      <ScrollToTop />
      <Sidebar />
      
      <div className='ml-64'>
        <Navbar />
        <main className='mt-16 min-h-screen'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout