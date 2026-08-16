'use strict';

const { google } = require('googleapis');

const SHEET_ID = process.env.GOOGLE_SHEETS_ID || '';
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const RAW_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || '';

function normalizePrivateKey(rawKey) {
  if (!rawKey) return '';

  let normalized = String(rawKey).trim();

  if ((normalized.startsWith('"') && normalized.endsWith('"')) || (normalized.startsWith("'") && normalized.endsWith("'"))) {
    normalized = normalized.slice(1, -1);
  }

  normalized = normalized
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  return normalized;
}

// En .env la clave puede venir con \n literales o con saltos de línea reales.
const PRIVATE_KEY = normalizePrivateKey(RAW_PRIVATE_KEY);

const RSVP_TAB = 'RSVP';
const SONGS_TAB = 'Canciones';

const RSVP_HEADER = [
  'ID',
  'Asiste',
  'Nombre (no asiste)',
  'Tipo',
  'Nombre',
  'Plato',
  'Intolerancia',
  'Fecha envío',
];

const SONGS_HEADER = [
  'ID',
  'Invitado',
  'Canción',
  'Artista',
  'Dedicatoria',
  'Fecha envío',
];

function isConfigured() {
  return !!(SHEET_ID && SERVICE_ACCOUNT_EMAIL && PRIVATE_KEY);
}

function getAuth() {
  return new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function getSheetsClient() {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
}

async function resetSheetTab(sheets, tabName, header) {
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SHEET_ID,
    range: tabName,
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: [header] },
  });
}

async function ensureHeaderRow(sheets, tabName, header) {
  const range = tabName;

  let existing;
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });
    existing = res.data.values && res.data.values[0];
  } catch (_err) {
    existing = null;
  }

  if (!existing || existing.length === 0 || !header.every((item, index) => existing[index] === item)) {
    await resetSheetTab(sheets, tabName, header);
  }
}

function flattenRsvp(entry) {
  const adults = Array.isArray(entry.adults) ? entry.adults : [];
  const kids = Array.isArray(entry.kids) ? entry.kids : [];

  function formatMealChoice(choice) {
    const key = String(choice || '').trim();
    const labels = {
      bacalao: 'Pescado',
      solomillo: 'Carne',
      'coordinar-restaurante': 'Comodín'
    };
    return labels[key] || key;
  }

  if (entry.assist === 'no') {
    return [[
      entry.id || '',
      'No',
      entry.guestName || '',
      'No asiste',
      entry.guestName || '',
      '',
      '',
      entry.submittedAt || '',
    ]];
  }

  const adultRows = adults.map((person) => [
    entry.id || '',
    'Sí',
    '',
    'Adulto',
    person.name || '',
    formatMealChoice(person.mealChoice),
    person.intolerance === 'yes' ? (person.intoleranceDetails || 'Sí') : '',
    entry.submittedAt || '',
  ]);

  const kidRows = kids.map((person) => [
    entry.id || '',
    'Sí',
    '',
    'Niño',
    person.name || '',
    '',
    person.intolerance === 'yes' ? (person.intoleranceDetails || 'Sí') : '',
    entry.submittedAt || '',
  ]);

  return [...adultRows, ...kidRows];
}

function flattenSong(entry) {
  return [
    entry.id || '',
    entry.guestName || '',
    entry.songTitle || '',
    entry.songArtist || '',
    entry.songDedication || '',
    entry.submittedAt || '',
  ];
}

async function appendRsvp(entry) {
  if (!isConfigured()) {
    return { skipped: true, reason: 'Google Sheets no está configurado.' };
  }

  const sheets = await getSheetsClient();
  await ensureHeaderRow(sheets, RSVP_TAB, RSVP_HEADER);

  const rows = flattenRsvp(entry);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${RSVP_TAB}!A1`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: rows },
  });

  return { ok: true };
}

async function appendSong(entry) {
  if (!isConfigured()) {
    return { skipped: true, reason: 'Google Sheets no está configurado.' };
  }

  const sheets = await getSheetsClient();
  await ensureHeaderRow(sheets, SONGS_TAB, SONGS_HEADER);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SONGS_TAB}!A1`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [flattenSong(entry)] },
  });

  return { ok: true };
}

async function resetSheets() {
  if (!isConfigured()) {
    return { skipped: true, reason: 'Google Sheets no está configurado.' };
  }

  const sheets = await getSheetsClient();
  await resetSheetTab(sheets, RSVP_TAB, RSVP_HEADER);
  await resetSheetTab(sheets, SONGS_TAB, SONGS_HEADER);

  return { ok: true };
}

module.exports = { appendRsvp, appendSong, isConfigured, flattenRsvp, resetSheets };
