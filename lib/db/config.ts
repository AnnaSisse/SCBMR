import mysql from 'mysql2/promise';

// Database configuration with better error handling for Amplify
const getDatabaseConfig = () => {
  const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'hospital_db',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
  };

  // Log configuration (without sensitive data) for debugging
  console.log('Database config:', {
    host: config.host,
    user: config.user,
    database: config.database,
    port: config.port,
    hasPassword: !!config.password
  });

  return config;
};

const pool = mysql.createPool(getDatabaseConfig());

// Test connection on startup
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
    // Don't throw error during build time
    if (process.env.NODE_ENV === 'production') {
      console.warn('Database connection failed in production - continuing without DB');
    }
  });

export default pool; 