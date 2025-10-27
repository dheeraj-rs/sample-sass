# How to Login

## Quick Start

The app is now running at: **http://localhost:3000**

---

## 🔐 Login as Owner (with 2FA)

### Step 1: Register as Owner
1. Go to: http://localhost:3000/register
2. Use the owner email: **drjsde@gmail.com**
3. Create a strong password (must meet requirements)
4. Click "Create Account"

### Step 2: Login with 2FA
1. Go to: http://localhost:3000/login
2. Enter credentials:
   - **Email**: drjsde@gmail.com
   - **Password**: (your password from registration)
3. Click "Sign In"
4. You'll see: "2FA code sent to your email"
5. Check your email inbox for the 6-digit code
6. Enter the code
7. Click "Verify Code"
8. ✅ You're now logged in as Owner!

**Owner Benefits:**
- ✅ 2FA security enabled automatically
- ✅ Full system access
- ✅ Can access all features
- ✅ Role: OWNER

---

## 👤 Login as Regular User

### Option 1: Email/Password
1. Go to: http://localhost:3000/register
2. Use any email (not the owner email)
3. Create password
4. Click "Create Account"
5. ✅ Logged in immediately!

### Option 2: Google OAuth
1. Go to: http://localhost:3000/login
2. Click "Sign in with Google"
3. Select your Google account
4. Grant permissions
5. ✅ Logged in via Google!

**Regular User Benefits:**
- Default plan: FREE
- Role: USER
- Can view dashboard
- Can upgrade to Pro/Max for full features

---

## 🎯 Demo/Guest Mode (No Login Required)

### View Without Login
1. Go to: http://localhost:3000/dashboard
2. You'll see a demo banner
3. View all features in read-only mode
4. Click any action → Login prompt appears

**What You Can Do:**
- ✅ View dashboard layout
- ✅ See feature previews
- ✅ Explore UI
- ❌ Cannot download or take actions
- ❌ Cannot create projects

**To Unlock Full Access:**
- Click "Login" or "Sign Up Free" buttons
- Register an account
- Start using all features

---

## 📧 Testing 2FA Email

If 2FA email doesn't arrive:

1. **Check Spam Folder** - Gmail might filter it
2. **Verify Email Config** in `.env.local`:
   ```
   EMAIL_USER=drjsde@gmail.com
   EMAIL_PASSWORD=xnjj cedm tsdq hckx
   ```
3. **Check Console** - Look for "Email sent" message
4. **Test Email** - Try registering with a different email first

---

## 🔄 Google OAuth Setup

### Current Status
✅ **Fixed!** Google OAuth now works properly.

### How It Works
1. Click "Sign in with Google"
2. Redirects to Google login
3. Google redirects back to: `/api/auth/google/callback`
4. System creates/updates user account
5. Logs you in automatically

### If It Doesn't Work
- Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local`
- Check `GOOGLE_CLIENT_SECRET` in `.env.local`
- Verify redirect URI in Google Cloud Console:
  - Should be: `http://localhost:3000/api/auth/google/callback`

---

## 🎨 Test Different Plans

### Free Plan (Default)
```
1. Register any account
2. Default plan: FREE
3. Can view shared data
4. Cannot create projects
```

### Pro Plan ($29/month)
```
1. Login to your account
2. Go to: /settings
3. Enter account name: "my-company"
4. Click "Upgrade to Pro"
5. ✅ You now have isolated database!
6. Create up to 10 projects
```

### Max Plan ($99/month)
```
1. Login to your account
2. Go to: /settings
3. Enter account name: "my-startup"
4. Click "Upgrade to Max"
5. ✅ Dedicated database created!
6. Create up to 100 projects
```

---

## 🐛 Troubleshooting

### "Login not working"
- Clear browser cookies
- Try incognito mode
- Check MongoDB connection
- Verify .env.local file exists

### "Google OAuth shows alert"
- **FIXED!** Refresh the page and try again

### "2FA code not received"
- Check spam folder
- Wait 1-2 minutes
- Verify EMAIL_USER and EMAIL_PASSWORD
- Check if Gmail allows less secure apps

### "Cannot access dashboard"
- Dashboard is now public! Just visit /dashboard
- No login required to view
- Login only required for actions

---

## ✨ Features to Test

### Authentication
- ✅ Email/Password registration
- ✅ Email/Password login
- ✅ Google OAuth
- ✅ Owner 2FA
- ✅ JWT sessions
- ✅ Secure cookies

### Access Control
- ✅ Public homepage
- ✅ Free dashboard access (no login)
- ✅ Login required for actions
- ✅ Plan-based features
- ✅ Role-based permissions

### Projects
- ✅ Create (Pro/Max only)
- ✅ View list
- ✅ Update
- ✅ Delete
- ✅ Isolated databases

### Settings
- ✅ Update profile
- ✅ Upgrade plan
- ✅ View 2FA status

---

## 🚀 Quick Test Flow

1. **Guest Mode**: Visit /dashboard (no login)
2. **Register**: Create account at /register
3. **Dashboard**: See your personal dashboard
4. **Upgrade**: Go to /settings, upgrade to Pro
5. **Projects**: Create projects at /projects
6. **Owner**: Register with drjsde@gmail.com for 2FA

---

## 📞 Need Help?

- Check `README.md` for full documentation
- Check `DEPLOYMENT.md` for deployment guide
- View console logs for errors
- Check MongoDB Atlas connection
- Verify all environment variables

**App is ready to use! Start exploring! 🎉**
