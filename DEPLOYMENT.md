# Deployment Guide - Document Management System

This guide provides step-by-step instructions for deploying the Document Management System to production.

## 📋 Pre-Deployment Checklist

- [ ] Database setup complete
- [ ] Environment variables configured
- [ ] Microsoft 365 OAuth configured
- [ ] File storage solution selected
- [ ] Domain name configured (if applicable)
- [ ] SSL certificate configured (if applicable)

## 🗄️ Database Setup

### Option 1: Vercel Postgres (Recommended for Vercel deployment)

1. Go to your Vercel project dashboard
2. Navigate to **Storage** > **Create Database** > **Postgres**
3. Copy the `DATABASE_URL` connection string
4. Add to environment variables

### Option 2: External PostgreSQL/MySQL

1. Set up a PostgreSQL or MySQL database
2. Create a new database: `CREATE DATABASE dms;`
3. Get the connection string
4. Add to environment variables

### Run Migrations

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy
```

## 🔐 Microsoft 365 OAuth Configuration

### 1. Register Application in Azure AD

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in:
   - **Name**: Document Management System
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: 
     - Type: Web
     - URI: `https://your-domain.com/api/auth/callback/azure-ad`

### 2. Configure Application

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Copy the secret value (you won't be able to see it again)

4. Go to **API permissions**
5. Click **Add a permission** > **Microsoft Graph** > **Delegated permissions**
6. Add:
   - `User.Read`
   - `email`
   - `openid`
   - `profile`

7. Click **Grant admin consent**

### 3. Get Required Values

- **Application (client) ID**: Found on the Overview page
- **Directory (tenant) ID**: Found on the Overview page
- **Client secret**: The value you copied earlier

## 🌐 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Import to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **Add New** > **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `pnpm build`
   - **Output Directory**: .next

### 3. Configure Environment Variables

Add the following environment variables in Vercel:

```env
# Database
DATABASE_URL=your_vercel_postgres_url

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_generated_secret

# Microsoft 365 OAuth
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=your_tenant_id
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Deploy

Click **Deploy** and wait for the build to complete.

### 5. Run Database Migrations

After deployment, run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migrations
vercel env pull .env.local
pnpm prisma migrate deploy
```

## 📦 File Storage Configuration

### Option 1: AWS S3

1. **Install dependencies**

```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

2. **Create S3 bucket**

- Go to AWS Console > S3
- Create a new bucket
- Configure CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-domain.com"],
    "ExposeHeaders": []
  }
]
```

3. **Add environment variables**

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

4. **Update upload API** (`src/app/api/upload/route.ts`)

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

// In POST handler:
const command = new PutObjectCommand({
  Bucket: process.env.AWS_S3_BUCKET!,
  Key: uniqueFilename,
  Body: buffer,
  ContentType: file.type
})

await s3Client.send(command)

const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`
```

### Option 2: Azure Blob Storage

1. **Install dependencies**

```bash
pnpm add @azure/storage-blob
```

2. **Create storage account**

- Go to Azure Portal > Storage accounts
- Create a new storage account
- Create a container named `documents`

3. **Add environment variables**

```env
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_STORAGE_CONTAINER=documents
```

4. **Update upload API**

```typescript
import { BlobServiceClient } from '@azure/storage-blob'

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING!
)

const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER!
)

const blockBlobClient = containerClient.getBlockBlobClient(uniqueFilename)
await blockBlobClient.uploadData(buffer)

const fileUrl = blockBlobClient.url
```

### Option 3: Cloudflare R2

1. **Install dependencies**

```bash
pnpm add @aws-sdk/client-s3
```

2. **Create R2 bucket**

- Go to Cloudflare Dashboard > R2
- Create a new bucket
- Create API token

3. **Add environment variables**

```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET=your-bucket-name
```

4. **Update upload API**

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
  }
})

// Same as AWS S3 implementation
```

## 🔒 Security Checklist

- [ ] Environment variables are not committed to Git
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Database credentials are secure
- [ ] File upload size limits are enforced
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (consider Vercel Edge Config)
- [ ] Error messages don't expose sensitive information
- [ ] HTTPS is enforced
- [ ] CSP headers are configured

## 🚀 Post-Deployment Steps

### 1. Create Admin User

Since there's no signup page, you need to manually create the first admin user:

```bash
# Connect to your database
psql $DATABASE_URL

# Insert admin user
INSERT INTO "User" (id, email, name, role, permissions, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@yourdomain.com',
  'Admin User',
  'ADMIN',
  ARRAY['VIEW_DOCUMENTS', 'UPLOAD_DOCUMENTS', 'EDIT_DOCUMENTS', 'DELETE_DOCUMENTS', 'MANAGE_USERS', 'MANAGE_MENUS', 'VIEW_LOGS'],
  NOW(),
  NOW()
);
```

### 2. Seed Initial Data (Optional)

Create departments and academic years:

```sql
-- Insert departments
INSERT INTO "Department" (id, name, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'ฝ่ายบริหาร', NOW(), NOW()),
  (gen_random_uuid(), 'ฝ่ายวิชาการ', NOW(), NOW()),
  (gen_random_uuid(), 'ฝ่ายกิจการนักเรียน', NOW(), NOW());

-- Insert academic years
INSERT INTO "AcademicYear" (id, year, "startDate", "endDate", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), '2566', '2023-05-16', '2024-03-31', NOW(), NOW()),
  (gen_random_uuid(), '2567', '2024-05-16', '2025-03-31', NOW(), NOW());
```

### 3. Test the Application

1. Visit your deployment URL
2. Click **Sign in with Microsoft 365**
3. Authenticate with your admin account
4. Verify all features work correctly

### 4. Monitor and Maintain

- Set up error tracking (e.g., Sentry)
- Monitor database performance
- Set up automated backups
- Monitor file storage usage
- Review activity logs regularly

## 🔄 Updating the Application

### Deploy Updates

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel will automatically deploy
```

### Run New Migrations

```bash
# Create migration locally
pnpm prisma migrate dev --name migration_name

# Push to GitHub
git push origin main

# Run on production
vercel env pull .env.local
pnpm prisma migrate deploy
```

## 🐛 Troubleshooting

### Build Errors

**Error**: `Module not found: Can't resolve '@/libs/prisma'`

**Solution**: Make sure Prisma Client is generated:
```bash
pnpm prisma generate
```

### Database Connection Errors

**Error**: `Can't reach database server`

**Solution**: Check that:
- DATABASE_URL is correct
- Database is accessible from Vercel
- IP whitelist includes Vercel IPs (if applicable)

### Authentication Errors

**Error**: `redirect_uri_mismatch`

**Solution**: 
- Update redirect URI in Azure AD to match your production URL
- Make sure NEXTAUTH_URL matches your deployment URL

### File Upload Errors

**Error**: `ENOENT: no such file or directory`

**Solution**: 
- Implement cloud storage (S3/Azure/R2)
- Local filesystem doesn't work on Vercel

## 📊 Performance Optimization

### 1. Enable Caching

Add caching headers to API routes:

```typescript
export async function GET(request: NextRequest) {
  const data = await fetchData()
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    }
  })
}
```

### 2. Optimize Images

Use Next.js Image component:

```typescript
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority
/>
```

### 3. Enable Compression

Vercel automatically enables gzip/brotli compression.

### 4. Database Optimization

- Add indexes to frequently queried columns
- Use connection pooling
- Implement pagination for large datasets

## 📝 Maintenance Schedule

### Daily
- Monitor error logs
- Check system health

### Weekly
- Review activity logs
- Check storage usage
- Review performance metrics

### Monthly
- Database backup verification
- Security updates
- Performance optimization review

## 🆘 Support

If you encounter issues:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review Vercel deployment logs
3. Check database logs
4. Open an issue on GitHub

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
