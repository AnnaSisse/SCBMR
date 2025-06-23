# Database Setup

## Quick Start

1. **Install MySQL** if not already installed
2. **Create .env.local** file with your database credentials
3. **Run initialization**: `npm run db:init`
4. **Start app**: `npm run dev`

## Environment Variables

Create `.env.local`:
```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=hospital_db
MYSQL_PORT=3306
AES_SECRET_KEY=your_32_byte_hex_key
```

## Available Scripts

- `npm run db:init` - Initialize database with schema and data
- `npm run db:check` - Check database connection
- `npm run db:reset` - Reset database (drop and recreate)
- `npm run db:seed` - Seed with additional data

## Default Login Credentials

- Admin: admin@hospital.com / admin123
- Doctor: doctor@hospital.com / doctor123
- Nurse: nurse@hospital.com / nurse123 