# PrepNova

Your comprehensive placement preparation platform for campus placements. Master aptitude, DSA, and company-specific interviews with an Aurora-themed learning experience.

## Architecture

```
+------------------------------------------------------------------+
|                         FRONTEND                                  |
|   React + Vite + Tailwind CSS + Monaco Editor                     |
|   Port: 5173                                                      |
|   Aurora gradient theme with light/dark mode                      |
+----------------------------------+-------------------------------+
                                   | HTTP/API
+----------------------------------v-------------------------------+
|                         BACKEND                                   |
|   Node.js + Express.js                                            |
|   Port: 5000                                                      |
|   JWT Authentication, REST API                                    |
+----------------------------------+-------------------------------+
                                   |
+----------------------------------v-------------------------------+
|                        DATABASE                                   |
|   Supabase (PostgreSQL)                                          |
|   - Users, Profiles, Progress                                    |
|   - Questions, Results, Companies                                |
+------------------------------------------------------------------+
```

## Features

### Core Modules
- **Aptitude Preparation** - Quantitative, Logical Reasoning, Verbal Ability with 30+ topics and 500+ questions
- **DSA Learning** - 13 data structures & algorithms topics with:
  - Code examples and implementations
  - Programming problems with Monaco code editor
  - Time/Space complexity analysis
  - Multiple difficulty levels
- **Company Preparation** - 50+ real company profiles with hiring process & interview questions

### User Features
- User authentication (Supabase Auth)
- Progress tracking with analytics
- Timed tests with difficulty levels
- Code editor for DSA programming problems
- Save favorite companies
- Light/Dark Aurora theme toggle
- Fully responsive design
- Aurora gradient animations

## Tech Stack

### Frontend
- React.js 18
- Vite (Build tool)
- Tailwind CSS
- Monaco Editor (code editing)
- Framer Motion (animations)
- React Router
- React Icons
- Chart.js

### Backend
- Node.js
- Express.js
- JWT (jsonwebtoken)
- Supabase JS Client

### Database
- Supabase (PostgreSQL)

## Project Structure

```
project/
+-- src/                    # Frontend source
|   +-- components/         # React components
|       +-- Logo.jsx        # PrepNova logo component
|       +-- CodeEditor.jsx  # Monaco code editor wrapper
|       +-- Layout.jsx      # Main layout with Aurora sidebar
|   +-- contexts/           # React contexts (Auth, Theme)
|   +-- pages/              # Page components
|       +-- DSA.jsx         # DSA topics list
|       +-- DSATopic.jsx    # Single topic with code examples
|       +-- DSATest.jsx     # Programming/MCQ test page
|   +-- lib/                # Supabase client & utilities
|
+-- server/                 # Backend source (optional)
|   +-- src/
|       +-- controllers/
|       +-- routes/
|       +-- middleware/
|       +-- index.js
|
+-- public/                 # Static assets
|   +-- ChatGPT_Image_Jun_13,_2026,_01_29_29_PM.png  # Logo image
|
+-- package.json
+-- tailwind.config.js      # Aurora color theme
+-- src/index.css           # Aurora CSS utilities
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd project

# Install dependencies
npm install
```

### Environment Variables

Create `.env` in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api  # Optional if using backend
```

**Note:** The frontend uses Supabase directly for authentication and data fetching. The backend server is optional but can be used for additional API endpoints.

### Running Locally

#### Frontend Only (Recommended)

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

#### Frontend + Backend

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
cd server
npm install  # First time only
npm run dev
```

The backend runs on `http://localhost:5000`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Option 1: Vercel (Recommended for Frontend)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

Vercel will automatically detect Vite and configure the build settings.

### Option 2: Netlify

1. Push code to GitHub
2. Connect to [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Deploy

### Backend Deployment (Optional)

Deploy the Express backend to Railway or Render:

**Railway:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and link project
railway login
railway link

# Deploy
railway up
```

**Render:**
1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repo
3. Set root directory: `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables

### Database (Supabase)

The database is already hosted on Supabase. To set up a new instance:

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migrations in order from `supabase/migrations/`
3. Copy the project URL and anon key to your `.env`

## API Endpoints (Optional Backend)

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Aptitude
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/aptitude/topics | Get all topics |
| GET | /api/aptitude/topics/:topicId/questions | Get questions |
| POST | /api/aptitude/submit | Submit test |

### DSA
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dsa/topics | Get all topics |
| GET | /api/dsa/topics/:topicId/questions | Get questions (includes programming) |
| POST | /api/dsa/submit | Submit test |

### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/companies | Get all companies |
| POST | /api/companies/:companyId/save | Save company |

## Theme Customization

The Aurora gradient theme is defined in:
- `tailwind.config.js` - Color palette and animations
- `src/index.css` - CSS utility classes (`.aurora-text`, `.btn-aurora`, `.card-aurora`)

Colors:
- Purple: `#8B5CF6`
- Blue: `#3B82F6`
- Cyan: `#06B6D4`
- Teal: `#14B8A6`

## License

MIT License
