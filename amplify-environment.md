# Amplify Environment Variables Setup

## Required Environment Variables

Set these in your Amplify Console under App Settings > Environment Variables:

### Database Configuration
```
MYSQL_HOST=your-rds-endpoint.amazonaws.com
MYSQL_USER=your_db_username
MYSQL_PASSWORD=your_db_password
MYSQL_DATABASE=hospital_db
MYSQL_PORT=3306
```

### Security Keys
```
AES_SECRET_KEY=your_32_byte_hex_encryption_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-amplify-domain.amplifyapp.com
```

### Optional: Database SSL (if using RDS)
```
MYSQL_SSL_CA=/path/to/ca-cert.pem
MYSQL_SSL_CERT=/path/to/client-cert.pem
MYSQL_SSL_KEY=/path/to/client-key.pem
```

## How to Set Environment Variables in Amplify Console:

1. Go to AWS Amplify Console
2. Select your app
3. Go to App Settings > Environment Variables
4. Add each variable with its value
5. Save and redeploy

## Generate Required Keys:

### AES Secret Key (32-byte hex):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### NextAuth Secret:
```bash
openssl rand -base64 32
```

## Important Notes:
- Never commit sensitive values to git
- Use different values for different environments (dev/staging/prod)
- Ensure your RDS instance is accessible from Amplify
- Consider using AWS Secrets Manager for production 