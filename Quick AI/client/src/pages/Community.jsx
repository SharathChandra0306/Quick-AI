import React, { useState, useEffect } from 'react'
import { Heart, Sparkles, Users, MessageCircle, Plus, Loader2 } from 'lucide-react'
import { useApi } from '../utils/api'
import { useUser } from '@clerk/clerk-react'
import Markdown from 'react-markdown'

const Community = () => {
  const api = useApi()
  const { user } = useUser()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', type: 'general', tags: '' })
  const [error, setError] = useState('')

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await api.getCommunityPosts('all', 1, 20, 'latest')
      setPosts(response.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Failed to load community posts')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError('Please provide both title and content')
      return
    }

    try {
      const tags = newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      await api.createPost(newPost.title, newPost.content, newPost.type, tags)
      setNewPost({ title: '', content: '', type: 'general', tags: '' })
      setShowCreatePost(false)
      fetchPosts() // Refresh posts
    } catch (error) {
      console.error('Error creating post:', error)
      setError('Failed to create post')
    }
  }

  const handleLikePost = async (postId) => {
    try {
      await api.likePost(postId)
      fetchPosts() // Refresh to update like counts
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <Users className='w-6 text-[#9E53EE]' />
          <h1 className='text-xl font-semibold'>Community</h1>
        </div>
        <button 
          onClick={() => setShowCreatePost(!showCreatePost)}
          className='flex items-center gap-2 bg-gradient-to-r from-[#9E53EE] to-[#E549A3] text-white px-4 py-2 rounded-lg text-sm'
        >
          <Plus className='w-4' />
          Create Post
        </button>
      </div>

      {error && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
          {error}
        </div>
      )}

      {showCreatePost && (
        <div className='bg-white p-4 rounded-lg border border-gray-200'>
          <h3 className='text-lg font-semibold mb-4'>Create New Post</h3>
          <form onSubmit={handleCreatePost} className='space-y-4'>
            <input
              type="text"
              placeholder="Post title..."
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              className='w-full p-2 border border-gray-300 rounded-md'
              required
            />
            <textarea
              placeholder="Share your thoughts..."
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              className='w-full p-2 border border-gray-300 rounded-md h-24 resize-none'
              required
            />
            <div className='flex gap-4'>
              <select
                value={newPost.type}
                onChange={(e) => setNewPost({...newPost, type: e.target.value})}
                className='p-2 border border-gray-300 rounded-md'
              >
                <option value="general">General</option>
                <option value="showcase">Showcase</option>
                <option value="question">Question</option>
                <option value="tip">Tip</option>
              </select>
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={newPost.tags}
                onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                className='flex-1 p-2 border border-gray-300 rounded-md'
              />
            </div>
            <div className='flex gap-2'>
              <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded-md'>
                Post
              </button>
              <button 
                type="button" 
                onClick={() => setShowCreatePost(false)}
                className='bg-gray-500 text-white px-4 py-2 rounded-md'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll p-4'>
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <div className='text-center'>
              <Loader2 className='w-8 h-8 animate-spin text-purple-500 mx-auto mb-2' />
              <p className='text-gray-500'>Loading community posts...</p>
            </div>
          </div>
        ) : posts.length > 0 ? (
          <div className='space-y-4'>
            {posts.map((post, index) => (
              <div key={post.id || index} className='border border-gray-200 rounded-lg p-4'>
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='font-semibold text-lg'>{post.title}</h3>
                  <span className='text-xs bg-gray-100 px-2 py-1 rounded'>{post.type}</span>
                </div>
                <div className='prose prose-sm max-w-none mb-3'>
                  <Markdown>{post.content}</Markdown>
                </div>
                <div className='flex justify-between items-center text-sm text-gray-500'>
                  <div className='flex gap-4'>
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className='flex items-center gap-1 hover:text-red-500'
                    >
                      <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-500 text-red-500' : ''}`} />
                      {post.likes || 0}
                    </button>
                    <div className='flex items-center gap-1'>
                      <MessageCircle className='w-4 h-4' />
                      {post.comments || 0}
                    </div>
                  </div>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex justify-center items-center h-full'>
            <div className='text-center text-gray-400'>
              <Users className='w-12 h-12 mx-auto mb-2' />
              <p>No posts yet. Be the first to share something!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Community
