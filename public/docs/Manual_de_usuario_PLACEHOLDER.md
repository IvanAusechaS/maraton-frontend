# Manual de Usuario MARATON

## Instrucciones para Generar el PDF

Este archivo es un placeholder. Para generar el PDF completo del manual de usuario:

### Opción 1: Usando Overleaf (Recomendado)

1. Visite [Overleaf](https://www.overleaf.com)
2. Cree un nuevo proyecto
3. Suba el archivo `docs/manual-de-usuario.tex`
4. Configure el compilador a **pdfLaTeX**
5. Compile y descargue el PDF
6. Guárdelo como `Manual_de_usuario.pdf` en esta ubicación

### Opción 2: Usando Pandoc

```bash
cd docs
pandoc manual-de-usuario.md -o ../public/docs/Manual_de_usuario.pdf \
  --pdf-engine=xelatex \
  --toc \
  --number-sections \
  -V geometry:margin=1in \
  -V fontsize=11pt \
  -V documentclass=book
```

### Opción 3: LaTeX Local

Si tiene LaTeX instalado localmente:

```bash
cd docs
pdflatex manual-de-usuario.tex
pdflatex manual-de-usuario.tex  # Segunda vez para TOC
mv manual-de-usuario.pdf ../public/docs/Manual_de_usuario.pdf
```

## Contenido del Manual

El manual incluye 16 capítulos completos:

1. Introducción
2. Requisitos del Sistema
3. Acceso a la Plataforma
4. Registro de Nueva Cuenta
5. Inicio de Sesión
6. Recuperación de Contraseña
7. Navegación Principal
8. Catálogo de Películas
9. Reproducción de Contenido
10. Sistema de Calificaciones y Comentarios
11. Gestión de Favoritos
12. Perfil de Usuario
13. Accesibilidad
14. Solución de Problemas
15. Políticas y Normas
16. Contacto y Soporte

## Versión

- **Versión del Manual:** 1.0.0
- **Fecha:** Octubre 2025
- **Plataforma:** MARATON

---

Para obtener el PDF final, compile el archivo LaTeX o Markdown ubicado en la carpeta `docs/`.
