# Script de pruebas para verificar la funcionalidad de búsqueda de usuarios

Write-Host "=== PRUEBAS DE BÚSQUEDA DE USUARIOS ===" -ForegroundColor Green
Write-Host ""

try {
    # Hacer login
    Write-Host "1. Haciendo login..." -ForegroundColor Yellow
    $loginBody = @{
        usuario = "Admin"
        password = "123456789"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:5001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $loginResult = $loginResponse.Content | ConvertFrom-Json
    $token = $loginResult.token
    
    if ($token) {
        Write-Host "✅ Login exitoso" -ForegroundColor Green
    } else {
        Write-Host "❌ Login falló" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    
    # Probar búsqueda por nombre
    Write-Host "2. Probando búsqueda por nombre..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $searchResponse = Invoke-WebRequest -Uri "http://localhost:5001/api/users/search?nombre=Admin" -Method GET -Headers $headers -ErrorAction Stop
    $searchResult = $searchResponse.Content | ConvertFrom-Json
    
    if ($searchResult.success) {
        Write-Host "✅ Búsqueda por nombre exitosa" -ForegroundColor Green
        Write-Host "   Usuarios encontrados: $($searchResult.data.Count)" -ForegroundColor Cyan
        Write-Host "   Primer usuario: $($searchResult.data[0].Nombre_Completo)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Búsqueda por nombre falló" -ForegroundColor Red
    }
    
    Write-Host ""
    
    # Probar búsqueda por documento
    Write-Host "3. Probando búsqueda por documento..." -ForegroundColor Yellow
    $searchDocResponse = Invoke-WebRequest -Uri "http://localhost:5001/api/users/search?documento=987654321" -Method GET -Headers $headers -ErrorAction Stop
    $searchDocResult = $searchDocResponse.Content | ConvertFrom-Json
    
    if ($searchDocResult.success) {
        Write-Host "✅ Búsqueda por documento exitosa" -ForegroundColor Green
        Write-Host "   Usuarios encontrados: $($searchDocResult.data.Count)" -ForegroundColor Cyan
        Write-Host "   Primer usuario: $($searchDocResult.data[0].Nombre_Completo)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Búsqueda por documento falló" -ForegroundColor Red
    }
    
    Write-Host ""
    
    # Probar búsqueda sin parámetros (debe fallar)
    Write-Host "4. Probando búsqueda sin parámetros (debe fallar)..." -ForegroundColor Yellow
    try {
        $searchNoParams = Invoke-WebRequest -Uri "http://localhost:5001/api/users/search" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "❌ Búsqueda sin parámetros debería haber fallado" -ForegroundColor Red
    } catch {
        Write-Host "✅ Búsqueda sin parámetros falló correctamente (esperado)" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "=== PRUEBAS COMPLETADAS ===" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error en las pruebas: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error Response: $errorContent" -ForegroundColor Red
    }
}
