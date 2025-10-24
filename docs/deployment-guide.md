# Referly Deployment Guide

## Overview

This guide covers deploying Referly to production using Vercel, including environment setup, database configuration, and domain setup.

## Prerequisites

- Vercel account
- Supabase account
- Whop developer account
- Domain name (optional)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to your users
3. Set a strong database password
4. Wait for the project to be created

### 1.2 Database Migration

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `docs/supabase-migration.sql`
3. Paste and run the entire script
4. Verify all tables are created successfully

### 1.3 Get Supabase Credentials

1. Go to Settings → API in your Supabase dashboard
2. Copy the following values:
   - Project URL
   - Anon (public) key
   - Service role key (keep this secret!)

## Step 2: Whop Configuration

### 2.1 Create Whop App

1. Go to your [Whop Dashboard](https://dashboard.whop.com)
2. Navigate to Apps → Create App
3. Fill in app details:
   - **Name**: Referly
   - **Description**: Referral and affiliate management system
   - **Redirect URI**: `https://your-domain.com/auth/callback`

### 2.2 Configure OAuth Settings

1. In your Whop app settings, configure:
   - **Allowed Origins**: `https://your-domain.com`
   - **Redirect URIs**: 
     - `https://your-domain.com/auth/callback`
     - `http://localhost:3000/auth/callback` (for development)
   - **Scopes**: `user:read`, `company:read`, `product:read`

### 2.3 Get Whop Credentials

1. Copy your Whop App ID and App Secret
2. These will be used as environment variables

## Step 3: Vercel Deployment

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Choose the repository containing Referly

### 3.2 Configure Build Settings

Vercel should auto-detect Next.js, but verify these settings:

- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

### 3.3 Environment Variables

Add these environment variables in Vercel:

#### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

#### Whop Configuration
```
WHOP_APP_ID=your-whop-app-id
WHOP_APP_SECRET=your-whop-app-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com
```

#### Optional Configuration
```
NODE_ENV=production
```

### 3.4 Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at the Vercel-provided URL

## Step 4: Domain Configuration

### 4.1 Custom Domain (Optional)

1. In Vercel, go to your project settings
2. Navigate to Domains
3. Add your custom domain
4. Configure DNS records as instructed by Vercel

### 4.2 DNS Configuration

If using a custom domain, configure these DNS records:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

## Step 5: Post-Deployment Setup

### 5.1 Update Whop App Settings

1. Update your Whop app's redirect URIs to use your production domain
2. Update allowed origins to include your production domain

### 5.2 Test Deployment

1. Visit your deployed app
2. Test the OAuth flow
3. Create a test campaign
4. Generate a test referral code
5. Verify database operations work

### 5.3 Configure Webhooks (Optional)

If you want to receive webhook notifications:

1. Go to your Whop app settings
2. Add webhook endpoint: `https://your-domain.com/api/webhooks`
3. Configure events you want to receive

## Step 6: Production Optimization

### 6.1 Performance Optimization

1. **Enable Vercel Analytics**
   - Go to your Vercel project settings
   - Enable Web Analytics
   - Monitor performance metrics

2. **Configure Caching**
   - Vercel automatically caches static assets
   - API routes are cached based on headers
   - Consider adding Redis for session storage

3. **Database Optimization**
   - Monitor Supabase performance
   - Add database indexes for frequently queried fields
   - Set up database backups

### 6.2 Security Configuration

1. **Environment Variables**
   - Never commit secrets to Git
   - Use Vercel's environment variable encryption
   - Rotate secrets regularly

2. **CORS Configuration**
   - Configure CORS for your domain
   - Restrict API access to authorized origins

3. **Rate Limiting**
   - Implement rate limiting for API endpoints
   - Monitor for abuse patterns

### 6.3 Monitoring and Logging

1. **Vercel Monitoring**
   - Enable Vercel Speed Insights
   - Monitor function execution times
   - Set up alerts for errors

2. **Supabase Monitoring**
   - Monitor database performance
   - Set up query alerts
   - Review access logs

3. **Application Monitoring**
   - Consider adding Sentry for error tracking
   - Monitor API response times
   - Track user engagement metrics

## Step 7: Backup and Recovery

### 7.1 Database Backups

1. **Supabase Backups**
   - Supabase provides automatic daily backups
   - Configure point-in-time recovery if needed
   - Export data regularly for additional safety

2. **Manual Backups**
   ```sql
   -- Export all data
   pg_dump -h your-supabase-host -U postgres -d postgres > backup.sql
   ```

### 7.2 Code Backups

1. **Git Repository**
   - Ensure all code is in version control
   - Use Git tags for releases
   - Maintain separate branches for staging/production

2. **Environment Configuration**
   - Document all environment variables
   - Keep configuration files in version control
   - Maintain deployment scripts

## Step 8: Scaling Considerations

### 8.1 Database Scaling

1. **Supabase Scaling**
   - Monitor database usage
   - Upgrade Supabase plan as needed
   - Consider read replicas for high traffic

2. **Query Optimization**
   - Add database indexes
   - Optimize slow queries
   - Use connection pooling

### 8.2 Application Scaling

1. **Vercel Scaling**
   - Vercel automatically scales based on traffic
   - Monitor function execution limits
   - Consider Edge Functions for global performance

2. **CDN Configuration**
   - Vercel provides global CDN automatically
   - Optimize images and static assets
   - Use appropriate caching headers

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Review Supabase logs

3. **OAuth Issues**
   - Verify Whop app configuration
   - Check redirect URIs match exactly
   - Ensure HTTPS is used in production

4. **Performance Issues**
   - Monitor Vercel function execution times
   - Check database query performance
   - Review network latency

### Debugging Tools

1. **Vercel CLI**
   ```bash
   npm i -g vercel
   vercel logs your-project-name
   ```

2. **Supabase CLI**
   ```bash
   npm i -g supabase
   supabase status
   ```

3. **Browser DevTools**
   - Check network requests
   - Review console errors
   - Monitor performance metrics

## Maintenance

### Regular Tasks

1. **Weekly**
   - Review error logs
   - Check database performance
   - Monitor user engagement

2. **Monthly**
   - Update dependencies
   - Review security settings
   - Backup important data

3. **Quarterly**
   - Security audit
   - Performance review
   - Plan capacity upgrades

### Updates and Upgrades

1. **Dependency Updates**
   - Regularly update npm packages
   - Test updates in staging environment
   - Deploy updates during low-traffic periods

2. **Feature Updates**
   - Use feature flags for gradual rollouts
   - Monitor user feedback
   - Plan rollback procedures

## Support and Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Whop API Documentation](https://docs.whop.com)

### Community
- Vercel Community Discord
- Supabase Community
- Whop Developer Community

### Professional Support
- Vercel Pro Support
- Supabase Support
- Custom development services

---

*This deployment guide is regularly updated. Check back for the latest best practices and configuration options.*
