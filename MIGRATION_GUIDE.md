# Migration Guide: Switch to Neon Database (Free Forever)

## Why Neon?
- ✅ **Never pauses** (unlike Supabase free tier)
- ✅ PostgreSQL compatible - works with Prisma as-is
- ✅ **No code changes needed**
- ✅ Generous free tier: 512 MB storage
- ✅ Instant cold starts (serverless)

---

## Step 1: Create Neon Account

1. Go to: https://neon.tech
2. Click **"Sign Up"** (use Google/GitHub)
3. Create a new project:
   - **Project name**: IssueTracker
   - **Region**: Choose closest to you (e.g., AWS ap-south-1 for India)
   - **PostgreSQL version**: 16 (latest)
4. Click **"Create Project"**

---

## Step 2: Get Connection String

1. After project creation, you'll see **Connection Details**
2. Copy the **connection string** (it looks like):
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. Keep this handy!

---

## Step 3: Update .env File

Replace your DATABASE_URL with the Neon connection string:

```env
# Database - Neon PostgreSQL (Never Pauses!)
DATABASE_URL="postgresql://your-username:your-password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://your-username:your-password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## Step 4: Run Database Migration

Open terminal and run:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate deploy

# OR reset and migrate from scratch
npx prisma migrate reset
```

---

## Step 5: (Optional) Migrate Existing Data

If you want to keep your old data from Supabase:

### Option A: Manual Export/Import

1. **Export from Supabase** (if project is active):
   ```bash
   # Install pg_dump if not installed
   pg_dump "postgresql://postgres:IssueTrackerSupabase@db.popzznlftmrdzwjosrxr.supabase.co:5432/postgres" > backup.sql
   ```

2. **Import to Neon**:
   ```bash
   psql "your-neon-connection-string" < backup.sql
   ```

### Option B: Use Prisma Studio

1. Open old database: `npx prisma studio` (with old DATABASE_URL)
2. Export data manually
3. Switch to new DATABASE_URL
4. Import data

---

## Step 6: Test Your Application

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
# Test:
# - Create an issue
# - Edit an issue
# - Delete an issue
# - Login with Google
```

---

## Alternative Free Databases (No Pause)

### Railway PostgreSQL
- Website: https://railway.app
- Free: $5 credit/month
- Connection similar to Neon

### PlanetScale MySQL
- Website: https://planetscale.com
- Free: 1 database
- **Need to change schema** from PostgreSQL to MySQL

### MongoDB Atlas (NoSQL)
- Website: https://www.mongodb.com/cloud/atlas
- Free: 512 MB forever
- **Need to change schema and ORM**

---

## Prisma Schema (No Changes Needed!)

Your current `prisma/schema.prisma` works perfectly with Neon:

```prisma
datasource db {
  provider = "postgresql"  // ✅ Same for Neon
  url      = env("DATABASE_URL")
}
```

---

## Keep Your Current Setup Active

To ping database weekly and prevent issues:

```bash
# Run this weekly (or use GitHub Actions)
node scripts/keep-alive.js
```

---

## Troubleshooting

### Error: "Can't reach database server"
- Check connection string is correct
- Ensure `sslmode=require` is in URL
- Check Neon project is active

### Error: "Prisma Client not found"
```bash
npx prisma generate
```

### Error: "Table doesn't exist"
```bash
npx prisma migrate deploy
```

---

## Summary

**Easiest Path:**
1. Create Neon account (2 minutes)
2. Copy connection string
3. Update `.env` file
4. Run `npx prisma migrate deploy`
5. Done! ✅

**No code changes. No ORM changes. Just works!**
