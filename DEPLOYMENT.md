# Deployment Guide

This guide will help you deploy your SaaS application to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB Atlas databases created
- [ ] Email service configured and tested
- [ ] Google OAuth credentials obtained (optional)
- [ ] Strong JWT secrets generated
- [ ] Owner email configured
- [ ] Domain/subdomain purchased (for production)

## Deployment Platforms

### Option 1: Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/sass-app.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   Go to Project Settings → Environment Variables and add:
   ```
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   OWNER_EMAIL=owner@example.com
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   EMAIL_USER=your-email
   EMAIL_PASSWORD=your-email-password
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your app will be live at `https://your-project.vercel.app`

5. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Option 2: Railway

Railway offers easy deployment with built-in databases.

#### Steps:

1. **Create Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add Environment Variables**
   - Click on your service
   - Go to Variables tab
   - Add all required environment variables

4. **Deploy**
   - Railway will automatically deploy
   - Access via provided URL

### Option 3: DigitalOcean App Platform

For more control and dedicated resources.

#### Steps:

1. **Create App**
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Connect GitHub repository

2. **Configure Build**
   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Add Environment Variables**
   - Add all required variables in App Settings

4. **Deploy**
   - Click "Create Resources"
   - App will be deployed

## MongoDB Atlas Setup

### Create Databases

1. **Log into MongoDB Atlas**
   - Go to [cloud.mongodb.com](https://cloud.mongodb.com)

2. **Create Cluster** (if not already created)
   - Choose your region
   - Select free tier or paid tier based on needs

3. **Create Databases**
   You need three databases:
   - `dfdsf-dfadmin` (main user database) - already in your connection string
   - `d-admin-free` (shared data for free users)
   - User databases will be auto-created as `d-{accountName}`

4. **Configure Network Access**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (for cloud deployments)
   - Or add specific IP addresses of your servers

5. **Database User**
   - Go to Database Access
   - Create user with read/write permissions
   - Use these credentials in MONGODB_URI

### Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority&appName=Cluster
```

Replace:
- `username` - Your database username
- `password` - Your database password
- `cluster.mongodb.net` - Your cluster address
- `database-name` - Your main database name

## Email Configuration

### Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Security → 2-Step Verification
   - Turn on

2. **Generate App Password**
   - Go to Security → App passwords
   - Select "Mail" and "Other"
   - Generate password
   - Use this in `EMAIL_PASSWORD` (format: `xxxx xxxx xxxx xxxx`)

3. **Configure Environment Variables**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### Production Email Services

For production, consider:
- **SendGrid** - Reliable, good free tier
- **AWS SES** - Scalable, cost-effective
- **Mailgun** - Developer-friendly
- **Postmark** - High deliverability

Update `src/lib/services/emailService.ts` accordingly.

## Google OAuth Setup

### Create OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)

2. **Create Project** (if needed)
   - Click "Select a project" → "New Project"
   - Name your project

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://your-domain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:3000` (development)
     - `https://your-domain.com` (production)

5. **Copy Credentials**
   - Copy Client ID → `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - Copy Client Secret → `GOOGLE_CLIENT_SECRET`

## Security Checklist

### Production Security

- [ ] Use strong, unique JWT_SECRET (min 32 characters)
- [ ] Use strong, unique NEXTAUTH_SECRET
- [ ] Never commit `.env.local` to version control
- [ ] Enable HTTPS in production (automatic on Vercel/Railway)
- [ ] Set secure cookie flags (automatic in production)
- [ ] Limit MongoDB network access to specific IPs
- [ ] Use app-specific passwords for email
- [ ] Enable MongoDB IP whitelist
- [ ] Regular security updates: `npm audit fix`
- [ ] Use environment variables for all secrets

### Generate Strong Secrets

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Post-Deployment

### Testing

1. **Test Authentication**
   - Register new account
   - Login with email/password
   - Test Google OAuth (if configured)
   - Test owner 2FA (with OWNER_EMAIL)

2. **Test Database Connections**
   - Verify user data in d-admin
   - Check shared data in d-admin-free
   - Upgrade to Pro/Max and verify isolated database creation

3. **Test Email Delivery**
   - Register account (welcome email)
   - Login as owner (2FA email)
   - Check spam folder if not received

4. **Test Projects**
   - Upgrade to Pro plan
   - Create projects
   - Verify data in isolated database

### Monitoring

Recommended monitoring tools:
- **Vercel Analytics** - Built-in for Vercel deployments
- **Sentry** - Error tracking
- **MongoDB Atlas Monitoring** - Database performance
- **LogRocket** - User session replay

### Performance Optimization

1. **Enable Caching**
   - Vercel Edge Network (automatic)
   - MongoDB connection pooling (already configured)

2. **Optimize Images**
   - Use Next.js Image component
   - Enable image optimization

3. **Database Indexes**
   - Already configured in models
   - Monitor slow queries in MongoDB Atlas

## Scaling Considerations

### Horizontal Scaling
- Vercel automatically scales serverless functions
- Consider upgrading MongoDB cluster for high traffic
- Use Redis for session storage (future enhancement)

### Database Scaling
- MongoDB Atlas auto-scales with paid tiers
- Consider read replicas for high read traffic
- Implement database backups

### CDN & Caching
- Vercel provides global CDN automatically
- Cache static assets
- Implement API response caching

## Troubleshooting

### Common Issues

**Issue: MongoDB Connection Failed**
- Check connection string format
- Verify network access (IP whitelist)
- Confirm database user credentials
- Check if database exists

**Issue: Email Not Sending**
- Verify Gmail app password format
- Check EMAIL_USER and EMAIL_PASSWORD
- Test with different email service
- Check spam folder

**Issue: 2FA Code Not Received**
- Verify EMAIL_USER matches OWNER_EMAIL logic
- Check email service logs
- Confirm 2FA is enabled for owner

**Issue: Google OAuth Failed**
- Verify redirect URIs match exactly
- Check client ID and secret
- Confirm Google+ API is enabled
- Test in incognito mode

**Issue: 404 on API Routes**
- Check Next.js version (needs 15+)
- Verify App Router structure
- Check middleware configuration

## Maintenance

### Regular Tasks

- [ ] Update dependencies monthly: `npm update`
- [ ] Check security vulnerabilities: `npm audit`
- [ ] Monitor database size and performance
- [ ] Review error logs
- [ ] Backup database regularly
- [ ] Test recovery procedures
- [ ] Review and update documentation

### Backup Strategy

1. **MongoDB Backups**
   - Enable continuous backup in MongoDB Atlas
   - Test restore procedures regularly
   - Keep backups for 30+ days

2. **Code Backups**
   - Use Git for version control
   - Regular commits to remote repository
   - Tag releases

## Support & Resources

- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

**Ready to Deploy!** Follow the checklist above and your application will be live in minutes.
