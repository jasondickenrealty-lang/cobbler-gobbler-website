#!/usr/bin/env node

/*
 * Prevent accidental removal/renaming of the Twilio SMS opt-in compliance image.
 * This script is intentionally strict and should fail production checks if the
 * required file/path is changed.
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const smsPagePath = path.join(projectRoot, 'src', 'app', 'sms-optin', 'page.tsx');
const vercelConfigPath = path.join(projectRoot, 'vercel.json');

// Every image a carrier reviewer is sent to. `/sms-optin-form.jpg` is named
// directly in the registered campaign's consent description, so it has to keep
// resolving at that exact literal path — it is not just an asset, it is a URL
// a third party already has on file.
const requiredAssets = [
  { url: '/assets/cobblestone-sms-optin.png', file: ['public', 'assets', 'cobblestone-sms-optin.png'] },
  { url: '/assets/cobblestone-sms-optin-checkout.png', file: ['public', 'assets', 'cobblestone-sms-optin-checkout.png'] },
  { url: '/sms-optin-form.jpg', file: ['public', 'sms-optin-form.jpg'] },
];

const errors = [];

const smsPageContents = fs.existsSync(smsPagePath) ? fs.readFileSync(smsPagePath, 'utf8') : null;
const vercelContents = fs.existsSync(vercelConfigPath) ? fs.readFileSync(vercelConfigPath, 'utf8') : null;

if (smsPageContents === null) {
  errors.push(`Missing SMS opt-in page: ${smsPagePath}`);
}
if (vercelContents === null) {
  errors.push(`Missing vercel.json: ${vercelConfigPath}`);
}

for (const asset of requiredAssets) {
  const assetPath = path.join(projectRoot, ...asset.file);
  if (!fs.existsSync(assetPath)) {
    errors.push(`Missing required compliance asset: ${assetPath}`);
  }
  if (smsPageContents !== null && !smsPageContents.includes(asset.url)) {
    errors.push(`SMS opt-in page must reference ${asset.url}. Check file: ${smsPagePath}`);
  }
  if (vercelContents !== null && !vercelContents.includes(asset.url)) {
    errors.push(`vercel.json should include a rule for ${asset.url}. Check file: ${vercelConfigPath}`);
  }
}

// The consent wording rendered beside each checkbox and the wording published
// on the proof page must match, or the campaign fails CTA verification. Both
// read from this shared constant; guard against it being inlined away.
const consentModulePath = path.join(projectRoot, 'src', 'lib', 'smsConsent.ts');
if (!fs.existsSync(consentModulePath)) {
  errors.push(`Missing shared SMS consent copy: ${consentModulePath}`);
} else if (smsPageContents !== null && !smsPageContents.includes('SMS_CONSENT_DISCLOSURE')) {
  errors.push(
    `SMS opt-in page must render SMS_CONSENT_DISCLOSURE from ${consentModulePath} rather than its own copy of the disclosure.`
  );
}

if (errors.length > 0) {
  console.error('\nSMS compliance guard failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  console.error('\nFix these issues before deploying.\n');
  process.exit(1);
}

console.log(`SMS compliance guard passed: ${requiredAssets.map((a) => a.url).join(', ')}`);
