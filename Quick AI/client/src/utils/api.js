// API utility functions for frontend
import { useAuth } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Custom hook for API calls
export const useApi = () => {
    const { getToken } = useAuth();

    const makeRequest = async (endpoint, options = {}) => {
        const token = await getToken();
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    };

    return {
        // AI Generation APIs
        generateArticle: (prompt, length) => 
            makeRequest('/ai/generate-article', {
                method: 'POST',
                body: JSON.stringify({ prompt, length })
            }),

        generateBlogTitles: (topic, count = 5) => 
            makeRequest('/ai/generate-blog-titles', {
                method: 'POST',
                body: JSON.stringify({ topic, count })
            }),

        generateImages: (prompt, style = 'realistic', size = '1024x1024') => 
            makeRequest('/ai/generate-images', {
                method: 'POST',
                body: JSON.stringify({ prompt, style, size })
            }),

        removeBackground: (imageDescription, imageUrl) => 
            makeRequest('/ai/remove-background', {
                method: 'POST',
                body: JSON.stringify({ imageDescription, imageUrl })
            }),

        removeObject: (imageDescription, objectToRemove, imageUrl) => 
            makeRequest('/ai/remove-object', {
                method: 'POST',
                body: JSON.stringify({ imageDescription, objectToRemove, imageUrl })
            }),

        reviewResume: (resumeText, jobDescription, focusAreas) => 
            makeRequest('/ai/review-resume', {
                method: 'POST',
                body: JSON.stringify({ resumeText, jobDescription, focusAreas })
            }),

        // Dashboard APIs
        getDashboard: () => makeRequest('/ai/dashboard'),
        getCreations: (type, page, limit) => 
            makeRequest(`/ai/creations?type=${type}&page=${page}&limit=${limit}`),

        // User APIs
        getUserProfile: () => makeRequest('/user/profile'),
        updateProfile: (data) => 
            makeRequest('/user/profile', {
                method: 'PUT',
                body: JSON.stringify(data)
            }),
        upgradeUser: (plan) => 
            makeRequest('/user/upgrade', {
                method: 'POST',
                body: JSON.stringify({ plan })
            }),
        getUserStats: () => makeRequest('/user/stats'),

        // Community APIs
        getCommunityPosts: (type, page, limit, sort) => 
            makeRequest(`/community/posts?type=${type}&page=${page}&limit=${limit}&sort=${sort}`),
        createPost: (title, content, type, tags) => 
            makeRequest('/community/posts', {
                method: 'POST',
                body: JSON.stringify({ title, content, type, tags })
            }),
        likePost: (postId) => 
            makeRequest(`/community/posts/${postId}/like`, { method: 'POST' }),
        getComments: (postId) => 
            makeRequest(`/community/posts/${postId}/comments`),
        addComment: (postId, content) => 
            makeRequest(`/community/posts/${postId}/comments`, {
                method: 'POST',
                body: JSON.stringify({ content })
            }),
        getFeaturedPosts: () => makeRequest('/community/featured'),
        getUserPosts: (page, limit) => 
            makeRequest(`/community/my-posts?page=${page}&limit=${limit}`),
        
        // Development utilities
        resetUsage: () => 
            makeRequest('/ai/reset-usage', { method: 'POST' })
    };
};

// Example usage in components:
/*
const MyComponent = () => {
    const api = useApi();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleGenerateArticle = async () => {
        setLoading(true);
        try {
            const response = await api.generateArticle("AI Technology", 500);
            setResult(response.content);
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleGenerateArticle} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Article'}
            </button>
            {result && <div>{result}</div>}
        </div>
    );
};
*/
