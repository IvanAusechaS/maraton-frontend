# Mobile Authentication Fix

## Problem

Users can login successfully on mobile devices, but when they try to add movies to favorites, they get a 401 Unauthorized error.

### Root Cause

The issue occurs because:

1. **Login saves user data to localStorage** ✅
2. **JWT token is stored in HTTP-only cookie** 🍪
3. **Mobile browsers have stricter cookie policies** 📱
4. **Cookie may not be sent with subsequent requests** ❌
5. **`isAuthenticated()` only checks localStorage, not the actual cookie** 🔍
6. **Result: UI thinks user is authenticated, but backend rejects requests** ❌

### Why This Happens on Mobile

Mobile browsers (especially Safari iOS and Chrome mobile) have aggressive privacy protections:
- **Third-party cookie blocking**
- **Cross-site tracking prevention**
- **Intelligent Tracking Prevention (ITP)** in Safari
- **SameSite cookie restrictions**

These protections can prevent cookies from being sent even when they should be.

## Solution

### 1. Added `verifyAuthentication()` Method

New method in `authService.ts` that actually checks with the backend:

```typescript
async verifyAuthentication(): Promise<boolean> {
  try {
    // Make a real API call to verify JWT cookie is valid
    await api.get('/usuarios/favorites');
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Clear invalid user data
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('authChanged'));
      return false;
    }
    return this.isAuthenticated(); // Assume authenticated on network errors
  }
}
```

### 2. Updated `handleToggleFavorite()`

Now verifies authentication with the server before allowing favorites operations:

```typescript
const handleToggleFavorite = async () => {
  // Quick local check
  if (!isAuthenticated) {
    // Prompt login
    return;
  }

  // IMPORTANT: Verify with server (catches mobile cookie issues)
  const isReallyAuthenticated = await authService.verifyAuthentication();
  if (!isReallyAuthenticated) {
    // Session expired or cookie not available
    alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
    navigate("/login");
    return;
  }

  // Proceed with favorite toggle...
};
```

## Benefits

✅ **Detects cookie issues immediately** - Before attempting the actual operation  
✅ **Better UX** - Clear message about session expiration  
✅ **Works on mobile** - Catches cookie problems specific to mobile browsers  
✅ **Graceful degradation** - Falls back to localStorage check on network errors  
✅ **Auto-cleanup** - Removes stale user data when session is invalid  

## Backend Requirements

For this to work properly on mobile, the backend MUST set cookies with:

```javascript
res.cookie('authToken', token, {
  httpOnly: true,
  secure: true,                    // HTTPS only
  sameSite: 'none',               // Allow cross-site (Vercel → Render)
  maxAge: 24 * 60 * 60 * 1000,   // 24 hours
  path: '/'                        // Available for all paths
});
```

### CORS Configuration

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app'
  ],
  credentials: true,  // CRITICAL: Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
```

## Testing on Mobile

### 1. Test Cookie Presence

On mobile device, open DevTools:
1. Go to Application → Cookies
2. Check if `authToken` cookie exists after login
3. Check cookie attributes: `Secure`, `SameSite=None`, `HttpOnly`

### 2. Test Authentication Flow

1. Login on mobile ✅
2. Navigate to movie detail page ✅
3. Click "Add to Favorites" button
4. Should either:
   - Add to favorites successfully ✅
   - Show "Session expired" message and redirect to login 🔄

### 3. Check Console Logs

Look for:
```
Error checking favorite status: ApiError: Autenticación requerida
```

If you see this, the `verifyAuthentication()` will catch it and prompt re-login.

## Alternative Solution: Authorization Header

If cookies continue to fail on mobile, consider switching to Authorization header:

### Pros:
- ✅ Works reliably on all platforms
- ✅ No cookie policy issues
- ✅ Easier to debug

### Cons:
- ❌ Less secure (XSS vulnerable)
- ❌ Requires localStorage for token
- ❌ More code changes needed

### Implementation:
```typescript
// Store token in localStorage after login
localStorage.setItem('token', response.token);

// Add to all API requests
headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
```

## Troubleshooting

### Issue: Still getting 401 on mobile after fix

**Check:**
1. Is `VITE_API_URL` set correctly in Vercel?
2. Is backend CORS allowing your Vercel domain?
3. Are cookies set with `sameSite: 'none'` and `secure: true`?
4. Is HTTPS enabled on both frontend and backend?

### Issue: Cookies work on desktop but not mobile

**Likely cause:** Safari ITP (Intelligent Tracking Prevention)

**Solution:** 
- Ensure cookies have `sameSite: 'none'` and `secure: true`
- Consider using same-domain deployment (frontend and backend on same domain)

### Issue: Login works but favorites fail immediately

**This fix addresses this exact issue!**

The `verifyAuthentication()` check will:
1. Detect the cookie is missing/invalid
2. Clear localStorage
3. Prompt user to login again
4. User logs in with fresh cookie
5. Favorites should work now

## Deployment Checklist

Before deploying:

- [ ] Backend sets cookies with correct attributes
- [ ] Backend CORS allows Vercel domain with credentials
- [ ] `VITE_API_URL` environment variable set in Vercel
- [ ] Test login flow on mobile device
- [ ] Test favorites on mobile device
- [ ] Check browser console for cookie/CORS errors
- [ ] Verify cookies appear in DevTools → Application → Cookies

## Future Improvements

1. **Add JWT refresh token** - Automatic token refresh before expiry
2. **Add loading state** - Show spinner during authentication verification
3. **Add retry logic** - Retry failed requests with new token
4. **Add session timeout warning** - Warn user before session expires
5. **Consider Authorization header** - If cookie issues persist on mobile
