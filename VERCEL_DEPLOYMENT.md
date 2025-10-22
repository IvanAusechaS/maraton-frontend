# Vercel Deployment Configuration

## Environment Variables

You need to set the following environment variable in Vercel:

### Production
```
VITE_API_URL=https://maraton-backend.onrender.com/api
```

## How to Set Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add the following:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://maraton-backend.onrender.com/api`
   - **Environment**: Production (and Preview if needed)
5. Click "Save"
6. Redeploy your application

## CORS Configuration Required in Backend

Your backend at `maraton-backend.onrender.com` needs to have CORS configured to allow your Vercel domain:

```javascript
// Backend CORS configuration (in your Express/NestJS server)
app.use(cors({
  origin: [
    'http://localhost:5173',                          // Local development
    'https://your-app.vercel.app',                    // Your Vercel domain
    'https://your-custom-domain.com'                   // Your custom domain (if any)
  ],
  credentials: true,  // CRITICAL: Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Cookie Configuration Required in Backend

Make sure your backend sets cookies with the correct attributes:

```javascript
// When setting the JWT cookie
res.cookie('authToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',  // true in production
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',  // 'none' for cross-domain
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
});
```

## Troubleshooting

### Error: 401 Unauthorized when accessing favorites

**Symptoms:**
- Works in localhost
- Fails in Vercel deployment
- Error: "Autenticación requerida"

**Solution:**
1. ✅ Verify `VITE_API_URL` is set in Vercel
2. ✅ Verify backend CORS allows your Vercel domain
3. ✅ Verify backend sets `Access-Control-Allow-Credentials: true`
4. ✅ Verify cookies have `sameSite: 'none'` and `secure: true` in production
5. ✅ Verify cookies have correct domain (or no domain for cross-origin)

### Checking CORS Headers

Open browser DevTools → Network tab → Select a failing request → Check Response Headers:

**Required headers:**
```
Access-Control-Allow-Origin: https://your-app.vercel.app
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

### Testing Cookies

In browser console:
```javascript
document.cookie  // Should show authToken if logged in
```

If no cookie appears after login, the backend cookie configuration is wrong.

## Alternative Solution: Use Authorization Header Instead

If cookies continue to fail, switch to Authorization header:

1. Store JWT in localStorage (less secure but works cross-domain)
2. Send JWT in Authorization header: `Authorization: Bearer <token>`
3. Update api.ts to include token in headers

This is less secure than HTTP-only cookies but works reliably across domains.
