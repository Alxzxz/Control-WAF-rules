#!/bin/bash

# Script para configurar Docker y ejecutar la aplicación Control-WAF-rules
# Este script funciona en sistemas basados en Debian/Ubuntu
# Para otros sistemas, puede requerir modificaciones

# Colores para mejor visualización
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Script de instalación y configuración para Control-WAF-rules ===${NC}"

# Función para verificar y mostrar errores
check_error() {
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: $1${NC}"
        exit 1
    fi
}

# Asegúrate de que el script se ejecuta como root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Por favor, ejecuta este script como root o con sudo${NC}"
  exit 1
fi

# Verificar si estamos en un sistema Debian/Ubuntu
if [ ! -f /etc/debian_version ]; then
    echo -e "${YELLOW}Advertencia: Este script está diseñado para sistemas Debian/Ubuntu. Puede que no funcione correctamente en tu sistema.${NC}"
    read -p "¿Quieres continuar? (s/n): " CONT
    if [ "$CONT" != "s" ]; then
        echo "Instalación cancelada"
        exit 0
    fi
fi

echo -e "${YELLOW}Actualizando repositorios...${NC}"
apt-get update
check_error "No se pudieron actualizar los repositorios"

echo -e "${YELLOW}Instalando paquetes necesarios...${NC}"
apt-get install -y apt-transport-https ca-certificates curl software-properties-common gnupg
check_error "No se pudieron instalar los paquetes necesarios"

echo -e "${YELLOW}Añadiendo clave GPG de Docker...${NC}"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
check_error "No se pudo añadir la clave GPG de Docker"

echo -e "${YELLOW}Añadiendo repositorio de Docker...${NC}"
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
check_error "No se pudo añadir el repositorio de Docker"

echo -e "${YELLOW}Actualizando repositorios nuevamente...${NC}"
apt-get update
check_error "No se pudieron actualizar los repositorios después de añadir Docker"

echo -e "${YELLOW}Instalando Docker...${NC}"
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
check_error "No se pudo instalar Docker"

echo -e "${YELLOW}Verificando que Docker está funcionando...${NC}"
systemctl start docker
systemctl enable docker
check_error "No se pudo iniciar el servicio de Docker"

# Verificar que Docker está funcionando correctamente
docker --version
check_error "Docker no se instaló correctamente"

echo -e "${YELLOW}Verificando Docker Compose...${NC}"
docker compose version
check_error "Docker Compose no se instaló correctamente"

# Crear un usuario no-root para ejecutar Docker (opcional)
echo -e "${YELLOW}¿Quieres crear un usuario para ejecutar Docker sin root? (recomendado)${NC}"
read -p "Nombre de usuario (deja en blanco para omitir): " DOCKER_USER

if [ ! -z "$DOCKER_USER" ]; then
    # Verificar si el usuario ya existe
    if id "$DOCKER_USER" &>/dev/null; then
        echo -e "${YELLOW}El usuario $DOCKER_USER ya existe. Se añadirá al grupo docker.${NC}"
    else
        echo -e "${YELLOW}Creando usuario $DOCKER_USER...${NC}"
        useradd -m -s /bin/bash $DOCKER_USER
        passwd $DOCKER_USER
        check_error "No se pudo crear el usuario"
    fi
    
    echo -e "${YELLOW}Añadiendo usuario $DOCKER_USER al grupo docker...${NC}"
    usermod -aG docker $DOCKER_USER
    check_error "No se pudo añadir el usuario al grupo docker"
    
    echo -e "${GREEN}Usuario $DOCKER_USER configurado correctamente.${NC}"
    echo -e "${YELLOW}IMPORTANTE: Para aplicar los cambios, el usuario debe cerrar sesión y volver a iniciarla.${NC}"
fi

# Recordatorio sobre el puerto MongoDB
echo -e "${YELLOW}NOTA: La aplicación utilizará el puerto 27018 para MongoDB. Asegúrate de que este puerto esté permitido en tu firewall.${NC}"

# Preguntar si quiere ejecutar la aplicación ahora
echo -e "${YELLOW}¿Quieres ejecutar la aplicación ahora?${NC}"
read -p "Ejecutar aplicación (s/n): " RUN_APP

if [ "$RUN_APP" = "s" ]; then
    CURRENT_DIR=$(pwd)
    echo -e "${YELLOW}Navegando al directorio de la aplicación...${NC}"
    cd /home/alejandromoyo/work/Control-WAF-rules/
    check_error "No se pudo encontrar el directorio de la aplicación"

    echo -e "${YELLOW}Iniciando la aplicación con Docker Compose...${NC}"
    docker compose up -d
    check_error "No se pudo iniciar la aplicación"

    echo -e "${GREEN}¡Aplicación iniciada correctamente!${NC}"
    echo -e "${YELLOW}Puedes acceder a ella en: http://localhost:3000${NC}"
    
    # Mostrar instrucciones para administrar la aplicación
    echo -e "\n${YELLOW}Comandos útiles para administrar la aplicación:${NC}"
    echo "  - Ver logs: docker compose logs -f"
    echo "  - Detener aplicación: docker compose down"
    echo "  - Reiniciar aplicación: docker compose restart"
    
    # Volver al directorio original
    cd $CURRENT_DIR
else
    echo -e "${YELLOW}Para ejecutar la aplicación más tarde, navega al directorio de la aplicación y ejecuta:${NC}"
    echo "  cd /home/alejandromoyo/work/Control-WAF-rules/"
    echo "  docker compose up -d"
fi

echo -e "\n${GREEN}¡Instalación completada! El sistema está listo para ejecutar Control-WAF-rules.${NC}"
