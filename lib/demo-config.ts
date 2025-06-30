// Demo configuration for when database is not available
export const DEMO_CONFIG = {
  // Demo user credentials
  demoUser: {
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'doctor',
    department: 'General',
    phone: '1234567890'
  },
  
  // Demo mode indicators
  isDemoMode: () => {
    const dbHost = process.env.MYSQL_HOST;
    return !dbHost || dbHost === 'localhost';
  },
  
  // Create demo user data
  createDemoUser: (userData: any) => ({
    user_id: Date.now(),
    first_name: userData.name?.split(' ')[0] || 'Demo',
    last_name: userData.name?.split(' ').slice(1).join(' ') || 'User',
    email: userData.email,
    role: userData.role,
    phone: userData.phone,
    department: userData.department,
    created_at: new Date().toISOString()
  }),
  
  // Demo mode messages
  messages: {
    demoMode: 'Demo Mode: Database not configured. Data stored locally.',
    demoLogin: 'For demo login, use: demo@example.com / demo123',
    demoRegistration: 'Registration successful! (Demo mode - no database configured)',
    databaseError: 'Database connection failed. Using demo mode.'
  }
};

// Helper function to check if we should use demo mode
export const shouldUseDemoMode = () => {
  if (typeof window !== 'undefined') {
    // Client-side: check if we're in a demo environment
    return window.location.hostname.includes('amplifyapp.com') || 
           window.location.hostname.includes('localhost');
  }
  // Server-side: check environment variables
  return DEMO_CONFIG.isDemoMode();
}; 