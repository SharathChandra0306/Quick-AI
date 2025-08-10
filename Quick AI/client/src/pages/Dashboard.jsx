import React, { useState, useCallback } from 'react'
import { useEffect } from 'react'
import { dummyCreationData } from '../assets/assets' 
import { Gem, Sparkles, RotateCcw } from 'lucide-react'
import { Protect } from '@clerk/clerk-react'
import Creationitem from '../components/Creationitem'
import { useApi } from '../utils/api'

const Dashboard = () => {
  const [creations , setCreations] = useState([])
  const api = useApi()
  const [resetLoading, setResetLoading] = useState(false)
  
  const getDashboardData = useCallback(async()=>{
    setCreations(dummyCreationData)
  }, [])
  
  const handleResetUsage = async () => {
    setResetLoading(true)
    try {
      const response = await api.resetUsage()
      if (response.success) {
        alert('Usage count reset successfully!')
      } else {
        alert('Failed to reset usage: ' + response.message)
      }
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setResetLoading(false)
    }
  }
  
  useEffect(()=>{
    getDashboardData()
  },[getDashboardData])
  return (
    <div className='h-full overflow-y-scroll p-6' >
      <div className='flex justify-start gap-4 flex-wrap'>
        {/* total creation card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
            <Sparkles className='w-5 text-white' />
          </div>
        </div>

        {/* Active Plan card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'>
              <Protect plan='premium' fallback='Free'>
                Premium
              </Protect>
            </h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
            <Gem className='w-5 text-white' />
          </div>
        </div>

        {/* Development Reset Button */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Development</p>
            <button 
              onClick={handleResetUsage}
              disabled={resetLoading}
              className='text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 disabled:opacity-50'
            >
              {resetLoading ? 'Resetting...' : 'Reset Usage'}
            </button>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF5722] to-[#E91E63] text-white flex justify-center items-center'>
            <RotateCcw className='w-5 text-white' />
          </div>
        </div>

      </div>
      <div className='space-y-3'>
        <p className='mt-6 mb-4'>Recent Creations</p>
        {
          creations.map((item) => 
            <Creationitem key={item.id} item={item} />)
        }
      </div>


    </div>
  )
}

export default Dashboard
