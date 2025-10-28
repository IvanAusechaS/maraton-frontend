# Directorio de Documentación Pública

Este directorio contiene archivos de documentación accesibles públicamente desde la aplicación web.

## Archivos Requeridos

### Manual_de_usuario.pdf

**Ubicación:** `public/docs/Manual_de_usuario.pdf`

**Descripción:** Manual de usuario completo de la plataforma MARATON en formato PDF.

**Generación:**

El PDF se genera a partir del archivo LaTeX ubicado en `docs/manual-de-usuario.tex`.

Para compilarlo:

1. Abrir [Overleaf](https://www.overleaf.com)
2. Crear nuevo proyecto
3. Subir `docs/manual-de-usuario.tex`
4. Configurar compilador a **pdfLaTeX** (o **XeLaTeX** si se descomenta fontspec)
5. Compilar
6. Descargar el PDF generado
7. Renombrar a `Manual_de_usuario.pdf`
8. Colocar en esta carpeta (`public/docs/`)

**Alternativa rápida (Pandoc):**

```bash
cd docs
pandoc manual-de-usuario.md -o ../public/docs/Manual_de_usuario.pdf \
  --pdf-engine=xelatex \
  --toc \
  --number-sections \
  -V geometry:margin=1in \
  -V fontsize=11pt
```

**Acceso en la aplicación:**

El manual está enlazado en el footer (sección "Ayuda") como "Manual de Usuario" y abre el PDF en una nueva pestaña.

Ruta pública: `/docs/Manual_de_usuario.pdf`

## Estructura de URLs

Cuando la aplicación está desplegada, los archivos en `public/` son accesibles directamente:

- `public/docs/Manual_de_usuario.pdf` → `https://tu-dominio.com/docs/Manual_de_usuario.pdf`

## Notas Importantes

1. **Tamaño del archivo:** El PDF no debe exceder 5 MB para tiempos de carga óptimos.
2. **Versionado:** Actualice el PDF cada vez que se actualice el manual LaTeX/Markdown.
3. **Nombre del archivo:** Use guiones bajos (`_`) en lugar de espacios para compatibilidad.
4. **Git LFS (opcional):** Para archivos PDF grandes, considere usar Git LFS.

## Actualización del Manual

Cuando actualice el contenido del manual:

1. Edite `docs/manual-de-usuario.tex` o `docs/manual-de-usuario.md`
2. Regenere el PDF
3. Reemplace el archivo en `public/docs/Manual_de_usuario.pdf`
4. Commit y push los cambios
5. El despliegue actualizará automáticamente el PDF

---

**Última actualización:** Octubre 2025
