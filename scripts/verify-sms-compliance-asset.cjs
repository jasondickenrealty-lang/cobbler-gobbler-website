#!/usr/bin/env node

/*
 * Prevent accidental removal/renaming of the Twilio SMS opt-in compliance image.
 * This script is intentionally strict and should fail production checks if the
 * required file/path is changed.
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const requiredAssetPath = path.join(projectRoot, 'public', 'assets', 'cobblestone-sms-optin.png');
const smsPagePath = path.join(projectRoot, 'src', 'app', 'sms-optin', 'page.tsx');
const vercelConfigPath = path.join(projectRoot, 'vercel.json');
const requiredPublicUrl = '/assets/cobblestone-sms-optin.png';

const errors = [];

if (!fs.existsSync(requiredAssetPath)) {
  errors.push(`Missing required compliance asset: ${requiredAssetPath}`);
}

if (!fs.existsSync(smsPagePath)) {
  errors.push(`Missing SMS opt-in page: ${smsPagePath}`);
} else {
  const smsPageContents = fs.readFileSync(smsPagePath, 'utf8');
  if (!smsPageContents.includes(requiredPublicUrl)) {
    errors.push(
      `SMS opt-in page must reference ${requiredPublicUrl}. Check file: ${smsPagePath}`
    );
  }
}

if (!fs.existsSync(vercelConfigPath)) {
  errors.push(`Missing vercel.json: ${vercelConfigPath}`);
} else {
  const vercelContents = fs.readFileSync(vercelConfigPath, 'utf8');
  if (!vercelContents.includes(requiredPublicUrl)) {
    errors.push(
      `vercel.json should include a rule for ${requiredPublicUrl}. Check file: ${vercelConfigPath}`
    );
  }
}

if (errors.length > 0) {
  console.error('\nSMS compliance guard failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  console.error('\nFix these issues before deploying.\n');
  process.exit(1);
}

console.log(`SMS compliance guard passed: ${requiredPublicUrl}`);
