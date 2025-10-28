# Implementación de Subtítulos - Backend

## Estado Actual
El frontend ya está completamente implementado y listo para consumir los endpoints de subtítulos. El backend necesita implementar los siguientes endpoints:

## Endpoints Requeridos

### 1. GET /api/peliculas/:id/subtitulos
Retorna los subtítulos disponibles para una película (archivos .vtt/.srt)

**Respuesta esperada:**
```json
{
  "peliculaId": 217,
  "titulo": "The Matrix",
  "subtitulos": [
    {
      "id": 1,
      "estado": true,
      "color": "#FFFFFF",
      "fuente": "Arial",
      "descriptiva": false,
      "url": "/subtitles/217-es.vtt",
      "peliculaId": 217,
      "idiomaId": 2,
      "idioma": {
        "id": 2,
        "nombre": "Español",
        "version": "es-ES"
      }
    },
    {
      "id": 2,
      "estado": true,
      "color": "#FFFFFF",
      "fuente": "Arial",
      "descriptiva": false,
      "url": "/subtitles/217-en.vtt",
      "peliculaId": 217,
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

### 2. GET /api/subtitles/:movieId (Opcional)
Endpoint alternativo para subtítulos parseados en JSON (útil para overlays en YouTube)

**Respuesta esperada:**
```json
[
  {
    "idioma": "es",
    "lineas": [
      {
        "text": "¿Qué es Matrix?",
        "start": 0.5,
        "duration": 2.0
      },
      {
        "text": "La verdad está ahí fuera.",
        "start": 3.0,
        "duration": 2.5
      }
    ]
  },
  {
    "idioma": "en",
    "lineas": [
      {
        "text": "What is the Matrix?",
        "start": 0.5,
        "duration": 2.0
      },
      {
        "text": "The truth is out there.",
        "start": 3.0,
        "duration": 2.5
      }
    ]
  }
]
```

## Implementación Backend

### 1. Actualizar Modelo Prisma

```prisma
model Subtitulo {
  id          Int      @id @default(autoincrement())
  estado      Boolean  @default(true)
  color       String   @default("#FFFFFF")
  fuente      String   @default("Arial")
  descriptiva Boolean  @default(false)
  url         String   // 👈 CAMPO REQUERIDO - ruta al archivo .vtt
  peliculaId  Int
  idiomaId    Int
  
  pelicula    Pelicula @relation(fields: [peliculaId], references: [id], onDelete: Cascade)
  idioma      Idioma   @relation(fields: [idiomaId], references: [id])
  
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

### 2. Migración de Base de Datos

```bash
# En el backend
npx prisma migrate dev --name add_subtitulos_url
```

### 3. Crear Controlador de Subtítulos

```typescript
// src/controllers/subtitulosController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMovieSubtitles = async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.id);

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

    // Obtener subtítulos con relación de idioma
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

    return res.json({
      peliculaId: movie.id,
      titulo: movie.titulo,
      subtitulos
    });
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener subtítulos'
    });
  }
};
```

### 4. Agregar Ruta

```typescript
// src/routes/peliculasRoutes.ts (o donde estén las rutas)
import { getMovieSubtitles } from '../controllers/subtitulosController';

router.get('/peliculas/:id/subtitulos', getMovieSubtitles);
```

### 5. Crear Archivos VTT de Ejemplo

Crea la carpeta `public/subtitles` en el backend y agrega archivos .vtt:

**public/subtitles/217-es.vtt:**
```vtt
WEBVTT

00:00:00.500 --> 00:00:02.500
¿Qué es Matrix?

00:00:03.000 --> 00:00:05.500
La verdad está ahí fuera, Neo.

00:00:06.000 --> 00:00:08.500
Estás viviendo en un mundo de sueños.
```

**public/subtitles/217-en.vtt:**
```vtt
WEBVTT

00:00:00.500 --> 00:00:02.500
What is the Matrix?

00:00:03.000 --> 00:00:05.500
The truth is out there, Neo.

00:00:06.000 --> 00:00:08.500
You're living in a dream world.
```

### 6. Configurar Archivos Estáticos

```typescript
// src/index.ts o app.ts
import express from 'express';
import path from 'path';

const app = express();

// Servir archivos estáticos de subtítulos
app.use('/subtitles', express.static(path.join(__dirname, '../public/subtitles')));
```

### 7. Seeds de Base de Datos

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear idiomas
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

  // Crear subtítulos para película 217
  await prisma.subtitulo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      estado: true,
      color: '#FFFFFF',
      fuente: 'Arial',
      descriptiva: false,
      url: '/subtitles/217-es.vtt',
      peliculaId: 217,
      idiomaId: espanol.id
    }
  });

  await prisma.subtitulo.upsert({
    where: { id: 2 },
    update: {},
    create: {
      estado: true,
      color: '#FFFFFF',
      fuente: 'Arial',
      descriptiva: false,
      url: '/subtitles/217-en.vtt',
      peliculaId: 217,
      idiomaId: english.id
    }
  });

  console.log('✅ Seeds de subtítulos creados');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 8. Ejecutar Seeds

```bash
npx prisma db seed
```

## Testing

```bash
# Probar el endpoint
curl http://localhost:3000/api/peliculas/217/subtitulos

# Probar archivo VTT
curl http://localhost:3000/subtitles/217-es.vtt
```

## CORS

Asegúrate de que CORS permita el acceso a los archivos:

```typescript
// src/index.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

## Notas Importantes

1. ✅ **Frontend ya implementado**: El frontend tiene toda la lógica para consumir estos endpoints
2. ✅ **Subtítulos nativos**: Se renderizan con `<track>` elements para videos MP4/WebM
3. ✅ **Overlay para YouTube**: Se usa overlay CSS cuando el video es de YouTube
4. ✅ **Accesibilidad**: Implementado con WCAG 2.1 AA (::cue styling, ARIA labels)
5. ✅ **Sin errores de compilación**: Todo el TypeScript está correcto

## Películas para Testing

Agrega subtítulos para estas películas de prueba:
- **ID 217**: The Matrix (YouTube o MP4)
- Cualquier otra película que uses para desarrollo

## Resultado Esperado

Una vez implementado el backend:
1. El menú de subtítulos mostrará los idiomas disponibles
2. Se podrán activar/desactivar dinámicamente
3. Los subtítulos se sincronizarán con el video
4. Funcionará tanto en videos MP4 como en YouTube (con overlay)
