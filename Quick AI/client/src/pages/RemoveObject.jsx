import React from 'react'
import { useState } from 'react'
import { Eraser, Scissors, Sparkles, Loader2 } from 'lucide-react'
import { useApi } from '../utils/api'

const RemoveObject = () => {
  const api = useApi()
  const [imageDescription, setImageDescription] = useState('')
  const [objectToRemove, setObjectToRemove] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const onSubmitHandler= async (e)=>{
    e.preventDefault();
    if (!imageDescription.trim() || !objectToRemove.trim() || !imageUrl.trim()) {
      setError('Please provide image description, object to remove, and image URL')
      return
    }
    
    setLoading(true)
    setError('')
    setResult('')
    
    try {
      const response = await api.removeObject(imageDescription, objectToRemove, imageUrl)
      setResult(response.content || response.processedImageUrl)
    } catch (error) {
      console.error('Error removing object:', error)
      setError(error.message || 'Failed to remove object. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
     <div className='h-full overflow-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/*left column*/}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200' action="">
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Object Removal</h1>
        </div>
        
        <p className='mt-6 text-sm font-medium'>Image Description</p>
        <input 
          onChange={(e) => setImageDescription(e.target.value)} 
          value={imageDescription}
          type="text" 
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' 
          placeholder='Describe the image content...'
          required 
        />
        
        <p className='mt-4 text-sm font-medium'>Object to Remove</p>
        <input 
          onChange={(e) => setObjectToRemove(e.target.value)} 
          value={objectToRemove}
          type="text" 
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' 
          placeholder='e.g. watch, spoon, person'
          required 
        />
        
        <p className='mt-4 text-sm font-medium'>Image URL</p>
        <input 
          onChange={(e) => setImageUrl(e.target.value)} 
          value={imageUrl}
          type="url" 
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' 
          placeholder='https://example.com/image.jpg'
          required 
        />
      
        <button 
          type="submit" 
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? (
            <>
              <Loader2 className='w-5 animate-spin' />
              Processing...
            </>
          ) : (
            <>
              <Scissors className='w-5' />
              Remove Object
            </>
          )}
        </button>
        
        {error && (
          <div className='mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
            {error}
          </div>
        )}

      </form>
      {/*Right column*/}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Scissors className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>
        <div className='flex-1 overflow-y-auto'>
          {loading ? (
            <div className='flex justify-center items-center h-full'>
              <div className='text-center'>
                <Loader2 className='w-8 h-8 animate-spin text-blue-500 mx-auto mb-2' />
                <p className='text-gray-500 text-sm'>Removing object...</p>
              </div>
            </div>
          ) : result ? (
            <div className='pt-4'>
              {result.startsWith('http') ? (
                <img src={result} alt="Processed" className='w-full max-w-md mx-auto rounded-lg shadow-lg' />
              ) : (
                <div className='prose prose-sm max-w-none text-slate-700'>
                  {result}
                </div>
              )}
            </div>
          ) : (
            <div className='flex justify-center items-center h-full'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Scissors className='w-9 h-9' />
                <p>Provide image details and click "Remove object" to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RemoveObject
