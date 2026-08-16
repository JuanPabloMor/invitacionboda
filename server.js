require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sheets = require('./sheets');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const SHEETS_REQUIRED = String(process.env.SHEETS_REQUIRED || '').toLowerCase() === 'true';
let DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, 'data');
let RSVP_PATH = path.join(DATA_DIR, 'rsvp.json');
let SONGS_PATH = path.join(DATA_DIR, 'songs.json');

const MEAL_CHOICE_LABELS = {
  bacalao: 'Pescado',
  solomillo: 'Carne',
  'coordinar-restaurante': 'Comodín'
};

function initializeDataStorage() {
  function tryInit(dirPath) {
    const rsvpPath = path.join(dirPath, 'rsvp.json');
    const songsPath = path.join(dirPath, 'songs.json');

    fs.mkdirSync(dirPath, { recursive: true });
    for (const filePath of [rsvpPath, songsPath]) {
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]', 'utf8');
      }
    }

    DATA_DIR = dirPath;
    RSVP_PATH = rsvpPath;
    SONGS_PATH = songsPath;
    return true;
  }

  try {
    return tryInit(DATA_DIR);
  } catch (error) {
    const fallbackDir = path.join('/tmp', 'invitacionesboda-data');
    try {
      const ok = tryInit(fallbackDir);
      console.warn(`DATA_DIR no escribible (${DATA_DIR}). Usando fallback: ${fallbackDir}`);
      return ok;
    } catch (_fallbackError) {
      throw error;
    }
  }
}

initializeDataStorage();

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function repairMojibakeString(value) {
  if (typeof value !== 'string') return value;

  let text = value;
  const mojibakeMap = {
    'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
    'Ã±': 'ñ', 'Ã¼': 'ü', 'Ã': 'Á', 'Ã‰': 'É', 'Ã': 'Í',
    'Ã“': 'Ó', 'Ãš': 'Ú', 'Ã‘': 'Ñ', 'Ãœ': 'Ü', 'Ã§': 'ç',
    'Ã€': 'À', 'Ãˆ': 'È', 'ÃŒ': 'Ì', 'ÃŠ': 'Ò', 'Ã™': 'Ù',
    'Â¡': '¡', 'Â¿': '¿', 'Â·': '·', 'Â°': '°', 'Âº': 'º'
  };

  Object.keys(mojibakeMap).forEach((wrong) => {
    text = text.split(wrong).join(mojibakeMap[wrong]);
  });

  text = text.replace(/\uFFFD/g, '');

  if (/[ÃÂ�]/.test(text)) {
    try {
      const repaired = Buffer.from(text, 'latin1').toString('utf8');
      if (repaired && repaired !== text && /[áéíóúÁÉÍÓÚñÑüÜçÇàèìòùÀÈÌÒÙ¡¿]/.test(repaired)) {
        text = repaired;
      }
    } catch (_error) {
      // no-op
    }
  }

  return text;
}

function repairMojibake(value) {
  if (Array.isArray(value)) return value.map(repairMojibake);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, repairMojibake(item)])
    );
  }
  if (typeof value === 'string') return repairMojibakeString(value);
  return value;
}

function readJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content || '[]');
    const normalized = Array.isArray(parsed) ? parsed.map(repairMojibake) : [];
    if (JSON.stringify(normalized) !== JSON.stringify(parsed)) {
      writeJson(filePath, normalized);
    }
    return normalized;
  } catch (error) {
    return [];
  }
}

function writeJson(filePath, payload) {
  const cleaned = repairMojibake(payload);
  fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf8');
}

function normalizeText(value, maxLength = 250) {
  if (typeof value !== 'string') return '';

  let text = value.trim();

  const mojibakeMap = {
    'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
    'Ã±': 'ñ', 'Ã¼': 'ü', 'Ã': 'Á', 'Ã‰': 'É', 'Ã': 'Í',
    'Ã“': 'Ó', 'Ãš': 'Ú', 'Ã‘': 'Ñ', 'Ãœ': 'Ü', 'Ã§': 'ç',
    'Ã€': 'À', 'Ãˆ': 'È', 'ÃŒ': 'Ì', 'ÃŠ': 'Ò', 'Ã™': 'Ù',
    'Â¡': '¡', 'Â¿': '¿', 'Â·': '·', 'Â°': '°', 'Âº': 'º'
  };

  Object.keys(mojibakeMap).forEach((wrong) => {
    text = text.split(wrong).join(mojibakeMap[wrong]);
  });

  text = text.replace(/\uFFFD/g, '');

  if (/[ÃÂ�]/.test(text)) {
    try {
      const repaired = Buffer.from(text, 'latin1').toString('utf8');
      if (repaired && repaired !== text && /[áéíóúÁÉÍÓÚñÑüÜçÇàèìòùÀÈÌÒÙ¡¿]/.test(repaired)) {
        text = repaired;
      }
    } catch (_error) {
      // no-op
    }
  }

  return text.replace(/\s+/g, ' ').slice(0, maxLength);
}

function isAdminAuthorized(req) {
  if (!ADMIN_TOKEN) return true;
  const token = req.header('x-admin-token') || req.query.token || '';
  return token === ADMIN_TOKEN;
}

function escapeCsv(value) {
  const text = String(value ?? '');
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
}

function toCsv(rows, columns) {
  const header = columns.map((item) => escapeCsv(item.label)).join(',');
  const body = rows.map((row) => columns.map((item) => escapeCsv(item.getValue(row))).join(',')).join('\n');
  return `${header}\n${body}`;
}

function formatMealChoice(choice) {
  const key = String(choice || '').trim();
  return MEAL_CHOICE_LABELS[key] || key;
}

function flattenRsvpRow(entry) {
  const adults = Array.isArray(entry.adults) ? entry.adults : [];
  const kids = Array.isArray(entry.kids) ? entry.kids : [];

  if (entry.assist === 'no') {
    return [{
      id: entry.id || '',
      assist: entry.assist || '',
      guestName: entry.guestName || '',
      type: 'No asiste',
      name: entry.guestName || '',
      meal: '',
      intolerance: '',
      submittedAt: entry.submittedAt || ''
    }];
  }

  const adultRows = adults.map((person) => ({
    id: entry.id || '',
    assist: entry.assist || '',
    guestName: entry.guestName || '',
    type: 'Adulto',
    name: person.name || '',
    meal: formatMealChoice(person.mealChoice),
    intolerance: person.intolerance === 'yes' ? (person.intoleranceDetails || 'Sí') : '',
    submittedAt: entry.submittedAt || ''
  }));

  const kidRows = kids.map((person) => ({
    id: entry.id || '',
    assist: entry.assist || '',
    guestName: entry.guestName || '',
    type: 'Niño',
    name: person.name || '',
    meal: '',
    intolerance: person.intolerance === 'yes' ? (person.intoleranceDetails || 'Sí') : '',
    submittedAt: entry.submittedAt || ''
  }));

  return [...adultRows, ...kidRows];
}

function validateRsvp(payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, message: 'La confirmación no tiene el formato correcto.' };
  }

  if (payload.assist === 'no') {
    const guestName = normalizeText(payload.guestName, 200);
    if (!guestName) {
      return { ok: false, message: 'Escribe tu nombre y apellidos si no vas a asistir.' };
    }

    return {
      ok: true,
      normalized: {
        assist: 'no',
        guestName,
        submittedAt: new Date().toISOString()
      }
    };
  }

  const adultTotal = Number(payload.adultsCount || 0);
  if (adultTotal < 1) {
    return { ok: false, message: 'Debes indicar al menos 1 adulto si vas a asistir.' };
  }

  const adults = Array.isArray(payload.adults) ? payload.adults : [];
  if (!adults.length || adults.length < adultTotal) {
    return { ok: false, message: 'Faltan datos de los adultos que has indicado.' };
  }

  const cleanedAdults = adults.map((person) => ({
    type: 'adult',
    name: normalizeText(person && person.name, 200),
    mealChoice: normalizeText(person && person.mealChoice, 80),
    intolerance: normalizeText(person && person.intolerance, 20),
    intoleranceDetails: normalizeText(person && person.intoleranceDetails, 500)
  }));
  const allowedMealChoices = new Set(['bacalao', 'solomillo', 'coordinar-restaurante']);

  if (!cleanedAdults[0] || !cleanedAdults[0].name) {
    return { ok: false, message: 'Falta el nombre y apellidos del Adulto 1.' };
  }

  if (!cleanedAdults[0].mealChoice) {
    return { ok: false, message: 'Falta la elección de plato del Adulto 1.' };
  }

  for (const person of cleanedAdults) {
    if (!allowedMealChoices.has(person.mealChoice)) {
      return { ok: false, message: 'La elección de plato debe ser Pescado, Carne o Comodín.' };
    }
  }

  for (const person of cleanedAdults) {
    if (!person.name) {
      return { ok: false, message: 'Todos los adultos deben tener nombre y apellidos.' };
    }
  }

  const kids = Array.isArray(payload.kids) ? payload.kids : [];
  const cleanedKids = kids.map((person) => ({
    type: 'kid',
    name: normalizeText(person && person.name, 200),
    intolerance: normalizeText(person && person.intolerance, 20),
    intoleranceDetails: normalizeText(person && person.intoleranceDetails, 500)
  }));

  return {
    ok: true,
    normalized: {
      assist: 'yes',
      adultsCount: adultTotal,
      adults: cleanedAdults,
      kidsCount: Number(payload.kidsCount || 0),
      kids: cleanedKids,
      submittedAt: new Date().toISOString()
    }
  };
}

function validateSong(payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, message: 'La petición de canción no tiene el formato correcto.' };
  }

  const guestName = normalizeText(payload.guestName, 200);
  if (!guestName) {
    return { ok: false, message: 'Escribe tu nombre y apellidos.' };
  }

  const rawSongs = Array.isArray(payload.songs)
    ? payload.songs
    : ((payload.songTitle || payload.songArtist || payload.songDedication) ? [payload] : []);

  const cleanedSongs = rawSongs.map((song) => ({
    songTitle: normalizeText(song && song.songTitle, 200),
    songArtist: normalizeText(song && song.songArtist, 200),
    songDedication: normalizeText(song && song.songDedication, 500)
  }));

  const songRows = cleanedSongs.filter((song) => song.songTitle || song.songArtist || song.songDedication);

  if (!songRows.length) {
    return { ok: false, message: 'Añade al menos una canción.' };
  }

  for (const song of songRows) {
    if (!song.songTitle) {
      return { ok: false, message: 'Cada fila debe incluir el título de la canción.' };
    }
  }

  return {
    ok: true,
    normalized: {
      guestName,
      songs: songRows,
      submittedAt: new Date().toISOString()
    }
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Servidor funcionando' });
});

app.get('/api/rsvp', (_req, res) => {
  const items = readJson(RSVP_PATH);
  res.json(items);
});

app.post('/api/rsvp', async (req, res) => {
  const validation = validateRsvp(req.body);
  if (!validation.ok) {
    return res.status(400).json({ ok: false, message: validation.message });
  }

  const sheetsConfigured = sheets.isConfigured();
  if (SHEETS_REQUIRED && !sheetsConfigured) {
    return res.status(503).json({
      ok: false,
      message: 'Google Sheets no está configurado en este entorno.'
    });
  }

  const entry = {
    id: crypto.randomUUID(),
    ...validation.normalized
  };

  let sheetsError = null;
  if (sheetsConfigured) {
    try {
      await sheets.appendRsvp(entry);
    } catch (err) {
      sheetsError = err;
      if (SHEETS_REQUIRED) {
        return res.status(502).json({
          ok: false,
          message: 'No se pudo guardar en Google Sheets. Inténtalo de nuevo.',
          error: err.message || String(err)
        });
      }
    }
  }

  const records = readJson(RSVP_PATH);

  records.push(entry);
  writeJson(RSVP_PATH, records);

  if (sheetsError) {
    console.error('[Sheets RSVP]', sheetsError.message || sheetsError);
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(201).json({ ok: true, message: 'Confirmación guardada correctamente.', entry });
});

app.get('/api/songs', (_req, res) => {
  const items = readJson(SONGS_PATH);
  res.json(items);
});

app.post('/api/songs', async (req, res) => {
  const validation = validateSong(req.body);
  if (!validation.ok) {
    return res.status(400).json({ ok: false, message: validation.message });
  }

  const sheetsConfigured = sheets.isConfigured();
  if (SHEETS_REQUIRED && !sheetsConfigured) {
    return res.status(503).json({
      ok: false,
      message: 'Google Sheets no está configurado en este entorno.'
    });
  }

  const submissionId = crypto.randomUUID();
  const entries = validation.normalized.songs.map((song, index) => ({
    id: crypto.randomUUID(),
    submissionId,
    songIndex: index + 1,
    guestName: validation.normalized.guestName,
    songTitle: song.songTitle,
    songArtist: song.songArtist,
    songDedication: song.songDedication,
    submittedAt: validation.normalized.submittedAt
  }));

  let sheetsError = null;
  if (sheetsConfigured) {
    try {
      for (const entry of entries) {
        await sheets.appendSong(entry);
      }
    } catch (err) {
      sheetsError = err;
      if (SHEETS_REQUIRED) {
        return res.status(502).json({
          ok: false,
          message: 'No se pudo guardar en Google Sheets. Inténtalo de nuevo.',
          error: err.message || String(err)
        });
      }
    }
  }

  const records = readJson(SONGS_PATH);

  records.push(...entries);
  writeJson(SONGS_PATH, records);

  if (sheetsError) {
    console.error('[Sheets Songs]', sheetsError.message || sheetsError);
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(201).json({ ok: true, message: 'Petición de canción guardada correctamente.', entries });
});

app.get('/api/export', (_req, res) => {
  res.json({
    rsvp: readJson(RSVP_PATH),
    songs: readJson(SONGS_PATH)
  });
});

app.get('/api/admin/summary', (req, res) => {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ ok: false, message: 'No autorizado.' });
  }

  const sheetsConfigured = sheets.isConfigured();
  const rsvp = readJson(RSVP_PATH);
  const songs = readJson(SONGS_PATH);
  const assistYes = rsvp.filter((item) => item.assist === 'yes').length;
  const assistNo = rsvp.filter((item) => item.assist === 'no').length;
  const adultsTotal = rsvp.reduce((sum, item) => sum + Number(item.adultsCount || 0), 0);
  const kidsTotal = rsvp.reduce((sum, item) => sum + Number(item.kidsCount || 0), 0);

  return res.json({
    ok: true,
    stats: {
      rsvpTotal: rsvp.length,
      songsTotal: songs.length,
      assistYes,
      assistNo,
      adultsTotal,
      kidsTotal,
      sheetsConfigured
    },
    latestRsvp: rsvp.slice(-20).reverse(),
    latestSongs: songs.slice(-20).reverse()
  });
});

app.post('/api/admin/reset-data', async (req, res) => {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ ok: false, message: 'No autorizado.' });
  }

  try {
    fs.writeFileSync(RSVP_PATH, '[]', 'utf8');
    fs.writeFileSync(SONGS_PATH, '[]', 'utf8');

    const sheetsConfigured = sheets.isConfigured();
    const sheetReset = sheetsConfigured
      ? await sheets.resetSheets()
      : { skipped: true, reason: 'Google Sheets no está configurado.' };

    return res.json({
      ok: true,
      message: sheetsConfigured
        ? 'Datos locales y Google Sheets reiniciados correctamente.'
        : 'Datos locales reiniciados. Google Sheets no está configurado en este entorno.',
      sheetsConfigured,
      sheets: sheetReset
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'No se pudieron limpiar los datos.',
      error: error.message || String(error)
    });
  }
});

app.get('/api/admin/export/rsvp.csv', (req, res) => {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ ok: false, message: 'No autorizado.' });
  }

  const rows = readJson(RSVP_PATH).flatMap(flattenRsvpRow);
  const csv = toCsv(rows, [
    { label: 'ID', getValue: (row) => row.id },
    { label: 'Asiste', getValue: (row) => row.assist },
    { label: 'Nombre no asistencia', getValue: (row) => row.guestName },
    { label: 'Tipo', getValue: (row) => row.type },
    { label: 'Nombre', getValue: (row) => row.name },
    { label: 'Plato', getValue: (row) => row.meal },
    { label: 'Intolerancia', getValue: (row) => row.intolerance },
    { label: 'Fecha envío', getValue: (row) => row.submittedAt }
  ]);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="rsvp-export.csv"');
  return res.send(csv);
});

app.get('/api/admin/export/songs.csv', (req, res) => {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ ok: false, message: 'No autorizado.' });
  }

  const rows = readJson(SONGS_PATH);
  const csv = toCsv(rows, [
    { label: 'ID', getValue: (row) => row.id || '' },
    { label: 'Invitado', getValue: (row) => row.guestName || '' },
    { label: 'Canción', getValue: (row) => row.songTitle || '' },
    { label: 'Artista', getValue: (row) => row.songArtist || '' },
    { label: 'Dedicatoria', getValue: (row) => row.songDedication || '' },
    { label: 'Fecha envío', getValue: (row) => row.submittedAt || '' }
  ]);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="songs-export.csv"');
  return res.send(csv);
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'mockup.html'));
});

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/healthz', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'invitacionesboda',
    dataDir: DATA_DIR,
    sheetsRequired: SHEETS_REQUIRED,
    sheetsConfigured: sheets.isConfigured()
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor de la boda escuchando en http://localhost:${PORT}`);
    console.log(`Directorio de datos: ${DATA_DIR}`);
  });
}

module.exports = app;
