# 🎬 Maraton Backend - Documentación de Películas y Favoritos

## 📋 Tabla de Contenidos
- [Arquitectura](#arquitectura)
- [API de Películas](#api-de-películas)
- [API de Favoritos](#api-de-favoritos)
- [Integración con Pexels](#integración-con-pexels)
- [Modelos de Datos](#modelos-de-datos)
- [Autenticación](#autenticación)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🏗️ Arquitectura

### Stack Tecnológico
- **Framework**: Express.js 5.1.0 con TypeScript
- **ORM**: Prisma 6.17.1
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: JWT con HTTP-only cookies
- **API Externa**: Pexels API para videos/trailers

### Estructura de Carpetas
```
src/
├── routes/
│   ├── pelicula.ts    # Endpoints de películas
│   ├── usuario.ts     # Endpoints de usuarios y favoritos
│   └── auth.ts        # Autenticación
├── services/
│   └── pexels.ts      # Servicio de integración con Pexels
├── middleware/
│   └── verifyToken.ts # Middleware de autenticación JWT
└── db/
    └── client.ts      # Cliente de Prisma
```

---

## 🎥 API de Películas

### Base URL
```
http://localhost:3000/api/peliculas
```
**Producción**: `https://tu-backend.onrender.com/api/peliculas`

---

### 1. Obtener todas las películas

**Endpoint**: `GET /api/peliculas`  
**Acceso**: Público  
**Descripción**: Obtiene todas las películas disponibles en la plataforma.

#### Request
```bash
curl -X GET http://localhost:3000/api/peliculas
```

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "titulo": "Inception",
    "director": "Christopher Nolan",
    "año": 2010,
    "duracion": 148,
    "sinopsis": "Un ladrón que roba secretos...",
    "trailer": "https://www.youtube.com/watch?v=...",
    "portada": "https://images.pexels.com/...",
    "largometraje": "https://videos.pexels.com/...",
    "actores": "Leonardo DiCaprio, Marion Cotillard",
    "disponible": true,
    "idiomaId": 1
  },
  {
    "id": 2,
    "titulo": "The Matrix",
    "director": "Wachowski Brothers",
    "año": 1999,
    "duracion": 136,
    "sinopsis": "Un hacker descubre la verdad...",
    "trailer": "https://www.youtube.com/watch?v=...",
    "portada": "https://images.pexels.com/...",
    "largometraje": "https://videos.pexels.com/...",
    "actores": "Keanu Reeves, Laurence Fishburne",
    "disponible": true,
    "idiomaId": 1
  }
]
```

#### Notas
- Solo devuelve películas con `disponible: true`
- Las películas eliminadas tienen `disponible: false` y no aparecen

---

### 2. Obtener película por ID

**Endpoint**: `GET /api/peliculas/:id`  
**Acceso**: Público  
**Descripción**: Obtiene los detalles completos de una película específica.

#### Request
```bash
curl -X GET http://localhost:3000/api/peliculas/1
```

#### Response (200 OK)
```json
{
  "id": 1,
  "titulo": "Inception",
  "director": "Christopher Nolan",
  "año": 2010,
  "duracion": 148,
  "sinopsis": "Un ladrón que roba secretos corporativos...",
  "trailer": "https://www.youtube.com/watch?v=YoHD9XEInc0",
  "portada": "https://images.pexels.com/photos/1234/pexels-photo.jpg",
  "largometraje": "https://videos.pexels.com/video-files/1234/movie.mp4",
  "actores": "Leonardo DiCaprio, Marion Cotillard, Tom Hardy",
  "disponible": true,
  "idiomaId": 1
}
```

#### Response (404 Not Found)
```json
{
  "error": "Pelicula no encontrada"
}
```

---

### 3. Obtener todos los géneros

**Endpoint**: `GET /api/peliculas/generos`  
**Acceso**: Público  
**Descripción**: Obtiene la lista completa de géneros disponibles.

#### Request
```bash
curl -X GET http://localhost:3000/api/peliculas/generos
```

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "nombre": "Acción",
    "estado": true
  },
  {
    "id": 2,
    "nombre": "Drama",
    "estado": true
  },
  {
    "id": 3,
    "nombre": "Comedia",
    "estado": true
  },
  {
    "id": 4,
    "nombre": "Terror",
    "estado": true
  },
  {
    "id": 5,
    "nombre": "Ciencia Ficción",
    "estado": true
  }
]
```

---

### 4. Obtener películas por género

**Endpoint**: `GET /api/peliculas/genero/:nombre`  
**Acceso**: Público  
**Descripción**: Obtiene todas las películas de un género específico.

#### Request
```bash
curl -X GET http://localhost:3000/api/peliculas/genero/Acción
```

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "titulo": "Inception",
    "director": "Christopher Nolan",
    "año": 2010,
    "duracion": 148,
    "sinopsis": "Un ladrón que roba secretos...",
    "trailer": "https://www.youtube.com/watch?v=...",
    "portada": "https://images.pexels.com/...",
    "largometraje": "https://videos.pexels.com/...",
    "actores": "Leonardo DiCaprio, Marion Cotillard",
    "disponible": true,
    "idiomaId": 1
  }
]
```

#### Response (404 Not Found)
```json
{
  "message": "No se encontraron películas para el género \"Terror\""
}
```

#### Notas
- La búsqueda es **case-insensitive** (no distingue mayúsculas/minúsculas)
- Ejemplos válidos: `"acción"`, `"Acción"`, `"ACCIÓN"` devuelven los mismos resultados

---

### 5. Eliminar película (soft delete)

**Endpoint**: `DELETE /api/peliculas/:id`  
**Acceso**: Público _(Nota: debería ser Privado/Admin en producción)_  
**Descripción**: Marca una película como no disponible (soft delete).

#### Request
```bash
curl -X DELETE http://localhost:3000/api/peliculas/1
```

#### Response (200 OK)
```json
{
  "id": 1,
  "titulo": "Inception",
  "disponible": false,
  "...": "..."
}
```

#### Notas
- No elimina físicamente la película de la base de datos
- Cambia el campo `disponible` a `false`
- Las películas con `disponible: false` no aparecen en `GET /api/peliculas`

---

## ⭐ API de Favoritos

**Base URL**: `http://localhost:3000/api/usuarios`  
**Autenticación**: Requerida (JWT cookie)

---

### 1. Añadir película a favoritos

**Endpoint**: `POST /api/usuarios/favorites`  
**Acceso**: Privado (requiere autenticación)  
**Descripción**: Añade una película a la lista de favoritos del usuario autenticado.

#### Request Headers
```
Cookie: authToken=<jwt_token>
```

#### Request Body
```json
{
  "peliculaId": 1
}
```

#### Request (cURL)
```bash
curl -X POST http://localhost:3000/api/usuarios/favorites \
  -H "Content-Type: application/json" \
  -H "Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"peliculaId": 1}'
```

#### Request (JavaScript/Fetch)
```javascript
const response = await fetch('http://localhost:3000/api/usuarios/favorites', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // ⚠️ IMPORTANTE: Incluir cookies
  body: JSON.stringify({
    peliculaId: 1
  })
});

const data = await response.json();
console.log(data);
```

#### Response (200 OK) - Preferencia actualizada
```json
{
  "message": "Pelicula añadida a favoritos"
}
```

#### Response (201 Created) - Nueva preferencia creada
```json
{
  "message": "Pelicula añadida a favoritos",
  "gusto": {
    "id": 10,
    "favoritos": true,
    "reproducida": false,
    "ver_mas_tarde": false,
    "calificacion": null,
    "usuarioId": 5,
    "peliculaId": 1
  }
}
```

#### Response (404 Not Found)
```json
{
  "error": "Usuario no encontrado"
}
```
o
```json
{
  "error": "Pelicula no encontrada"
}
```

#### Notas
- Si ya existe una preferencia para esta película, actualiza `favoritos` a `true`
- Si no existe preferencia, crea una nueva con `favoritos: true`
- Los campos `reproducida`, `ver_mas_tarde`, y `calificacion` tienen valores por defecto

---

### 2. Obtener películas favoritas

**Endpoint**: `GET /api/usuarios/favorites`  
**Acceso**: Privado (requiere autenticación)  
**Descripción**: Obtiene todas las películas marcadas como favoritas por el usuario autenticado.

#### Request Headers
```
Cookie: authToken=<jwt_token>
```

#### Request (cURL)
```bash
curl -X GET http://localhost:3000/api/usuarios/favorites \
  -H "Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Request (JavaScript/Fetch)
```javascript
const response = await fetch('http://localhost:3000/api/usuarios/favorites', {
  method: 'GET',
  credentials: 'include', // ⚠️ IMPORTANTE: Incluir cookies
});

const data = await response.json();
console.log(data);
```

#### Response (200 OK)
```json
{
  "total": 3,
  "movies": [
    {
      "id": 1,
      "titulo": "Inception",
      "director": "Christopher Nolan",
      "año": 2010,
      "duracion": 148,
      "sinopsis": "Un ladrón que roba secretos...",
      "trailer": "https://www.youtube.com/watch?v=...",
      "portada": "https://images.pexels.com/...",
      "largometraje": "https://videos.pexels.com/...",
      "actores": "Leonardo DiCaprio, Marion Cotillard",
      "disponible": true,
      "idiomaId": 1
    },
    {
      "id": 5,
      "titulo": "Interstellar",
      "director": "Christopher Nolan",
      "año": 2014,
      "duracion": 169,
      "sinopsis": "Un grupo de exploradores...",
      "trailer": "https://www.youtube.com/watch?v=...",
      "portada": "https://images.pexels.com/...",
      "largometraje": "https://videos.pexels.com/...",
      "actores": "Matthew McConaughey, Anne Hathaway",
      "disponible": true,
      "idiomaId": 1
    }
  ]
}
```

#### Response (500 Internal Server Error)
```json
{
  "message": "No se pudieron obtener favoritos, intentalo de nuevo mas tarde"
}
```

---

### 3. Actualizar estado de favorito

**Endpoint**: `PATCH /api/usuarios/favorites/:id`  
**Acceso**: Privado (requiere autenticación)  
**Descripción**: Actualiza el estado de favorito de una película específica (marcar/desmarcar).

#### Request Headers
```
Cookie: authToken=<jwt_token>
```

#### Request Body
```json
{
  "favorite": false
}
```

#### Request (cURL) - Desmarcar como favorito
```bash
curl -X PATCH http://localhost:3000/api/usuarios/favorites/1 \
  -H "Content-Type: application/json" \
  -H "Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"favorite": false}'
```

#### Request (JavaScript/Fetch)
```javascript
// Desmarcar como favorito
const response = await fetch('http://localhost:3000/api/usuarios/favorites/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // ⚠️ IMPORTANTE: Incluir cookies
  body: JSON.stringify({
    favorite: false // true para marcar, false para desmarcar
  })
});

const data = await response.json();
console.log(data);
```

#### Response (200 OK)
```json
{
  "gustoActualizado": {
    "id": 10,
    "favoritos": false,
    "reproducida": false,
    "ver_mas_tarde": false,
    "calificacion": null,
    "usuarioId": 5,
    "peliculaId": 1
  }
}
```

#### Response (404 Not Found)
```json
{
  "message": "No fue posible actualizar favoritos, intentalo de nuevo mas tarde."
}
```

#### Notas
- Solo actualiza preferencias que ya existen
- Si la preferencia no existe, devuelve 404
- Usa `POST /favorites` primero para crear la preferencia inicial

---

## 🎨 Integración con Pexels

### Servicio de Pexels (`src/services/pexels.ts`)

El backend integra la API de Pexels para obtener videos de alta calidad que pueden usarse como trailers o largometrajes.

#### Configuración

**Variables de entorno** (`.env`):
```bash
PEXELS_API_KEY=tu_api_key_de_pexels
```

#### Función Principal

```typescript
import { fetchVideos } from './services/pexels';

// Buscar videos de películas cortas
const videos = await fetchVideos('/videos/search', 'short film', 5, 1);
```

#### Parámetros

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `route` | string | `/videos/search` | Ruta de la API de Pexels |
| `query` | string | `'short film'` | Término de búsqueda |
| `perPage` | number | `5` | Cantidad de videos por página |
| `page` | number | `1` | Número de página |

#### Respuesta de Pexels

```javascript
[
  {
    id: 12345,
    width: 1920,
    height: 1080,
    duration: 30,
    image: "https://images.pexels.com/videos/...",
    video_files: [
      {
        id: 67890,
        quality: "hd",
        file_type: "video/mp4",
        width: 1920,
        height: 1080,
        link: "https://videos.pexels.com/video-files/..."
      }
    ],
    video_pictures: [
      {
        id: 11111,
        picture: "https://images.pexels.com/videos/...",
        nr: 0
      }
    ]
  }
]
```

#### Uso en Frontend

```javascript
// Obtener URL del video en calidad HD
const videoUrl = videos[0].video_files.find(f => f.quality === 'hd')?.link;

// Obtener thumbnail/portada
const thumbnailUrl = videos[0].video_pictures[0].picture;

// Usar en componente de video
<video src={videoUrl} poster={thumbnailUrl} controls />
```

#### Queries Recomendadas para Películas

```javascript
// Diferentes géneros
await fetchVideos('/videos/search', 'action movie', 10, 1);
await fetchVideos('/videos/search', 'drama film', 10, 1);
await fetchVideos('/videos/search', 'comedy scene', 10, 1);
await fetchVideos('/videos/search', 'horror movie', 10, 1);
await fetchVideos('/videos/search', 'sci-fi film', 10, 1);

// Trailers
await fetchVideos('/videos/search', 'movie trailer', 10, 1);

// Cortometrajes
await fetchVideos('/videos/search', 'short film', 10, 1);
```

---

## 📊 Modelos de Datos

### Modelo Pelicula

```prisma
model Pelicula {
  id              Int           @id @default(autoincrement())
  duracion        Int           // Duración en minutos
  largometraje    String        @unique // URL del video completo
  actores         String        // Lista de actores (string separado por comas)
  año             Int           // Año de lanzamiento
  disponible      Boolean       // true = visible, false = soft deleted
  sinopsis        String        // Descripción de la película
  trailer         String        // URL del trailer
  titulo          String        // Título de la película
  director        String        // Nombre del director
  portada         String        // URL de la imagen de portada
  idiomaId        Int           // ID del idioma principal
  
  // Relaciones
  catalogos       Catalogo[]    // Géneros asociados
  comentarios     Comentario[]  // Comentarios de usuarios
  gustos          Gusto[]       // Preferencias de usuarios (favoritos, etc.)
  idioma          Idioma        @relation(fields: [idiomaId], references: [id])
  subtitulos      Subtitulo[]   // Subtítulos disponibles
}
```

### Modelo Gusto (Preferencias/Favoritos)

```prisma
model Gusto {
  id            Int      @id @default(autoincrement())
  favoritos     Boolean  @default(false)   // ⭐ Película favorita
  reproducida   Boolean  @default(false)   // ✅ Ya vista
  ver_mas_tarde Boolean  @default(false)   // 🕒 Ver más tarde
  calificacion  Int?                       // ⭐ Calificación 1-5 (opcional)
  usuarioId     Int                        // ID del usuario
  peliculaId    Int                        // ID de la película
  
  // Relaciones
  pelicula      Pelicula @relation(fields: [peliculaId], references: [id])
  usuario       Usuario  @relation(fields: [usuarioId], references: [id])

  // Índice único: Un usuario solo puede tener una preferencia por película
  @@unique([usuarioId, peliculaId])
}
```

### Modelo Genero

```prisma
model Genero {
  id          Int        @id @default(autoincrement())
  nombre      String     @unique @map("descripcion")
  estado      Boolean    // true = activo, false = inactivo
  catalogos   Catalogo[] // Películas asociadas
}
```

### Modelo Catalogo (Relación Película-Género)

```prisma
model Catalogo {
  id         Int      @id @default(autoincrement())
  peliculaId Int
  generoId   Int
  genero     Genero   @relation(fields: [generoId], references: [id])
  pelicula   Pelicula @relation(fields: [peliculaId], references: [id])
}
```

---

## 🔐 Autenticación

### Middleware de Verificación JWT

El sistema usa **HTTP-only cookies** para autenticación segura.

#### Configuración CORS

```typescript
// src/index.ts
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://maraton-frontend.vercel.app'
  ],
  credentials: true // ⚠️ OBLIGATORIO para cookies
}));

app.use(cookieParser());
```

#### Middleware `verify`

```typescript
import verify from '../middleware/verifyToken';

// Proteger endpoint
router.get('/favorites', verify, async (req, res) => {
  const userId = req.user.id; // Usuario autenticado
  // ...
});
```

#### Estructura del Token

```typescript
interface JWTPayload {
  id: number;        // ID del usuario
  email: string;     // Email del usuario
  iat: number;       // Timestamp de emisión
  exp: number;       // Timestamp de expiración (24h)
}
```

#### Obtener Token en Frontend

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // ⚠️ IMPORTANTE
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'Password123!'
  })
});

// La cookie se establece automáticamente

// 2. Requests posteriores
const response = await fetch('http://localhost:3000/api/usuarios/favorites', {
  method: 'GET',
  credentials: 'include' // ⚠️ Incluir cookies en cada request
});
```

#### Logout

```javascript
const response = await fetch('http://localhost:3000/api/auth/logout', {
  method: 'POST',
  credentials: 'include'
});

// La cookie se elimina automáticamente
```

---

## 💻 Ejemplos de Uso

### Ejemplo Completo: Frontend React

```jsx
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

function MovieFavorites() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener todas las películas
  useEffect(() => {
    fetchMovies();
    fetchFavorites();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${API_URL}/peliculas`);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios/favorites`, {
        credentials: 'include' // ⚠️ Incluir cookies
      });
      const data = await response.json();
      setFavorites(data.movies);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    }
  };

  const toggleFavorite = async (movieId, isFavorite) => {
    try {
      if (isFavorite) {
        // Desmarcar favorito
        await fetch(`${API_URL}/usuarios/favorites/${movieId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ favorite: false })
        });
      } else {
        // Marcar como favorito
        await fetch(`${API_URL}/usuarios/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ peliculaId: movieId })
        });
      }
      
      // Actualizar lista de favoritos
      fetchFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some(fav => fav.id === movieId);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Películas</h1>
      <div className="movies-grid">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <img src={movie.portada} alt={movie.titulo} />
            <h3>{movie.titulo}</h3>
            <p>{movie.director} ({movie.año})</p>
            <button onClick={() => toggleFavorite(movie.id, isFavorite(movie.id))}>
              {isFavorite(movie.id) ? '❤️ Favorito' : '🤍 Añadir a favoritos'}
            </button>
          </div>
        ))}
      </div>

      <h2>Mis Favoritos ({favorites.length})</h2>
      <div className="favorites-list">
        {favorites.map(movie => (
          <div key={movie.id} className="favorite-item">
            <img src={movie.portada} alt={movie.titulo} />
            <div>
              <h4>{movie.titulo}</h4>
              <p>{movie.sinopsis.substring(0, 100)}...</p>
              <button onClick={() => toggleFavorite(movie.id, true)}>
                ❌ Quitar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieFavorites;
```

### Ejemplo: Búsqueda por Género

```jsx
function MoviesByGenre() {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Obtener géneros
    fetch('http://localhost:3000/api/peliculas/generos')
      .then(res => res.json())
      .then(data => setGenres(data));
  }, []);

  const selectGenre = async (genreName) => {
    setSelectedGenre(genreName);
    const response = await fetch(
      `http://localhost:3000/api/peliculas/genero/${genreName}`
    );
    const data = await response.json();
    setMovies(data);
  };

  return (
    <div>
      <h2>Explorar por Género</h2>
      <div className="genre-buttons">
        {genres.map(genre => (
          <button 
            key={genre.id}
            onClick={() => selectGenre(genre.nombre)}
            className={selectedGenre === genre.nombre ? 'active' : ''}
          >
            {genre.nombre}
          </button>
        ))}
      </div>

      {movies.length > 0 && (
        <div className="movies-grid">
          <h3>Películas de {selectedGenre}</h3>
          {movies.map(movie => (
            <div key={movie.id} className="movie-card">
              <img src={movie.portada} alt={movie.titulo} />
              <h4>{movie.titulo}</h4>
              <p>{movie.año}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Ejemplo: Reproductor de Video con Pexels

```jsx
function VideoPlayer({ movieId }) {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    // Obtener detalles de la película
    fetch(`http://localhost:3000/api/peliculas/${movieId}`)
      .then(res => res.json())
      .then(data => setMovie(data));
  }, [movieId]);

  if (!movie) return <div>Cargando...</div>;

  return (
    <div className="video-player">
      <h1>{movie.titulo}</h1>
      
      {/* Video principal de Pexels */}
      <video 
        controls 
        poster={movie.portada}
        width="100%"
        height="auto"
      >
        <source src={movie.largometraje} type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>

      <div className="movie-info">
        <p><strong>Director:</strong> {movie.director}</p>
        <p><strong>Año:</strong> {movie.año}</p>
        <p><strong>Duración:</strong> {movie.duracion} min</p>
        <p><strong>Actores:</strong> {movie.actores}</p>
        <p>{movie.sinopsis}</p>
      </div>

      {/* Trailer */}
      <div className="trailer">
        <h3>Trailer</h3>
        <iframe 
          width="100%" 
          height="400" 
          src={movie.trailer}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
```

---

## 🚀 Configuración de Producción

### Variables de Entorno Render

```bash
# Base de datos
DATABASE_URL=postgresql://postgres.xxx:xxx@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require

# Autenticación
JWT_SECRET=tu_secret_super_seguro_aqui
NODE_ENV=production

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=appmaraton@gmail.com

# Frontend
FRONTEND_URL_PROD=https://maraton-frontend.vercel.app

# Pexels API
PEXELS_API_KEY=tu_api_key_de_pexels

# Supabase (opcional)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### CORS en Producción

```typescript
// src/index.ts
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL_PROD || 'https://maraton-frontend.vercel.app'
];
```

---

## 📝 Notas Importantes

### ⚠️ Seguridad

1. **CORS con credentials**: Siempre incluir `credentials: 'include'` en fetch del frontend
2. **HTTPS en producción**: Las cookies HTTP-only solo funcionan con HTTPS
3. **SameSite cookies**: Configuradas como `'none'` en producción para cross-site
4. **Validación**: Todos los endpoints validan datos de entrada

### 🎯 Best Practices

1. **Soft Delete**: Las películas se marcan como `disponible: false` en lugar de eliminarse
2. **Índices únicos**: `usuarioId + peliculaId` en tabla `Gusto` previene duplicados
3. **Valores por defecto**: Los campos booleanos tienen `@default(false)` en Prisma
4. **Error handling**: Todos los endpoints usan `globalErrorHandler`

### 🔄 Estados de Preferencias

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `favoritos` | Boolean | ⭐ Película en lista de favoritos |
| `reproducida` | Boolean | ✅ Película ya vista |
| `ver_mas_tarde` | Boolean | 🕒 Guardada para ver después |
| `calificacion` | Int? | ⭐ Rating 1-5 (nullable) |

---

## 📞 Soporte

Para más información sobre el backend, consulta:
- **Documentación de Prisma**: https://www.prisma.io/docs
- **Pexels API**: https://www.pexels.com/api/documentation/
- **JWT con cookies**: https://jwt.io/

---

**Versión**: 1.0.0  
**Última actualización**: Octubre 2025  
**Proyecto**: Maraton - Plataforma de Películas (Académico)
