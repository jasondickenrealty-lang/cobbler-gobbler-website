import { NextResponse } from 'next/server';
import {
  ALLOWED_SLOTS,
  DATE_KEY_REGEX,
  EMAIL_REGEX,
  HTML_TAG_REGEX,
  US_PHONE_REGEX,
  clean,
  forward,
  isSameOrigin,
} from '@/lib/officePartyApi';

export const runtime = 'nodejs';

/**
 * Create an office party reservation.
 *
 * No order and no card: this only reserves the slot and mints the share link.
 * Guests add their orders through /api/office-party/[id]/orders.
 */

type CreatePayload = {
  businessName?: string;
  businessAddress?: string;
  buildingLocation?: string;
  businessPhone?: string;
  contactName?: string;
  contactPhone?: string;
  email?: string;
  specialRequests?: string;
  pickupDate?: string;
  pickupTime?: string;
  billingMode?: string;
};

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Office party endpoint is available. Create reservations with POST.',
  });
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as CreatePayload;

  const payload = {
    businessName: clean(body.businessName, 120),
    businessAddress: clean(body.businessAddress, 300),
    buildingLocation: clean(body.buildingLocation, 200),
    businessPhone: clean(body.businessPhone, 40),
    contactName: clean(body.contactName, 120),
    contactPhone: clean(body.contactPhone, 40),
    email: clean(body.email, 160).toLowerCase(),
    specialRequests: clean(body.specialRequests, 2000),
    pickupDate: clean(body.pickupDate, 10),
    pickupTime: clean(body.pickupTime, 5),
    billingMode: clean(body.billingMode, 20).toLowerCase(),
  };

  if (!['individual', 'host'].includes(payload.billingMode)) {
    return NextResponse.json(
      { error: 'Choose whether the company is paying or everyone pays for their own order.' },
      { status: 400 }
    );
  }

  if (
    !payload.businessName ||
    !payload.businessAddress ||
    !payload.buildingLocation ||
    !payload.businessPhone ||
    !payload.contactName ||
    !payload.contactPhone ||
    !payload.email
  ) {
    return NextResponse.json(
      { error: 'Please complete all of the company and contact fields.' },
      { status: 400 }
    );
  }

  if (!EMAIL_REGEX.test(payload.email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (!US_PHONE_REGEX.test(payload.businessPhone)) {
    return NextResponse.json(
      { error: 'Please enter a valid US company phone number.' },
      { status: 400 }
    );
  }

  if (!US_PHONE_REGEX.test(payload.contactPhone)) {
    return NextResponse.json(
      { error: 'Please enter a valid US phone number for the host.' },
      { status: 400 }
    );
  }

  if (!DATE_KEY_REGEX.test(payload.pickupDate)) {
    return NextResponse.json({ error: 'Please choose a delivery date.' }, { status: 400 });
  }

  if (!ALLOWED_SLOTS.includes(payload.pickupTime)) {
    return NextResponse.json(
      { error: 'Delivery time must be 11:00 AM, 12:00 PM, or 1:00 PM.' },
      { status: 400 }
    );
  }

  const textFields = [
    payload.businessName,
    payload.businessAddress,
    payload.buildingLocation,
    payload.contactName,
    payload.specialRequests,
  ].filter(Boolean);
  if (textFields.some((field) => HTML_TAG_REGEX.test(field))) {
    return NextResponse.json({ error: 'Input must not contain HTML tags.' }, { status: 400 });
  }

  return forward(
    '/public/office-party',
    { method: 'POST', body: payload },
    'Failed to set up your office party. Please try again later.'
  );
}
