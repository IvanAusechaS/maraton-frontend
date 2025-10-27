# Documentación MARATON

Este directorio contiene toda la documentación oficial de la plataforma MARATON.

## Contenido

### 1. Manual de Usuario
**Archivo:** `manual-de-usuario.md`

Manual completo para usuarios finales de la plataforma. Incluye:
- Introducción a la plataforma
- Requisitos del sistema
- Guía de registro e inicio de sesión
- Navegación y uso del catálogo
- Sistema de calificaciones y comentarios
- Gestión de favoritos y perfil
- Accesibilidad
- Solución de problemas
- Políticas y normas
- Contacto y soporte

**Destinatarios:** Usuarios generales de MARATON  
**Formato:** Markdown profesional, apto para conversión a PDF

---

### 2. Implementación WCAG 2.1
**Archivo:** `wcag-implementation.md`

Documentación técnica completa sobre la implementación de accesibilidad web siguiendo estándares WCAG 2.1 Level AA.

**Contenido:**
- Resumen ejecutivo del proyecto de accesibilidad
- Estándares implementados (WCAG 2.1 Level A y AA)
- Principios de accesibilidad (Perceptible, Operable, Comprensible, Robusto)
- Implementación detallada por página
- Heurísticas de Nielsen integradas
- Arquitectura de componentes accesibles
- Herramientas y metodología de testing
- Resultados y métricas
- Trabajo futuro y recomendaciones

**Destinatarios:** Desarrolladores, diseñadores, QA testers  
**Alcance:** 6 páginas con conformidad 100% WCAG AA (LoginPage, SignupPage, RecoveryPage, ResetPassPage, SuccessEmailPage, NotFoundPage)

---

### 3. Heurísticas de Usabilidad y WCAG
**Archivo:** `wcag-usability-heuristics.md`

Guía práctica sobre las 10 heurísticas de usabilidad de Nielsen y directrices WCAG implementadas.

**Contenido:**
- 10 Heurísticas de Nielsen con ejemplos de código
- WCAG 2.1 Level A (14 criterios)
- WCAG 2.1 Level AA (9 criterios)
- Responsive design y accesibilidad móvil
- Testing checklist
- Mejoras futuras (Level AAA)
- Referencias y recursos

**Destinatarios:** Equipo de desarrollo, diseñadores UX/UI  
**Uso:** Referencia rápida para implementaciones y code reviews

---

## Propósito de la Documentación

### Para Usuarios
El **Manual de Usuario** proporciona toda la información necesaria para utilizar la plataforma de manera efectiva, resolver problemas comunes y comprender las políticas del servicio.

### Para Desarrolladores
La documentación técnica de **WCAG** y **Heurísticas** sirve como:
- Guía de implementación de accesibilidad
- Estándares de desarrollo a seguir
- Checklist de testing y validación
- Base de conocimiento para onboarding
- Referencia para decisiones de diseño

---

## Actualizaciones

La documentación se actualiza con cada versión mayor de la plataforma. Los cambios incrementales se documentan en el changelog de cada archivo.

**Última actualización general:** Octubre 2025  
**Versión de documentación:** 1.0.0  
**Versión de plataforma:** 1.0.0

---

## Contribución a la Documentación

Para actualizar o corregir la documentación:

1. **Identifique el archivo correcto:**
   - Manual de usuario: Para guías de uso final
   - WCAG Implementation: Para detalles técnicos de accesibilidad
   - Heurísticas: Para patrones de usabilidad

2. **Siga el formato existente:**
   - Use Markdown estándar
   - Mantenga consistencia de estilo
   - Incluya ejemplos cuando sea relevante
   - Actualice la fecha de última modificación

3. **Proceso de revisión:**
   - Cree un PR con cambios a documentación
   - Use el label `documentation`
   - Solicite revisión del equipo técnico
   - Incluya justificación de cambios

---

## Conversión a PDF

El **Manual de Usuario** está diseñado para convertirse a PDF usando herramientas como:

### Pandoc (Recomendado)
```bash
pandoc manual-de-usuario.md -o manual-de-usuario.pdf \
  --pdf-engine=xelatex \
  --toc \
  --number-sections \
  -V geometry:margin=1in \
  -V fontsize=11pt
```

### Markdown to PDF (VS Code Extension)
1. Instale la extensión "Markdown PDF"
2. Abra `manual-de-usuario.md`
3. Presione Ctrl+Shift+P (o Cmd+Shift+P en Mac)
4. Ejecute "Markdown PDF: Export (pdf)"

### Grip + Print to PDF
```bash
grip manual-de-usuario.md
# Abra http://localhost:6419 en navegador
# Use "Imprimir" → "Guardar como PDF"
```

---

## Licencia

Toda la documentación en este directorio es propiedad de MARATON y está destinada para uso interno y de usuarios de la plataforma.

© 2025 MARATON. Todos los derechos reservados.
