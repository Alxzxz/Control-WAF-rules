# WAF Rules API Documentation

API Base URL: `http://localhost:3000/api`

## Endpoints

### Obtener todas las reglas
```http
GET /rules

Response 200:
[
  {
    "name": "SQL Injection Rule",
    "id": "SQLi-001",
    "description": "Detecta intentos de SQL Injection",
    "status": "active",
    "severity": 3,
    "comments": [],
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
]
```

### Crear nueva regla
```http
POST /rules
Content-Type: application/json

{
  "name": "SQL Injection Rule",
  "id": "SQLi-001",
  "description": "Detecta intentos de SQL Injection",
  "status": "active",
  "severity": 3
}

Response 201:
{
  "name": "SQL Injection Rule",
  "id": "SQLi-001",
  "description": "Detecta intentos de SQL Injection",
  "status": "active",
  "severity": 3,
  "comments": [],
  "createdAt": "2024-01-20T10:00:00.000Z"
}
```

### Actualizar regla
```http
PUT /rules/:id
Content-Type: application/json

{
  "name": "SQL Injection Rule Updated",
  "description": "Descripción actualizada",
  "status": "preview",
  "severity": 4
}

Response 200:
{
  "name": "SQL Injection Rule Updated",
  "id": "SQLi-001",
  "description": "Descripción actualizada",
  "status": "preview",
  "severity": 4,
  "comments": [],
  "createdAt": "2024-01-20T10:00:00.000Z"
}
```

### Cambiar estado de la regla (active/inactive)
```http
PATCH /rules/:id/status

Response 200:
{
  "name": "SQL Injection Rule",
  "id": "SQLi-001",
  "status": "inactive",
  // ... resto de datos
}
```

### Añadir comentario a una regla
```http
POST /rules/:id/comments
Content-Type: application/json

{
  "text": "Este es un comentario"
}

Response 200:
{
  "name": "SQL Injection Rule",
  "id": "SQLi-001",
  "comments": [
    {
      "text": "Este es un comentario",
      "date": "2024-01-20T10:05:00.000Z"
    }
  ],
  // ... resto de datos
}
```

### Eliminar regla
```http
DELETE /rules/:id

Response 200:
{
  "message": "Rule deleted"
}
```

## Estados disponibles
- `active`: Regla activa y en funcionamiento
- `inactive`: Regla desactivada
- `preview`: Regla en modo de prueba
- `false_positive`: Regla marcada como falso positivo

## Niveles de severidad
- `1`: Severidad Baja
- `2`: Severidad Media
- `3`: Severidad Alta
- `4`: Severidad Crítica

## Ejemplos de uso con cURL

### Obtener todas las reglas
```bash
curl http://localhost:3000/api/rules
```

### Crear nueva regla
```bash
curl -X POST http://localhost:3000/api/rules \
  -H "Content-Type: application/json" \
  -d '{
    "name": "XSS Protection",
    "id": "XSS-001",
    "description": "Protección contra XSS",
    "status": "active",
    "severity": 3
  }'
```

### Actualizar regla
```bash
curl -X PUT http://localhost:3000/api/rules/XSS-001 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "XSS Protection Updated",
    "description": "Nueva descripción",
    "status": "preview",
    "severity": 4
  }'
```

### Añadir comentario
```bash
curl -X POST http://localhost:3000/api/rules/XSS-001/comments \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Comentario de prueba"
  }'
```
