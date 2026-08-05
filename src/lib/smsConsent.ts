// Single source of truth for the SMS consent (CTA) disclosure.
//
// A2P 10DLC reviewers compare the wording rendered next to every opt-in
// checkbox against the wording published on the public proof page at
// /sms-optin. If any surface drifts, the campaign gets rejected for CTA
// mismatch — so the loyalty forms and the proof page all render
// SMS_CONSENT_DISCLOSURE rather than each keeping its own copy.
//
// The online-ordering repo carries an identical copy at
// online-ordering/src/lib/smsConsent.ts. Change one, change both.
export const SMS_CONSENT_DISCLOSURE =
  'I agree to receive recurring automated text messages from Cobblestone Creamery ' +
  'at the mobile number provided, including order updates and promotional offers. ' +
  'Consent is not a condition of purchase. Msg frequency varies, up to 8 msgs/month. ' +
  'Msg & data rates may apply. Reply STOP to cancel, HELP for help.';

export const PRIVACY_POLICY_URL = 'https://cobblestonecreamery.com/privacy';
export const TERMS_URL = 'https://cobblestonecreamery.com/terms';
