# 🎬 Maraton Frontend

Movie streaming platform built with React, TypeScript, and Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd maraton-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

Visit `http://localhost:5173`

## 📁 Project Structure

```
maraton-frontend/
├── docs/               # 📚 Complete documentation (see docs/README.md)
├── public/             # Static assets (SVG icons, images)
├── src/
│   ├── components/     # Reusable components (Navbar, Footer, Modal, FavoriteButton)
│   ├── contexts/       # React contexts (FavoritesContext)
│   ├── hooks/          # Custom React hooks (useFavorites)
│   ├── pages/          # Page components
│   │   ├── auth/       # Authentication pages (Login, Signup)
│   │   ├── home/       # Home page with Hero and Carousel
│   │   ├── movie/      # Movies browsing page
│   │   ├── movie-detail/  # Movie detail page
│   │   ├── movie-player/  # Video player page
│   │   ├── profile/    # User profile page
│   │   └── about/      # About us page
│   ├── layout/         # Layout components
│   ├── routes/         # Route configuration
│   ├── services/       # API services (auth, movies)
│   └── main.tsx        # App entry point
├── .env                # Local environment variables
└── vite.config.ts      # Vite configuration
```

## 📚 Documentation

All project documentation is organized in the [`docs/`](./docs/) directory:

- **[Complete Documentation Index](./docs/README.md)** - Start here for all docs
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - How to deploy the application
- **[WCAG & Usability](./docs/USABILITY_WCAG_DOCUMENTATION.md)** - Accessibility compliance
- **[Features Documentation](./docs/)** - Movies, authentication, favorites, and more

> 💡 **Tip**: Check the [docs/README.md](./docs/README.md) for a complete table of contents.

## 🛠️ Tech Stack

- **Framework**: React 19.x
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 7.x
- **Routing**: React Router v7
- **Styling**: SASS/SCSS with BEM methodology
- **HTTP Client**: Fetch API
- **Notifications**: React Toastify
- **Media API**: Pexels API

## 🎨 Features

- ✅ User authentication (Login/Signup/Logout) with JWT
- ✅ Password recovery and reset
- ✅ Movie catalog with genre filters (Terror, Aventura, Acción, Romance)
- ✅ Favorites system with real-time synchronization
- ✅ Full-screen video player with keyboard controls
- ✅ Movie detail pages with ratings and comments
- ✅ Search functionality
- ✅ Responsive design (Desktop/Tablet/Mobile)
- ✅ User profile management
- ✅ Protected routes
- ✅ WCAG 2.1 Level AA accessibility compliance
- ✅ Custom modal system
- ✅ Toast notifications

## 🌐 Environment Variables

### Development (`.env`)
```bash
VITE_API_URL=http://localhost:3000/api
VITE_APP_ENV=development
```

### Production (`.env.production`)
```bash
VITE_API_URL=https://maraton-backend.onrender.com/api
VITE_APP_ENV=production
```

## 📜 Available Scripts

```bash
# Development server with HMR
npm run dev

# Type check and build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## 🐳 Docker Support

### Development
```bash
docker-compose up
```

### Production Build
```bash
docker build -t maraton-frontend .
docker run -p 80:80 maraton-frontend
```

See [DOCKER.md](./DOCKER.md) for detailed Docker instructions.

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide including:
- Vercel deployment
- Netlify deployment
- Render static site
- Environment configuration
- CORS setup
- CI/CD pipeline

### Quick Deploy

**Vercel** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## 🔐 API Integration

Backend: `https://maraton-backend.onrender.com`

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/recovery` - Password recovery
- `POST /api/auth/reset-password` - Reset password

### Movie Endpoints
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/movies/filter/:category` - Filter by category

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npm run build  # Includes tsc -b
```

## 📝 Code Style

- **Methodology**: BEM for CSS class naming
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with React rules
- **Formatting**: Consistent with project conventions

## 🤝 Contributing

1. Create a feature branch from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push to remote
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request to `develop`

### Commit Convention
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 📄 License

See [LICENSE](./LICENSE) for details.

## 👥 Team

- **Ivan Ausecha** - Frontend Developer

## 🔗 Links

- **Production**: TBD
- **Backend API**: https://maraton-backend.onrender.com
- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

Built with ❤️ using React + TypeScript + Vite

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
