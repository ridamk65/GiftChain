# Supabase Setup for GiftChain

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Click "New Project"
4. Choose organization and enter:
   - **Name**: GiftChain
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you

## 2. Get Your Credentials

After project creation:
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** 
   - **anon/public key**

## 3. Update Environment Variables

Edit `backend/.env`:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Create Database Tables

1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste the contents of `backend/schema.sql`
3. Click **Run**

## 5. Test the Integration

1. Restart your backend: `npm run dev`
2. Create a gift in your frontend
3. Check Supabase **Table Editor** → **gifts** table
4. You should see your gift data stored!

## 6. Benefits

✅ **Persistent storage** - Data survives server restarts
✅ **Real-time updates** - Automatic UI sync
✅ **Scalable** - Handles thousands of users
✅ **Backup & Recovery** - Built-in data protection
✅ **Analytics** - Query gift statistics easily

Your app now uses professional database storage!