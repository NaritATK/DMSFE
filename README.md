# Document Management System (DMS)

A comprehensive document management system built with Next.js 14, TypeScript, Prisma, and Material-UI. This system provides role-based access control for STAFF and ADMIN users with features including document upload, version control, user management, activity logging, and n8n webhook integration.

## 🚀 Features

### STAFF Features
- **Dashboard**: View statistics, charts, storage usage, recent uploads, and activity timeline
- **Upload Documents**: Multi-file upload with drag & drop, file preview, and metadata form
- **Edit Documents**: List, search, edit metadata, replace files with version tracking
- **History**: View document history with advanced filtering, sorting, and pagination

### ADMIN Features
- **User Management**: Add/remove users, assign roles (STAFF/ADMIN), configure permissions and menu access
- **Menu Management**: Create and manage menu structure with tree hierarchy, icons, and role-based visibility
- **Activity Logs**: View detailed activity logs with advanced filtering, sorting, and export functionality
- **n8n Webhook Integration**: Configure webhooks per department, test connections, manage events and custom headers

### System Features
- **Authentication**: Microsoft 365 OAuth (Azure AD) integration
- **Authorization**: Role-based access control with RoleGuard component
- **Role Switching**: ADMIN users can switch between STAFF and ADMIN roles
- **Activity Logging**: Comprehensive audit trail for all user actions
- **Responsive Design**: Mobile-friendly interface with MUI components
- **Dark/Light Mode**: Theme switching support

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Database**: PostgreSQL/MySQL with Prisma ORM
- **Authentication**: NextAuth.js with Microsoft 365 OAuth
- **File Upload**: react-dropzone
- **Icons**: Iconify
- **Styling**: TailwindCSS + MUI Theme

## 🛠️ Installation

### Prerequisites

- Node.js 22.x or higher
- pnpm (recommended) or npm
- PostgreSQL or MySQL database
- Microsoft 365 Azure AD application (for OAuth)

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/NaritATK/DMS_FE.git
cd DMS_FE
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dms"
# or for MySQL:
# DATABASE_URL="mysql://user:password@localhost:3306/dms"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Microsoft 365 OAuth
AZURE_AD_CLIENT_ID="your-client-id"
AZURE_AD_CLIENT_SECRET="your-client-secret"
AZURE_AD_TENANT_ID="your-tenant-id"
```

4. **Set up the database**

```bash
# Generate Prisma Client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev --name init

# (Optional) Seed the database
pnpm prisma db seed
```

5. **Run the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── [lang]/
│   │   ├── (dashboard)/(private)/
│   │   │   ├── dashboard/          # Dashboard page
│   │   │   ├── upload/             # Upload page
│   │   │   ├── edit/               # Edit page
│   │   │   ├── history/            # History page
│   │   │   └── admin/
│   │   │       ├── users/          # User management
│   │   │       ├── menus/          # Menu management
│   │   │       ├── logs/           # Activity logs
│   │   │       └── webhooks/       # Webhook integration
│   │   └── (blank-layout-pages)/
│   │       └── login/              # Login page
│   └── api/
│       ├── documents/              # Document CRUD API
│       ├── upload/                 # File upload API
│       ├── users/                  # User management API
│       ├── menus/                  # Menu management API
│       ├── webhooks/               # Webhook API
│       └── logs/                   # Activity logs API
├── components/
│   ├── auth/
│   │   └── RoleGuard.tsx          # Role-based access control
│   ├── documents/
│   │   └── FileDropzone.tsx       # Drag & drop file upload
│   └── layout/
│       └── RoleSwitcher.tsx       # Role switching for ADMIN
├── views/
│   ├── dashboard/                  # Dashboard components (6)
│   ├── upload/                     # Upload components (1)
│   ├── edit/                       # Edit components (2)
│   ├── history/                    # History components (3)
│   └── admin/
│       ├── users/                  # User management components (3)
│       ├── menus/                  # Menu management components (3)
│       ├── logs/                   # Logs components (3)
│       └── webhooks/               # Webhook components (4)
├── hooks/
│   ├── useAuth.ts                 # Authentication hook
│   ├── useRole.ts                 # Role checking hook
│   └── useActivityLog.ts          # Activity logging hook
├── libs/
│   ├── auth.ts                    # NextAuth configuration
│   └── prisma.ts                  # Prisma client singleton
├── types/
│   ├── dms.ts                     # DMS type definitions
│   └── next-auth.d.ts             # Extended NextAuth types
└── prisma/
    └── schema.prisma              # Database schema
```

## 🗄️ Database Schema

### Models

- **User**: User accounts with role and permissions
- **Account**: OAuth account information
- **Session**: User sessions
- **Document**: Document metadata
- **DocumentVersion**: Document version history
- **Menu**: Menu structure with tree hierarchy
- **WebhookConfig**: n8n webhook configurations
- **ActivityLog**: Comprehensive activity audit trail
- **Department**: Department information
- **AcademicYear**: Academic year information

## 🔐 Authentication & Authorization

### Microsoft 365 OAuth Setup

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Set redirect URI to `http://localhost:3000/api/auth/callback/azure-ad`
5. Copy **Application (client) ID**, **Directory (tenant) ID**, and create a **Client secret**
6. Add these values to your `.env` file

### Roles

- **STAFF**: Can upload, edit, and view documents
- **ADMIN**: Has all STAFF permissions plus user management, menu management, logs, and webhooks

### Permissions

- `VIEW_DOCUMENTS`: View documents
- `UPLOAD_DOCUMENTS`: Upload new documents
- `EDIT_DOCUMENTS`: Edit document metadata
- `DELETE_DOCUMENTS`: Delete documents
- `MANAGE_USERS`: Manage users (ADMIN only)
- `MANAGE_MENUS`: Manage menus (ADMIN only)
- `VIEW_LOGS`: View activity logs (ADMIN only)

## 📡 API Routes

### Documents
- `GET /api/documents` - List documents with filters
- `POST /api/documents` - Create new document
- `GET /api/documents/[id]` - Get document by ID
- `PATCH /api/documents/[id]` - Update document
- `DELETE /api/documents/[id]` - Delete document

### Upload
- `POST /api/upload` - Upload file (max 50MB)

### Users (ADMIN only)
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Menus (ADMIN only)
- `GET /api/menus` - List menus
- `POST /api/menus` - Create menu
- `PATCH /api/menus/[id]` - Update menu
- `DELETE /api/menus/[id]` - Delete menu

### Webhooks (ADMIN only)
- `GET /api/webhooks` - List webhooks
- `POST /api/webhooks` - Create webhook
- `PATCH /api/webhooks/[id]` - Update webhook
- `DELETE /api/webhooks/[id]` - Delete webhook
- `POST /api/webhooks/[id]/test` - Test webhook

### Logs (ADMIN only)
- `GET /api/logs` - List activity logs with filtering

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

```bash
git push origin main
```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click **Import Project**
   - Select your GitHub repository
   - Configure environment variables
   - Deploy

3. **Set up database**
   - Use Vercel Postgres or external database
   - Run migrations: `pnpm prisma migrate deploy`

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
AZURE_AD_CLIENT_ID="your-client-id"
AZURE_AD_CLIENT_SECRET="your-client-secret"
AZURE_AD_TENANT_ID="your-tenant-id"
```

### File Storage for Production

⚠️ **Important**: The current implementation uses local filesystem for file storage, which is **not suitable for production**.

For production, use cloud storage:

**AWS S3**:
```bash
pnpm add @aws-sdk/client-s3
```

**Azure Blob Storage**:
```bash
pnpm add @azure/storage-blob
```

**Cloudflare R2**:
```bash
pnpm add @aws-sdk/client-s3
```

Update `/src/app/api/upload/route.ts` to use your chosen storage provider.

## 🧪 Testing

```bash
# Run tests (if configured)
pnpm test

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

## 📝 Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm prisma generate  # Generate Prisma Client
pnpm prisma migrate dev  # Run migrations (development)
pnpm prisma migrate deploy  # Run migrations (production)
pnpm prisma studio    # Open Prisma Studio

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Material-UI](https://mui.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Vercel](https://vercel.com/)

## 📧 Support

For support, email support@example.com or open an issue on GitHub.

## 🔗 Links

- [Documentation](https://github.com/NaritATK/DMS_FE/wiki)
- [Issue Tracker](https://github.com/NaritATK/DMS_FE/issues)
- [Changelog](https://github.com/NaritATK/DMS_FE/releases)
