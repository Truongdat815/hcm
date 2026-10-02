const fs = require('fs');
const path = require('path');

// Vercel injects process.env automatically. For local development, load .env
// without requiring an extra package.
const localEnvPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(localEnvPath)) {
  for (const rawLine of fs.readFileSync(localEnvPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  databaseURL: process.env.FIREBASE_DATABASE_URL || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || ''
};

const output = `window.HCM_CONFIG = ${JSON.stringify({
  BACKEND_URL: '',
  FIREBASE_CONFIG: firebaseConfig,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '2026',
  GAME_CONFIG: {
    questionSeconds: Math.max(5, Number(process.env.GAME_QUESTION_SECONDS) || 20),
    questionCount: Math.max(1, Number(process.env.GAME_QUESTION_COUNT) || 10)
  }
}, null, 2)};\n`;

const primaryPath = path.join(__dirname, '..', 'presentation-web', 'config.generated.js');
fs.writeFileSync(primaryPath, output);
const publicPath = path.join(__dirname, '..', 'presentation-web', 'public', 'config.generated.js');
try {
  fs.writeFileSync(publicPath, output);
} catch (e) {}

console.log(firebaseConfig.databaseURL
  ? 'Firebase config generated for Vercel.'
  : 'Firebase env is missing; browser will show a configuration error.');
