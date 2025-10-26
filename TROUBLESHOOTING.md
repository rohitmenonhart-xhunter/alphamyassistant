# Troubleshooting Guide - MongoDB 500 Errors

## ❌ Issue: 500 Errors from /api/context and /api/conversations

### Root Cause
MongoDB is not connecting properly in production. This is usually because:
1. **MONGODB_URI environment variable is not set** in your deployment platform
2. **MongoDB Network Access is not configured** to allow connections from your deployment
3. **Connection string has incorrect credentials**

## ✅ Solution Steps

### Step 1: Verify Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - Login to [vercel.com](https://vercel.com)
   - Select your project

2. **Check Environment Variables**
   - Go to: Settings → Environment Variables
   - Verify these are ALL set:
     ```
     OPENAI_API_KEY=sk-proj-...
     MONGODB_URI=mongodb+srv://rohit:rohit@chats...
     GROQ_API_KEY=gsk_...
     NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
     ```

3. **If MONGODB_URI is missing:**
   - Click "Add New"
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://rohit:rohit@chats.wu47yno.mongodb.net/?appName=chats`
   - Environment: Production, Preview, Development (check all)
   - Click "Save"

4. **Redeploy**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

### Step 2: Configure MongoDB Atlas Network Access

1. **Go to MongoDB Atlas**
   - Login to [cloud.mongodb.com](https://cloud.mongodb.com)
   - Select your cluster

2. **Network Access**
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - IP: `0.0.0.0/0`
   - Click "Confirm"

   **Note:** This allows connections from any IP (needed for Vercel's dynamic IPs)

3. **Database Access**
   - Click "Database Access" in left sidebar
   - Verify user `rohit` exists
   - Verify it has "Read and write to any database" permission
   - If not, click "Edit" and grant permissions

### Step 3: Test MongoDB Connection

After setting up, test the connection:

1. **Check Vercel Logs**
   - Go to Deployments → Latest → View Function Logs
   - Look for errors like:
     - `MONGODB_URI is not set`
     - `MongoDB connection error`
     - `Authentication failed`

2. **Check Browser Console**
   - Open your deployed site
   - Press F12 (Developer Tools)
   - Go to Console tab
   - Look for:
     - ✅ `System prompt loaded from MongoDB context`
     - ❌ `Failed to load context from server`

## 🔍 Diagnostic Commands

### In Your Deployed Site (Browser Console):

```javascript
// Test API endpoints
fetch('/api/context').then(r => r.json()).then(console.log);
fetch('/api/conversations').then(r => r.json()).then(console.log);

// Check environment
console.log('App URL:', window.location.origin);
```

### In Vercel Function Logs:

Look for these messages:
- ✅ `Context saved to MongoDB successfully`
- ❌ `MONGODB_URI is not set in environment variables`
- ❌ `MongoDB connection error`

## 🎯 Quick Fix Checklist

- [ ] MONGODB_URI is set in Vercel environment variables
- [ ] All 4 environment variables are set (OpenAI, MongoDB, Groq, App URL)
- [ ] MongoDB Network Access allows 0.0.0.0/0
- [ ] MongoDB user has read/write permissions
- [ ] Redeployed after adding environment variables
- [ ] Cleared browser cache and hard refreshed (Ctrl+Shift+R)

## 🚀 After Fixing

Once fixed, your app will:
1. ✅ Load context from MongoDB on page load
2. ✅ Save context to MongoDB when you update settings
3. ✅ Save conversations to MongoDB
4. ✅ No more 500 errors
5. ✅ Full sync between MongoDB and localStorage

## 🛟 Still Having Issues?

### Check Vercel Function Logs:
```bash
# Install Vercel CLI
npm i -g vercel

# View logs
vercel logs YOUR_PROJECT_URL --follow
```

### Test Locally:
```bash
# Add MONGODB_URI to .env.local
echo "MONGODB_URI=your_connection_string" >> .env.local

# Run locally
npm run dev

# Test in browser console
fetch('http://localhost:3000/api/context').then(r => r.json()).then(console.log);
```

### Common Error Messages:

| Error | Solution |
|-------|----------|
| `MONGODB_URI is not set` | Add environment variable in Vercel |
| `MongoServerError: Authentication failed` | Check MongoDB username/password |
| `MongoServerError: user is not allowed` | Grant read/write permissions in MongoDB |
| `connect ETIMEDOUT` | Add 0.0.0.0/0 to MongoDB Network Access |
| `getaddrinfo ENOTFOUND` | Check MongoDB connection string is correct |

## 💡 Important Notes

1. **Environment Variables Take Time**
   - After adding env vars, you MUST redeploy
   - Changes don't apply to existing deployments

2. **MongoDB Connection String**
   - Must include `?appName=chats` at the end
   - Must have correct username:password
   - Use `mongodb+srv://` not `mongodb://`

3. **Fallback Behavior**
   - App now gracefully falls back to localStorage
   - Won't crash if MongoDB is unavailable
   - Will show warnings in console

4. **Testing**
   - Always test in production after deployment
   - Check both browser console and Vercel logs
   - Verify data saves and loads correctly

---

## ✅ Success Indicators

When everything is working:

**Browser Console:**
```
✅ System prompt loaded from MongoDB context
✅ No 500 errors in Network tab
```

**Vercel Logs:**
```
✅ MongoDB connection successful
✅ Context saved to database
✅ Conversations loaded
```

**Your App:**
```
✅ Context loads on page refresh
✅ Settings show your saved data
✅ Conversations persist across sessions
✅ No error messages
```

---

Need more help? Check the [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/) or [Vercel Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables).

