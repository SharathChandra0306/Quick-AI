import React from 'react'
import { useState } from 'react'
import { Edit, Hash, Image, Sparkles, Loader2 } from 'lucide-react'
import { useApi } from '../utils/api'

const GenerateImages = () => {
  const api = useApi()
  const imageStyle = ['Realistic','Ghibli style','Anime style','Cartoon style','Pixel art','Fantasy style','3D style', 'Cyberpunk style','portrait style']
  const [selectedStyle , setSelectedStyle] = useState('Realistic')
  const [input,setInput]=useState('')
  const [publish,setPublish]=useState(false)
  const [generatedImage, setGeneratedImage] = useState('')
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [originalPrompt, setOriginalPrompt] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmitHandler= async (e)=>{
    e.preventDefault();
    if (!input.trim()) {
      setError('Please describe the image you want to generate')
      return
    }
    
    setLoading(true)
    setError('')
    setGeneratedImage('')
    setGeneratedDescription('')
    setEnhancedPrompt('')
    setOriginalPrompt('')
    setImageLoading(false)
    
    try {
      const response = await api.generateImages(`${input} in ${selectedStyle} style`, selectedStyle, '1024x1024')
      console.log('API Response:', response) // Debug log
      
      if (response.imageUrl) {
        setGeneratedImage(response.imageUrl)
        setGeneratedDescription(response.content || '')
        setEnhancedPrompt(response.enhancedPrompt || '')
        setOriginalPrompt(response.originalPrompt || input)
        setImageLoading(true) // Start loading the image
      } else if (response.content) {
        // Fallback if no image URL
        setGeneratedDescription(response.content)
        setError('Image generation service unavailable, showing description only')
      } else {
        setError('No image URL received from the server')
      }
    } catch (error) {
      console.error('Error generating image:', error)
      setError(error.message || 'Failed to generate image. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='h-full overflow-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/*left column*/}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200' action="">
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Describe Your Image</p>
        <textarea onChange={(e)=>setInput(e.target.value)} value={input} rows={4}  className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='Describe Want you want to see in the image..' required />
        
        <div className='mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md'>
          <p className='text-xs text-yellow-700 font-medium'>💡 Tips for better results:</p>
          <p className='text-xs text-yellow-600 mt-1'>• Be specific: "young boy, 8 years old, playing soccer in a green park"</p>
          <p className='text-xs text-yellow-600'>• Include details: colors, actions, setting, lighting</p>
          <p className='text-xs text-yellow-600'>• Avoid vague terms like "nice" or "good"</p>
        </div>
        <p className='mt-4 text-sm font-medium'>Style</p>
        <div className='mt-5 flex gap-3 flex-wrap sm:max-w-9/11'>
            {
             imageStyle.map((item)=>(
                <span onClick={()=> setSelectedStyle(item)}  className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item? 'bg-green-50 text-green-700':'text-gray-500 border-gray-300'}`} key={item}>{item}</span>
              ))}
        </div>
        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input type="checkbox" onChange={(e)=>setPublish(e.target.checked)} 
            checked={publish} className='sr-only peer'
            />
            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'>
            </div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
          </label>
          <p className='text-sm'>Make this image public </p>

        </div>
        <br />
        <button 
          type="submit" 
          disabled={loading}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? (
            <>
              <Loader2 className='w-5 animate-spin' />
              Generating...
            </>
          ) : (
            <>
              <Image className='w-5' />
              Generate Image
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
          <Image className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>Generated Image</h1>
        </div>
        <div className='flex-1 overflow-y-auto'>
          {loading ? (
            <div className='flex justify-center items-center h-full'>
              <div className='text-center'>
                <Loader2 className='w-8 h-8 animate-spin text-green-500 mx-auto mb-2' />
                <p className='text-gray-500 text-sm'>Generating your image...</p>
              </div>
            </div>
          ) : generatedImage ? (
            <div className='pt-4 text-center'>
              <div className='relative'>
                {imageLoading && (
                  <div className='absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg'>
                    <Loader2 className='w-8 h-8 animate-spin text-green-500' />
                  </div>
                )}
                <img 
                  src={generatedImage} 
                  alt="AI Generated" 
                  className='w-full max-w-md mx-auto rounded-lg shadow-lg'
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false)
                    setError('Failed to load generated image')
                  }}
                />
              </div>
              {originalPrompt && (
                <div className='mt-3 p-2 bg-green-50 rounded-lg text-left'>
                  <h4 className='font-semibold text-xs mb-1 text-green-700'>Your Prompt:</h4>
                  <p className='text-xs text-green-600'>{originalPrompt}</p>
                </div>
              )}
              {enhancedPrompt && (
                <div className='mt-2 p-2 bg-blue-50 rounded-lg text-left'>
                  <h4 className='font-semibold text-xs mb-1 text-blue-700'>Enhanced Prompt:</h4>
                  <p className='text-xs text-blue-600'>{enhancedPrompt}</p>
                </div>
              )}
              {generatedDescription && (
                <div className='mt-3 p-3 bg-gray-50 rounded-lg text-left'>
                  <h3 className='font-semibold text-sm mb-2'>AI Analysis:</h3>
                  <p className='text-sm text-gray-600 whitespace-pre-wrap'>{generatedDescription}</p>
                </div>
              )}
              <div className='mt-4 flex gap-2 justify-center'>
                <button 
                  onClick={() => {
                    setGeneratedImage('')
                    setImageLoading(false)
                    onSubmitHandler({ preventDefault: () => {} })
                  }}
                  className='px-4 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors'
                >
                  🔄 Regenerate
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedImage)
                    alert('Image URL copied to clipboard!')
                  }}
                  className='px-4 py-2 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors'
                >
                  📋 Copy URL
                </button>
              </div>
            </div>
          ) : (
            <div className='flex justify-center items-center h-full'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Image className='w-9 h-9' />
                <p>Describe an image and click "Generate Image" to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GenerateImages
