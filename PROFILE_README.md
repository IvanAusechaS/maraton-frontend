# Páginas de Perfil - Maraton App

## 📋 Descripción General

Las páginas de perfil (`ProfilePage` y `EditProfilePage`) están diseñadas con el mismo estilo visual de las imágenes de referencia, incluyendo:

- ✅ Degradado de fondo (#0f2027 → #203a43 → #2c5364)
- ✅ Contenedores con backdrop blur y transparencia
- ✅ Avatar circular con gradiente cyan-azul
- ✅ Estadísticas de películas vistas y series seguidas
- ✅ Diseño responsive para todos los dispositivos
- ✅ Modales de confirmación con animaciones

## 🎨 Características de Diseño

### ProfilePage

- Avatar circular con iniciales del usuario
- Sección de información personal con iconos
- Estadísticas de contenido (películas/series)
- Formulario deshabilitado para cambio de contraseña (redirecciona a EditProfile)
- Botón de eliminación de cuenta con doble confirmación

### EditProfilePage

- Formulario completo de edición de perfil
- Validación en tiempo real de campos
- Cambio de contraseña funcional
- Eliminación de cuenta con confirmación doble
- Timer de 3 segundos antes de permitir eliminación final

## 🔄 Funcionamiento con/sin Backend

### Modo Online (Backend disponible)

Cuando el backend está disponible y responde correctamente:

1. Se cargan los datos reales del usuario desde el servidor
2. Las actualizaciones se persisten en la base de datos
3. Los cambios de contraseña se procesan en el servidor
4. La eliminación de cuenta se ejecuta completamente

### Modo Offline (Backend no disponible)

Si el backend no está disponible o hay error de conexión:

1. Se cargan datos predeterminados genéricos:

   - Username: "Usuario"
   - Nombre: "Nombre Apellido"
   - Email: "correo@dominio.com"
   - Ubicación: "Calim Colombia"
   - Películas vistas: 127
   - Series seguidas: 23

2. Los cambios se guardan localmente en `localStorage`
3. Se muestra un mensaje indicando "Modo offline"
4. Los datos se sincronizarán automáticamente cuando el backend esté disponible

## 🛡️ Heurísticas de Usabilidad Implementadas

### 1. Prevención de Errores

- Validación de campos en tiempo real
- Mensajes de error claros y específicos
- Confirmación visual de campos inválidos (borde rojo)

### 2. Visibilidad del Estado del Sistema

- Spinner de carga al cargar el perfil
- Banner informativo cuando está en modo offline
- Mensajes de éxito/error claros y temporales (5 segundos)
- Estado de guardado en botones ("Guardando...")

### 3. Confirmación de Acciones Destructivas

Para la eliminación de cuenta:

1. **Primera confirmación**: Modal explicando las consecuencias
2. **Segunda confirmación**: Modal final con timer de 3 segundos
3. El botón final se desbloquea después del timer
4. Texto dinámico mostrando el countdown

### 4. Feedback Visual

- Hover states en todos los botones
- Transiciones suaves (0.3s ease)
- Animaciones de entrada para modales
- Estados de loading con spinners

### 5. Diseño Responsive

- Breakpoints: 1024px, 768px, 640px, 480px
- Grid adaptativo (2 columnas → 1 columna)
- Botones de modal apilados en móvil
- Tamaños de fuente y espaciado ajustados

## 🔧 Integración con Backend (Futura)

El código está preparado para funcionar con los siguientes endpoints:

### GET `/api/user/profile`

```typescript
Response: {
  id: number;
  email: string;
  username: string;
  nombre_completo?: string;
  ubicacion?: string;
  fecha_registro: string;
  peliculas_vistas?: number;
  series_seguidas?: number;
}
```

### PUT `/api/user/profile`

```typescript
Request: {
  username?: string;
  nombre_completo?: string;
  email?: string;
  ubicacion?: string;
}
Response: UserProfile
```

### POST `/api/user/change-password`

```typescript
Request: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
Response: {
  message: string;
}
```

### DELETE `/api/user/account`

```typescript
Response: {
  message: string;
}
```

## 🚀 Uso

### Navegación

```typescript
// Ir al perfil
navigate("/profile");

// Ir a editar perfil
navigate("/profile/edit");
```

### Rutas Configuradas

- `/profile` - Vista del perfil
- `/profile/edit` - Edición del perfil

## 📱 Responsive Breakpoints

```scss
- Desktop: > 1024px (2 columnas)
- Tablet: 768px - 1024px (1 columna)
- Mobile Large: 640px - 768px
- Mobile: < 640px
```

## 🎯 Validaciones Implementadas

### Perfil

- Username: mínimo 3 caracteres
- Email: formato válido de email
- Nombre completo: mínimo 2 caracteres (opcional)
- Ubicación: sin validación (opcional)

### Contraseña

- Contraseña actual: requerida
- Nueva contraseña: mínimo 6 caracteres
- Confirmación: debe coincidir con nueva contraseña

## 🔒 Seguridad

- Las contraseñas nunca se muestran en consola
- Tokens almacenados en localStorage
- Validación de autenticación en cada carga
- Redirección automática al login si el token expira
- Limpieza de datos locales al eliminar cuenta

## 🎨 Paleta de Colores

```scss
// Background Gradient
#0f2027 → #203a43 → #2c5364

// Contenedores
rgba(30, 41, 59, 0.85) - Fondo principal
rgba(148, 163, 184, 0.15) - Bordes

// Avatar
linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)

// Botones Principales
linear-gradient(135deg, #5b6ef6 0%, #4656eb 100%)

// Botón Eliminar
rgba(239, 68, 68, 0.15) - Fondo
#f87171 - Texto

// Estados
#3b82f6 - Azul (info/estadísticas)
#22c55e - Verde (éxito)
#ef4444 - Rojo (error/peligro)
#fbbf24 - Amarillo (advertencia)
```

## 📦 Dependencias

Las páginas utilizan las siguientes dependencias (ya incluidas):

- `react-router-dom` - Navegación
- `sass` - Estilos SCSS

No requiere instalación de paquetes adicionales.

## ✅ Checklist de Funcionalidades

- [x] Vista de perfil con datos predeterminados
- [x] Edición de perfil con validación
- [x] Cambio de contraseña
- [x] Eliminación de cuenta con doble confirmación
- [x] Timer de 3 segundos en confirmación final
- [x] Manejo de errores con mensajes claros
- [x] Modo offline con datos predeterminados
- [x] Diseño responsive
- [x] Animaciones y transiciones
- [x] Estados de carga
- [x] Validación de formularios
- [x] Integración lista para backend

## 🧪 Testing

Para probar las páginas:

1. **Sin Backend**: Las páginas cargarán datos predeterminados automáticamente
2. **Con Backend**: Configurar `VITE_API_URL` en `.env`
3. **Navegación**: Ir a `/profile` o `/profile/edit`

## 📝 Notas Importantes

- Los datos predeterminados NO incluyen nombres reales
- El sistema detecta automáticamente si el backend está disponible
- Los cambios en modo offline se guardan localmente
- La sincronización será automática cuando el backend esté listo
- No se requieren cambios en el frontend cuando el backend se implemente
