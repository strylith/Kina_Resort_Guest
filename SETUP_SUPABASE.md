# How to Add This Project to Your Supabase Account

This guide will walk you through setting up this project with your own Supabase account.

## Prerequisites

1. A Supabase account (create one at https://supabase.com if you don't have one)
2. Node.js installed on your machine

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in (or create an account)
2. Click **"New Project"** or **"New Organization"** if you don't have one
3. Fill in the project details:
   - **Project Name**: e.g., "Kina Resort Guest"
   - **Database Password**: Create a strong password (save this securely)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Select Free tier for testing, or paid for production
4. Click **"Create new project"** and wait for it to be provisioned (usually 1-2 minutes)

## Step 2: Get Your Supabase Credentials

Once your project is ready:

1. In your Supabase project dashboard, go to **Settings** (gear icon) → **API**
2. You'll find the following credentials:
   - **Project URL** (this is your `SUPABASE_URL`)
   - **anon public** key (this is your `SUPABASE_ANON_KEY`)
   - **service_role** key (this is your `SUPABASE_SERVICE_ROLE_KEY` - keep this secret!)

**Important**: The `service_role` key has admin privileges and bypasses Row Level Security (RLS). Never expose it in client-side code!

## Step 3: Create Environment Variables File

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Create a `.env` file:
   ```bash
   touch .env
   ```

3. Add your Supabase credentials to the `.env` file:
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   SUPABASE_ANON_KEY=your-anon-key-here

   # Optional: Other environment variables
   NODE_ENV=development
   PORT=3000

   # Optional: If you want to use mock database for testing
   USE_MOCK_DB=false
   ```

   Replace:
   - `https://your-project-id.supabase.co` with your actual Project URL
   - `your-service-role-key-here` with your actual service_role key
   - `your-anon-key-here` with your actual anon public key

**Note**: The `.env` file is (or should be) in `.gitignore` and won't be committed to version control.

## Step 4: Set Up Database Schema

You need to run SQL scripts in your Supabase project to create the necessary tables and configurations.

### 4a. Run Initial Setup SQL

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `server/supabase-setup.sql` from this project
4. Copy and paste the entire contents into the SQL Editor
5. Click **"Run"** (or press `Ctrl+Enter`)
6. Verify the tables were created by checking **Table Editor** in the sidebar

This script creates:
- `users` table (extends Supabase Auth)
- `packages` table (rooms, cottages, function halls)
- `bookings` table
- `reservations_calendar` table
- `admin_settings` table
- Row Level Security (RLS) policies
- Indexes for performance
- Sample package data

### 4b. Run Booking Setup SQL

1. Still in **SQL Editor**, create a new query
2. Open `server/supabase-bookings-setup.sql` from this project
3. Copy and paste the contents into the SQL Editor
4. Click **"Run"**

This adds booking terms and additional columns to the bookings table.

### 4c. Run Migration Scripts (Optional but Recommended)

If you want the full booking functionality, run these migrations:

1. **Run `server/migration-add-booking-fields.sql`**:
   - Creates additional columns for detailed booking data
   - Converts `guests` column to JSONB format

2. **Run `server/migration-restructure-booking-items.sql`** (optional):
   - Creates a `booking_items` table for more structured booking data
   - Migrates existing JSON data to normalized table structure

## Step 5: Install Dependencies and Test

1. Install npm packages:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

   Or in production:
   ```bash
   npm start
   ```

3. Check the console output - you should see:
   ```
   🔗 Initializing Supabase connection...
   ✅ Supabase connection established
   ```

If you see an error about missing environment variables, double-check your `.env` file.

## Step 6: Verify Setup

1. **Test Database Connection**:
   - The server should start without errors
   - Check the console logs for connection confirmation

2. **Check Tables in Supabase**:
   - Go to **Table Editor** in your Supabase dashboard
   - You should see: `users`, `packages`, `bookings`, `reservations_calendar`, `admin_settings`

3. **Verify Sample Data**:
   - In **Table Editor**, click on the `packages` table
   - You should see 9 sample packages (rooms, cottages, function halls)

## Troubleshooting

### Error: "Missing Supabase environment variables"

- Make sure your `.env` file is in the `server` directory
- Verify that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set correctly
- Check for any extra spaces or quotes in your `.env` file

### Error: "Invalid API key" or connection errors

- Double-check that you copied the keys correctly from Supabase dashboard
- Make sure you're using the `service_role` key (not `anon` key) for `SUPABASE_SERVICE_ROLE_KEY`
- Verify your project is active and not paused

### SQL Script Errors

- Make sure you run scripts in order: `supabase-setup.sql` first, then `supabase-bookings-setup.sql`
- If you get "already exists" errors, that's okay - the scripts use `IF NOT EXISTS`
- Check the SQL Editor error messages for specific issues

### RLS Policy Issues

- Row Level Security is enabled by default
- The service role key bypasses RLS, so your backend should work fine
- If you need to adjust RLS policies, go to **Authentication** → **Policies** in Supabase dashboard

## Security Notes

1. **Never commit `.env` file to git** - it contains sensitive credentials
2. **Service Role Key** has admin access - only use it in backend/server code
3. **Anon Key** is safe for client-side code, but RLS policies will still apply
4. In production, use environment variables provided by your hosting platform instead of `.env` files

## Next Steps

- Create test users via the Supabase Auth dashboard or using `server/create-test-users.js`
- Customize the sample packages in the `packages` table
- Configure email templates in Supabase for authentication emails
- Set up storage buckets if you need file uploads

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

