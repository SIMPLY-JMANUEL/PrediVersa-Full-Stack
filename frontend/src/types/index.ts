import { ReactNode, FormEvent } from 'react';

// Types for User entities
export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: 'admin' | 'teacher' | 'student' | 'parent' | 'moderator';
  fecha_registro: string;
  photo?: string;
  activo?: boolean;
}

export interface UserProfile extends User {
  telefono?: string;
  biografia?: string;
  configuraciones?: UserSettings;
}

export interface UserSettings {
  tema?: 'light' | 'dark';
  idioma?: string;
  notificaciones?: boolean;
  privacidad?: 'publico' | 'privado';
}

// Authentication types
export interface LoginCredentials {
  correo: string;
  contraseña: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expires_in: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshToken: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'file' | 'date' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
}

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

// Component props types
export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textLight: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    large: string;
    xl: string;
  };
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  completedCourses: number;
  pendingTasks: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'user_registered' | 'course_completed' | 'task_created' | 'report_generated';
  message: string;
  timestamp: string;
  user?: User;
}

// Educational content types
export interface Course {
  id: number;
  titulo: string;
  descripcion: string;
  instructor_id: number;
  fecha_creacion: string;
  estado: 'borrador' | 'publicado' | 'archivado';
  duracion?: number; // en minutos
  nivel: 'principiante' | 'intermedio' | 'avanzado';
  tags: string[];
  thumbnail?: string;
}

export interface Lesson {
  id: number;
  course_id: number;
  titulo: string;
  contenido: string;
  orden: number;
  tipo: 'video' | 'texto' | 'quiz' | 'ejercicio';
  duracion?: number;
  recursos?: string[];
}

export interface Quiz {
  id: number;
  titulo: string;
  descripcion: string;
  preguntas: Question[];
  tiempo_limite?: number;
  intentos_permitidos: number;
}

export interface Question {
  id: number;
  pregunta: string;
  tipo: 'multiple_choice' | 'true_false' | 'open_text' | 'matching';
  opciones?: string[];
  respuesta_correcta: string | string[];
  puntos: number;
  explicacion?: string;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event types
export interface CustomEvent<T = any> {
  type: string;
  payload: T;
  timestamp: number;
}

// Hook types
export interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  handleChange: (name: string, value: any) => void;
  handleBlur: (name: string) => void;
  handleSubmit: (onSubmit: (values: T) => void) => (e: FormEvent) => void;
  reset: () => void;
  setFieldValue: (name: string, value: any) => void;
  setFieldError: (name: string, error: string) => void;
}

export interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
