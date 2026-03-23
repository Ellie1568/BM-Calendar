# Google Calendar OAuth2 Setup Guide

You only need to do this once. After setup you'll have four values to paste into your OpenClaw config.

---

## Step 1: Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **Select a project → New Project**
3. Give it any name (e.g. `openclaw-calendar`) → **Create**

---

## Step 2: Enable Google Calendar API

1. In the left menu: **APIs & Services → Library**
2. Search for **Google Calendar API** → click it → **Enable**

---

## Step 3: Configure OAuth Consent Screen

1. **APIs & Services → OAuth consent screen**
2. User type: choose **External** (works for personal Gmail) → **Create**
3. Fill in:
   - App name: anything (e.g. `OpenClaw Calendar`)
   - User support email: your Gmail
   - Developer contact: your Gmail
4. Click through **Scopes** and **Test users** screens (no changes needed, just Save & Continue)
5. On the **Test users** step: click **Add users** → add your own Gmail address → Save

---

## Step 4: Create OAuth2 Credentials

1. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
2. Application type: **Desktop app**
3. Name: anything → **Create**
4. Copy the **Client ID** and **Client Secret** — these are `GCAL_CLIENT_ID` and `GCAL_CLIENT_SECRET`

---

## Step 5: Get a Refresh Token

Open this URL in your browser (replace `YOUR_CLIENT_ID`):

```
https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost&response_type=code&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent
```

1. Sign in with your Google account → Allow
2. You'll be redirected to `http://localhost/?code=4/0A...` — copy the `code=` value
3. Run this curl command (replace the placeholders):

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=YOUR_CODE \
  -d grant_type=authorization_code \
  -d redirect_uri=http://localhost
```

4. The response contains `"refresh_token": "1//..."` — this is `GCAL_REFRESH_TOKEN`

---

## Step 6: Get Your Calendar ID

1. Go to [calendar.google.com](https://calendar.google.com)
2. On the left, find the calendar you want → click the three dots → **Settings and sharing**
3. Scroll down to **Integrate calendar** → copy the **Calendar ID**
   - For your primary calendar it looks like: `yourname@gmail.com`
   - For other calendars: a long string ending in `@group.calendar.google.com`
4. This is `GCAL_CALENDAR_ID`

---

## Step 7: Add to OpenClaw Config

Add these four values to your agent's environment. In openclaw, edit your workspace config or add to `.env`:

```
GCAL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GCAL_CLIENT_SECRET=GOCSPX-...
GCAL_REFRESH_TOKEN=1//...
GCAL_CALENDAR_ID=your-calendar-id
```

---

## Step 8: Install dependency & test

```bash
npm install googleapis
node scripts/gcal.js today
```

Should return `[]` (empty array) or a list of today's events.
