import React, { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';

// Interfaces TypeScript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoute?: string;
  requiredRole?: string;
}

interface CacheEntry {
  hasAccess: boolean;
  timestamp: number;
  userRole?: string;
}

// Cache simple para rutas verificadas
const routeCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoute, 
  requiredRole 
}) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para limpiar cache expirado
  const cleanExpiredCache = useCallback(() => {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    routeCache.forEach((value, key) => {
      if (now - value.timestamp > CACHE_DURATION) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => routeCache.delete(key));
  }, []);

  // Función para verificar acceso con cache
  const verifyAccess = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      // Verificar si el usuario tiene el rol requerido
      if (requiredRole) {
        try {
          const user = JSON.parse(userStr);
          if (user.rol !== requiredRole || user.activo !== 'SI') {
            setHasAccess(false);
            setLoading(false);
            return;
          }
          // Si tiene el rol correcto, dar acceso inmediatamente
          setHasAccess(true);
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing user data:', error);
          setHasAccess(false);
          setLoading(false);
          return;
        }
      }

      // Limpiar cache expirado
      cleanExpiredCache();

      // Verificar cache primero para rutas específicas
      const cacheKey = `${token}-${requiredRoute}`;
      const cached = routeCache.get(cacheKey);
      const now = Date.now();

      if (cached && (now - cached.timestamp < CACHE_DURATION)) {
        setHasAccess(cached.hasAccess);
        setLoading(false);
        return;
      }

      // Si no está en cache o expiró, consultar backend para rutas específicas
      if (requiredRoute) {
        const response = await fetch(`http://localhost:5001/api/auth/verify-route/${requiredRoute}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const accessGranted = data.hasAccess;
          
          // Guardar en cache
          routeCache.set(cacheKey, {
            hasAccess: accessGranted,
            timestamp: now,
            userRole: data.userRole
          });
          
          setHasAccess(accessGranted);
        } else {
          setHasAccess(false);
          // Si la respuesta no es ok, limpiar cache para este token
          const keysToDelete: string[] = [];
          routeCache.forEach((_, key) => {
            if (key.startsWith(`${token}-`)) {
              keysToDelete.push(key);
            }
          });
          keysToDelete.forEach(key => routeCache.delete(key));
        }
      } else {
        // Si no hay ruta específica ni rol, permitir acceso por defecto
        setHasAccess(true);
      }
    } catch (error) {
      console.error('Error verifying route access:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  }, [requiredRoute, requiredRole, cleanExpiredCache]);

  // Función para limpiar cache manualmente (útil cuando cambian roles)
  const refreshPermissions = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Limpiar cache para este usuario
      const keysToDelete: string[] = [];
      routeCache.forEach((_, key) => {
        if (key.startsWith(`${token}-`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => routeCache.delete(key));
      // Reverificar acceso
      setLoading(true);
      verifyAccess();
    }
  }, [verifyAccess]);

  // Escuchar eventos personalizados para refresh de permisos
  useEffect(() => {
    const handlePermissionRefresh = () => {
      refreshPermissions();
    };

    window.addEventListener('refreshPermissions', handlePermissionRefresh);
    return () => {
      window.removeEventListener('refreshPermissions', handlePermissionRefresh);
    };
  }, [refreshPermissions]);

  useEffect(() => {
    verifyAccess();
  }, [verifyAccess]);

  // Estados de carga y renderizado
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }
  
  if (!hasAccess) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Función helper para refrescar permisos globalmente
export const refreshUserPermissions = () => {
  // Disparar evento personalizado para que todos los ProtectedRoute se actualicen
  window.dispatchEvent(new CustomEvent('refreshPermissions'));
};

// Función helper para limpiar cache de rutas
export const clearRouteCache = () => {
  routeCache.clear();
};

export default ProtectedRoute;
