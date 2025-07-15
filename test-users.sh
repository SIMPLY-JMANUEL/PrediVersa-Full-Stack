#!/bin/bash
# Script de pruebas para verificar la funcionalidad de búsqueda de usuarios

echo "=== PRUEBAS DE BÚSQUEDA DE USUARIOS ==="
echo ""

# Hacer login
echo "1. Haciendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:5001/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"usuario": "Admin", "password": "123456789"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo "✅ Login exitoso"
else
    echo "❌ Login falló"
    echo "Respuesta: $LOGIN_RESPONSE"
    exit 1
fi

echo ""

# Probar búsqueda por nombre
echo "2. Probando búsqueda por nombre..."
SEARCH_RESPONSE=$(curl -s -X GET "http://localhost:5001/api/users/search?nombre=Admin" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")

echo "Respuesta: $SEARCH_RESPONSE"

if echo "$SEARCH_RESPONSE" | jq -e '.success' > /dev/null; then
    echo "✅ Búsqueda por nombre exitosa"
else
    echo "❌ Búsqueda por nombre falló"
fi

echo ""

# Probar búsqueda por documento
echo "3. Probando búsqueda por documento..."
SEARCH_DOC_RESPONSE=$(curl -s -X GET "http://localhost:5001/api/users/search?documento=987654321" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")

echo "Respuesta: $SEARCH_DOC_RESPONSE"

if echo "$SEARCH_DOC_RESPONSE" | jq -e '.success' > /dev/null; then
    echo "✅ Búsqueda por documento exitosa"
else
    echo "❌ Búsqueda por documento falló"
fi

echo ""
echo "=== PRUEBAS COMPLETADAS ==="
