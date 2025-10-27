# Production-Ready SaaS Application

A comprehensive Next.js 15+ application with enterprise-grade authentication, role-based access control, and multi-database MongoDB architecture.

## 🚀 Features

### Authentication & Security
- ✅ **Email/Password Authentication** with strong password requirements
- ✅ **Google OAuth Integration** for social login
- ✅ **Two-Factor Authentication (2FA)** via email for owner accounts
- ✅ **JWT-based Session Management** with secure HTTP-only cookies
- ✅ **Password Hashing** using bcrypt
- ✅ **Email Verification** system

### Multi-Database Architecture
- ✅ **d-admin** - Central database for all user accounts and credentials
- ✅ **d-admin-free** - Shared read-only database for free-tier users
- ✅ **Isolated User Databases** - Dedicated databases for Pro/Max users (d-{accountName})
- ✅ **Automatic Database Routing** based on user plan

### Role-Based Access Control (RBAC)
- ✅ **Owner Role** - Full system access with mandatory 2FA
- ✅ **Admin Role** - Administrative privileges
- ✅ **User Role** - Standard user access
- ✅ **Middleware Protection** for routes and API endpoints
- ✅ **Plan-Based Permissions** (Free, Pro, Max)

### Project Management
- ✅ **Create/Read/Update/Delete Projects** (Pro/Max plans)
- ✅ **Plan-Based Limits** (Pro: 10 projects, Max: 100 projects)
- ✅ **Project Isolation** in user-specific databases
- ✅ **Status Tracking** and metadata management

### UI/UX
- ✅ **Modern, Responsive Design** with Tailwind CSS
- ✅ **Gradient Backgrounds** and smooth animations
- ✅ **Loading States** and error handling
- ✅ **Toast Notifications** for user feedback
- ✅ **Mobile-First Approach**

## 📁 Project Structure

```
sass-app/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/                 # Authentication endpoints
│   │   │   │   ├── login/            # Login with email/password
│   │   │   │   ├── register/         # User registration
│   │   │   │   ├── verify-2fa/       # 2FA verification
│   │   │   │   ├── google/           # Google OAuth
│   │   │   │   ├── logout/           # Logout
│   │   │   │   └── me/               # Get current user
│   │   │   ├── user/                 # User management
│   │   │   │   ├── upgrade/          # Plan upgrade
│   │   │   │   └── update/           # Profile update
│   │   │   ├── projects/             # Project CRUD
│   │   │   │   ├── route.ts          # List/Create projects
│   │   │   │   └── [id]/route.ts     # Get/Update/Delete project
│   │   │   └── shared-data/          # Shared data access
│   │   ├── dashboard/                # Dashboard page
│   │   ├── login/                    # Login page
│   │   ├── register/                 # Registration page
│   │   ├── projects/                 # Projects page
│   │   ├── settings/                 # Settings page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   ├── components/                   # React components
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   └── layout/                   # Layout components
│   │       └── Navbar.tsx
│   ├── lib/                          # Utilities and libraries
│   │   ├── auth/                     # Authentication utilities
│   │   │   ├── jwt.ts                # JWT token management
│   │   │   ├── password.ts           # Password hashing/validation
│   │   │   └── twoFactor.ts          # 2FA code generation
│   │   ├── database/                 # Database utilities
│   │   │   ├── connections.ts        # Multi-database connections
│   │   │   └── models/               # Mongoose models
│   │   │       ├── User.ts           # User model (d-admin)
│   │   │       ├── Project.ts        # Project model (user DBs)
│   │   │       └── SharedData.ts     # Shared data (d-admin-free)
│   │   ├── middleware/               # Custom middleware
│   │   │   └── authMiddleware.ts     # API authentication
│   │   ├── services/                 # Business logic
│   │   │   └── emailService.ts       # Email sending (2FA, welcome)
│   │   └── utils.ts                  # General utilities
│   └── middleware.ts                 # Next.js middleware (route protection)
├── .env.local                        # Environment variables
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind CSS config
├── next.config.js                    # Next.js config
└── README.md                         # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Gmail account for email sending (or other SMTP provider)
- Google OAuth credentials (optional)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Environment Variables

The `.env.local` file is already configured with your credentials:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://admin_db:dadsdmin@cluster.35kzjud.mongodb.net/dfdsf-dfadmin?retryWrites=true&w=majority&appName=Cluster

# JWT Secret
JWT_SECRET=drjadmin

# Owner Configuration
OWNER_EMAIL=drjsde@gmail.com

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=81016674dsf4861-oe506bicohrjcnh8dsfi0f516n7s4oah6lb.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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ZV

# Email Configuration (Gmail)
EMAIL_USER=drjsde@gmail.com
EMAIL_PASSWORD=xnjj cedm tsdq hckx

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=drjadmin

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Step 4: Build for Production

```bash
npm run build
npm start
```

## 🗄️ Database Architecture

### Database: `d-admin` (User Management)
**Collections:**
- `users` - All user accounts, credentials, roles, and plans

**Purpose:** Central authentication and user management

### Database: `d-admin-free` (Shared Data)
**Collections:**
- `shareddata` - Read-only data accessible to free users

**Purpose:** Provide common resources to free-tier users

### Database: `d-{accountName}` (User-Specific)
**Collections:**
- `projects` - User's projects and data

**Purpose:** Isolated data storage for Pro/Max users with full CRUD access

## 👤 User Roles & Permissions

### Owner
- Email: `drjsde@gmail.com` (configured in environment)
- Access: Full system access
- 2FA: Mandatory (email-based)
- Database: Can access all databases
- Special: Automatically assigned when registering with OWNER_EMAIL

### Admin
- Access: Administrative privileges
- 2FA: Optional
- Database: Access to d-admin and d-admin-free
- Can manage users (future enhancement)

### User
- Access: Standard user features
- Plans:
  - **Free**: Read-only access to shared data
  - **Pro**: Isolated database, up to 10 projects
  - **Max**: Dedicated database, up to 100 projects

## 📧 Email Features

### 2FA Code Email
- Sent when owner logs in
- 6-digit code
- 10-minute expiration
- HTML-formatted with branding

### Welcome Email
- Sent upon successful registration
- Contains dashboard link
- Professional HTML template

## 🔐 Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### JWT Tokens
- 7-day expiration
- HTTP-only cookies
- Secure flag in production
- Contains user metadata (id, email, role, plan, accountName)

### Middleware Protection
- Route-level protection
- API endpoint authentication
- Role-based access control
- Plan-based feature gating

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production
Update these in your deployment platform:
- Set `NEXTAUTH_URL` to your production domain
- Set `NEXT_PUBLIC_APP_URL` to your production domain
- Ensure all MongoDB URIs are correct
- Verify email credentials are valid

### MongoDB Atlas Setup
1. Create three databases:
   - `dfdsf-dfadmin` (or your d-admin name)
   - `d-admin-free`
   - User databases will be created automatically: `d-{accountName}`
2. Configure IP whitelist (0.0.0.0/0 for cloud hosting)
3. Set up database users with proper permissions

## 🧪 Testing

### Test Accounts

**Owner Account** (2FA Required):
- Email: `drjsde@gmail.com`
- Password: Set during registration
- Role: Owner
- Features: All features + 2FA

**Regular User**:
- Register any email
- Default role: User
- Default plan: Free
- Can upgrade to Pro/Max

### Test Flow

1. **Registration**
   - Visit `/register`
   - Create account with strong password
   - Automatically logged in

2. **Login**
   - Visit `/login`
   - Enter credentials
   - If owner: Enter 2FA code from email

3. **Dashboard**
   - View account stats
   - See plan information
   - Check project count

4. **Upgrade Plan**
   - Visit `/settings`
   - Enter account name
   - Select Pro or Max plan
   - Isolated database created automatically

5. **Create Projects**
   - Visit `/projects` (Pro/Max only)
   - Create new project
   - Data stored in isolated database

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/verify-2fa` - Verify 2FA code
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### User Management
- `PUT /api/user/update` - Update profile
- `POST /api/user/upgrade` - Upgrade plan

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Shared Data
- `GET /api/shared-data` - Get shared data (free users)

## 🎨 UI Components

### Button
Variants: primary, secondary, outline, ghost, danger
Sizes: sm, md, lg
Features: Loading state, disabled state

### Input
Features: Label, error display, validation
Types: text, email, password, etc.

### Card
Components: Card, CardHeader, CardTitle, CardContent
Use: Content containers with consistent styling

## 🔧 Customization

### Adding New Roles
1. Update `User.ts` schema to include new role
2. Add role checks in `middleware.ts`
3. Create role-specific middleware in `authMiddleware.ts`

### Adding New Plans
1. Update `User.ts` schema
2. Modify `upgrade` API route
3. Update plan limits in project routes
4. Add pricing UI in home and settings pages

### Custom Email Templates
Edit `src/lib/services/emailService.ts` to customize:
- Email styles
- Email content
- Additional email types

## 📚 Technologies Used

- **Next.js 15+** - React framework with App Router
- **TypeScript** - Type-safe development
- **MongoDB** - NoSQL database with Mongoose ODM
- **Tailwind CSS** - Utility-first CSS framework
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending
- **Lucide React** - Icon library

## 🤝 Support

For issues or questions:
1. Check this README
2. Review the code comments
3. Check MongoDB connection strings
4. Verify email configuration
5. Test with owner email for 2FA

## 📄 License

This is a production-ready template for SaaS applications. Customize as needed for your use case.

---

**Built with ❤️ using Next.js 15+, TypeScript, and MongoDB**
