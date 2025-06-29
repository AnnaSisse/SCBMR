# Amplify Deployment Fix Guide

## Issues Fixed

### 1. Missing Amplify Configuration
- ✅ Created `amplify.yml` build specification
- ✅ Configured proper build phases and artifacts
- ✅ Added caching configuration

### 2. Next.js Configuration Issues
- ✅ Updated `next.config.mjs` for Amplify compatibility
- ✅ Added `output: 'standalone'` for better deployment
- ✅ Disabled problematic features during build

### 3. Environment Variables
- ✅ Created environment setup guide
- ✅ Added graceful error handling for missing variables
- ✅ Created health check API endpoint

### 4. Database Connection Issues
- ✅ Updated database config with better error handling
- ✅ Added connection testing with graceful fallbacks
- ✅ Prevented build failures from database issues

## Required Environment Variables

Set these in Amplify Console > App Settings > Environment Variables:

### Essential Variables
```
NODE_ENV=production
NEXTAUTH_URL=https://your-amplify-domain.amplifyapp.com
NEXTAUTH_SECRET=your_generated_secret_here
AES_SECRET_KEY=your_32_byte_hex_key_here
```

### Database Variables (if using RDS)
```
MYSQL_HOST=your-rds-endpoint.amazonaws.com
MYSQL_USER=your_db_username
MYSQL_PASSWORD=your_db_password
MYSQL_DATABASE=hospital_db
MYSQL_PORT=3306
```

## Generate Required Keys

### AES Secret Key (32-byte hex):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### NextAuth Secret:
```bash
openssl rand -base64 32
```

## Deployment Steps

1. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "Fix Amplify deployment issues"
   git push origin main
   ```

2. **Set Environment Variables in Amplify Console**
   - Go to AWS Amplify Console
   - Select your app
   - Navigate to App Settings > Environment Variables
   - Add all required variables

3. **Redeploy**
   - Amplify will automatically trigger a new build
   - Monitor the build logs for any remaining issues

## Health Check

After deployment, visit:
```
https://your-domain.amplifyapp.com/api/health
```

This will show:
- System status
- Environment configuration
- Database connection status
- Missing environment variables

## Troubleshooting

### Build Still Failing?
1. Check build logs for specific error messages
2. Ensure all environment variables are set
3. Verify database connectivity (if using RDS)
4. Check that your RDS security group allows Amplify connections

### Database Connection Issues?
1. Ensure RDS instance is publicly accessible
2. Check security group rules
3. Verify database credentials
4. Test connection from a local environment

### Environment Variables Not Loading?
1. Check variable names (case-sensitive)
2. Ensure variables are set for the correct branch
3. Redeploy after setting variables
4. Check Amplify Console for variable status

## Monitoring

The application now includes:
- ✅ Real-time system status indicator
- ✅ Health check API endpoint
- ✅ Graceful error handling
- ✅ Deployment status alerts

## Support

If issues persist:
1. Check the health endpoint for detailed status
2. Review Amplify build logs
3. Verify all environment variables are correctly set
4. Test database connectivity independently 