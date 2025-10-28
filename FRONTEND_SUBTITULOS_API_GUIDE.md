# 🎬 Guía de Integración de Subtítulos - Frontend

## 📋 Descripción General

El backend proporciona una API completa para obtener y gestionar subtítulos de películas en formato JSON. Los subtítulos se almacenan en la base de datos y están disponibles en múltiples idiomas.

---

## 🎯 Endpoints Disponibles

### 1. **GET /api/subtitles/:movieId** - Obtener Subtítulos

Obtiene todos los subtítulos disponibles para una película específica.

#### Request

```http
GET /api/subtitles/217
```

#### Response (200 OK)

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
      },
      {
        "text": "Esto es una prueba de subtítulos",
        "start": 7.7,
        "duration": 3.8
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
      },
      {
        "text": "Welcome to the channel",
        "start": 3.5,
        "duration": 4.2
      }
    ]
  },
  {
    "idioma": "pt-BR",
    "lineas": [
      {
        "text": "Olá a todos",
        "start": 0.0,
        "duration": 3.5
      }
    ]
  }
]
```

#### Response Codes

- **200**: Subtítulos encontrados exitosamente
- **404**: No se encontraron subtítulos para esta película
- **500**: Error interno del servidor

---

### 2. **PATCH /api/subtitles/:movieId** - Actualizar Estado de Subtítulos

Habilita o deshabilita subtítulos de un idioma específico para una película.

#### Request

```http
PATCH /api/subtitles/217
Content-Type: application/json

{
  "idiomaId": 2,
  "estado": true
}
```

#### Response (200 OK)

```json
{
  "message": "Subtítulo actualizado correctamente",
  "subtitulo": {
    "id": 1,
    "estado": true,
    "peliculaId": 217,
    "idiomaId": 2,
    "contenido": { /* ... */ },
    "idioma": {
      "id": 2,
      "nombre": "English",
      "version": "en-US"
    }
  }
}
```

#### Response Codes

- **200**: Subtítulo actualizado correctamente
- **400**: Faltan parámetros requeridos (idiomaId, estado)
- **404**: Subtítulo no encontrado
- **500**: Error interno del servidor

---

## 🎨 Estructura de Datos

### Objeto Subtítulo

```typescript
interface Subtitulo {
  idioma: string;        // Código del idioma: "es", "en", "pt-BR"
  lineas: LineaSubtitulo[];
}

interface LineaSubtitulo {
  text: string;          // Texto del subtítulo
  start: number;         // Tiempo de inicio en segundos
  duration: number;      // Duración en segundos
}
```

---

## 💻 Ejemplos de Integración

### React + TypeScript

#### 1. Definir Interfaces

```typescript
// types/subtitles.ts
export interface SubtitleLine {
  text: string;
  start: number;
  duration: number;
}

export interface Subtitle {
  idioma: string;
  lineas: SubtitleLine[];
}

export interface SubtitleTrack {
  language: string;
  label: string;
  lines: SubtitleLine[];
}
```

#### 2. Hook Personalizado para Subtítulos

```typescript
// hooks/useSubtitles.ts
import { useState, useEffect } from 'react';
import { Subtitle, SubtitleTrack } from '../types/subtitles';

export const useSubtitles = (movieId: number) => {
  const [subtitles, setSubtitles] = useState<SubtitleTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubtitles = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/subtitles/${movieId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setSubtitles([]);
            return;
          }
          throw new Error('Error al cargar subtítulos');
        }

        const data: Subtitle[] = await response.json();

        // Convertir al formato que necesita el reproductor
        const tracks: SubtitleTrack[] = data.map(subtitle => ({
          language: subtitle.idioma,
          label: getLanguageLabel(subtitle.idioma),
          lines: subtitle.lineas
        }));

        setSubtitles(tracks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchSubtitles();
  }, [movieId]);

  return { subtitles, loading, error };
};

// Función helper para obtener nombres legibles de idiomas
function getLanguageLabel(code: string): string {
  const labels: Record<string, string> = {
    'es': 'Español',
    'en': 'English',
    'pt-BR': 'Português (Brasil)'
  };
  return labels[code] || code;
}
```

#### 3. Componente de Reproductor de Video

```typescript
// components/VideoPlayer.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useSubtitles } from '../hooks/useSubtitles';
import { SubtitleLine } from '../types/subtitles';

interface VideoPlayerProps {
  movieId: number;
  videoUrl: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ movieId, videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { subtitles, loading, error } = useSubtitles(movieId);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es');

  // Actualizar subtítulo actual basado en el tiempo del video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const track = subtitles.find(s => s.language === selectedLanguage);
      
      if (!track) {
        setCurrentSubtitle('');
        return;
      }

      const currentLine = track.lines.find(
        line => currentTime >= line.start && 
                currentTime < line.start + line.duration
      );

      setCurrentSubtitle(currentLine?.text || '');
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [subtitles, selectedLanguage]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="video-element"
        />
        
        {/* Mostrar subtítulo actual */}
        {currentSubtitle && (
          <div className="subtitle-overlay">
            {currentSubtitle}
          </div>
        )}
      </div>

      {/* Selector de idioma */}
      {!loading && subtitles.length > 0 && (
        <div className="subtitle-controls">
          <label htmlFor="subtitle-language">Subtítulos:</label>
          <select
            id="subtitle-language"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="subtitle-select"
          >
            <option value="">Sin subtítulos</option>
            {subtitles.map(track => (
              <option key={track.language} value={track.language}>
                {track.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
```

#### 4. Estilos CSS

```css
/* styles/VideoPlayer.css */
.video-player-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.video-wrapper {
  position: relative;
  width: 100%;
  background: #000;
}

.video-element {
  width: 100%;
  height: auto;
  display: block;
}

.subtitle-overlay {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  max-width: 80%;
  line-height: 1.4;
  pointer-events: none;
  z-index: 10;
}

.subtitle-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-top: 16px;
}

.subtitle-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.subtitle-select:focus {
  outline: none;
  border-color: #007bff;
}

.error {
  padding: 16px;
  background: #fee;
  color: #c33;
  border-radius: 8px;
  margin: 16px 0;
}
```

---

### Vue 3 + TypeScript

```vue
<template>
  <div class="video-player-container">
    <div class="video-wrapper">
      <video
        ref="videoRef"
        :src="videoUrl"
        controls
        @timeupdate="handleTimeUpdate"
        class="video-element"
      />
      
      <div v-if="currentSubtitle" class="subtitle-overlay">
        {{ currentSubtitle }}
      </div>
    </div>

    <div v-if="!loading && subtitles.length > 0" class="subtitle-controls">
      <label for="subtitle-language">Subtítulos:</label>
      <select
        id="subtitle-language"
        v-model="selectedLanguage"
        class="subtitle-select"
      >
        <option value="">Sin subtítulos</option>
        <option
          v-for="track in subtitles"
          :key="track.language"
          :value="track.language"
        >
          {{ track.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

interface SubtitleLine {
  text: string;
  start: number;
  duration: number;
}

interface SubtitleTrack {
  language: string;
  label: string;
  lines: SubtitleLine[];
}

const props = defineProps<{
  movieId: number;
  videoUrl: string;
}>();

const videoRef = ref<HTMLVideoElement>();
const subtitles = ref<SubtitleTrack[]>([]);
const currentSubtitle = ref('');
const selectedLanguage = ref('es');
const loading = ref(true);

const languageLabels: Record<string, string> = {
  'es': 'Español',
  'en': 'English',
  'pt-BR': 'Português (Brasil)'
};

const fetchSubtitles = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/subtitles/${props.movieId}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        subtitles.value = [];
        return;
      }
      throw new Error('Error al cargar subtítulos');
    }

    const data = await response.json();
    subtitles.value = data.map((subtitle: any) => ({
      language: subtitle.idioma,
      label: languageLabels[subtitle.idioma] || subtitle.idioma,
      lines: subtitle.lineas
    }));
  } catch (error) {
    console.error('Error fetching subtitles:', error);
  } finally {
    loading.value = false;
  }
};

const handleTimeUpdate = () => {
  if (!videoRef.value) return;

  const currentTime = videoRef.value.currentTime;
  const track = subtitles.value.find(s => s.language === selectedLanguage.value);

  if (!track) {
    currentSubtitle.value = '';
    return;
  }

  const currentLine = track.lines.find(
    line => currentTime >= line.start && 
            currentTime < line.start + line.duration
  );

  currentSubtitle.value = currentLine?.text || '';
};

onMounted(() => {
  fetchSubtitles();
});
</script>

<style scoped>
/* Mismos estilos que el ejemplo de React */
</style>
```

---

## 🔧 Funciones de Administración

### Actualizar Estado de Subtítulos

```typescript
// services/subtitles.ts
export const updateSubtitleStatus = async (
  movieId: number,
  languageId: number,
  enabled: boolean
): Promise<void> => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/subtitles/${movieId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idiomaId: languageId,
        estado: enabled
      })
    }
  );

  if (!response.ok) {
    throw new Error('Error al actualizar subtítulos');
  }

  return response.json();
};
```

---

## 📊 Modelo de Base de Datos

### Tabla: Subtitulo

```prisma
model Subtitulo {
  id          Int      @id @default(autoincrement())
  estado      Boolean  @default(false)
  peliculaId  Int
  idiomaId    Int
  contenido   Json     
  idioma      Idioma   @relation(fields: [idiomaId], references: [id])
  pelicula    Pelicula @relation(fields: [peliculaId], references: [id])

  @@unique([peliculaId, idiomaId])
}
```

### Campos

- **id**: Identificador único del subtítulo
- **estado**: Si el subtítulo está habilitado (true) o no (false)
- **peliculaId**: ID de la película asociada
- **idiomaId**: ID del idioma del subtítulo
- **contenido**: JSON con estructura `{ idioma: string, lineas: LineaSubtitulo[] }`

---

## 🌐 Idiomas Soportados

| Código | Nombre | Ejemplo |
|--------|--------|---------|
| `es` | Español | "Hola a todos" |
| `en` | English | "Hello everyone" |
| `pt-BR` | Português (Brasil) | "Olá a todos" |

---

## ⚠️ Consideraciones Importantes

### 1. **Sincronización de Tiempo**

Los tiempos en los subtítulos están en **segundos** con decimales:

```javascript
{
  "text": "Hola",
  "start": 5.5,      // 5.5 segundos
  "duration": 2.3    // 2.3 segundos de duración
}
```

El subtítulo se muestra desde `start` hasta `start + duration`.

### 2. **Manejo de Errores**

Siempre verifica el código de respuesta:

```typescript
if (response.status === 404) {
  // No hay subtítulos disponibles para esta película
  // Mostrar video sin subtítulos
}
```

### 3. **Performance**

Para videos largos con muchos subtítulos, considera:

- Usar índices binarios para búsqueda más rápida
- Cachear subtítulos en localStorage
- Lazy loading de subtítulos

### 4. **Accesibilidad**

```html
<!-- Asegúrate de agregar atributos ARIA -->
<div 
  class="subtitle-overlay" 
  role="text" 
  aria-live="polite"
  aria-atomic="true"
>
  {{ currentSubtitle }}
</div>
```

---

## 🎯 Checklist de Integración

- [ ] Crear interfaces TypeScript para subtítulos
- [ ] Implementar hook/composable para cargar subtítulos
- [ ] Agregar componente de video player
- [ ] Sincronizar subtítulos con tiempo del video
- [ ] Agregar selector de idioma
- [ ] Aplicar estilos CSS para overlay de subtítulos
- [ ] Manejar caso cuando no hay subtítulos disponibles
- [ ] Agregar tests para componente de subtítulos
- [ ] Implementar caché de subtítulos (opcional)
- [ ] Agregar soporte de accesibilidad (ARIA)

---

## 🔗 Recursos Adicionales

### Variables de Entorno

```bash
# .env.local (React)
REACT_APP_API_URL=http://localhost:3000

# .env.local (Vue)
VITE_API_URL=http://localhost:3000

# Producción
REACT_APP_API_URL=https://api.tudominio.com
VITE_API_URL=https://api.tudominio.com
```

### Testing

```typescript
// __tests__/useSubtitles.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useSubtitles } from '../hooks/useSubtitles';

describe('useSubtitles', () => {
  it('should fetch subtitles for a movie', async () => {
    const { result } = renderHook(() => useSubtitles(217));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.subtitles).toHaveLength(3);
    expect(result.current.error).toBeNull();
  });
});
```

---

## 📞 Soporte

Si tienes problemas con la integración:

1. Verifica que el endpoint esté disponible: `GET /api/subtitles/:movieId`
2. Revisa la consola del navegador para errores de CORS
3. Confirma que la película tenga subtítulos en la base de datos
4. Verifica que el formato de respuesta coincida con el esperado

---

**Fecha de actualización:** 27 de Octubre, 2025  
**Versión:** 1.0  
**Estado:** ✅ Producción
