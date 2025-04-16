# Utilizamos Node.js como imagen base
FROM node:18-alpine

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos archivos de configuración primero (para aprovechar la caché de Docker)
COPY package.json package-lock.json* ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto de archivos de la aplicación
COPY . .

# Exponemos el puerto para la aplicación web
EXPOSE 3000

# Comando por defecto cuando se inicia el contenedor
CMD ["npm", "start"]
