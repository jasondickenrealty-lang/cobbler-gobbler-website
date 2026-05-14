'use client';

import { FormEvent, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const POSITION_OPTIONS = [
  'Team Member',
  'Shift Lead',
  'Manager',
  'Kitchen/Prep',
  'Any Available Position',
];

type ApplicationForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  availability: string;
  startDate: string;
  experience: string;
  whyJoin: string;
  additionalInfo: string;
};

const INITIAL_FORM: ApplicationForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: POSITION_OPTIONS[0],
  availability: '',
  startDate: '',
  experience: '',
  whyJoin: '',
  additionalInfo: '',
};

export default function JoinOurTeamPage() {
  const [form, setForm] = useState<ApplicationForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const statusRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof ApplicationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/job-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to submit application.');
      }

      setSubmitted(true);
      setForm(INITIAL_FORM);
      setTimeout(() => statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } catch (submitError: any) {
      setError(submitError?.message || 'Failed to submit application.');
      setTimeout(() => statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Now Hiring in Evansville, Indiana</h1>
            <p className="text-dark/70 text-lg leading-relaxed">
              Cobblestone Creamery is hiring friendly, reliable people who love great food and great
              customer service. Fill out the application below and we will be in touch if there is a fit
              at our downtown Evansville shop at 900 Main Street.
            </p>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
            <div ref={statusRef}>
              {submitted && (
                <div className="mb-8 rounded border border-green-200 bg-green-50 px-5 py-4 text-green-800">
                  Application submitted successfully! We will review it and reach out if there is a fit.
                </div>
              )}

              {error && (
                <div className="mb-8 rounded border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                  {error}
                </div>
              )}
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <p className="text-dark/70">Want to submit another application?{' '}
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-primary underline hover:no-underline"
                  >
                    Click here
                  </button>
                </p>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-dark mb-2">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full rounded border border-dark/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-dark mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full rounded border border-dark/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full rounded border border-dark/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-dark mb-2">
                    Phone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full rounded border border-dark/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-dark mb-2">
                    Position Applying For *
                  </label>
                  <select
                    id="position"
                    required
                    value={form.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    className="w-full rounded border border-dark/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                  >
                    {POSITION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-dark mb-2">
                    Earliest Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full rounded border border-dark/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-dark mb-2">
                  Availability (days/times) *
                </label>
                <textarea
                  id="availability"
                  required
                  rows={4}
                  value={form.availability}
                  onChange={(e) => handleChange('availability', e.target.value)}
                  className="w-full rounded border border-dark/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Example: Monday-Friday after 3 PM, open weekends"
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-dark mb-2">
                  Relevant Experience
                </label>
                <textarea
                  id="experience"
                  rows={4}
                  value={form.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  className="w-full rounded border border-dark/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Tell us about customer service, food service, leadership, or other experience."
                />
              </div>

              <div>
                <label htmlFor="whyJoin" className="block text-sm font-medium text-dark mb-2">
                  Why do you want to join Cobblestone Creamery? *
                </label>
                <textarea
                  id="whyJoin"
                  required
                  rows={4}
                  value={form.whyJoin}
                  onChange={(e) => handleChange('whyJoin', e.target.value)}
                  className="w-full rounded border border-dark/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-dark mb-2">
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  rows={4}
                  value={form.additionalInfo}
                  onChange={(e) => handleChange('additionalInfo', e.target.value)}
                  className="w-full rounded border border-dark/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto bg-primary text-white px-8 py-3 rounded text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
