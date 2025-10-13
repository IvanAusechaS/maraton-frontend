# Etapa 1: Build
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production=false

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:alpine

# Copiar el build desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
