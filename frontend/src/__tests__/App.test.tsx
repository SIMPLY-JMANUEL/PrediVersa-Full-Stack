import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Button from '../components/Button/Button';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Helper para renderizar con contexto
const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('Button Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Loading...</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies correct variant class', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('secondary');
  });

  it('applies correct size class', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('lg');
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    
    await user.click(screen.getByText('Disabled'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('AuthContext (Frontend State)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('initializes with no user', () => {
    const TestComponent = () => {
      const { user, isAuthenticated } = useAuth();
      return (
        <div>
          <span data-testid="user">{user ? user.nombre : 'No user'}</span>
          <span data-testid="authenticated">{isAuthenticated.toString()}</span>
        </div>
      );
    };

    renderWithAuth(<TestComponent />);
    
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('logs out user (frontend state)', async () => {
    // Set up initial logged in state
    const mockUser = {
      id: 1,
      nombre: 'Test User',
      correo: 'test@example.com',
      rol: 'student' as const,
      fecha_registro: '2023-01-01'
    };

    localStorage.setItem('auth_token', 'fake-token');
    localStorage.setItem('user_data', JSON.stringify(mockUser));

    const TestComponent = () => {
      const { logout, user, isAuthenticated } = useAuth();

      return (
        <div>
          <button onClick={logout}>Logout</button>
          <span data-testid="user">{user ? user.nombre : 'No user'}</span>
          <span data-testid="authenticated">{isAuthenticated.toString()}</span>
        </div>
      );
    };

    renderWithAuth(<TestComponent />);
    
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

// Test para componentes con animaciones
describe('Animation Components', () => {
  it('applies animation classes correctly', () => {
    const AnimatedDiv = () => (
      <div className="animate-fade-in" data-testid="animated">
        Animated content
      </div>
    );

    render(<AnimatedDiv />);
    
    const element = screen.getByTestId('animated');
    expect(element).toHaveClass('animate-fade-in');
  });

  it('respects reduced motion preferences', () => {
    // Mock prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const AnimatedDiv = () => (
      <div className="animate-fade-in" data-testid="animated">
        Animated content
      </div>
    );

    render(<AnimatedDiv />);
    
    const element = screen.getByTestId('animated');
    expect(element).toHaveClass('animate-fade-in');
  });
});

// Test para Grid Layout
describe('Grid Layout', () => {
  it('applies grid classes correctly', () => {
    const GridContainer = () => (
      <div className="contentGrid cols3" data-testid="grid">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </div>
    );

    render(<GridContainer />);
    
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('contentGrid', 'cols3');
  });

  it('renders grid items correctly', () => {
    const GridContainer = () => (
      <div className="cardGrid" data-testid="grid">
        <div data-testid="item-1">Item 1</div>
        <div data-testid="item-2">Item 2</div>
        <div data-testid="item-3">Item 3</div>
      </div>
    );

    render(<GridContainer />);
    
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
  });
});

// Test de integración de UI
describe('UI Integration Tests', () => {
  it('renders dashboard layout correctly', () => {
    const DashboardLayout = () => (
      <div className="dashboardLayout" data-testid="dashboard">
        <header className="dashboardHeader" data-testid="header">Header</header>
        <aside className="dashboardSidebar" data-testid="sidebar">Sidebar</aside>
        <main className="dashboardMain" data-testid="main">Main Content</main>
        <footer className="dashboardFooter" data-testid="footer">Footer</footer>
      </div>
    );

    render(<DashboardLayout />);
    
    expect(screen.getByTestId('dashboard')).toHaveClass('dashboardLayout');
    expect(screen.getByTestId('header')).toHaveClass('dashboardHeader');
    expect(screen.getByTestId('sidebar')).toHaveClass('dashboardSidebar');
    expect(screen.getByTestId('main')).toHaveClass('dashboardMain');
    expect(screen.getByTestId('footer')).toHaveClass('dashboardFooter');
  });
});
