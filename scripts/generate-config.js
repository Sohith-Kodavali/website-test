// ============================================
// RRK — Build-time Firebase config injection
// Reads template, replaces tokens with env vars.
// In CI/Vercel: fails if any env var is missing.
// Locally: warns but keeps placeholders.
// ============================================

const fs = require('fs');
const path = require('path');

const TEMPLATE = path.join(__dirname, '..', 'js', 'firebase-config.template.js');
const OUTPUT   = path.join(__dirname, '..', 'js', 'firebase-config.js');

const TOKENS = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID'
];

const isCI = process.env.VERCEL === '1' || process.env.CI === 'true';

if (!fs.existsSync(TEMPLATE)) {
  console.error('ERROR: Template not found at ' + TEMPLATE);
  process.exit(1);
}

let content = fs.readFileSync(TEMPLATE, 'utf-8');
const missing = [];

for (const token of TOKENS) {
  const value = process.env[token];
  if (value) {
    content = content.replaceAll(token, value);
  } else {
    missing.push(token);
  }
}

if (missing.length > 0) {
  if (isCI) {
    console.error('ERROR: Missing required environment variables: ' + missing.join(', '));
    process.exit(1);
  } else {
    console.warn('WARNING: Missing env vars (' + missing.join(', ') + '). Using placeholders for local dev.');
  }
}

fs.writeFileSync(OUTPUT, content, 'utf-8');
console.log('✅ Generated js/firebase-config.js' + (missing.length > 0 ? ' (with ' + missing.length + ' placeholders)' : ' (all vars injected)'));
