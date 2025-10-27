# 🎯 Complete User Flow Documentation

## Overview

The application now implements a **freemium model** where:
- ✅ **Free users (no login)** can VIEW pages to explore features
- ✅ **Any ACTION** requires login (create, edit, delete, download)
- ✅ **After login**, features unlock based on plan (Free → Pro → Max)

---

## 🌐 Public Pages (No Login Required)

### Homepage (`/`)
- **Access**: Public
- **Actions Available**:
  - ✅ View features
  - ✅ Click "Get Started Free" → `/register`
  - ✅ Click "Sign In" → `/login`
  - ✅ Browse pricing plans

### Dashboard (`/dashboard`)
- **Access**: Public (View Only)
- **What Users See**:
  - **Not Logged In**: 
    - 🎨 Demo banner: "👋 Viewing Demo Dashboard"
    - Login/Sign Up buttons
    - Stats showing demo data
    - Role: GUEST, Plan: FREE
  - **Logged In**:
    - Personal welcome message
    - Real user stats and data
    - Role and plan information
    - Action buttons unlocked

### Projects (`/projects`)
- **Access**: Public (View Only)
- **What Users See**:
  - **Not Logged In**:
    - 🎨 Banner: "🚀 Unlock Project Management"
    - Login/Get Started buttons
    - Empty state with preview
    - "Sign Up to Create" button
  - **Logged In (Free Plan)**:
    - ⚡ Upgrade banner
    - "Upgrade Now" button
    - Cannot create projects
  - **Logged In (Pro/Max)**:
    - Full project management
    - Create/Edit/Delete projects
    - Shows project count and limits

---

## 🔐 Authentication Flow

### Registration (`/register`)

**Step 1: User Fills Form**
```
- Name: John Doe
- Email: user@example.com
- Password: (strong password with requirements)
```

**Step 2: Account Created**
```
✅ User registered
✅ Default plan: FREE
✅ Default role: USER
✅ Automatically logged in
✅ Redirected to: /dashboard
```

**Special Case: Owner Account**
```
If email = drjsde@gmail.com:
✅ Role: OWNER
✅ 2FA: Enabled automatically
✅ Full system access
```

### Login (`/login`)

**Option 1: Email/Password**
```
1. Enter email and password
2. Click "Sign In"
3. If owner → Enter 2FA code from email
4. ✅ Logged in → /dashboard
```

**Option 2: Google OAuth**
```
1. Click "Sign in with Google"
2. Select Google account
3. Grant permissions
4. ✅ Auto-login → /dashboard
```

---

## 🎨 Action-Based Login Prompts

### Scenario 1: Guest Clicks "New Project"
```
Current: /projects (not logged in)
Action: Click "New Project" button
Result: → Redirect to /register?redirect=/projects
```

### Scenario 2: Guest Clicks "Edit" on Project
```
Current: /projects (not logged in)
Action: Click edit button
Result: → Redirect to /login?redirect=/projects
```

### Scenario 3: Free User Tries to Create
```
Current: /projects (logged in, free plan)
Action: Click "New Project"
Result: → Redirect to /settings (upgrade page)
```

### Scenario 4: Paid User Creates Project
```
Current: /projects (logged in, pro/max)
Action: Click "New Project"
Result: ✅ Opens create modal
        ✅ Project created in isolated database
```

---

## 💳 Plan-Based Access Control

### Free Plan (Default)
**Can Access:**
- ✅ View dashboard (read-only)
- ✅ View projects page (read-only)
- ✅ Access shared data (d-admin-free database)
- ✅ Update profile (/settings)

**Cannot Access:**
- ❌ Create projects
- ❌ Edit projects
- ❌ Delete projects
- ❌ Isolated database

**Call to Action:**
- "Upgrade to Pro" buttons everywhere
- Yellow upgrade banners
- Feature limitations clearly shown

### Pro Plan ($29/month)
**How to Upgrade:**
```
1. Login to account
2. Go to /settings
3. Enter account name: "my-company"
4. Click "Upgrade to Pro"
5. ✅ Isolated database created: d-my-company
```

**Unlocks:**
- ✅ Create up to 10 projects
- ✅ Isolated database (d-{accountName})
- ✅ Full CRUD operations
- ✅ Priority support
- ✅ All features

### Max Plan ($99/month)
**How to Upgrade:**
```
1. Login to account
2. Go to /settings
3. Enter account name: "my-startup"
4. Click "Upgrade to Max"
5. ✅ Dedicated database created: d-my-startup
```

**Unlocks:**
- ✅ Create up to 100 projects
- ✅ Dedicated database (d-{accountName})
- ✅ Full CRUD operations
- ✅ 24/7 priority support
- ✅ Advanced features
- ✅ All features

---

## 🔄 Complete User Journey Examples

### Journey 1: Guest → Free User → Paid User

**Step 1: Browse as Guest**
```
1. Visit homepage (/)
2. Click "Get Started Free"
3. → Redirects to /register
```

**Step 2: Register Account**
```
1. Fill registration form
2. Submit
3. ✅ Account created (FREE plan)
4. ✅ Logged in automatically
5. → /dashboard
```

**Step 3: Explore Features**
```
1. View dashboard (personal data shown)
2. Go to /projects
3. Click "New Project"
4. See upgrade banner (FREE plan limitation)
```

**Step 4: Upgrade to Pro**
```
1. Click "Upgrade Now"
2. → /settings
3. Enter account name: "my-company"
4. Click "Upgrade to Pro"
5. ✅ Plan upgraded
6. ✅ Database created: d-my-company
```

**Step 5: Create Projects**
```
1. Go to /projects
2. Click "New Project"
3. ✅ Modal opens (now allowed!)
4. Enter project details
5. Submit
6. ✅ Project created in d-my-company
```

### Journey 2: Direct Purchase Flow

**Step 1: Guest Views Projects**
```
1. Visit /projects (no login)
2. See demo banner
3. Click "Get Started Free"
4. → /register
```

**Step 2: Register & Immediate Upgrade**
```
1. Register account
2. ✅ Logged in
3. See "Upgrade" banner on /projects
4. Click "Upgrade Now"
5. Choose Pro/Max plan
6. ✅ Instant access to features
```

### Journey 3: Owner Access

**Step 1: Register as Owner**
```
1. Visit /register
2. Use email: drjsde@gmail.com
3. Create password
4. Submit
5. ✅ Role: OWNER automatically assigned
6. ✅ 2FA: Enabled automatically
```

**Step 2: Login with 2FA**
```
1. Visit /login
2. Enter credentials
3. See "2FA code sent to email"
4. Check email inbox
5. Enter 6-digit code
6. ✅ Verified & logged in
```

**Step 3: Full System Access**
```
✅ Access all features
✅ Manage all databases
✅ 2FA security enabled
✅ Owner privileges
```

---

## 🎭 Feature Unlocking Matrix

| Feature | Guest (No Login) | Free Plan | Pro Plan | Max Plan |
|---------|-----------------|-----------|----------|----------|
| View Dashboard | ✅ Read-Only | ✅ Personal | ✅ Personal | ✅ Personal |
| View Projects | ✅ Read-Only | ✅ Read-Only | ✅ Full Access | ✅ Full Access |
| Create Projects | ❌ → Login | ❌ → Upgrade | ✅ (10 max) | ✅ (100 max) |
| Edit Projects | ❌ → Login | ❌ → Upgrade | ✅ | ✅ |
| Delete Projects | ❌ → Login | ❌ → Upgrade | ✅ | ✅ |
| Isolated Database | ❌ | ❌ | ✅ d-{account} | ✅ d-{account} |
| Update Profile | ❌ → Login | ✅ | ✅ | ✅ |
| Access Settings | ❌ → Login | ✅ | ✅ | ✅ |

---

## 🚦 Action Triggers & Redirects

### Buttons That Require Login

**"New Project" Button**
```javascript
onClick: 
  if (!user) → /register?redirect=/projects
  else if (user.plan === 'free') → /settings
  else → Show create modal
```

**"Edit" Button**
```javascript
onClick:
  if (!user) → /login?redirect=/projects
  else → Open edit modal
```

**"Delete" Button**
```javascript
onClick:
  if (!user) → /login?redirect=/projects
  else → Confirm & delete
```

**"Upgrade Now" Button**
```javascript
onClick: → /settings
```

**"Get Started Free" Button**
```javascript
onClick: → /register
```

**"Login" Button**
```javascript
onClick: → /login
```

---

## 📱 Mobile & Responsive Behavior

All pages are mobile-responsive:
- ✅ Banners stack vertically
- ✅ Buttons remain accessible
- ✅ Cards adapt to screen size
- ✅ Navigation remains functional

---

## 🎯 Key User Experience Points

### For Guests (No Login)
1. Can explore and preview all pages
2. Clear call-to-actions: "Sign Up" / "Login"
3. Demo banners explain limitations
4. Smooth onboarding flow

### For Free Users
1. Full login experience
2. Clear upgrade prompts
3. Feature limitations explained
4. Easy upgrade path

### For Paid Users
1. Full feature access
2. Isolated database
3. No interruptions
4. Project limits shown clearly

### For Owner
1. Automatic 2FA security
2. Full system privileges
3. Admin capabilities
4. Special access controls

---

## ✅ Testing Checklist

**Guest Flow:**
- [ ] Visit /dashboard without login
- [ ] See demo banner
- [ ] Click any action button
- [ ] Verify redirect to login/register

**Free User Flow:**
- [ ] Register new account
- [ ] See FREE plan assigned
- [ ] Try to create project
- [ ] See upgrade prompt

**Pro/Max Flow:**
- [ ] Upgrade to Pro plan
- [ ] Create projects
- [ ] Edit projects
- [ ] Delete projects
- [ ] Verify isolated database

**Owner Flow:**
- [ ] Register with owner email
- [ ] Receive 2FA email
- [ ] Login with 2FA code
- [ ] Verify owner role
- [ ] Access all features

---

**This flow ensures maximum engagement while maintaining clear upgrade paths! 🚀**
