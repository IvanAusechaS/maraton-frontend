# Manual de Usuario MARATON - LaTeX

Este archivo contiene el Manual de Usuario de MARATON en formato LaTeX profesional, diseñado para compilación en Overleaf.

## Características del Documento

### Diseño Profesional
- **Clase de documento:** `book` con formato a dos caras
- **Tamaño de página:** A4 (210 × 297 mm)
- **Fuente principal:** Times New Roman (11pt)
- **Márgenes:** Optimizados para impresión (interior 3cm, exterior 2cm)

### Elementos Visuales
- **Colores corporativos:** Paleta completa de MARATON
  - Azul principal: RGB(0, 123, 255)
  - Gris oscuro: RGB(26, 26, 26)
  - Colores de estado (success, warning, error, info)
- **Cajas destacadas:** 4 tipos con iconos FontAwesome
  - Información (azul)
  - Advertencia (amarillo)
  - Nota importante (verde)
  - Error/Problema (rojo)
- **Títulos personalizados:** Con colores corporativos
- **Encabezados y pies:** Con nombre de sección y número de página

### Estructura del Documento
1. Portada con logo y versión
2. Página de derechos de autor
3. Tabla de contenidos
4. Prefacio
5. 16 capítulos principales
6. 3 apéndices (Glosario, Atajos, Códigos de error)
7. Índice alfabético

## Compilación en Overleaf

### Paso 1: Crear Proyecto
1. Inicie sesión en [Overleaf](https://www.overleaf.com)
2. Clic en "New Project" → "Blank Project"
3. Nombre el proyecto: "Manual Usuario MARATON"

### Paso 2: Cargar Archivo
1. Elimine el `main.tex` predeterminado
2. Clic en "Upload" → Seleccione `manual-de-usuario.tex`
3. Renombre a `main.tex` si es necesario

### Paso 3: Agregar Logo
El documento requiere un logo en la portada:
- **Nombre esperado:** `logo-maraton.png`
- **Ubicación:** Raíz del proyecto Overleaf
- **Formato:** PNG con fondo transparente
- **Dimensiones recomendadas:** 800 × 300 px

**Alternativa si no tiene logo:**
```latex
% Reemplace la línea:
\includegraphics[width=0.4\textwidth]{logo-maraton.png}

% Por:
{\Huge\textbf{MARATON}}
```

### Paso 4: Configurar Compilador
1. Menú → Configuración del proyecto
2. **Compiler:** XeLaTeX (requerido para fontspec)
3. **Main document:** main.tex

### Paso 5: Compilar
- Clic en "Recompile" o Ctrl+S
- Espere 10-20 segundos (documento completo)
- Revise el PDF generado

## Paquetes Requeridos

Todos estos paquetes están disponibles en Overleaf por defecto:

### Esenciales
- `inputenc`, `babel`, `fontenc` - Soporte de idioma español
- `geometry` - Control de márgenes
- `xcolor` - Colores personalizados
- `graphicx`, `tikz` - Gráficos y diagramas
- `tcolorbox` - Cajas destacadas

### Tipografía
- `fontspec` - Fuentes personalizadas (requiere XeLaTeX)
- `lmodern` - Fuentes Latin Modern
- `microtype` - Mejoras tipográficas

### Navegación
- `hyperref` - Hipervínculos y marcadores PDF
- `fancyhdr` - Encabezados y pies personalizados
- `titlesec` - Formato de títulos

### Tablas y Listas
- `booktabs`, `longtable`, `array`, `multirow` - Tablas avanzadas
- `enumitem` - Listas personalizadas

### Extras
- `fontawesome5` - Iconos en el documento
- `listings` - Código fuente (si se añade)
- `makeidx` - Índice alfabético

## Personalización

### Cambiar Colores Corporativos

Modifique la sección de definición de colores:

```latex
\definecolor{maratonblue}{RGB}{0,123,255}     % Color principal
\definecolor{maratondark}{RGB}{26,26,26}      % Texto oscuro
\definecolor{maratonaccent}{RGB}{255,193,7}   % Acento
```

### Ajustar Márgenes

En la configuración de `geometry`:

```latex
\usepackage[
    top=2.5cm,      % Margen superior
    bottom=2.5cm,   % Margen inferior
    inner=3cm,      % Margen interior (encuadernación)
    outer=2cm       % Margen exterior
]{geometry}
```

### Modificar Encabezados

En la sección `fancyhdr`:

```latex
\fancyhead[LE,RO]{\thepage}              % Número de página
\fancyhead[RE]{\textit{\leftmark}}       % Nombre de capítulo
\fancyhead[LO]{\textit{\rightmark}}      % Nombre de sección
```

## Problemas Comunes y Soluciones

### Error: "Font not found"
**Causa:** Fuentes especificadas no disponibles  
**Solución:** Use fuentes predeterminadas:
```latex
% Comente o elimine:
% \setmainfont{Times New Roman}
% \setsansfont{Arial}
% \setmonofont{Courier New}
```

### Error: "File logo-maraton.png not found"
**Causa:** Logo no cargado  
**Solución:** Suba el logo o use texto alternativo (ver Paso 3)

### Error: "XeLaTeX required"
**Causa:** Compilador incorrecto  
**Solución:** Cambie a XeLaTeX en configuración del proyecto

### Advertencia: "Overfull \hbox"
**Causa:** Texto que excede margen  
**Solución:** Normal en documentos extensos, puede ignorarse o ajustar manualmente

### PDF no se actualiza
**Causa:** Caché de Overleaf  
**Solución:** 
1. Menú → "Clear cached files"
2. Recompilar

## Exportación del PDF

### Desde Overleaf
1. Clic en el ícono de descarga junto a "Recompile"
2. Seleccione "PDF"
3. Guarde como: `Manual-Usuario-MARATON-v1.0.pdf`

### Opciones de Calidad
- **Normal:** Para visualización en pantalla
- **Alta:** Para impresión profesional (aumentar DPI de imágenes)

## Impresión Recomendada

### Configuración
- **Papel:** A4 (210 × 297 mm)
- **Orientación:** Vertical
- **Impresión:** Doble cara (twoside)
- **Encuadernación:** Margen izquierdo (3cm)
- **Color:** Sí (para cajas y destacados)

### Estimado de Páginas
- **Total aproximado:** 80-100 páginas (depende de contenido completo)
- **Portada + preliminares:** 5 páginas
- **Capítulos principales:** 70-85 páginas
- **Apéndices e índices:** 10 páginas

## Mantenimiento y Actualizaciones

### Actualizar Versión
Modifique en la sección de información:

```latex
\date{Octubre 2025 -- Versión 1.0.0}  % Cambiar versión aquí
```

Y en el pie de página:

```latex
\fancyfoot[C]{\small \textcolor{gray}{Manual de Usuario MARATON - Versión 1.0.0}}
```

### Agregar Nuevo Capítulo

```latex
\chapter{Nombre del Capítulo}
\section{Primera Sección}
Contenido aquí...

\section{Segunda Sección}
Más contenido...
```

### Agregar Entradas al Índice

```latex
\index{término}  % Añade al índice alfabético
```

## Recursos Adicionales

### Documentación LaTeX
- [Overleaf Documentation](https://www.overleaf.com/learn)
- [LaTeX Wikibook](https://en.wikibooks.org/wiki/LaTeX)
- [CTAN (Comprehensive TeX Archive Network)](https://www.ctan.org/)

### Paquetes Específicos
- [tcolorbox manual](https://ctan.org/pkg/tcolorbox)
- [fontawesome5 icons](https://ctan.org/pkg/fontawesome5)
- [hyperref options](https://ctan.org/pkg/hyperref)

### Plantillas Similares
- [Overleaf Gallery](https://www.overleaf.com/gallery)
- Buscar: "book template", "manual template"

## Conversión a Otros Formatos

### HTML
```bash
htlatex main.tex "xhtml,charset=utf-8" " -cunihtf -utf8"
```

### Word (vía Pandoc)
```bash
pandoc main.tex -o manual.docx
```

### EPUB
```bash
tex4ebook main.tex
```

## Contacto

Para consultas sobre este documento LaTeX:
- **Email:** docs@maraton.app
- **Repositorio:** GitHub (maraton-frontend/docs/)

---

**Nota:** Este es un documento vivo que se actualiza con cada versión de la plataforma. Consulte siempre la versión más reciente en el repositorio oficial.
