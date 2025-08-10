import { FileText, Sparkles, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { useApi } from '../utils/api'
import Markdown from 'react-markdown'

const ReviewResume = () => {
  const api = useApi()
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [focusAreas, setFocusAreas] = useState('')
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const onSubmitHandler= async (e)=>{
    e.preventDefault();
    if (!resumeText.trim()) {
      setError('Please provide your resume text')
      return
    }
    
    setLoading(true)
    setError('')
    setReview('')
    
    try {
      const response = await api.reviewResume(
        resumeText, 
        jobDescription || 'General review', 
        focusAreas ? focusAreas.split(',').map(area => area.trim()) : ['overall']
      )
      setReview(response.content)
    } catch (error) {
      console.error('Error reviewing resume:', error)
      setError(error.message || 'Failed to review resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='h-full overflow-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/*left column*/}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200' action="">
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00DA83]' />
          <h1 className='text-xl font-semibold'>Resume Review</h1>
        </div>
        
        <p className='mt-6 text-sm font-medium'>Resume Text</p>
        <textarea 
          onChange={(e) => setResumeText(e.target.value)} 
          value={resumeText}
          rows={4}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' 
          placeholder='Paste your resume content here...'
          required 
        />
        
        <p className='mt-4 text-sm font-medium'>Job Description (Optional)</p>
        <textarea 
          onChange={(e) => setJobDescription(e.target.value)} 
          value={jobDescription}
          rows={3}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' 
          placeholder='Paste job description to get targeted feedback...'
        />
        
        <p className='mt-4 text-sm font-medium'>Focus Areas (Optional)</p>
        <input 
          onChange={(e) => setFocusAreas(e.target.value)} 
          value={focusAreas}
          type="text" 
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' 
          placeholder='e.g. skills, experience, formatting (comma-separated)'
        />
        <p className='text-xs text-gray-500 font-light mt-1'>Leave blank for general review</p>
      
        <button 
          type="submit" 
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? (
            <>
              <Loader2 className='w-5 animate-spin' />
              Reviewing...
            </>
          ) : (
            <>
              <FileText className='w-5' />
              Review Resume
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
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <FileText className='w-5 h-5 text-[#00DA83]' />
          <h1 className='text-xl font-semibold'>Analysis Results</h1>
        </div>
        <div className='flex-1 overflow-y-auto'>
          {loading ? (
            <div className='flex justify-center items-center h-full'>
              <div className='text-center'>
                <Loader2 className='w-8 h-8 animate-spin text-green-500 mx-auto mb-2' />
                <p className='text-gray-500 text-sm'>Analyzing your resume...</p>
              </div>
            </div>
          ) : review ? (
            <div className='prose prose-sm max-w-none text-slate-700 pt-4'>
              <Markdown>{review}</Markdown>
            </div>
          ) : (
            <div className='flex justify-center items-center h-full'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <FileText className='w-9 h-9' />
                <p>Provide resume text and click "Review Resume" to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewResume
