'use client';

import { FormEvent, useMemo, useState } from 'react';
import Image from 'next/image';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { db } from '@/lib/firebase';

const EVENT_DATE_LABEL = 'May 24, 2026';
const EVENT_DATE_ISO = '2026-05-24';

const PRIZES = [
  { place: '1st Place', amount: '$100', note: 'Champion', tone: 'from-[#ffcd3c] to-[#f08b00]' },
  { place: '2nd Place', amount: '$50', note: 'Second Best', tone: 'from-[#d4d9df] to-[#8c97a3]' },
  { place: '3rd Place', amount: '$25', note: 'Third Winner', tone: 'from-[#f8c37e] to-[#be7a23]' },
];

const EVENT_FACTS = [
  '10 contestants only',
  'Fastest finish wins',
  'Peach cobbler cheesecake bowl',
  'Food Truck Fest day',
];

const BURST_PARTICLES = Array.from({ length: 11 });

function normalizePhone(value: string) {
  return value.replace(/\D/g, '');
}

export default function ContestSignupPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [ageGroup, setAgeGroup] = useState<'18+' | '16-17' | ''>('');
  const [parentGuardianName, setParentGuardianName] = useState('');
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [flyerVisible, setFlyerVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isFormValid = useMemo(() => {
    const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
    const phoneDigits = normalizePhone(phone);
    const guardianOk = ageGroup !== '16-17' || parentGuardianName.trim().length > 1;
    return (
      name.trim().length > 1 &&
      emailOk &&
      phoneDigits.length >= 10 &&
      ageGroup !== '' &&
      guardianOk &&
      legalAccepted
    );
  }, [ageGroup, email, legalAccepted, name, parentGuardianName, phone]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!isFormValid) {
      setErrorMessage('Please complete all required fields and accept the rules and legal terms.');
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPhone = normalizePhone(phone);

      await addDoc(collection(db, 'contestSignups'), {
        name: name.trim(),
        phone: phone.trim(),
        email: normalizedEmail,
        normalizedEmail,
        normalizedPhone,
        ageGroup,
        parentGuardianName: parentGuardianName.trim(),
        legalAccepted,
        eventName: '1st Annual Cobbler Eating Contest',
        eventDate: EVENT_DATE_ISO,
        eventDateLabel: EVENT_DATE_LABEL,
        createdAt: serverTimestamp(),
      });

      setName('');
      setPhone('');
      setEmail('');
      setAgeGroup('');
      setParentGuardianName('');
      setLegalAccepted(false);
      setSuccessMessage('You are signed up. We will contact you with contest details.');
    } catch (error) {
      console.error('Contest signup failed', error);
      setErrorMessage('We could not save your signup right now. Please try again in a minute.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-[75vh] overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(255,188,42,0.22),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(216,49,36,0.2),transparent_46%),linear-gradient(180deg,#120907_0%,#1a0a07_35%,#110b0f_100%)] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background:repeating-linear-gradient(-45deg,transparent,transparent_14px,rgba(255,255,255,0.03)_14px,rgba(255,255,255,0.03)_28px)]" />
        <div className="pointer-events-none absolute -left-20 top-24 h-52 w-52 rounded-full bg-[#fca311]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-24 h-64 w-64 rounded-full bg-[#ef233c]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="rounded-2xl border border-[#f4b32b]/70 bg-[#7c120f]/90 p-3 text-center shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffe7a5] sm:text-sm">
              1st Annual Cobbler Eating Contest • Sunday, {EVENT_DATE_LABEL}
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
            <section className="rounded-3xl border border-[#ffd068]/40 bg-[linear-gradient(180deg,rgba(24,24,24,0.86)_0%,rgba(11,11,11,0.92)_100%)] p-6 shadow-[0_26px_60px_rgba(0,0,0,0.4)] md:p-8">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#ffd56b] bg-[#ffc83a]/20 px-4 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#ffd56b]">
                  Annual Event
                </span>
                <span className="rounded-full border border-[#ff8e7f]/40 bg-[#d33124]/30 px-4 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#ffd2cb]">
                  Spots Are Limited
                </span>
              </div>

              <h1 className="font-serif text-4xl uppercase leading-[0.95] tracking-[0.08em] text-[#fff1cf] sm:text-5xl lg:text-6xl">
                1st Annual Cobbler
                <span className="block rotate-[-1.4deg] text-[#ffbf1f] [text-shadow:0_2px_0_rgba(0,0,0,0.5),0_9px_24px_rgba(0,0,0,0.45)]">Eating Contest</span>
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-[#ffe8d8]/90 sm:text-lg">
                Big appetites. Big prizes. One sweet victory. Sign up now for the showdown at Food Truck Fest.
              </p>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {EVENT_FACTS.map((fact) => (
                  <div
                    key={fact}
                    className="rounded-xl border border-[#ffcf70]/25 bg-[#2a140f]/70 px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#ffe7b8]"
                  >
                    {fact}
                  </div>
                ))}
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {PRIZES.map((prize) => (
                  <div key={prize.place} className={`rounded-2xl border border-black/30 bg-gradient-to-br ${prize.tone} p-4 text-black shadow-[0_10px_22px_rgba(0,0,0,0.32)]`}>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em]">{prize.place}</p>
                    <p className="mt-2 text-4xl font-black leading-none">{prize.amount}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em]">{prize.note}</p>
                  </div>
                ))}
              </div>

              <section className="mt-8 rounded-2xl border border-[#f4bc4b]/35 bg-[#190f0c] p-5">
                <h2 className="text-xl font-semibold uppercase tracking-[0.12em] text-[#ffc83a]">Rules and Legal</h2>
                <ul className="mt-4 space-y-2 text-sm text-[#ffe7d3]">
                  <li>Contestants must be age 16 or older on the day of the event.</li>
                  <li>Contestants ages 16 to 17 must be accompanied by a parent or legal guardian who signs consent at check-in.</li>
                  <li>By entering, contestants confirm they are physically able to participate and understand eating quickly may present health risks.</li>
                  <li>Each contestant receives one official Peach Cobbler Cheesecake Bowl prepared by Cobblestone Creamery.</li>
                  <li>Winner is determined by fastest verified finish. All timing and judging decisions are final.</li>
                  <li>By participating, contestants grant permission for event photos/video to be used by Cobblestone Creamery for marketing and social media.</li>
                  <li>Contestants release and hold harmless Cobblestone Creamery, event partners, and staff from claims arising from participation, except where prohibited by law.</li>
                  <li>Cobblestone Creamery may refuse entry or disqualify any participant for unsafe, disruptive, or unsportsmanlike conduct.</li>
                </ul>
              </section>

              <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ffe4b8]">Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
                className="rounded-xl border border-[#ffd88c]/30 bg-[#2c1711] px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-[#ffc83a] focus:outline-none"
                placeholder="Your full name"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ffe4b8]">Phone Number</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                required
                className="rounded-xl border border-[#ffd88c]/30 bg-[#2c1711] px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-[#ffc83a] focus:outline-none"
                placeholder="(812) 555-1234"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ffe4b8]">Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                className="rounded-xl border border-[#ffd88c]/30 bg-[#2c1711] px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-[#ffc83a] focus:outline-none"
                placeholder="you@example.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ffe4b8]">Age Group</span>
              <select
                value={ageGroup}
                onChange={(event) => setAgeGroup(event.target.value as '18+' | '16-17' | '')}
                required
                className="rounded-xl border border-[#ffd88c]/30 bg-[#2c1711] px-4 py-3 text-base text-white focus:border-[#ffc83a] focus:outline-none"
              >
                <option value="" className="text-black">Select your age group</option>
                <option value="18+" className="text-black">18 or older</option>
                <option value="16-17" className="text-black">16-17</option>
              </select>
            </label>

            {ageGroup === '16-17' ? (
              <label className="grid gap-2">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ffe4b8]">Parent or Guardian Full Name</span>
                <input
                  type="text"
                  value={parentGuardianName}
                  onChange={(event) => setParentGuardianName(event.target.value)}
                  required
                  className="rounded-xl border border-[#ffd88c]/30 bg-[#2c1711] px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-[#ffc83a] focus:outline-none"
                  placeholder="Parent/guardian name for signature at check-in"
                />
              </label>
            ) : null}

            <label className="flex items-start gap-3 rounded-xl border border-[#ffd88c]/30 bg-[#2a140f]/70 p-4">
              <input
                type="checkbox"
                checked={legalAccepted}
                onChange={(event) => setLegalAccepted(event.target.checked)}
                required
                className="mt-1 h-5 w-5"
              />
              <span className="text-sm text-[#ffe6c9]">
                I confirm that I am age 16+ and agree to the contest rules, liability terms, and media release above. If I am 16-17, my parent or legal guardian will be present to sign consent at check-in.
              </span>
            </label>

            {errorMessage ? (
              <p className="rounded-lg border border-red-300/60 bg-red-500/25 px-4 py-3 text-sm text-red-100">
                {errorMessage}
              </p>
            ) : null}

            {successMessage ? (
              <div className="relative overflow-hidden rounded-lg border border-emerald-300/70 bg-emerald-500/20 px-4 py-3 text-sm text-emerald-100">
                <p className="relative z-10">{successMessage}</p>
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  {BURST_PARTICLES.map((particle, index) => (
                    <span
                      key={`burst-${index}`}
                      className="contest-burst"
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 rounded-full bg-[linear-gradient(135deg,#ffcb3f,#d87a00)] px-7 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition-transform duration-200 hover:translate-y-[-1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Sign Up'}
            </button>
              </form>
            </section>

            <aside className="space-y-6">
              {flyerVisible ? (
                <div className="overflow-hidden rounded-3xl border border-[#ffd168]/45 bg-black/45 shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
                  <Image
                    src="/assets/cobbler-eating-contest-flyer.png"
                    alt="Cobblestone Creamery annual cobbler eating contest flyer"
                    width={768}
                    height={1280}
                    className="h-auto w-full"
                    priority
                    onError={() => setFlyerVisible(false)}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-[#ffd168]/30 bg-black/45 p-4 text-sm text-[#ffe8ca]">
                  Contest flyer is loading. If it does not appear yet, place the image at /website/public/assets/cobbler-eating-contest-flyer.png and refresh.
                </div>
              )}

              <div className="rounded-3xl border border-[#ffcf6c]/35 bg-[linear-gradient(145deg,rgba(117,12,9,0.78),rgba(34,7,6,0.9))] p-6 shadow-[0_16px_30px_rgba(0,0,0,0.36)]">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffd777]">Event Details</p>
                <div className="mt-4 space-y-4 text-[#ffeed4]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#ffcc7d]">Date</p>
                    <p className="text-2xl font-black uppercase">Sunday, May 24th</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#ffcc7d]">Location</p>
                    <p className="text-lg font-bold uppercase">900 Main Street, Evansville</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#ffcc7d]">Challenge</p>
                    <p className="text-lg font-bold uppercase">Eat The Peach Cobbler Cheesecake Bowl Fastest</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
        <style jsx>{`
          .contest-burst {
            position: absolute;
            top: 100%;
            width: 8px;
            height: 8px;
            border-radius: 9999px;
            background: linear-gradient(180deg, #ffd166, #ef476f);
            opacity: 0;
            animation: burst-rise 1.25s ease-out infinite;
          }

          .contest-burst:nth-child(1) { left: 8%; animation-delay: 0ms; }
          .contest-burst:nth-child(2) { left: 16%; animation-delay: 90ms; }
          .contest-burst:nth-child(3) { left: 24%; animation-delay: 40ms; }
          .contest-burst:nth-child(4) { left: 33%; animation-delay: 140ms; }
          .contest-burst:nth-child(5) { left: 41%; animation-delay: 10ms; }
          .contest-burst:nth-child(6) { left: 50%; animation-delay: 110ms; }
          .contest-burst:nth-child(7) { left: 59%; animation-delay: 50ms; }
          .contest-burst:nth-child(8) { left: 68%; animation-delay: 160ms; }
          .contest-burst:nth-child(9) { left: 76%; animation-delay: 20ms; }
          .contest-burst:nth-child(10) { left: 85%; animation-delay: 120ms; }
          .contest-burst:nth-child(11) { left: 92%; animation-delay: 70ms; }

          @keyframes burst-rise {
            0% {
              transform: translateY(0) scale(0.7);
              opacity: 0;
            }
            15% {
              opacity: 0.95;
            }
            100% {
              transform: translateY(-140px) scale(1.12);
              opacity: 0;
            }
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}