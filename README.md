<<<<<<< HEAD
# 🚀 Quick AI - Complete SaaS AI Platform

A comprehensive AI-powered SaaS platform built with React, Node.js, and Express. Quick AI provides multiple AI generation tools including article writing, blog title generation, image creation, background removal, object removal, resume review, and community features.

## 🌟 Features

### AI Generation Tools
- **📝 Write Article**: Generate comprehensive articles using AI
- **📰 Blog Titles**: Create engaging SEO-friendly blog titles
- **🎨 Generate Images**: Create AI-generated images with multiple styles
- **🖼️ Remove Background**: AI-powered background removal suggestions
- **✂️ Remove Object**: Smart object removal from images
- **📄 Review Resume**: AI-powered resume analysis and feedback
- **👥 Community**: Share and discover AI creations

### Additional Features
- **🔐 Authentication**: Secure user authentication with Clerk
- **📊 Dashboard**: Comprehensive user dashboard with usage analytics
- **💎 Premium Plans**: Free and Premium tiers with usage limits
- **🎯 Usage Tracking**: Monitor AI generation usage
- **📱 Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **React Router**: Client-side routing
- **Clerk**: Authentication and user management

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **OpenAI API**: AI generation (using Gemini model)
- **Pollinations.ai**: Free AI image generation
- **Clerk Express**: Backend authentication

## 📁 Project Structure

```
Quick AI/
├── client/                          # Frontend React application
│   ├── public/                      # Static assets
│   │   ├── favicon.svg             # App favicon
│   │   ├── gradientBackground.png   # Background image
│   │   └── vite.svg               # Vite logo
│   ├── src/                        # Source code
│   │   ├── assets/                 # Images and static assets
│   │   │   ├── ai_gen_img_*.png   # Sample AI images
│   │   │   ├── arrow_icon.svg     # Navigation icons
│   │   │   ├── assets.js          # Asset exports
│   │   │   ├── logo.svg           # App logo
│   │   │   ├── profile_img_1.png  # Profile images
│   │   │   ├── star_icon.svg      # Rating icons
│   │   │   └── user_group.png     # Community image
│   │   ├── components/             # Reusable components
│   │   │   ├── AITools.jsx        # AI tools showcase
│   │   │   ├── Creationitem.jsx   # Creation display item
│   │   │   ├── ErrorBoundary.jsx  # Error handling
│   │   │   ├── Footer.jsx         # App footer
│   │   │   ├── Hero.jsx           # Landing page hero
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   ├── Plan.jsx           # Pricing plans
│   │   │   ├── Sidebar.jsx        # App sidebar
│   │   │   └── Testimonial.jsx    # User testimonials
│   │   ├── pages/                  # Main application pages
│   │   │   ├── BlogTitles.jsx     # Blog title generation
│   │   │   ├── Community.jsx      # Community features
│   │   │   ├── Dashboard.jsx      # User dashboard
│   │   │   ├── GenerateImages.jsx # AI image generation
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Layout.jsx         # App layout wrapper
│   │   │   ├── RemoveBackground.jsx # Background removal
│   │   │   ├── RemoveObject.jsx   # Object removal
│   │   │   ├── ReviewResume.jsx   # Resume analysis
│   │   │   └── WriteArticle.jsx   # Article generation
│   │   ├── utils/                  # Utility functions
│   │   │   └── api.js             # API integration layer
│   │   ├── App.css                # Global styles
│   │   ├── App.jsx                # Main app component
│   │   ├── index.css              # Tailwind imports
│   │   └── main.jsx               # App entry point
│   ├── eslint.config.js           # ESLint configuration
│   ├── index.html                 # HTML template
│   ├── package.json               # Dependencies and scripts
│   ├── README.md                  # Frontend documentation
│   └── vite.config.js             # Vite configuration
├── server/                         # Backend Node.js application
│   ├── config/                     # Configuration files
│   │   └── db.js                  # Database connection
│   ├── controllers/                # Business logic controllers
│   │   ├── aiControllers.js       # AI generation logic
│   │   ├── communityControllers.js # Community features
│   │   └── userControllers.js     # User management
│   ├── middlewares/                # Express middlewares
│   │   └── auth.js                # Authentication middleware
│   ├── routes/                     # API route definitions
│   │   ├── aiRoutes.js            # AI generation endpoints
│   │   ├── communityRoutes.js     # Community endpoints
│   │   └── userRoutes.js          # User endpoints
│   ├── package.json               # Backend dependencies
│   └── server.js                  # Express server setup
├── test-server.js                 # Development test server
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## 🔧 Key Files Explained

### Frontend Core Files

#### `client/src/App.jsx`
Main React component that sets up routing, authentication, and error boundaries.

#### `client/src/utils/api.js`
Centralized API integration layer with:
- Authentication token management
- RESTful API methods for all features
- Error handling and request configuration

#### `client/src/pages/GenerateImages.jsx`
Advanced AI image generation component featuring:
- Multiple art styles (Realistic, Anime, Cartoon, etc.)
- Enhanced prompt engineering
- Real AI image generation via Pollinations.ai
- Loading states and error handling

#### `client/src/components/Sidebar.jsx`
Navigation sidebar with all AI tools and user features.

### Backend Core Files

#### `server/server.js`
Express server setup with:
- CORS configuration
- Route mounting
- Database initialization
- Clerk authentication setup

#### `server/controllers/aiControllers.js`
Main AI generation logic including:
- Usage limit checking and tracking
- OpenAI/Gemini API integration
- Enhanced prompt engineering for each AI tool
- Database storage of user creations

#### `server/config/db.js`
Neon PostgreSQL database connection with schema:
```sql
users (id, email, plan, free_usage, created_at)
creations (id, user_id, prompt, content, type, created_at)
community_posts (id, user_id, title, content, likes, created_at)
```

#### `server/middlewares/auth.js`
Clerk authentication middleware that:
- Validates JWT tokens
- Extracts user information
- Fetches user plan and usage data

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database (Neon recommended)
- Clerk account for authentication
- OpenAI/Gemini API key

### 1. Clone Repository
```bash
git clone https://github.com/SharathChandra0306/Quick-AI.git
cd Quick-AI
```

### 2. Backend Setup
```bash
cd "Quick AI/server"
npm install
```

Create `.env` file in server directory:
```env
# Database
DATABASE_URL=your_neon_postgresql_url

# Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# AI API
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Server
PORT=3000
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd "../client"
npm install
```

Create `.env.local` file in client directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000/api
```

### 4. Database Setup
The database will auto-initialize with required tables on first run.

### 5. Run the Application

Start backend server:
```bash
cd "Quick AI/server"
npm start
```

Start frontend development server:
```bash
cd "Quick AI/client"
npm run dev
```

Access the application at `http://localhost:5173`

## 🔑 Environment Variables

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port (default: 3000) | No |

### Frontend (.env.local)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `VITE_API_URL` | Backend API URL | Yes |

## 🎯 API Endpoints

### AI Generation
- `POST /api/ai/generate-article` - Generate articles
- `POST /api/ai/generate-blog-titles` - Generate blog titles
- `POST /api/ai/generate-images` - Generate AI images
- `POST /api/ai/remove-background` - Background removal suggestions
- `POST /api/ai/remove-object` - Object removal suggestions
- `POST /api/ai/review-resume` - Resume analysis

### User & Dashboard
- `GET /api/ai/dashboard` - Dashboard data
- `GET /api/ai/creations` - User creations
- `POST /api/ai/reset-usage` - Reset usage (dev only)

### Community
- `GET /api/community/posts` - Community posts
- `POST /api/community/posts` - Create post
- `POST /api/community/posts/:id/like` - Like post

## 💻 Development Features

### Usage Limits
- **Free Plan**: 100 AI generations
- **Premium Plan**: Unlimited usage
- **Development Mode**: Bypasses all limits

### Error Handling
- Comprehensive error boundaries
- API error handling with user-friendly messages
- Loading states for all async operations

### Image Generation
- **Service**: Pollinations.ai (free)
- **Styles**: 9 different art styles
- **Enhancement**: AI-powered prompt optimization
- **Features**: Regenerate, copy URL, detailed prompts

## 🔒 Security Features

- JWT token authentication via Clerk
- Environment variable protection
- Input validation and sanitization
- CORS configuration
- Rate limiting via usage tracking

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS utilities
- Responsive sidebar navigation
- Optimized for all screen sizes

## 🚀 Deployment

### Backend Deployment
1. Deploy to platforms like Vercel, Railway, or Heroku
2. Set environment variables
3. Ensure database connectivity

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Set environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Sharath Chandra**
- GitHub: [@SharathChandra0306](https://github.com/SharathChandra0306)

## 🙏 Acknowledgments

- **Clerk** for authentication services
- **Neon** for PostgreSQL hosting
- **Pollinations.ai** for free AI image generation
- **Google Gemini** for AI text generation
- **Tailwind CSS** for styling
- **Vite** for fast development

---

Built with ❤️ using modern web technologies
=======
# Quick-AI
>>>>>>> 2895c7282faa6168c32c6c3fc0b76d7b83b93b0e
