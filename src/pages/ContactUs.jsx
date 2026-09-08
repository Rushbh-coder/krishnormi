import { useEffect, useState } from 'react';
import Header from '../sections/Header';
import Footer from '../sections/Footer';
import iconLocation from '../assets/footer/icon-location.svg';
import iconLocationGreen from '../assets/footer/icon-location-green.svg';
import iconEmailGreen from '../assets/footer/icon-email-green.svg';
import iconPhoneGreen from '../assets/footer/icon-phone-green.svg';
import bannerBg1 from '../assets/hero/hero-background.png';
import bannerBg2 from '../assets/testimonials/bg.png';
import bannerBg3 from '../assets/treatments/bg-1.png';
import { useSection } from '../context/HomepageContentContext';
import { DEFAULT_CONTENT } from '../data/homepageDefaults';
import { supabase } from '../lib/supabaseClient';

const BANNER_IMAGES = [bannerBg1, bannerBg2, bannerBg3];

export default function ContactUs() {
  const { row } = useSection('contact');
  const content = row?.content ?? DEFAULT_CONTENT.contact;

  const mapQuery = content.latitude && content.longitude
    ? `${content.latitude},${content.longitude}`
    : content.address;

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [showLocationCard, setShowLocationCard] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setBannerIndex((i) => (i + 1) % BANNER_IMAGES.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    const { error } = await supabase.from('contact_enquiries').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    });
    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
      return;
    }
    setStatus('success');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  const contactDetails = [
    { icon: iconLocationGreen, label: 'Address', value: content.address },
    { icon: iconPhoneGreen, label: 'Phone', value: content.phone },
    { icon: iconEmailGreen, label: 'Email', value: content.email },
  ];

  const connectCards = [
    {
      icon: iconPhoneGreen,
      title: 'Call Us',
      text: 'Speak directly with our team',
      value: content.phone,
      cta: 'Call Now',
      href: `tel:${content.phone.replace(/\s+/g, '')}`,
    },
    {
      icon: iconEmailGreen,
      title: 'Email Us',
      text: 'Send us your enquiry',
      value: content.email,
      cta: 'Send Email',
      href: `mailto:${content.email}`,
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Contact Banner */}
        <section className="relative overflow-hidden bg-primary/40 py-[58px] text-center">
          {BANNER_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                i === bannerIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-white/85" />

          <div className="container relative">
            <p className="mb-3 font-heading text-[13px] font-semibold tracking-[0.04em] text-accent">
              {content.banner_eyebrow}
            </p>
            <h1 className="mb-3 font-heading text-[44px] leading-[1.2] font-bold text-text-dark max-[700px]:text-[32px] max-[420px]:text-[26px]">
              {content.banner_heading}
            </h1>
            <div className="mx-auto max-w-[780px]">
              <p className="font-heading text-[17px] leading-[1.6] text-text">{content.banner_text}</p>
            </div>
          </div>
        </section>

        {/* Contact & Location */}
        <section className="bg-white py-[90px] max-[700px]:py-14">
          <div className="container flex items-center gap-[70px] max-[1100px]:flex-col max-[1100px]:items-stretch">
            <div className="relative aspect-[820/520] w-full flex-1 overflow-hidden rounded-[20px] border border-[#d9e6e0] bg-primary/10">
              <iframe
                title="Krishnormi clinic location"
                className="absolute inset-0 h-full w-full border-0"
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Marker badge — click to toggle the clinic-info card (hover doesn't work reliably over an iframe) */}
              <button
                type="button"
                onClick={() => setShowLocationCard((v) => !v)}
                aria-expanded={showLocationCard}
                aria-label="Toggle clinic location details"
                className={`absolute top-[6%] left-[5%] flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-accent p-0 shadow-[0_4px_10px_rgba(13,38,33,0.25)] transition-opacity duration-200 ${
                  showLocationCard ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <img src={iconLocation} alt="" aria-hidden="true" className="h-4 w-4 brightness-0 invert" />
              </button>

              <div
                className={`absolute top-[6%] left-[5%] w-[280px] max-w-[80%] rounded-[15px] border border-[#d6e3dd] bg-white p-[18px_22px] shadow-[0_10px_24px_-6px_rgba(13,38,33,0.13)] transition-[opacity,transform] duration-200 ${
                  showLocationCard ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
                }`}
              >
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <p className="font-heading text-xs font-semibold text-accent">{content.map_label_name}</p>
                  <button
                    type="button"
                    onClick={() => setShowLocationCard(false)}
                    aria-label="Close"
                    className="-mt-1 -mr-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-transparent p-0 text-[#98a2b3] hover:text-text-dark"
                  >
                    &times;
                  </button>
                </div>
                <p className="mb-1 font-heading text-base font-semibold text-text-dark">{content.map_label_line1}</p>
                <p className="font-heading text-[13px] text-[#60736e]">{content.map_label_line2}</p>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="mb-1.5 font-heading text-[30px] font-bold text-text-dark">{content.clinic_name}</h2>
              <p className="mb-6 font-heading text-sm text-[#6b7d78]">{content.clinic_subheading}</p>

              <div className="flex flex-col gap-5">
                {contactDetails.map((detail) => (
                  <div className="flex items-start gap-3.5" key={detail.label}>
                    <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-xl bg-primary/10 [&_img]:h-5 [&_img]:w-5">
                      <img src={detail.icon} alt="" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="mb-1 font-heading text-[13px] font-semibold text-accent">{detail.label}</p>
                      <p className="font-heading text-[15px] leading-[1.4] text-text-dark">{detail.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 max-[500px]:gap-2">
                <p className="inline-block rounded-[10px] bg-[#fff7f9] px-4 py-2.5 font-heading text-[13px] font-semibold text-accent">
                  {content.appointment_note}
                </p>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-[22px] py-3.5 font-heading text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                  Get Directions <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Connect & Enquiry */}
        <section className="bg-[#f9fcfb] py-20 max-[700px]:py-14">
          <div className="container flex items-start gap-[70px] max-[1100px]:flex-col">
            <div className="flex-1">
              <p className="mb-3 font-heading text-[13px] font-semibold tracking-[0.04em] text-accent">
                {content.connect_eyebrow}
              </p>
              <h2 className="mb-4 font-heading text-[34px] leading-[1.2] font-bold text-text-dark max-[420px]:text-[27px]">
                {content.connect_heading}
              </h2>
              <p className="mb-6 max-w-[500px] font-heading text-[15px] leading-[1.6] text-text">{content.connect_text}</p>

              <div className="flex gap-4 max-[500px]:flex-col">
                {connectCards.map((card) => (
                  <div
                    key={card.title}
                    className="flex w-full max-w-[285px] flex-col gap-3 rounded-[18px] border border-[#dce8e3] bg-white p-[26px_24px] max-[500px]:max-w-full"
                  >
                    <span className="flex h-[50px] w-[50px] items-center justify-center rounded-xl bg-primary/10 [&_img]:h-6 [&_img]:w-6">
                      <img src={card.icon} alt="" aria-hidden="true" />
                    </span>
                    <p className="font-heading text-xl font-semibold text-text-dark">{card.title}</p>
                    <p className="font-heading text-[13px] text-[#60736e]">{card.text}</p>
                    <p className="font-heading text-[13px] font-semibold text-accent">{card.value}</p>
                    <a
                      href={card.href}
                      className="inline-flex items-center gap-1.5 self-start rounded-[9px] bg-primary px-[17px] py-2.5 font-heading text-[13px] font-semibold text-white transition hover:bg-primary-dark"
                    >
                      {card.cta} <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="w-full max-w-[730px] flex-none rounded-[22px] border border-[#d8e8e2] bg-white p-[34px_38px] shadow-[0_12px_30px_-10px_rgba(13,38,33,0.06)] max-[500px]:p-6"
            >
              <p className="mb-1.5 font-heading text-2xl font-semibold text-text-dark">{content.form_title}</p>
              <p className="mb-5 font-heading text-[13px] text-[#6b7d78]">{content.form_subtitle}</p>

              <div className="mb-4 flex flex-col gap-1.5">
                <label className="font-heading text-xs font-semibold text-[#344b47]" htmlFor="contact-name">
                  Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Enter your name"
                  className="h-[50px] rounded-[9px] border border-[#d6e1dc] px-3.5 font-heading text-sm text-text-dark placeholder:text-[#8a9995] focus:outline-2 focus:-outline-offset-1 focus:outline-primary"
                />
              </div>

              <div className="mb-4 flex flex-col gap-1.5">
                <label className="font-heading text-xs font-semibold text-[#344b47]" htmlFor="contact-email">
                  Email *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  placeholder="Enter your email"
                  className="h-[50px] rounded-[9px] border border-[#d6e1dc] px-3.5 font-heading text-sm text-text-dark placeholder:text-[#8a9995] focus:outline-2 focus:-outline-offset-1 focus:outline-primary"
                />
              </div>

              <div className="mb-4 flex flex-col gap-1.5">
                <label className="font-heading text-xs font-semibold text-[#344b47]" htmlFor="contact-phone">
                  Phone *
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="Enter your phone number"
                  className="h-[50px] rounded-[9px] border border-[#d6e1dc] px-3.5 font-heading text-sm text-text-dark placeholder:text-[#8a9995] focus:outline-2 focus:-outline-offset-1 focus:outline-primary"
                />
              </div>

              <div className="mb-5 flex flex-col gap-1.5">
                <label className="font-heading text-xs font-semibold text-[#344b47]" htmlFor="contact-message">
                  Your skin or hair concern
                </label>
                <textarea
                  id="contact-message"
                  rows={3}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Briefly describe how we can help"
                  className="resize-none rounded-[9px] border border-[#d6e1dc] px-3.5 py-3 font-heading text-sm text-text-dark placeholder:text-[#8a9995] focus:outline-2 focus:-outline-offset-1 focus:outline-primary"
                />
              </div>

              {status === 'error' && (
                <p className="mb-3 font-heading text-sm text-[#df2759]" role="alert">
                  {errorMessage || 'Something went wrong. Please try again.'}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary mb-3 w-1/4 justify-center py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting'
                  ? 'Submitting…'
                  : status === 'success'
                    ? 'Thank you — we’ll be in touch'
                    : 'Submit Enquiry'}
              </button>
              <p className="font-heading text-[11px] text-[#82918d]">
                Submitting this form does not confirm an appointment.
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
