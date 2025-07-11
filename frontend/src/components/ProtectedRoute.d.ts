import React from 'react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoute?: string;
  requiredRole?: string;
}

declare const ProtectedRoute: React.FC<ProtectedRouteProps>;
export default ProtectedRoute;
