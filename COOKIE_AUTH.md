# 🍪 Cookie-Based Authentication

## Overview
This application now uses **HTTP-only cookies** for authentication instead of localStorage tokens. This is a more secure approach that prevents XSS (Cross-Site Scripting) attacks.

## Why HTTP-Only Cookies?

### Security Benefits
1. **XSS Protection**: HTTP-only cookies cannot be accessed by JavaScript, preventing token theft via XSS attacks
2. **CSRF Protection**: When combined with SameSite attribute, cookies provide better CSRF protection
3. **Automatic Management**: Browser handles cookie storage and expiration
4. **Secure Flag**: Cookies can be set to only transmit over HTTPS in production

### Problems with localStorage
❌ Accessible by any JavaScript code (vulnerable to XSS)  
❌ No automatic expiration handling  
❌ Not sent automatically with requests  
❌ Can be accessed by third-party scripts  

## Implementation

### Frontend Changes

#### 1. API Configuration (`src/services/api.ts`)
```typescript
const config: RequestInit = {
  ...options,
  headers,
  credentials: 'include', // ✅ Sends cookies with cross-origin requests
};
```

#### 2. Authentication Service (`src/services/authService.ts`)
- **Removed**: Token storage in localStorage
- **Kept**: User data in localStorage (non-sensitive info for UI state)
- **Changed**: `isAuthenticated()` now checks for user data instead of token

```typescript
async login(data: LoginData): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', data);
  
  // Only store user data, not the token
  if (response.usuario) {
    localStorage.setItem('user', JSON.stringify(response.usuario));
  }
  
  return response;
}
```

### Backend Requirements

The backend must be configured to:

#### 1. Set HTTP-Only Cookies on Login
```javascript
// Example with Express.js
res.cookie('authToken', token, {
  httpOnly: true,        // Cannot be accessed by JavaScript
  secure: true,          // Only sent over HTTPS (production)
  sameSite: 'strict',    // CSRF protection
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: '/',
});
```

#### 2. Configure CORS
```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-frontend-domain.vercel.app'
  ],
  credentials: true, // ✅ Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

#### 3. Verify Token from Cookie
```javascript
const authMiddleware = (req, res, next) => {
  const token = req.cookies.authToken; // Read from cookie
  
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  // Verify token...
};
```

#### 4. Clear Cookie on Logout
```javascript
app.post('/auth/logout', (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
  
  res.json({ message: 'Logged out successfully' });
});
```

## Environment Configuration

### Development (.env)
```bash
VITE_API_URL=http://localhost:3000/api
```

### Production (.env.production)
```bash
VITE_API_URL=https://maraton-backend-cv2e.onrender.com/api
```

## Testing

### Test Cookie Setup
1. Login to the application
2. Open browser DevTools → Application/Storage → Cookies
3. Verify `authToken` cookie exists with:
   - ✅ HttpOnly flag
   - ✅ Secure flag (in production)
   - ✅ SameSite=Strict

### Test Authentication Flow
```bash
# 1. Login
curl -X POST https://maraton-backend-cv2e.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  -c cookies.txt

# 2. Access protected endpoint
curl https://maraton-backend-cv2e.onrender.com/api/movies \
  -b cookies.txt

# 3. Logout
curl -X POST https://maraton-backend-cv2e.onrender.com/api/auth/logout \
  -b cookies.txt
```

## Migration Guide

### For Users
No action needed. The change is transparent.

### For Developers
1. ✅ Update backend to set HTTP-only cookies
2. ✅ Configure CORS with `credentials: true`
3. ✅ Update login endpoint to set cookie
4. ✅ Update logout endpoint to clear cookie
5. ✅ Update auth middleware to read from cookie
6. ✅ Test authentication flow end-to-end

## Troubleshooting

### Issue: Cookies not being sent
**Solution**: Ensure `credentials: 'include'` is set in fetch config

### Issue: CORS errors
**Solution**: Backend must:
- Set `Access-Control-Allow-Credentials: true`
- Set specific origin (not `*`)
- Include cookie domain in CORS config

### Issue: Cookie not visible in DevTools
**Solution**: This is normal! HTTP-only cookies don't appear in JavaScript but are visible in DevTools → Application → Cookies

### Issue: Authentication fails after refresh
**Solution**: Check that:
- Cookie hasn't expired
- Cookie path is correct (`/`)
- Backend is reading cookie correctly

## Security Best Practices

✅ **DO**:
- Use HTTPS in production
- Set `httpOnly: true`
- Set `secure: true` in production
- Set `sameSite: 'strict'` or `'lax'`
- Use short expiration times
- Implement refresh token mechanism

❌ **DON'T**:
- Store sensitive data in localStorage
- Send tokens in URL parameters
- Use `sameSite: 'none'` without `secure: true`
- Set overly long expiration times

## Resources

- [OWASP Cookie Security](https://owasp.org/www-community/controls/SecureCookieAttribute)
- [MDN HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [SameSite Cookies Explained](https://web.dev/samesite-cookies-explained/)

---

**Last Updated**: October 14, 2025  
**Author**: Ivan Ausecha
