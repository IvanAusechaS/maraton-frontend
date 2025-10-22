# 🐛 Backend Issue: Nueva Película No Aparece en Favoritos

## 📋 Descripción del Problema

Cuando el usuario añade una película a favoritos desde `MovieDetailPage`, la película **NO aparece** inmediatamente en la lista de favoritos en `MoviePage`, aunque el frontend hace todo correctamente.

### Escenario de Prueba

1. ✅ Usuario añade película ID **45** a favoritos
2. ✅ Frontend llama correctamente: `POST /api/usuarios/favorites` con `{peliculaId: 45}`
3. ✅ Backend responde 200 OK
4. ✅ Frontend recarga favoritos: `GET /api/usuarios/favorites`
5. ❌ Backend solo retorna películas **[42, 25]** (NO incluye la 45)

**Resultado esperado**: Backend debería retornar **[42, 25, 45]**

---

## 🔍 Diagnóstico

### Frontend (✅ Funcionando Correctamente)

```javascript
// 1. Añadir a favoritos
POST http://localhost:3000/api/usuarios/favorites
Body: { peliculaId: 45 }
Headers: { 'Content-Type': 'application/json' }
Credentials: include (cookie con JWT)

// Response: 200 OK
{
  "message": "Pelicula añadida a favoritos",
  "gusto": { ... }
}

// 2. Inmediatamente después, recarga favoritos
GET http://localhost:3000/api/usuarios/favorites
Credentials: include

// Response: 200 OK
{
  "total": 2,
  "movies": [
    { id: 42, titulo: "...", ... },
    { id: 25, titulo: "...", ... }
    // ❌ FALTA: { id: 45, titulo: "...", ... }
  ]
}
```

### Logs del Frontend

```
➕ [MovieDetailPage] Adding to favorites... (movie ID: 45)
📢 [MovieDetailPage] Calling notifyFavoritesChange()
🔄 [FavoritesContext] Version changing from 1 to 2
✅ [MoviePage] User authenticated, fetching favorites...
📥 [MoviePage] Favorites fetched: 2 movies  ← ❌ Debería ser 3
🎬 [MoviePage] Movies IDs: [42, 25]        ← ❌ Falta el 45
```

---

## 🚨 Posibles Causas en el Backend

### Causa 1: POST No Está Guardando Correctamente

**Archivo**: `src/routes/usuario.ts` - Endpoint `POST /favorites`

**Posible problema**:
```typescript
router.post("/favorites", verify, async (req, res) => {
  const movieId = req.body.peliculaId;
  const userId = req.user.id;
  
  try {
    const user = await prisma.usuario.findUnique({
      where: {
        id: userId  // ⚠️ ¿Está llegando correctamente el userId del JWT?
      }
    });
    
    // ⚠️ ¿Se está verificando que la película exista?
    const movie = await prisma.pelicula.findUnique({
      where: { id: movieId }
    });
    
    if (!movie) {
      // Si la película no existe, debería retornar error
      return res.status(404).json({ error: "Pelicula no encontrada" });
    }

    // ⚠️ ¿Se está creando o actualizando el registro en la tabla "gusto"?
    const gusto = await prisma.gusto.create({
      data: {
        usuarioId: userId,
        peliculaId: movieId,
        favoritos: true,
        reproducida: false,
        ver_mas_tarde: false
      }
    });
    
    res.status(201).json({
      message: "Pelicula añadida a favoritos",
      gusto: gusto
    });
    
  } catch (error) {
    // ⚠️ ¿Qué error se está capturando?
    console.error("Error adding to favorites:", error);
    res.status(500).json({ error: "Error interno" });
  }
});
```

**Verificar**:
1. ¿El `userId` del JWT es correcto? (`req.user.id`)
2. ¿La película con ID 45 existe en la tabla `peliculas`?
3. ¿Se está creando el registro en la tabla `gusto`?
4. ¿Hay algún error de constraint/unique en la base de datos?

---

### Causa 2: GET No Está Retornando Todas las Películas

**Archivo**: `src/routes/usuario.ts` - Endpoint `GET /favorites`

**Posible problema**:
```typescript
router.get("/favorites", verify, async (req, res) => {
  const userId = req.user.id;
  
  try {
    const gustos = await prisma.gusto.findMany({
      where: {
        usuarioId: userId,
        favoritos: true  // ⚠️ ¿Este filtro está correcto?
      },
      include: {
        pelicula: true  // ⚠️ ¿La relación está bien definida?
      }
    });
    
    const movies = gustos.map(gusto => gusto.pelicula);
    
    res.json({
      total: movies.length,
      movies: movies
    });
    
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Error interno" });
  }
});
```

**Verificar**:
1. ¿La query de `findMany` está usando el `userId` correcto?
2. ¿El campo `favoritos` es booleano y está en `true`?
3. ¿La relación `gusto.pelicula` está bien definida en el schema de Prisma?
4. ¿Hay algún soft-delete o filtro adicional que oculte la película?

---

### Causa 3: Problema con el Schema de Prisma

**Archivo**: `prisma/schema.prisma`

**Verificar la relación**:
```prisma
model Gusto {
  id            Int      @id @default(autoincrement())
  favoritos     Boolean  @default(false)
  reproducida   Boolean  @default(false)
  ver_mas_tarde Boolean  @default(false)
  calificacion  Int?
  
  usuarioId     Int
  peliculaId    Int
  
  usuario       Usuario  @relation(fields: [usuarioId], references: [id])
  pelicula      Pelicula @relation(fields: [peliculaId], references: [id])
  
  @@unique([usuarioId, peliculaId])  // ⚠️ Esta constraint es importante
}
```

**Problema potencial**:
- Si ya existe un registro con `usuarioId=5` y `peliculaId=45` con `favoritos=false`
- El `POST` debería hacer `upsert` en lugar de `create`

---

## ✅ Solución Recomendada

### Fix para POST /favorites (Usar UPSERT)

```typescript
router.post("/favorites", verify, async (req, res) => {
  const movieId = req.body.peliculaId;
  const userId = req.user.id;
  
  // Validar input
  if (!movieId || isNaN(movieId)) {
    return res.status(400).json({ error: "peliculaId inválido" });
  }
  
  try {
    // Verificar que el usuario existe
    const user = await prisma.usuario.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    // Verificar que la película existe
    const movie = await prisma.pelicula.findUnique({
      where: { id: movieId }
    });
    
    if (!movie) {
      return res.status(404).json({ error: "Pelicula no encontrada" });
    }
    
    // ✅ USAR UPSERT en lugar de CREATE
    const gusto = await prisma.gusto.upsert({
      where: {
        usuarioId_peliculaId: {
          usuarioId: userId,
          peliculaId: movieId
        }
      },
      update: {
        favoritos: true  // Si ya existe, actualizar a true
      },
      create: {
        usuarioId: userId,
        peliculaId: movieId,
        favoritos: true,
        reproducida: false,
        ver_mas_tarde: false
      }
    });
    
    res.status(201).json({
      message: "Pelicula añadida a favoritos",
      gusto: gusto
    });
    
  } catch (error) {
    console.error("Error adding to favorites:", error);
    
    // Más detalle en el error para debugging
    res.status(500).json({ 
      error: "No se pudo añadir a favoritos",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
```

### Fix para GET /favorites (Mejor Query)

```typescript
router.get("/favorites", verify, async (req, res) => {
  const userId = req.user.id;
  
  try {
    const gustos = await prisma.gusto.findMany({
      where: {
        usuarioId: userId,
        favoritos: true
      },
      include: {
        pelicula: {
          include: {
            idioma: true,  // Incluir idioma si es necesario
            generos: true  // Incluir géneros si es necesario
          }
        }
      },
      orderBy: {
        id: 'desc'  // Más recientes primero
      }
    });
    
    // Extraer solo las películas
    const movies = gustos.map(gusto => gusto.pelicula);
    
    // Log para debugging (remover en producción)
    console.log(`✅ User ${userId} has ${movies.length} favorites:`, movies.map(m => m.id));
    
    res.json({
      total: movies.length,
      movies: movies
    });
    
  } catch (error) {
    console.error("❌ Error fetching favorites for user", userId, ":", error);
    res.status(500).json({ 
      message: "No se pudieron obtener favoritos, intentalo de nuevo mas tarde",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
```

---

## 🧪 Cómo Verificar

### 1. Verificar que el POST funciona

```bash
# Desde el backend, ejecutar en la terminal:
curl -X POST http://localhost:3000/api/usuarios/favorites \
  -H "Content-Type: application/json" \
  -H "Cookie: authToken=TU_TOKEN_JWT" \
  -d '{"peliculaId": 45}'

# Expected response:
{
  "message": "Pelicula añadida a favoritos",
  "gusto": {
    "id": 123,
    "usuarioId": 5,
    "peliculaId": 45,
    "favoritos": true,
    "reproducida": false,
    "ver_mas_tarde": false,
    "calificacion": null
  }
}
```

### 2. Verificar directamente en la base de datos

```sql
-- Conectar a la base de datos y ejecutar:
SELECT * FROM "Gusto" WHERE "usuarioId" = 5 AND "peliculaId" = 45;

-- Debería retornar:
-- id | usuarioId | peliculaId | favoritos | reproducida | ver_mas_tarde | calificacion
-- 123| 5         | 45         | true      | false       | false         | null
```

### 3. Verificar que el GET retorna la película

```bash
curl http://localhost:3000/api/usuarios/favorites \
  -H "Cookie: authToken=TU_TOKEN_JWT"

# Expected response:
{
  "total": 3,
  "movies": [
    { "id": 45, "titulo": "...", ... },  # ← La película recién añadida
    { "id": 42, "titulo": "...", ... },
    { "id": 25, "titulo": "...", ... }
  ]
}
```

---

## 📊 Tabla de Debugging

| Paso | Acción | ¿Funciona? | Comando de Verificación |
|------|--------|------------|-------------------------|
| 1 | POST añade registro a DB | ❓ | `SELECT * FROM "Gusto" WHERE "peliculaId" = 45` |
| 2 | GET retorna la película | ❓ | `curl .../favorites` con cookie |
| 3 | Película existe en DB | ❓ | `SELECT * FROM "Pelicula" WHERE id = 45` |
| 4 | Usuario existe | ✅ | Usuario ID 5 está logueado |
| 5 | JWT tiene userId correcto | ❓ | Verificar payload del JWT |

---

## 🔧 Checklist para el Equipo Backend

- [ ] Verificar que la película ID 45 existe en `Pelicula` table
- [ ] Verificar que `POST /favorites` usa `upsert` en lugar de `create`
- [ ] Verificar que `GET /favorites` no tiene filtros adicionales ocultos
- [ ] Añadir logs de debugging en ambos endpoints
- [ ] Verificar la constraint `@@unique([usuarioId, peliculaId])` en el schema
- [ ] Probar manualmente con `curl` o Postman
- [ ] Verificar directamente en la base de datos con SQL
- [ ] Confirmar que no hay soft-deletes o estados adicionales

---

## 📝 Logs Recomendados para Debugging

Añadir estos logs temporalmente en el backend:

```typescript
// En POST /favorites
console.log("📥 POST /favorites - userId:", userId, "peliculaId:", movieId);
console.log("✅ Gusto created/updated:", gusto);

// En GET /favorites
console.log("📥 GET /favorites - userId:", userId);
console.log("✅ Found", gustos.length, "gustos");
console.log("✅ Movie IDs:", gustos.map(g => g.peliculaId));
```

---

## 🎯 Resultado Esperado

Después de aplicar los fixes:

1. ✅ Usuario añade película 45 a favoritos
2. ✅ Backend guarda correctamente en la tabla `Gusto`
3. ✅ Frontend recarga favoritos
4. ✅ Backend retorna: `{total: 3, movies: [45, 42, 25]}`
5. ✅ La película aparece inmediatamente en la UI sin refrescar

---

**Prioridad**: 🔴 **ALTA** - Funcionalidad core no funciona correctamente  
**Fecha**: 21 de Octubre, 2025  
**Reportado por**: Frontend Team
