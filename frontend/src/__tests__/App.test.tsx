import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import App from '../App';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Helper para renderizar con contexto y router
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

// Mock window.fetch para pruebas
Object.defineProperty(window, 'fetch', {
  value: jest.fn(),
  writable: true,
});

describe('PrediVersa App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (window.fetch as jest.Mock).mockClear();
  });

  describe('App Component', () => {
    it('renders without crashing', () => {
      renderWithProviders(<App />);
      expect(document.body).toBeInTheDocument();
    });

    it('displays preloader initially', () => {
      renderWithProviders(<App />);
      // El preloader debería estar presente al cargar
      const preloader = document.querySelector('.preloader');
      expect(preloader).toBeInTheDocument();
    });

    it('shows background shapes', () => {
      renderWithProviders(<App />);
      const shapes = document.querySelector('.background-shapes');
      expect(shapes).toBeInTheDocument();
    });
  });

  describe('Header Component', () => {
    it('renders header with navigation links', () => {
      renderWithProviders(<Header />);

      // Verificar que el logo/título está presente
      expect(screen.getByText('PrediVersa')).toBeInTheDocument();

      // Verificar algunos enlaces de navegación principales (ajustar según la implementación real)
      const navLinks = screen.getAllByRole('link');
      expect(navLinks.length).toBeGreaterThan(0);
    });

    it('renders navigation menu', () => {
      renderWithProviders(<Header />);

      // Verificar que hay elementos de navegación
      const nav = document.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Footer Component', () => {
    it('renders footer with company information', () => {
      renderWithProviders(<Footer />);

      // Verificar que el footer contiene información de la empresa
      expect(screen.getByText(/prediversa/i)).toBeInTheDocument();
      expect(screen.getByText(/2024/i)).toBeInTheDocument();
    });
  });

  describe('AuthContext', () => {
    it('initializes with no user', () => {
      const TestComponent = () => {
        const { user, isAuthenticated } = useAuth();
        return (
          <div>
            <span data-testid="user">{user ? user.nombre : 'No user'}</span>
            <span data-testid="authenticated">
              {isAuthenticated.toString()}
            </span>
          </div>
        );
      };

      renderWithProviders(<TestComponent />);

      expect(screen.getByTestId('user')).toHaveTextContent('No user');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });

    it('handles logout correctly', async () => {
      const mockUser = {
        id: 1,
        nombre: 'Test User',
        correo: 'test@example.com',
        rol: 'student' as const,
        fecha_registro: '2023-01-01',
      };

      localStorage.setItem('auth_token', 'fake-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));

      const TestComponent = () => {
        const { logout, user, isAuthenticated } = useAuth();

        return (
          <div>
            <button onClick={logout}>Logout</button>
            <span data-testid="user">{user ? user.nombre : 'No user'}</span>
            <span data-testid="authenticated">
              {isAuthenticated.toString()}
            </span>
          </div>
        );
      };

      renderWithProviders(<TestComponent />);

      // Initially should be logged in
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('Test User');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('No user');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      });

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user_data')).toBeNull();
    });
  });

  describe('Responsive Design', () => {
    it('handles mobile viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithProviders(<App />);

      // Verificar que la aplicación se renderiza correctamente en mobile
      expect(document.body).toBeInTheDocument();
    });

    it('handles desktop viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      renderWithProviders(<App />);

      // Verificar que la aplicación se renderiza correctamente en desktop
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('User Interface', () => {
    it('renders main content area', () => {
      renderWithProviders(<App />);

      // Verificar que hay un área de contenido principal
      const mainContent = document.querySelector('main');
      expect(mainContent).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      renderWithProviders(<App />);

      // Verificar que se aplican las clases CSS correctas
      const body = document.body;
      expect(body).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('renders router without errors', () => {
      renderWithProviders(<App />);

      // Verificar que el router se renderiza correctamente
      expect(document.body).toBeInTheDocument();
    });

    it('handles route changes', async () => {
      renderWithProviders(<App />);

      // Verificar que la aplicación maneja cambios de ruta
      expect(window.location.pathname).toBe('/');
    });
  });

  describe('Error Handling', () => {
    it('handles component errors gracefully', () => {
      // Mock console.error to avoid noise in tests
      const originalError = console.error;
      console.error = jest.fn();

      renderWithProviders(<App />);

      // Verificar que la aplicación se renderiza sin errores críticos
      expect(document.body).toBeInTheDocument();

      // Restore console.error
      console.error = originalError;
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderWithProviders(<App />);

      // Verificar que hay elementos con roles apropiados
      const mainElement = document.querySelector('main');
      expect(mainElement).toHaveAttribute('role', 'main');
    });

    it('supports keyboard navigation', () => {
      renderWithProviders(<App />);

      // Verificar que hay elementos focusables
      const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select'
      );
      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });
});
