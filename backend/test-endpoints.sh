#!/bin/bash
# Script para probar los endpoints de encuestas

echo "🧪 PRUEBAS DE ENDPOINTS DE ENCUESTAS"
echo "======================================="

# URL base del backend
BASE_URL="http://localhost:5001/api/student/cuestionarios"

echo "📝 Probando endpoint de encuesta emocional..."
curl -X POST "$BASE_URL/emocional/evaluar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "respuestas": {
      "pregunta1": "4",
      "pregunta2": "3",
      "pregunta3": "2",
      "pregunta4": "4",
      "pregunta5": "3"
    }
  }' | echo

echo ""
echo "⚠️ Probando endpoint de encuesta de violencia..."
curl -X POST "$BASE_URL/violencia/evaluar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "respuestas": {
      "pregunta1": "no",
      "pregunta2": "si",
      "pregunta3": "no",
      "pregunta4": "si",
      "pregunta5": "no"
    }
  }' | echo

echo ""
echo "🚨 Probando endpoint de encuesta de señales de víctima..."
curl -X POST "$BASE_URL/victima/evaluar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "respuestas": {
      "pregunta1": "no",
      "pregunta2": "si",
      "pregunta3": "no",
      "pregunta4": "no",
      "pregunta5": "si"
    }
  }' | echo

echo ""
echo "⚖️ Probando endpoint de encuesta de derechos..."
curl -X POST "$BASE_URL/derechos/evaluar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "respuestas": {
      "pregunta1": "si",
      "pregunta2": "no",
      "pregunta3": "si"
    }
  }' | echo

echo ""
echo "✅ Pruebas completadas!"
