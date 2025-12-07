# Vercel Deployment Guide for MindForge

## 🚀 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Code tested locally
- [ ] No console errors in dev
- [ ] All secrets in `.env.local` (never commit)

## 📋 Step-by-Step Deployment

### 1. Prepare GitHub Repository

```bash
# Ensure all changes are committed
git status

# Push to main branch
git push origin main
```

### 2. Connect to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Select your GitHub repository
4. Configure project settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 3. Set Environment Variables in Vercel

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_VAPI_PUBLIC_KEY
VAPI_PRIVATE_KEY
HUGGINGFACE_API_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_APP_URL (set to your Vercel URL)
```

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete (~3-5 minutes)
3. Get your deployment URL

### 5. Post-Deployment Setup

```bash
# Set environment variables for Vercel
vercel env pull

# Run database migrations
npm run db:push
```

### 6. Update Auth Redirects

Go to Clerk Dashboard → Applications → YourApp → Authentication:

Update redirect URLs to your Vercel domain:
- Sign In URL: `https://yourdomain.vercel.app/sign-in`
- Sign Up URL: `https://yourdomain.vercel.app/sign-up`
- After Sign In URL: `https://yourdomain.vercel.app/dashboard`
- After Sign Up URL: `https://yourdomain.vercel.app/onboarding`

## 🔒 Production Security

1. **Enable HTTPS**: Automatic with Vercel
2. **Set Production Environment**: Use Vercel's production environment
3. **Monitor Logs**: Check Vercel dashboard for errors
4. **Set up Alerts**: Configure alerts for failed deployments
5. **Regular Backups**: Supabase handles automated backups

## 🔧 Continuous Deployment

Every time you push to `main`:
1. Vercel automatically builds your project
2. Tests run (if configured)
3. Deployment happens automatically
4. URL stays the same

## 📊 Monitoring & Analytics

### Vercel Dashboard Insights
- Real User Monitoring (RUM)
- Core Web Vitals
- Performance metrics
- Error tracking

### Application Monitoring
- Check Supabase logs for database issues
- Monitor Clerk for auth problems
- Track HuggingFace API usage

## 🆘 Troubleshooting Deployments

### Build Fails
1. Check build logs in Vercel
2. Ensure all environment variables are set
3. Verify Node.js version compatibility
4. Check for missing dependencies

### Runtime Errors
1. Check Vercel function logs
2. Enable "Show Errors" in Vercel dashboard
3. Check browser console for client-side errors

### Database Issues
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set
2. Check Supabase project is active
3. Run migrations: `vercel env pull && npm run db:push`

### Authentication Issues
1. Verify Clerk environment variables
2. Check redirect URLs in Clerk dashboard
3. Clear browser cache and retry

## 📈 Scaling Considerations

### Database
- Supabase includes automatic scaling
- Monitor connection limits
- Consider upgrading plan if needed

### API Rate Limits
- HuggingFace: Check usage limits
- VAPI: Monitor API calls
- Upstash: Check Redis connections

### Storage
- Database backups: Supabase handles
- File uploads: Use Supabase Storage or similar

## 🔄 Rollback Instructions

```bash
# If deployment causes issues:
1. Go to Vercel Dashboard
2. Find previous successful deployment
3. Click "Redeploy" button
4. Verify the rollback was successful
```

## 📝 Environment Variables Reference

| Variable | Source | Purpose |
|----------|--------|---------|
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk | Frontend auth key |
| CLERK_SECRET_KEY | Clerk | Server-side auth |
| NEXT_PUBLIC_SUPABASE_URL | Supabase | Database URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase | Client-side DB access |
| SUPABASE_SERVICE_ROLE_KEY | Supabase | Server-side DB access |
| NEXT_PUBLIC_VAPI_PUBLIC_KEY | VAPI | Voice API key |
| VAPI_PRIVATE_KEY | VAPI | Voice API secret |
| HUGGINGFACE_API_KEY | HuggingFace | LLM access |
| UPSTASH_REDIS_REST_URL | Upstash | Redis endpoint |
| UPSTASH_REDIS_REST_TOKEN | Upstash | Redis auth |

---

**Happy Deploying! 🚀**
