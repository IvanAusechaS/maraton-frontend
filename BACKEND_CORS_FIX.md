# 🔧 Guía Completa: Configuración Backend para Cookies HTTP-only

## 🚨 El Problema

```
Access to fetch at 'https://maraton-backend-cv2e.onrender.com/api/auth/login' 
from origin 'https://maraton-frontend.vercel.app' has been blocked by CORS policy: 
The value of the 'Access-Control-Allow-Origin' header in the response must not be 
the wildcard '*' when the request's credentials mode is 'include'.
```

### ¿Por qué pasa esto?

1. El **frontend** envía requests con `credentials: 'include'` para enviar cookies
2. El **backend** responde con `Access-Control-Allow-Origin: *` (wildcard)
3. El **navegador** BLOQUEA la request porque:
   - ❌ Con `credentials: true` NO puedes usar wildcard `*`
   - ✅ Debes especificar el origin exacto

⚠️ **Nota Importante**: **Postman funciona** porque NO es un navegador y no aplica CORS. Los navegadores sí lo aplican por seguridad.

---

## ✅ SOLUCIÓN COMPLETA

### 📦 Paso 1: Instalar Dependencias

```bash
npm install cookie-parser cors
```

---

### 🔧 Paso 2: Configurar CORS (CRÍTICO)

#### Archivo: `server.js` o `app.js` o `index.js`

```javascript
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// ✅ LISTA DE ORÍGENES PERMITIDOS
const allowedOrigins = [
  'http://localhost:5173',                    // Desarrollo local
  'http://localhost:5174',                    // Desarrollo local (puerto alternativo)
  'https://maraton-frontend.vercel.app',      // ✅ PRODUCCIÓN VERCEL
];

// ✅ CONFIGURACIÓN CORS CORRECTA
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, mobile apps, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Verificar si el origin está permitido
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS permitido para: ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ CORS bloqueado para: ${origin}`);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true, // ✅ CRUCIAL: Permite cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
};

// ✅ APLICAR MIDDLEWARES EN ESTE ORDEN (IMPORTANTE)
app.use(cors(corsOptions));        // 1️⃣ CORS primero
app.use(cookieParser());           // 2️⃣ Cookie parser segundo  
app.use(express.json());           // 3️⃣ JSON parser tercero
app.use(express.urlencoded({ extended: true }));

// ... tus rutas después ...
```

#### Mejor Práctica: Con Variables de Entorno

**Archivo `.env`:**
```bash
# Frontend URLs
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL_PROD=https://maraton-frontend.vercel.app

# JWT Secret
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_por_uno_real

# Node Environment
NODE_ENV=production
```

**En tu código:**
```javascript
require('dotenv').config();

const allowedOrigins = [
  process.env.FRONTEND_URL_DEV,
  process.env.FRONTEND_URL_PROD,
].filter(Boolean); // Filtrar valores undefined

console.log('✅ CORS configurado para:', allowedOrigins);
```

---

### 🍪 Paso 3: Modificar Ruta de LOGIN

#### ANTES (inseguro con localStorage):
```javascript
app.post('/api/auth/login', async (req, res) => {
  try {
    // ... autenticar usuario ...
    const token = jwt.sign({ userId: user.id }, 'secret');
    
    // ❌ Token en el response (accesible desde JavaScript)
    res.json({
      message: 'Login exitoso',
      token: token,  // ❌ VULNERABLE A XSS
      usuario: { /* ... */ }
    });
  } catch (error) {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});
```

#### DESPUÉS (seguro con HTTP-only cookie):
```javascript
const jwt = require('jsonwebtoken');

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Autenticar usuario (tu lógica actual aquí)
    const user = await Usuario.findOne({ where: { email } });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Generar JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // ✅ GUARDAR TOKEN EN COOKIE HTTP-ONLY
    res.cookie('authToken', token, {
      httpOnly: true,  // ✅ NO accesible desde JavaScript (previene XSS)
      secure: process.env.NODE_ENV === 'production', // ✅ Solo HTTPS en producción
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ✅ Para CORS
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      path: '/',
    });
    
    // ✅ NO ENVIAR EL TOKEN EN EL JSON
    res.json({
      message: 'Login exitoso',
      usuario: {
        id: user.id,
        email: user.email,
        username: user.username,
        fecha_nacimiento: user.fecha_nacimiento,
      }
      // ❌ NO incluir "token" aquí
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});
```

---

### 🚪 Paso 4: Modificar Ruta de LOGOUT

```javascript
app.post('/api/auth/logout', (req, res) => {
  // Limpiar la cookie
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
  
  res.json({ message: 'Logout exitoso' });
});
```

---

### 🔐 Paso 5: Actualizar Middleware de Autenticación

#### ANTES (leer del header):
```javascript
const authMiddleware = (req, res, next) => {
  // ❌ Leer del header Authorization
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
```

#### DESPUÉS (leer de cookie):
```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // ✅ Leer del cookie HTTP-only
  const token = req.cookies.authToken;
  
  if (!token) {
    return res.status(401).json({ message: 'Autenticación requerida' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('✅ Usuario autenticado:', decoded.userId);
    next();
  } catch (error) {
    console.error('❌ Error verificando token:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
```

#### Aplicar en Rutas Protegidas:
```javascript
const authMiddleware = require('./middleware/auth');

// Rutas protegidas
app.get('/api/movies', authMiddleware, async (req, res) => {
  // req.user tiene los datos del token decodificado
  console.log('Usuario autenticado:', req.user.userId);
  // ... tu lógica ...
});

app.get('/api/profile', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  // ... obtener perfil del usuario ...
});
```

---

## 🧪 PASO 6: PROBAR TODO

### Prueba 1: Verificar CORS

```bash
curl -X OPTIONS https://maraton-backend-cv2e.onrender.com/api/auth/login \
  -H "Origin: https://maraton-frontend.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v

# ✅ Debe incluir en la respuesta:
# Access-Control-Allow-Origin: https://maraton-frontend.vercel.app
# Access-Control-Allow-Credentials: true
# (NO debe ser *)
```

### Prueba 2: Login y Cookie

```bash
# 1. Login (guardar cookie en archivo)
curl -X POST https://maraton-backend-cv2e.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://maraton-frontend.vercel.app" \
  -d '{"email":"tu@email.com","password":"tupassword"}' \
  -c cookies.txt \
  -v

# ✅ Debe mostrar:
# Set-Cookie: authToken=eyJhbGc...; Path=/; HttpOnly; Secure; SameSite=None

# 2. Usar cookie para request autenticado
curl https://maraton-backend-cv2e.onrender.com/api/movies \
  -b cookies.txt \
  -H "Origin: https://maraton-frontend.vercel.app" \
  -v

# ✅ Debe devolver las películas correctamente
```

---

## ⚙️ PASO 7: Configurar Variables de Entorno en Render

1. Ve a tu dashboard de Render
2. Selecciona tu servicio: `maraton-backend-cv2e`
3. Ve a **Environment** → **Environment Variables**
4. Agrega las siguientes variables:

```
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL_PROD=https://maraton-frontend.vercel.app
JWT_SECRET=tu_secreto_super_seguro_cambiar_esto
NODE_ENV=production
```

5. Click en **Save Changes**
6. Render hará un **redeploy automático**

---

## 📝 CHECKLIST COMPLETO

### Backend Code
- [ ] `npm install cookie-parser cors`
- [ ] Configurar CORS con origins específicos (NO `*`)
- [ ] Agregar `credentials: true` en corsOptions
- [ ] Agregar `app.use(cookieParser())` ANTES de las rutas
- [ ] Modificar `/api/auth/login` para setear cookie (NO enviar token en JSON)
- [ ] Modificar `/api/auth/logout` para limpiar cookie
- [ ] Modificar middleware de auth para leer `req.cookies.authToken`
- [ ] Crear archivo `.env` con variables

### Render Dashboard
- [ ] Configurar variables de entorno en Render
- [ ] `FRONTEND_URL_PROD=https://maraton-frontend.vercel.app`
- [ ] `JWT_SECRET=secreto_seguro`
- [ ] `NODE_ENV=production`
- [ ] Hacer deploy del backend

### Testing
- [ ] Probar CORS con curl
- [ ] Probar login desde frontend en producción
- [ ] Verificar cookie en DevTools (Application → Cookies)
- [ ] Verificar flags: HttpOnly, Secure, SameSite
- [ ] Probar rutas protegidas
- [ ] Probar logout
- [ ] Probar refresh de página mantiene sesión

---

## 🔍 TROUBLESHOOTING

### ❌ Error: "CORS blocked"
**Causa**: El origin no está en `allowedOrigins`  
**Solución**: Agregar `https://maraton-frontend.vercel.app` a la lista

### ❌ Error: "Cookie not being sent"
**Causa**: Falta `credentials: true` en CORS del backend  
**Solución**: Verificar corsOptions tiene `credentials: true`

### ❌ Error: "req.cookies.authToken is undefined"
**Causa**: `cookieParser()` no está aplicado o está después de las rutas  
**Solución**: Mover `app.use(cookieParser())` ANTES de las rutas

### ❌ Cookie no aparece en DevTools
**Causa**: Es HTTP-only (normal)  
**Solución**: Ir a DevTools → Application → Cookies (ahí sí aparece)

### ✅ Postman funciona pero navegador no
**Causa**: Postman no aplica CORS  
**Solución**: Es normal, el navegador aplica CORS por seguridad

---

## 📊 COMPARACIÓN

| Antes (localStorage) | Después (HTTP-only cookie) |
|---------------------|---------------------------|
| ❌ Token en JSON response | ✅ Token en cookie |
| ❌ `Authorization: Bearer TOKEN` | ✅ Cookie automática |
| ❌ Vulnerable a XSS | ✅ Protegido contra XSS |
| ❌ CORS con `*` | ✅ CORS con origin específico |
| ❌ Token accesible desde JS | ✅ Token inaccesible desde JS |

---

## 🎯 RESUMEN DE CAMBIOS EN EL BACKEND

1. **CORS**: Cambiar de `origin: '*'` a origins específicos con `credentials: true`
2. **Login**: Setear cookie en vez de enviar token en JSON
3. **Logout**: Limpiar cookie
4. **Middleware**: Leer token de `req.cookies.authToken` en vez de header
5. **Variables de entorno**: Configurar en Render

---

## 📞 ¿NECESITAS AYUDA?

1. Revisa los logs de Render para errores
2. Usa DevTools → Network → Headers para ver requests
3. Prueba primero con curl antes del frontend
4. Verifica que las variables de entorno estén correctas en Render

---

**Prioridad**: 🔴 **CRÍTICA** - Bloqueando producción  
**Fecha**: 14 de octubre de 2025  
**Autor**: Ivan Ausecha  
**Frontend**: https://maraton-frontend.vercel.app  
**Backend**: https://maraton-backend-cv2e.onrender.com

