# Deployment Guide - Frontend

## 📋 Overview
This guide covers deploying the Maraton frontend application to production with Render backend integration.

## 🔧 Prerequisites
- Backend deployed at: `https://maraton-backend.onrender.com`
- Node.js 18+ installed
- Git repository access

## 🌐 Environment Configuration

### Development
Uses local backend:
```bash
VITE_API_URL=http://localhost:3000/api
VITE_APP_ENV=development
```

### Production
Uses Render backend:
```bash
VITE_API_URL=https://maraton-backend.onrender.com/api
VITE_APP_ENV=production
```

## 🚀 Deployment Steps

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select `maraton-frontend`

2. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://maraton-backend.onrender.com/api
   VITE_APP_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main/develop

### Option 2: Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Add new site from Git
   - Select your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Set Environment Variables**
   Go to Site settings > Environment variables:
   ```
   VITE_API_URL=https://maraton-backend.onrender.com/api
   VITE_APP_ENV=production
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will auto-deploy on commits

### Option 3: Render Static Site

1. **Create New Static Site**
   - Go to [render.com](https://render.com)
   - New > Static Site
   - Connect your repository

2. **Configure Build**
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://maraton-backend.onrender.com/api
   VITE_APP_ENV=production
   ```

4. **Deploy**
   - Click "Create Static Site"

## 🔐 CORS Configuration

Ensure your backend (`maraton-backend`) has CORS configured to allow requests from your frontend domain:

```javascript
// Backend CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://your-frontend-domain.vercel.app',
  'https://your-frontend-domain.netlify.app',
  'https://your-frontend-domain.onrender.com'
];
```

## 📝 Build Commands

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview  # Preview production build locally
```

### Type Check
```bash
npm run build  # Runs TypeScript check before build
```

## 🧪 Testing Production Build Locally

1. Create `.env.production.local`:
```bash
cp .env.production .env.production.local
```

2. Build and preview:
```bash
npm run build
npm run preview
```

3. Test at `http://localhost:4173`

## 🔄 CI/CD Pipeline

### Automatic Deployments
- **Develop branch** → Staging environment
- **Main branch** → Production environment

### Manual Deployment
```bash
# Ensure you're on the correct branch
git checkout main  # or develop

# Pull latest changes
git pull origin main

# Deploy (platform-specific)
# Vercel/Netlify will auto-deploy
# Or trigger manual deployment from platform dashboard
```

## 🐛 Troubleshooting

### API Connection Issues
1. Check backend is running: `https://maraton-backend.onrender.com/health`
2. Verify CORS configuration on backend
3. Check browser console for CORS errors
4. Verify environment variables are set correctly

### Build Failures
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist`
3. Check TypeScript errors: `npm run build`
4. Verify all dependencies are in package.json

### Environment Variables Not Working
1. Ensure variables start with `VITE_`
2. Restart dev server after changing .env
3. Clear Vite cache: `rm -rf node_modules/.vite`
4. Rebuild: `npm run build`

## 📊 Performance Optimization

### Implemented
- ✅ Vite production build optimization
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Tree shaking

### Future Optimizations
- [ ] Image optimization (WebP, lazy loading)
- [ ] CDN for static assets
- [ ] Service Worker for PWA
- [ ] Bundle size analysis

## 🔒 Security Checklist

- [x] Environment variables not committed to Git
- [x] API URL configurable via environment
- [x] HTTPS enabled in production
- [x] CORS properly configured
- [ ] Security headers configured on hosting platform
- [ ] CSP (Content Security Policy) headers

## 📞 Support

For deployment issues:
- Check platform-specific documentation
- Review GitHub Actions logs (if using)
- Contact team lead

---

**Last Updated**: October 13, 2025
**Maintainer**: Ivan Ausecha
**Backend URL**: https://maraton-backend.onrender.com
