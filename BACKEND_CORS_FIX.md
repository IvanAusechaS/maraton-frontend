# 🚨 URGENT: CORS Error - PATCH Method Not Allowed

## 📋 Error Description

**Error Message**:
```
Access to fetch at 'http://localhost:3000/api/usuarios/favorites/25' from origin 'http://localhost:5173' 
has been blocked by CORS policy: Method PATCH is not allowed by Access-Control-Allow-Methods in preflight response.
```

**What's happening**: The backend CORS configuration is not allowing the PATCH HTTP method, which is needed to remove movies from favorites.

---

## 🔧 REQUIRED FIX

**File**: Backend CORS configuration (likely in `src/index.ts` or `src/app.ts`)

### Current (Broken) Configuration ❌:

```typescript
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
  // Missing: methods configuration
}));
```

### Fixed Configuration ✅:

```typescript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // ✅ ADD THIS LINE
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
}));
```

---

## 📝 Complete CORS Setup

Add this to your backend main file (before routes):

```typescript
import cors from 'cors';

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Important: Add this BEFORE your routes
app.options('*', cors(corsOptions)); // Enable preflight for all routes
```

---

## 🎯 Why PATCH is Needed

The favorites feature uses:
- **POST** `/api/usuarios/favorites` - Add to favorites
- **PATCH** `/api/usuarios/favorites/:id` - Remove from favorites (update favorite: false)

Without PATCH in CORS, users **cannot remove movies from favorites**.

---

## ✅ Testing

After applying the fix, test with:

```bash
# Test PATCH request
curl -X PATCH http://localhost:3000/api/usuarios/favorites/25 \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -b cookies.txt \
  -d '{"favorite": false}'
```

Expected: **Status 200** (not CORS error)

---

## 🔗 Related Files

- Backend CORS config: `src/index.ts` or `src/app.ts`
- Frontend service: `src/services/movieService.ts` (uses PATCH method)

---

**Priority**: 🔴 **CRITICAL** - Users cannot remove favorites  
**Estimated Time**: 5 minutes  
**Date**: October 21, 2025
