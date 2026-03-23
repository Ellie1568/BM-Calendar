---
name: google-calendar
description: "Read and write Google Calendar events via googleapis. Use when the user asks to: check today's schedule, list events for a month, add/create a new calendar event (with optional reminder), or delete an event. Requires GCAL_CLIENT_ID, GCAL_CLIENT_SECRET, GCAL_REFRESH_TOKEN, GCAL_CALENDAR_ID env vars. See references/setup.md for first-time OAuth2 setup."
metadata: { "openclaw": { "emoji": "🗓️", "requires": { "bins": ["node"], "npm": ["googleapis"] } } }
---

# Google Calendar Skill

Read and write Google Calendar events from OpenClaw agents.

## Setup (first time only)

See **[references/setup.md](references/setup.md)** for step-by-step OAuth2 setup.

Required env vars (set in openclaw config or `.env`):
```
GCAL_CLIENT_ID=...
GCAL_CLIENT_SECRET=...
GCAL_REFRESH_TOKEN=...
GCAL_CALENDAR_ID=...
```

## Usage

Run `scripts/gcal.js` with Node.js. All output is JSON.

### Read today's events
```bash
node scripts/gcal.js today
```

### Read a month's events
```bash
node scripts/gcal.js month           # current month
node scripts/gcal.js month 2026-04   # specific month
```

### Add an event
```bash
# Timed event with 30-minute reminder
node scripts/gcal.js add --title "Meeting" --start "2026-04-01T14:00:00" --end "2026-04-01T15:00:00" --remind 30

# All-day event
node scripts/gcal.js add --title "Holiday" --start "2026-04-01" --allday true

# Use default calendar reminder (omit --remind)
node scripts/gcal.js add --title "Dentist" --start "2026-04-02T10:00:00"
```

### Delete an event
```bash
node scripts/gcal.js delete <eventId>
```
Event IDs come from the `id` field in list output.

## Output format

All commands return JSON:
```json
[{ "id": "...", "title": "...", "start": "...", "end": "...", "allDay": false }]
```
Errors return `{ "error": "..." }` and exit code 1.

## Agent workflow

When a user asks to add an event:
1. Extract: title, date/time, duration (default 1h if not specified)
2. Ask if they want a reminder — if yes, ask how many minutes before
3. Run `add` command, confirm success with event title + time
4. If the user says "remind me", default to 30 minutes unless specified
