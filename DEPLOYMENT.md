# Alpha - Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Files Created
- [x] `.gitignore` - Protects sensitive files
- [x] `.env.example` - Template for environment variables
- [x] `.env.local` - Local environment variables (DO NOT COMMIT!)

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Alpha Personal Assistant"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   In Vercel Dashboard → Settings → Environment Variables, add:
   ```
   OPENAI_API_KEY=your_key_here
   MONGODB_URI=your_mongodb_uri_here
   GROQ_API_KEY=your_groq_key_here
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live!

5. **Update .env.local for Production**
   - Copy your Vercel URL (e.g., `https://alpha-rohit.vercel.app`)
   - Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables

### Option 2: Netlify

1. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment Variables**
   Same as Vercel (add in Netlify Dashboard)

3. **Deploy**
   - Connect GitHub repo
   - Deploy automatically

### Option 3: Railway / Render

Similar process:
1. Connect GitHub
2. Add environment variables
3. Deploy

## 🔐 Security Checklist

### Before Pushing to GitHub:

- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys in code files
- [ ] `.env.example` has placeholder values only
- [ ] MongoDB connection string is secure

### Verify .gitignore is working:
```bash
git status
# Should NOT show .env.local
```

## 📝 Environment Variables Explained

### Required for Production:

1. **OPENAI_API_KEY**
   - Get from: [platform.openai.com](https://platform.openai.com)
   - Used for: Chat responses

2. **MONGODB_URI**
   - Your existing: `mongodb+srv://rohit:rohit@chats.wu47yno.mongodb.net/?appName=chats`
   - Used for: Storing conversations and context

3. **GROQ_API_KEY**
   - Your existing key
   - Used for: Voice transcription

4. **NEXT_PUBLIC_APP_URL**
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.vercel.app`
   - Used for: API calls and redirects

## 🔄 Updating After Deployment

### To Update Your Live App:

1. **Make changes locally**
   ```bash
   # Make your changes
   npm run build  # Test build locally
   npm start      # Test production build
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

3. **Auto-Deploy**
   - Vercel/Netlify will auto-deploy
   - Usually takes 2-3 minutes

## 🌐 Custom Domain (Optional)

### On Vercel:

1. Go to Project → Settings → Domains
2. Add your domain (e.g., `alpha.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## 🐛 Troubleshooting

### Build Fails

**Problem:** "Module not found"
```bash
# Solution:
rm -rf node_modules package-lock.json
npm install
```

**Problem:** "Environment variable not defined"
- Check all variables are added in deployment platform
- Redeploy after adding variables

### MongoDB Connection Issues

**Problem:** "MongoServerError: Authentication failed"
- Verify MongoDB URI is correct
- Check MongoDB Network Access (allow 0.0.0.0/0 for cloud deployments)
- Ensure database user has correct permissions

### API Calls Failing

**Problem:** "Failed to fetch"
- Check `NEXT_PUBLIC_APP_URL` is set correctly
- Ensure all API keys are valid
- Check browser console for specific errors

## 📊 Monitoring

### Check Your Deployment:

1. **Vercel Dashboard**
   - View deployment logs
   - Check build status
   - Monitor API usage

2. **MongoDB Atlas**
   - Monitor database connections
   - Check storage usage
   - View query performance

3. **OpenAI Dashboard**
   - Monitor API usage
   - Check token consumption
   - Set usage limits

## 💰 Cost Considerations

### Free Tiers:

- **Vercel**: Free for personal projects
- **MongoDB Atlas**: 512MB free forever
- **OpenAI**: Pay-as-you-go (monitor usage)
- **Groq**: Free tier available

### Estimated Monthly Costs:
- Hosting: $0 (Vercel free tier)
- Database: $0 (MongoDB free tier)
- OpenAI: $5-20 (depending on usage)
- Groq: $0-5 (depending on transcription volume)

## 🔒 Production Recommendations

1. **Set up usage alerts** on OpenAI dashboard
2. **Enable MongoDB backup** (optional but recommended)
3. **Use environment-specific API keys** (dev vs prod)
4. **Monitor error logs** in Vercel
5. **Set up custom domain** for professional look

## 📞 Support

If you encounter issues:
1. Check Vercel/Netlify logs
2. Check browser console
3. Verify all environment variables
4. Test API keys separately

---

## Quick Deploy Commands

```bash
# Initialize Git (if not already done)
git init

# Add .gitignore (already created)
# Verify .env.local is ignored
git status

# Commit everything
git add .
git commit -m "Initial commit - Alpha Personal Assistant"

# Push to GitHub
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main

# Deploy to Vercel
# Use Vercel dashboard or CLI:
npm i -g vercel
vercel
```

**Your Alpha assistant is ready for the world! 🚀**

