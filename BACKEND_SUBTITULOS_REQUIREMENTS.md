# 🎬 Requerimientos Backend - Subtítulos

## 📊 Estado Actual

✅ **Ruta configurada:** `/api/subtitles`  
❌ **Problema:** Error interno al obtener subtítulos  
❌ **Causa probable:** Tabla vacía o campo `url` faltante en modelo `Subtitulo`

```bash
# Request actual
curl http://localhost:3000/api/subtitles/296

# Respuesta actual
{"error": "Error interno al obtener subtítulos"}
```

---

## 🎯 Lo que necesita el Frontend

El frontend ya está **100% implementado** y funcional con datos mock. Solo necesita que el backend responda correctamente en uno de estos dos formatos:

### **Formato 1: Con archivos VTT (Recomendado para HTML5 video)**

```json
{
  "peliculaId": 296,
  "titulo": "Top 5 Mejores Clips de Vegetta777 😂",
  "subtitulos": [
    {
      "id": 1,
      "estado": true,
      "color": "#FFFFFF",
      "fuente": "Arial",
      "descriptiva": false,
      "url": "/subtitles/296-es.vtt",
      "peliculaId": 296,
      "idiomaId": 2,
      "idioma": {
        "id": 2,
        "nombre": "Español",
        "version": "es-ES"
      }
    },
    {
      "id": 3,
      "estado": true,
      "color": "#FFFFFF",
      "fuente": "Arial",
      "descriptiva": false,
      "url": "/subtitles/296-en.vtt",
      "peliculaId": 296,
      "idiomaId": 1,
      "idioma": {
        "id": 1,
        "nombre": "English",
        "version": "en-US"
      }
    }
  ]
}
```

### **Formato 2: JSON parseado (Para YouTube overlay)**

```json
[
  {
    "idioma": "es",
    "lineas": [
      {
        "text": "Hola a todos",
        "start": 0.0,
        "duration": 3.5
      },
      {
        "text": "Bienvenidos al canal",
        "start": 3.5,
        "duration": 4.2
      }
    ]
  },
  {
    "idioma": "en",
    "lineas": [
      {
        "text": "Hello everyone",
        "start": 0.0,
        "duration": 3.5
      }
    ]
  }
]
```

---

## 🔧 Checklist de Implementación

### 1️⃣ **Actualizar Schema Prisma**

Agregar el campo `url` al modelo `Subtitulo`:

```prisma
model Subtitulo {
  id          Int      @id @default(autoincrement())
  estado      Boolean  @default(true)
  color       String   @default("#FFFFFF")
  fuente      String   @default("Arial")
  descriptiva Boolean  @default(false)
  url         String   // 👈 CAMPO NUEVO REQUERIDO
  peliculaId  Int
  idiomaId    Int
  
  pelicula    Pelicula @relation(fields: [peliculaId], references: [id], onDelete: Cascade)
  idioma      Idioma   @relation(fields: [idiomaId], references: [id])
  
  @@unique([peliculaId, idiomaId])
  @@map("subtitulos")
}

model Idioma {
  id         Int         @id @default(autoincrement())
  nombre     String      @unique // "Español", "English"
  version    String      @unique // "es-ES", "en-US"
  subtitulos Subtitulo[]
  
  @@map("idiomas")
}
```

**Ejecutar migración:**
```bash
npx prisma migrate dev --name add_url_to_subtitulos
```

---

### 2️⃣ **Implementar el Controlador**

Actualizar el controlador para manejar correctamente el endpoint:

```typescript
// controllers/subtitulosController.ts (o donde esté tu controlador)

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMovieSubtitles = async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.movieId);

    // Validar que movieId sea un número válido
    if (isNaN(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de película inválido'
      });
    }

    // Verificar que la película existe
    const movie = await prisma.pelicula.findUnique({
      where: { id: movieId }
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }

    // Obtener subtítulos activos con su idioma
    const subtitulos = await prisma.subtitulo.findMany({
      where: {
        peliculaId: movieId,
        estado: true // Solo subtítulos activos
      },
      include: {
        idioma: true
      },
      orderBy: {
        idiomaId: 'asc'
      }
    });

    // Si no hay subtítulos, devolver array vacío o 404
    if (subtitulos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay subtítulos disponibles para esta película'
      });
    }

    // Respuesta exitosa
    return res.status(200).json({
      peliculaId: movie.id,
      titulo: movie.titulo,
      subtitulos
    });

  } catch (error) {
    console.error('Error al obtener subtítulos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno al obtener subtítulos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
```

---

### 3️⃣ **Verificar la Ruta**

Asegurarse que la ruta esté correctamente conectada:

```typescript
// routes/subtitulosRoutes.ts

import express from 'express';
import { getMovieSubtitles } from '../controllers/subtitulosController';

const router = express.Router();

// GET /api/subtitles/:movieId
router.get('/:movieId', getMovieSubtitles);

export default router;
```

Y que esté registrada en el app principal:

```typescript
// index.ts o app.ts
import subtitulosRoutes from './routes/subtitulosRoutes';

app.use('/api/subtitles', subtitulosRoutes);
```

---

### 4️⃣ **Crear Archivos VTT de Ejemplo**

Crear la carpeta `public/subtitles/` en el backend y agregar archivos de prueba:

**Estructura:**
```
backend/
├── public/
│   └── subtitles/
│       ├── 296-es.vtt
│       ├── 296-en.vtt
│       ├── 299-es.vtt
│       └── 299-en.vtt
```

**Ejemplo: `public/subtitles/296-es.vtt`**
```vtt
WEBVTT

00:00:00.500 --> 00:00:02.500
Hola a todos

00:00:02.500 --> 00:00:05.000
Bienvenidos al canal

00:00:05.000 --> 00:00:08.000
Este es el clip número 5 de Vegetta777

00:00:08.000 --> 00:00:11.500
¡Espero que lo disfruten!
```

**Ejemplo: `public/subtitles/296-en.vtt`**
```vtt
WEBVTT

00:00:00.500 --> 00:00:02.500
Hello everyone

00:00:02.500 --> 00:00:05.000
Welcome to the channel

00:00:05.000 --> 00:00:08.000
This is clip number 5 from Vegetta777

00:00:08.000 --> 00:00:11.500
I hope you enjoy it!
```

---

### 5️⃣ **Configurar Archivos Estáticos**

Permitir acceso público a los archivos VTT:

```typescript
// index.ts o app.ts
import express from 'express';
import path from 'path';

const app = express();

// Servir archivos estáticos de subtítulos
app.use('/subtitles', express.static(path.join(__dirname, '../public/subtitles')));

// CORS debe permitir acceso a estos archivos
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

### 6️⃣ **Seeds de Base de Datos**

Crear datos de prueba para poder testear:

```typescript
// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeds de subtítulos...');

  // Crear idiomas si no existen
  const espanol = await prisma.idioma.upsert({
    where: { version: 'es-ES' },
    update: {},
    create: {
      nombre: 'Español',
      version: 'es-ES'
    }
  });

  const english = await prisma.idioma.upsert({
    where: { version: 'en-US' },
    update: {},
    create: {
      nombre: 'English',
      version: 'en-US'
    }
  });

  const portugues = await prisma.idioma.upsert({
    where: { version: 'pt-BR' },
    update: {},
    create: {
      nombre: 'Português',
      version: 'pt-BR'
    }
  });

  console.log('✅ Idiomas creados:', { espanol, english, portugues });

  // Verificar que las películas existan
  const peliculas = [296, 299, 303];
  
  for (const peliculaId of peliculas) {
    const pelicula = await prisma.pelicula.findUnique({
      where: { id: peliculaId }
    });

    if (!pelicula) {
      console.log(`⚠️  Película ${peliculaId} no existe, saltando...`);
      continue;
    }

    // Crear subtítulos en español
    await prisma.subtitulo.upsert({
      where: {
        peliculaId_idiomaId: {
          peliculaId: peliculaId,
          idiomaId: espanol.id
        }
      },
      update: {
        estado: true,
        url: `/subtitles/${peliculaId}-es.vtt`
      },
      create: {
        estado: true,
        color: '#FFFFFF',
        fuente: 'Arial',
        descriptiva: false,
        url: `/subtitles/${peliculaId}-es.vtt`,
        peliculaId: peliculaId,
        idiomaId: espanol.id
      }
    });

    // Crear subtítulos en inglés
    await prisma.subtitulo.upsert({
      where: {
        peliculaId_idiomaId: {
          peliculaId: peliculaId,
          idiomaId: english.id
        }
      },
      update: {
        estado: true,
        url: `/subtitles/${peliculaId}-en.vtt`
      },
      create: {
        estado: true,
        color: '#FFFFFF',
        fuente: 'Arial',
        descriptiva: false,
        url: `/subtitles/${peliculaId}-en.vtt`,
        peliculaId: peliculaId,
        idiomaId: english.id
      }
    });

    console.log(`✅ Subtítulos creados para película ${peliculaId}`);
  }

  console.log('✅ Seeds de subtítulos completados');
}

main()
  .catch((e) => {
    console.error('❌ Error en seeds:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Ejecutar seeds:**
```bash
npx prisma db seed
```

---

## 🧪 Testing

### Test 1: Verificar endpoint
```bash
curl http://localhost:3000/api/subtitles/296 | jq
```

**Respuesta esperada:**
```json
{
  "peliculaId": 296,
  "titulo": "Top 5 Mejores Clips de Vegetta777 😂",
  "subtitulos": [
    {
      "id": 1,
      "estado": true,
      "color": "#FFFFFF",
      "fuente": "Arial",
      "descriptiva": false,
      "url": "/subtitles/296-es.vtt",
      "peliculaId": 296,
      "idiomaId": 2,
      "idioma": {
        "id": 2,
        "nombre": "Español",
        "version": "es-ES"
      }
    }
  ]
}
```

### Test 2: Acceder a archivo VTT
```bash
curl http://localhost:3000/subtitles/296-es.vtt
```

**Respuesta esperada:**
```vtt
WEBVTT

00:00:00.500 --> 00:00:02.500
Hola a todos
...
```

### Test 3: Película sin subtítulos
```bash
curl http://localhost:3000/api/subtitles/999
```

**Respuesta esperada:**
```json
{
  "success": false,
  "message": "No hay subtítulos disponibles para esta película"
}
```

---

## 📋 Películas de Testing

Agregar subtítulos para estas películas (existen en la BD):

| ID  | Título |
|-----|--------|
| 296 | Top 5 Mejores Clips de Vegetta777 😂 |
| 299 | EQUIPADOS para LA GUERRA en el NETHER! |
| 303 | Cuando el teléfono suena |

---

## ⚠️ Notas Importantes

1. **El campo `url` es obligatorio** - Sin él, el frontend no puede mostrar subtítulos en videos HTML5
2. **Los archivos VTT deben ser accesibles públicamente** - Configurar static files en Express
3. **CORS debe estar habilitado** - Para que el frontend pueda acceder a los archivos
4. **Si no hay subtítulos, devolver 404** - El frontend maneja este caso correctamente

---

## ✅ Resultado Esperado

Una vez completada la implementación:

1. ✅ El endpoint `/api/subtitles/:movieId` responde correctamente
2. ✅ Los archivos VTT son accesibles en `/subtitles/*.vtt`
3. ✅ El frontend carga y muestra los subtítulos automáticamente
4. ✅ Los usuarios pueden seleccionar entre idiomas disponibles
5. ✅ Los subtítulos se sincronizan con el video

---

## 🚀 Frontend está Listo

El frontend **ya está 100% implementado** con:

- ✅ Fetch automático de subtítulos al cargar el player
- ✅ Renderizado de `<track>` elements para HTML5 video
- ✅ Overlay CSS para videos de YouTube
- ✅ Menú de selección de idiomas
- ✅ Sincronización en tiempo real
- ✅ Accesibilidad WCAG 2.1 AA
- ✅ Manejo de errores y fallbacks

**En cuanto implementen estos endpoints, todo funcionará automáticamente sin cambios en el frontend.**

---

## 📞 Contacto

Si tienen dudas sobre la implementación, revisar:
- **FRONTEND_SUBTITULOS_API_GUIDE.md** - Documentación completa de la API
- **BACKEND_SUBTITULOS_IMPLEMENTATION.md** - Guía detallada de implementación

---

**Fecha:** 27 de Octubre, 2025  
**Prioridad:** 🔴 Alta  
**Estado Frontend:** ✅ Completado  
**Estado Backend:** ⏳ Pendiente
