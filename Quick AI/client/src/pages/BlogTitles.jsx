import React from 'react'
import { useState } from 'react'
import { Edit, Hash, Sparkles, Loader2 } from 'lucide-react'
import { useApi } from '../utils/api'
import Markdown from 'react-markdown'

const BlogTitles = () => {
  const api = useApi()
  const blogCategories = ['General','Technology','Business','Health','Lifestyle','Travel','Education','Entertainment','Food']
  const [selectedCategory , setSelectedCategory] = useState('General')
  const [input,setInput]=useState('')
  const [generatedTitles, setGeneratedTitles] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const onSubmitHandler= async (e)=>{
    e.preventDefault();
    if (!input.trim()) {
      setError('Please enter a keyword for blog titles')
      return
    }
    
    setLoading(true)
    setError('')
    setGeneratedTitles('')
    
    try {
      const response = await api.generateBlogTitles(`${input} in the category ${selectedCategory}`, 5)
      setGeneratedTitles(response.content)
    } catch (error) {
      console.error('Error generating blog titles:', error)
      setError(error.message || 'Failed to generate blog titles. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='h-full overflow-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/*left column*/}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200' action="">
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>AI Title Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Keyword</p>
        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='The future of the artifical intelligence is ..' required />
        <p className='mt-4 text-sm font-medium'>Category</p>
        <div className='mt-5 flex gap-3 flex-wrap sm:max-w-9/11'>
            {
              blogCategories.map((item)=>(
                <span onClick={()=> setSelectedCategory(item)}  className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedCategory === item? 'bg-purple-50 text-purple-700':'text-gray-500 border-gray-300'}`} key={item}>{item}</span>
              ))}
        </div>
        <br />
        <button 
          type="submit" 
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? (
            <>
              <Loader2 className='w-5 animate-spin' />
              Generating...
            </>
          ) : (
            <>
              <Hash className='w-5' />
              Generate Title
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
          <Hash className='w-5 h-5 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>Generated Titles</h1>
        </div>
        <div className='flex-1 overflow-y-auto'>
          {loading ? (
            <div className='flex justify-center items-center h-full'>
              <div className='text-center'>
                <Loader2 className='w-8 h-8 animate-spin text-purple-500 mx-auto mb-2' />
                <p className='text-gray-500 text-sm'>Generating blog titles...</p>
              </div>
            </div>
          ) : generatedTitles ? (
            <div className='prose prose-sm max-w-none text-slate-700 pt-4'>
              <Markdown>{generatedTitles}</Markdown>
            </div>
          ) : (
            <div className='flex justify-center items-center h-full'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Hash className='w-9 h-9' />
                <p>Enter a topic and click "Generate Title" to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogTitles
