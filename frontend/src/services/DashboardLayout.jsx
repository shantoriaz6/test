import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const DashboardLayout = () => {
  return (
    <div className='min-h-screen w-full'>
      <Sidebar />
      
      <div className='ml-64'>
        <Navbar />
        <main className='mt-16'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout