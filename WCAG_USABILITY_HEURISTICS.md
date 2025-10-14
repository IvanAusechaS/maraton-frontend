# Heurísticas de Usabilidad y Accesibilidad WCAG

## Resumen
Este documento describe las heurísticas de usabilidad de Nielsen y las directrices WCAG 2.1 implementadas en la aplicación Maraton.

---

## 🎯 Heurísticas de Nielsen Implementadas

### 1. **Visibilidad del Estado del Sistema**
- **Login/Signup Pages**: 
  - Loading spinners durante el envío de formularios
  - Estados disabled en botones durante procesos
  - Mensajes de error claros y visibles con iconos
  - Mensajes de éxito con feedback visual

**Implementación**:
```tsx
// Estado de carga visible
{isSubmitting ? (
  <>
    <span className="spinner" aria-hidden="true"></span>
    INGRESANDO...
  </>
) : "INGRESAR"}
```

### 2. **Coincidencia entre el Sistema y el Mundo Real**
- Uso de lenguaje natural y familiar
- Iconos reconocibles (ojo para mostrar/ocultar contraseña)
- Etiquetas descriptivas en español
- Términos como "Recordarme" en lugar de "Remember me"

### 3. **Control y Libertad del Usuario**
- Botones "Regresar al inicio" en todas las páginas de autenticación
- Función mostrar/ocultar contraseña
- Cancelación de operaciones disponible
- Navegación clara entre páginas

**Implementación**:
```tsx
<button 
  className="login-page__back" 
  onClick={() => navigate("/")}
  aria-label="Regresar al inicio"
>
  ← Regresar al inicio
</button>
```

### 4. **Consistencia y Estándares**
- Diseño consistente en todas las páginas
- Botones primarios siempre en la parte inferior
- Colores consistentes para acciones (azul para primario, rojo para errores)
- Patrones de formulario estándar

### 5. **Prevención de Errores**
- Validación de contraseña en tiempo real
- Confirmación de contraseña
- Campos requeridos claramente marcados
- Validación de formato de email
- Mensajes preventivos antes de acciones destructivas

**Implementación**:
```tsx
const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres";
  }
  if (!/[A-Z]/.test(password)) {
    return "La contraseña debe contener al menos una letra mayúscula";
  }
  // ... más validaciones
};
```

### 6. **Reconocimiento antes que Recuerdo**
- Labels flotantes que permanecen visibles
- Placeholders descriptivos
- Iconos que refuerzan el propósito de cada campo
- Recordatorio de requisitos de contraseña

### 7. **Flexibilidad y Eficiencia de Uso**
- Checkbox "Recordarme" para usuarios frecuentes
- Autocompletado en campos de email y contraseña
- Navegación por teclado completa
- Atajos visuales (mostrar/ocultar contraseña)

### 8. **Diseño Estético y Minimalista**
- Formularios limpios sin elementos innecesarios
- Espaciado adecuado entre elementos
- Colores que no distraen
- Jerarquía visual clara

### 9. **Ayudar a Reconocer, Diagnosticar y Recuperarse de Errores**
- Mensajes de error específicos y descriptivos
- Iconos de error visibles
- Sugerencias de corrección
- Enlace directo a recuperación de contraseña

**Implementación**:
```tsx
{error && (
  <div 
    className="login-page__error" 
    role="alert"
    aria-live="assertive"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {/* Icono de error */}
    </svg>
    {error}
  </div>
)}
```

### 10. **Ayuda y Documentación**
- Enlace "¿Olvidaste tu contraseña?" visible
- Mensajes de error educativos
- Texto alternativo en imágenes
- Labels descriptivos

---

## ♿ Directrices WCAG 2.1 Implementadas

### Nivel A (Requisitos Mínimos)

#### 1.1.1 Contenido No Textual (A)
- Todas las imágenes tienen atributos `alt` descriptivos
- Iconos decorativos marcados con `aria-hidden="true"`
- Logos con descripciones completas

**Implementación**:
```tsx
<img 
  src="/main-logo.svg" 
  alt="Logotipo de Maraton - Plataforma de streaming" 
/>
```

#### 1.3.1 Info y Relaciones (A)
- Uso semántico correcto de HTML5
- Labels asociados a inputs mediante `htmlFor`
- Estructura jerárquica de encabezados
- Roles ARIA cuando es necesario

**Implementación**:
```tsx
<label htmlFor="email" className="login-page__label">
  Correo electrónico
</label>
<input
  id="email"
  type="email"
  aria-required="true"
/>
```

#### 1.3.3 Características Sensoriales (A)
- No se depende solo del color para transmitir información
- Errores indicados con iconos, color y texto
- Estados indicados con múltiples señales

#### 2.1.1 Teclado (A)
- Toda la funcionalidad accesible por teclado
- Focus visible en todos los elementos interactivos
- Orden de tabulación lógico
- Sin trampas de teclado

**Implementación**:
```tsx
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
  tabIndex={0}
>
```

#### 2.2.2 Pausar, Detener, Ocultar (A)
- Spinners de carga con estados controlables
- No hay contenido parpadeante automático

#### 2.4.1 Evitar Bloques (A)
- Navegación directa disponible
- Botones de "Regresar" en todas las páginas

#### 2.4.2 Página Titulada (A)
- Cada página tiene un título descriptivo único
- Encabezados H1 claros en cada página

#### 2.4.3 Orden del Foco (A)
- Orden de tabulación lógico y predecible
- Focus management en modales y errores

**Implementación**:
```tsx
// Focus en mensajes de error para lectores de pantalla
setTimeout(() => {
  document.getElementById('error-message')?.focus();
}, 100);
```

#### 2.4.4 Propósito de los Enlaces (A)
- Todos los enlaces y botones tienen texto descriptivo
- Aria-labels cuando el texto visual no es suficiente

#### 3.1.1 Idioma de la Página (A)
- Atributo `lang="es"` en HTML principal

#### 3.2.1 Al Recibir el Foco (A)
- No hay cambios de contexto inesperados al recibir foco

#### 3.2.2 Al Recibir Entradas (A)
- Formularios no se envían automáticamente
- Cambios de estado son intencionales

#### 3.3.1 Identificación de Errores (A)
- Errores identificados claramente
- Descripción del error proporcionada
- Sugerencias de corrección cuando es posible

**Implementación**:
```tsx
<input
  type="email"
  aria-required="true"
  aria-invalid={error ? "true" : "false"}
  aria-describedby={error ? "error-message" : undefined}
/>
```

#### 3.3.2 Etiquetas o Instrucciones (A)
- Todos los campos de formulario tienen labels
- Instrucciones claras proporcionadas
- Campos requeridos marcados

#### 4.1.1 Análisis (A)
- HTML válido y bien formado
- Elementos cerrados correctamente

#### 4.1.2 Nombre, Función, Valor (A)
- Elementos con roles, nombres y valores apropiados
- Estados comunicados a tecnologías asistivas

**Implementación**:
```tsx
<button 
  aria-busy={isSubmitting}
  aria-live="polite"
  disabled={isSubmitting}
>
```

### Nivel AA (Requisitos Recomendados)

#### 1.4.3 Contraste (AA)
- Ratio de contraste mínimo 4.5:1 para texto normal
- Ratio de contraste mínimo 3:1 para texto grande
- Verificado en todos los componentes

#### 1.4.5 Imágenes de Texto (AA)
- Uso de texto real en lugar de imágenes de texto
- Excepciones solo para logos

#### 2.4.5 Múltiples Vías (AA)
- Múltiples formas de navegar (botones, enlaces, breadcrumbs)

#### 2.4.6 Encabezados y Etiquetas (AA)
- Encabezados descriptivos y claros
- Labels que describen propósito o contenido

#### 2.4.7 Foco Visible (AA)
- Indicador de foco visible en todos los elementos interactivos
- Outline personalizado cuando es necesario

**Implementación**:
```css
&:focus {
  outline: 3px solid rgba(0, 123, 255, 0.5);
  outline-offset: 2px;
}
```

#### 3.1.2 Idioma de las Partes (AA)
- Idioma consistente en español en toda la aplicación

#### 3.2.3 Navegación Coherente (AA)
- Elementos de navegación en ubicaciones consistentes

#### 3.2.4 Identificación Coherente (AA)
- Componentes similares identificados consistentemente

#### 3.3.3 Sugerencias ante Errores (AA)
- Sugerencias proporcionadas cuando hay errores de entrada

#### 3.3.4 Prevención de Errores (AA)
- Confirmaciones para datos importantes
- Capacidad de revisar antes de enviar

---

## 📱 Responsive Design y Accesibilidad Móvil

### Táctil
- Áreas de toque mínimo de 44x44px
- Espaciado adecuado entre elementos táctiles
- No hay dependencia de hover

### Zoom
- Soporta zoom hasta 200% sin pérdida de funcionalidad
- Diseño fluido que se adapta

---

## 🧪 Testing de Accesibilidad

### Herramientas Recomendadas
1. **axe DevTools** - Testing automatizado de WCAG
2. **WAVE** - Evaluación visual de accesibilidad
3. **Lighthouse** - Auditoría de accesibilidad de Chrome
4. **NVDA/JAWS** - Testing con lectores de pantalla
5. **Keyboard Navigation** - Testing manual con teclado

### Checklist de Testing
- [ ] Navegación completa solo con teclado
- [ ] Lectores de pantalla anuncian correctamente
- [ ] Contraste de colores cumple WCAG AA
- [ ] Formularios validados correctamente
- [ ] Errores anunciados a tecnologías asistivas
- [ ] Focus management funciona correctamente
- [ ] Zoom al 200% no rompe layout
- [ ] Áreas táctiles suficientemente grandes

---

## 🚀 Mejoras Futuras

### Nivel AAA
- [ ] Ratio de contraste 7:1 (AAA)
- [ ] Transcripciones para audio
- [ ] Lenguaje de señas para videos
- [ ] Navegación por shortcuts personalizables

### Mejoras de UX
- [ ] Modo oscuro accesible
- [ ] Personalización de tamaño de fuente
- [ ] Reducción de animaciones (prefers-reduced-motion)
- [ ] Alto contraste opcional

---

## 📚 Referencias

1. **Nielsen Norman Group** - 10 Usability Heuristics
   - https://www.nngroup.com/articles/ten-usability-heuristics/

2. **WCAG 2.1 Guidelines**
   - https://www.w3.org/WAI/WCAG21/quickref/

3. **MDN Web Accessibility**
   - https://developer.mozilla.org/en-US/docs/Web/Accessibility

4. **WebAIM Resources**
   - https://webaim.org/resources/

---

## 👥 Contribuciones

Para mantener y mejorar la accesibilidad:
1. Siempre incluir aria-labels en elementos interactivos
2. Probar con teclado antes de cada commit
3. Verificar contraste de colores en nuevos componentes
4. Documentar decisiones de accesibilidad en PRs
5. Ejecutar axe DevTools en cambios de UI

---

**Última actualización**: Octubre 2025
**Mantenido por**: Equipo de Desarrollo Maraton
