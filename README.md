# New Global Net Foundation

Institutional website, 12 association links, FAQ assistant, and member accounts.

## Deploy on Vercel

1. Import this repository. Framework: **Next.js**. Root directory: repository root.
2. Build command: `npm run build`. Install command: `npm install`. Leave the Output Directory override **disabled** (Next.js default).
3. Node version: **22.x**. Redeploy without build cache if the previous deployment used Vinext.

The public site builds without environment variables. Signup and login show a setup notice until Supabase is configured. This is deliberate: no fake accounts or browser-only member database.

## Enable signup, login and member profiles

1. Create a Supabase project. Run `supabase/schema.sql` once in its SQL Editor. The policies restrict every member to their own record.
2. In Vercel Environment Variables add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the project's Connect/API settings. These are the project URL and publishable key, **not** a service-role key. Add them to production and the desired preview environments. Redeploy.
3. In Supabase Authentication → URL Configuration, set Site URL to your production website URL and allow that URL. Add specific trusted preview URLs if needed.
4. Keep email confirmation enabled. In Authentication → Email Templates → Confirm signup, use a confirmation link in this form:

   `<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Confirm your email</a>`

5. For Reset Password, use:

   `<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery">Reset password</a>`

6. Configure an SMTP sender in Supabase for delivery to real members; Supabase's default email service is restricted. Test signup → confirmation → login → profile save → logout → login → profile edit/delete before inviting members.

Members create accounts using email/password, verify email, and complete their profile. Existing ChatGPT Sites accounts and D1 member records are **not automatically migrated**. This version does not trust incoming ChatGPT identity headers on public hosts.

The dashboard records optional update consent. No email/WhatsApp marketing automation is connected.

## Local development

Use Node 22, `npm install`, copy `.env.example` to `.env.local` and fill in the two Supabase values, then `npm run dev`. Production build: `npm run build`; server: `npm start`.

## Netlify

Use Netlify's Next.js integration, build command `npm run build`, Node 22, and the same environment variables. Do not use the former Vinext `dist` output. This migration was validated with a Next.js production build; provider deployment and live Supabase flows require your account configuration.

Legacy Sites/Cloudflare build files remain in the repository for reference. The default scripts and member APIs now target standard Next.js with Supabase. The currently hosted ChatGPT Site is a separate deployment.
