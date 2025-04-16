# Guía de Instalación para Control-WAF-rules

Esta guía proporciona instrucciones detalladas para configurar e instalar la aplicación Control-WAF-rules en una nueva máquina virtual o servidor.

## Requisitos Previos

- Un sistema operativo Linux (preferiblemente basado en Debian/Ubuntu)
- Acceso root o privilegios sudo
- Conexión a Internet

## Instalación Automática

Hemos preparado un script de instalación automatizado que configurará todo lo necesario para ejecutar la aplicación.

### Paso 1: Descargar y preparar el script de instalación

```bash
# Otorgar permisos de ejecución al script
chmod +x setup.sh
```

### Paso 2: Ejecutar el script como superusuario

```bash
sudo ./setup.sh
```

El script realizará las siguientes acciones:
- Actualizar los repositorios del sistema
- Instalar paquetes necesarios
- Instalar Docker y Docker Compose
- Configurar usuarios y permisos (opcional)
- Iniciar la aplicación (opcional)

## Instalación Manual

Si prefieres realizar la instalación manualmente, sigue estos pasos:

### Paso 1: Actualizar el sistema

```bash
sudo apt update
sudo apt upgrade -y
```

### Paso 2: Instalar dependencias

```bash
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common gnupg
```

### Paso 3: Añadir el repositorio de Docker

```bash
# Añadir clave GPG
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Añadir repositorio
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
```

### Paso 4: Instalar Docker y Docker Compose

```bash
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Paso 5: Configurar Docker

```bash
# Iniciar y habilitar el servicio Docker
sudo systemctl start docker
sudo systemctl enable docker

# Añadir tu usuario al grupo docker (opcional)
sudo usermod -aG docker $USER
```

### Paso 6: Ejecutar la aplicación

```bash
# Navegar al directorio de la aplicación
cd /ruta/a/Control-WAF-rules/

# Iniciar la aplicación
docker compose up -d
```

## Acceso a la Aplicación

Una vez que la aplicación esté en funcionamiento, puedes acceder a ella a través de tu navegador web:

```
http://localhost:3000
```

## Administración

### Comandos útiles para administrar la aplicación

```bash
# Ver logs de la aplicación
docker compose logs -f

# Detener la aplicación
docker compose down

# Reiniciar la aplicación
docker compose restart

# Ver contenedores en ejecución
docker ps
```

### Acceso a MongoDB

La base de datos MongoDB está disponible en:

```
localhost:27018
```

## Solución de problemas

### Puerto en uso

Si recibes un error indicando que el puerto 27018 ya está en uso, puedes modificar el archivo `docker-compose.yml` para usar un puerto diferente.

### Problemas de permisos

Si encuentras problemas de permisos al ejecutar Docker, asegúrate de haber añadido tu usuario al grupo docker y haber cerrado sesión y vuelto a iniciarla.

---

Para más información o soporte, consulta la documentación oficial o contacta al equipo de desarrollo.
