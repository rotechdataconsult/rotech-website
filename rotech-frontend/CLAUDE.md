# Rotech Frontend

## Project Overview
Frontend for the Rotech Data Consult website. Built with Next.js (App Router).

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4
- **Backend/DB**: Supabase (`@supabase/supabase-js`)
- **Linting**: ESLint 9

## Project Structure
```
app/
  admin/        # Admin pages
  auth/         # Auth pages (login, signup, etc.)
  courses/      # Courses pages
  dashboard/    # User dashboard
  datasets/     # Datasets pages
  layout.js     # Root layout
  page.js       # Home page
  globals.css   # Global styles
lib/
  supabase.js   # Supabase client setup
public/         # Static assets
```

## Common Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Conventions
- Use App Router file conventions (`page.js`, `layout.js`, `loading.js`, etc.)
- Tailwind CSS for all styling — no CSS modules or inline styles
- Supabase client imported from `lib/supabase.js`
- JavaScript (not TypeScript)
