# Update Vercel Deployment with Neon Database

## Current Deployment
- URL: https://issue-tracker2-kpuf.vercel.app/
- Status: Using old Supabase database (paused)
- Need: Switch to Neon database

---

## Steps to Update

### Method 1: Via Vercel Dashboard (Recommended - 5 minutes)

#### Step 1: Login to Vercel
1. Go to: https://vercel.com/dashboard
2. Find project: **issue-tracker2-kpuf**
3. Click on it

#### Step 2: Update Environment Variables
1. Click **Settings** (top menu)
2. Click **Environment Variables** (left sidebar)
3. Find and update these variables:

**DATABASE_URL:**
- Click **Edit** or **Add** if not exists
- Value: 
  ```
  postgresql://neondb_owner:npg_KpyVgvnW68Jq@ep-fragrant-boat-aoor9jsf-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
  ```
- Apply to: **Production, Preview, Development** (all)
- Click **Save**

**DIRECT_URL:**
- Click **Edit** or **Add** if not exists
- Value: 
  ```
  postgresql://neondb_owner:npg_KpyVgvnW68Jq@ep-fragrant-boat-aoor9jsf-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
  ```
- Apply to: **Production, Preview, Development** (all)
- Click **Save**

**NEXTAUTH_URL:**
- Value: `https://issue-tracker2-kpuf.vercel.app`
- (Should already be set, just verify)

Keep other variables the same (use your existing values):
- ✅ NEXTAUTH_SECRET (your existing secret)
- ✅ GOOGLE_CLIENT_ID (your existing Google OAuth ID)
- ✅ GOOGLE_CLIENT_SECRET (your existing Google OAuth secret)

#### Step 3: Run Database Migration on Neon

Before redeploying, make sure your Neon database has the schema:

**Run locally:**
```bash
npx prisma migrate deploy
```

You should see:
```
✅ All migrations have been successfully applied.
```

#### Step 4: Redeploy

**Option A: Redeploy from Dashboard**
1. Go to **Deployments** tab
2. Click the **latest deployment**
3. Click **three dots (⋮)** → **Redeploy**
4. Wait 2-3 minutes

**Option B: Push to GitHub** (if connected)
```bash
git add .
git commit -m "Switch to Neon database"
git push origin main
```
Vercel will auto-deploy.

#### Step 5: Verify

1. Visit: https://issue-tracker2-kpuf.vercel.app/
2. Test:
   - ✅ Can you see the homepage?
   - ✅ Can you login?
   - ✅ Can you create an issue?
   - ✅ Can you view issues?

---

### Method 2: Via Vercel CLI (Advanced)

#### Install Vercel CLI
```bash
npm i -g vercel
```

#### Login
```bash
vercel login
```

#### Link Project
```bash
vercel link
```

#### Set Environment Variables
```bash
# Set DATABASE_URL
vercel env add DATABASE_URL production

# When prompted, paste:
postgresql://neondb_owner:npg_KpyVgvnW68Jq@ep-fragrant-boat-aoor9jsf-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# Set DIRECT_URL
vercel env add DIRECT_URL production

# When prompted, paste:
postgresql://neondb_owner:npg_KpyVgvnW68Jq@ep-fragrant-boat-aoor9jsf-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

#### Deploy
```bash
vercel --prod
```

---

## Important Notes

### ⚠️ Database Migration Required

Your Neon database needs the same schema as your old Supabase database.

**Make sure you ran:**
```bash
npx prisma migrate deploy
```

This creates all the tables (Issue, User, Account, Session, etc.) in Neon.

### ⚠️ Data Migration (Optional)

If you had important data in Supabase:

1. **Export from Supabase** (if you can resume it temporarily)
2. **Import to Neon**

Otherwise, you'll start with a fresh database.

### ⚠️ NextAuth Configuration

Make sure in Vercel you have:
```
NEXTAUTH_URL=https://issue-tracker2-kpuf.vercel.app
```

NOT `http://localhost:3000`

---

## Troubleshooting

### Error: "Can't reach database"

**Check:**
1. DATABASE_URL is correct in Vercel
2. No extra spaces or quotes
3. `sslmode=require` is at the end

### Error: "Table doesn't exist"

**Solution:**
```bash
# Run migration locally pointing to Neon
npx prisma migrate deploy
```

### Error: "NextAuth configuration error"

**Check:**
1. NEXTAUTH_URL = https://issue-tracker2-kpuf.vercel.app (not localhost)
2. NEXTAUTH_SECRET is set
3. GOOGLE_CLIENT_ID and SECRET are set

### Error: "Deployment failed"

**Solution:**
1. Check build logs in Vercel
2. Make sure `package.json` has `postinstall: "prisma generate"`
3. Clear Vercel cache and redeploy

---

## Checklist

Before marking as complete:

- [ ] Updated DATABASE_URL in Vercel
- [ ] Updated DIRECT_URL in Vercel
- [ ] Ran `npx prisma migrate deploy` locally
- [ ] Redeployed on Vercel
- [ ] Tested https://issue-tracker2-kpuf.vercel.app/
- [ ] Can login with Google
- [ ] Can create/edit/delete issues
- [ ] No errors in Vercel logs

---

## Expected Result

✅ Your app at https://issue-tracker2-kpuf.vercel.app/ will now use Neon database

✅ Database will NEVER pause (even after weeks of inactivity)

✅ No more "paused project" issues

✅ Everything works the same, just more reliable!

---

## Quick Summary

1. **Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. Update `DATABASE_URL` and `DIRECT_URL` with Neon connection strings
4. **Deployments** → **Redeploy**
5. Wait 2 minutes
6. Test your app!

**Total time: 5-10 minutes**
