# 🐳 Guía de Docker - Maraton Frontend

Esta guía explica cómo usar Docker para el proyecto Maraton Frontend.

## 📋 Prerrequisitos

- Docker instalado (versión 20.10 o superior)
- Docker Compose instalado (versión 2.0 o superior)

## 🚀 Desarrollo Local con Docker

### Iniciar el entorno de desarrollo

```bash
# Construir y levantar el contenedor de desarrollo
docker-compose up maraton-frontend-dev

# O en modo detached (segundo plano)
docker-compose up -d maraton-frontend-dev
```

La aplicación estará disponible en: **http://localhost:5173**

### Hot Reload

El código fuente está montado como volumen, por lo que cualquier cambio en el código se reflejará automáticamente en el navegador.

### Detener el contenedor

```bash
docker-compose down
```

## 🏭 Producción

### Construir la imagen de producción

```bash
# Construir la imagen
docker build -t maraton-frontend:latest .

# O usar docker-compose
docker-compose --profile production up maraton-frontend-prod
```

La aplicación estará disponible en: **http://localhost:8080**

### Probar la build de producción localmente

```bash
docker-compose --profile production up maraton-frontend-prod
```

## 🛠️ Comandos Útiles

### Reconstruir contenedores desde cero

```bash
docker-compose build --no-cache
```

### Ver logs del contenedor

```bash
# Desarrollo
docker-compose logs -f maraton-frontend-dev

# Producción
docker-compose --profile production logs -f maraton-frontend-prod
```

### Ejecutar comandos dentro del contenedor

```bash
# Instalar una nueva dependencia
docker-compose exec maraton-frontend-dev npm install <paquete>

# Acceder a la shell del contenedor
docker-compose exec maraton-frontend-dev sh
```

### Limpiar imágenes y contenedores

```bash
# Eliminar contenedores detenidos
docker-compose down

# Eliminar contenedores y volúmenes
docker-compose down -v

# Limpiar todo (imágenes, contenedores, volúmenes)
docker system prune -a --volumes
```

## 📦 Estructura de Archivos Docker

- `Dockerfile` - Imagen optimizada multi-stage para producción con Nginx
- `Dockerfile.dev` - Imagen para desarrollo con hot-reload
- `docker-compose.yml` - Orquestación de servicios
- `nginx.conf` - Configuración de Nginx para SPA
- `.dockerignore` - Archivos excluidos del contexto de build

## 🔧 Configuración

### Variables de Entorno

Puedes crear un archivo `.env` en la raíz del proyecto para variables de entorno:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_ENV=development
```

### Puertos

- **5173** - Puerto de desarrollo (Vite)
- **8080** - Puerto de producción (Nginx)

## 🐛 Troubleshooting

### El contenedor no inicia

1. Verifica que los puertos no estén en uso:
   ```bash
   lsof -i :5173
   lsof -i :8080
   ```

2. Revisa los logs:
   ```bash
   docker-compose logs maraton-frontend-dev
   ```

### Cambios no se reflejan

1. Reconstruye el contenedor:
   ```bash
   docker-compose down
   docker-compose up --build maraton-frontend-dev
   ```

### Problemas de permisos en Linux

Si tienes problemas con permisos de archivos:

```bash
# Cambiar propietario de node_modules
docker-compose exec maraton-frontend-dev chown -R node:node /app
```

## 📚 Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Vite Documentation](https://vitejs.dev/)
- [Nginx Documentation](https://nginx.org/en/docs/)
