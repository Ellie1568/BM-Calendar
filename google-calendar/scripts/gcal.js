#!/usr/bin/env node
/**
 * gcal.js — Google Calendar CLI for OpenClaw agents
 *
 * Env vars required:
 *   GCAL_CLIENT_ID, GCAL_CLIENT_SECRET, GCAL_REFRESH_TOKEN, GCAL_CALENDAR_ID
 *
 * Usage:
 *   node gcal.js today
 *   node gcal.js month [YYYY-MM]
 *   node gcal.js add --title "..." --start "2026-03-24T15:00:00" [--end "..."] [--allday] [--remind 30]
 *   node gcal.js delete <eventId>
 */

import { google } from 'googleapis';

const {
  GCAL_CLIENT_ID,
  GCAL_CLIENT_SECRET,
  GCAL_REFRESH_TOKEN,
  GCAL_CALENDAR_ID,
} = process.env;

if (!GCAL_CLIENT_ID || !GCAL_CLIENT_SECRET || !GCAL_REFRESH_TOKEN || !GCAL_CALENDAR_ID) {
  console.error(JSON.stringify({ error: 'Missing env vars: GCAL_CLIENT_ID, GCAL_CLIENT_SECRET, GCAL_REFRESH_TOKEN, GCAL_CALENDAR_ID' }));
  process.exit(1);
}

const auth = new google.auth.OAuth2(GCAL_CLIENT_ID, GCAL_CLIENT_SECRET, 'http://localhost');
auth.setCredentials({ refresh_token: GCAL_REFRESH_TOKEN });
const cal = google.calendar({ version: 'v3', auth });

const args = process.argv.slice(2);
const cmd = args[0];

function parseArgs(arr) {
  const out = {};
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].startsWith('--')) {
      const key = arr[i].slice(2);
      out[key] = arr[i + 1] ?? true;
      i++;
    }
  }
  return out;
}

function fmt(e) {
  return {
    id: e.id,
    title: e.summary || '（無標題）',
    start: e.start?.dateTime || e.start?.date,
    end: e.end?.dateTime || e.end?.date,
    allDay: !!e.start?.date && !e.start?.dateTime,
    location: e.location || null,
    description: e.description || null,
  };
}

async function cmdToday() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const res = await cal.events.list({
    calendarId: GCAL_CALENDAR_ID,
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });
  console.log(JSON.stringify((res.data.items || []).map(fmt)));
}

async function cmdMonth(ym) {
  let year, month;
  if (ym) {
    [year, month] = ym.split('-').map(Number);
    month -= 1;
  } else {
    const d = new Date();
    year = d.getFullYear(); month = d.getMonth();
  }
  const start = new Date(year, month, 1);
  const end   = new Date(year, month + 1, 1);
  const res = await cal.events.list({
    calendarId: GCAL_CALENDAR_ID,
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });
  console.log(JSON.stringify((res.data.items || []).map(fmt)));
}

async function cmdAdd(flags) {
  const { title, start, end, allday, remind } = flags;
  if (!title || !start) {
    console.error(JSON.stringify({ error: '--title and --start are required' }));
    process.exit(1);
  }
  const tz = 'Asia/Taipei';
  const event = {
    summary: title,
    start: allday ? { date: start } : { dateTime: start, timeZone: tz },
    end:   allday ? { date: end || start } : { dateTime: end || start, timeZone: tz },
  };
  if (remind !== undefined) {
    event.reminders = {
      useDefault: false,
      overrides: [{ method: 'popup', minutes: Number(remind) }],
    };
  } else {
    event.reminders = { useDefault: true };
  }
  const res = await cal.events.insert({ calendarId: GCAL_CALENDAR_ID, resource: event });
  console.log(JSON.stringify({ ok: true, event: fmt(res.data) }));
}

async function cmdDelete(id) {
  if (!id) { console.error(JSON.stringify({ error: 'event id required' })); process.exit(1); }
  await cal.events.delete({ calendarId: GCAL_CALENDAR_ID, eventId: id });
  console.log(JSON.stringify({ ok: true, deleted: id }));
}

(async () => {
  try {
    if (cmd === 'today')       await cmdToday();
    else if (cmd === 'month')  await cmdMonth(args[1]);
    else if (cmd === 'add')    await cmdAdd(parseArgs(args));
    else if (cmd === 'delete') await cmdDelete(args[1]);
    else {
      console.error(JSON.stringify({ error: `Unknown command: ${cmd}. Use: today | month [YYYY-MM] | add | delete <id>` }));
      process.exit(1);
    }
  } catch (e) {
    console.error(JSON.stringify({ error: e.message }));
    process.exit(1);
  }
})();
