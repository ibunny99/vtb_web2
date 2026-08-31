'use client';
import React, { useState, useEffect } from 'react';

interface FAQItemData {
  id?: number;
  question: string;
  answer: string;
}

const defaultFaqs: FAQItemData[] = [
  {
    question: 'How do I join the VTB Roleplay server? / របៀបចូលរួម?',
    answer:
      'Join our official VTB Roleplay Discord server, read through the server rules carefully, and submit a Whitelist application once portals are open. / ចូលរួម Discord ផ្លូវការរបស់ VTB Roleplay ហើយដាក់ពាក្យ Whitelist។',
  },
  {
    question: 'Is POV recording required during shootouts/gunfights?',
    answer:
      'Yes. All players participating in PvP combat or shootouts must record their POV (Point of View) and retain the footage for at least 14 days.',
  },
  {
    question: 'How do I report bugs or rule violations?',
    answer:
      'Always stay In-Character (IC) until the scenario finishes. Afterwards, open a support ticket on the VTB Roleplay Discord with video evidence.',
  },
  {
    question: 'What are Queue Priority Subscriptions?',
    answer:
      'Subscriptions grant queue priority for faster server access, exclusive Discord roles, and directly support server maintenance and development.',
  },
];

function FAQItem({ item }: { item: FAQItemData }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <button
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 border-none bg-transparent py-5 text-start font-heading text-base font-bold text-white transition-colors duration-200 hover:text-[#00DCFF] focus-visible:outline-none focus-visible:text-[#00DCFF]"
        onClick={() => setOpen(!open)}
      >
        <span>{item.question}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="flex-shrink-0"
          style={{
            color: 'rgba(255,255,255,0.35)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.4s cubic-bezier(0.25,0.1,0.25,1), color 0.2s ease',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className="overflow-hidden"
        style={{
          maxHeight: open ? '280px' : '0',
          transition: 'max-height 0.5s cubic-bezier(0.25,0.1,0.25,1), padding 0.5s cubic-bezier(0.25,0.1,0.25,1)',
          paddingBottom: open ? '1.25rem' : '0',
        }}
      >
        <p
          className="text-[0.9375rem] leading-[1.7]"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQItemData[]>(defaultFaqs);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data && d.data.faqs && d.data.faqs.length > 0) {
          setFaqs(d.data.faqs);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Top zigzag */}
      <div className="relative -mb-px w-full leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" className="block h-12 w-full md:h-20">
          <path d="M0 80V44L36 16H520L544 0H896L920 16H1404L1440 44V80H0Z" fill="#0C0F14" />
        </svg>
      </div>

      <section
        id="faq"
        className="relative section-py"
        style={{ backgroundColor: '#0C0F14' }}
      >
        <div className="container-app">
          <div data-reveal className="mb-14 text-center">
            <h2 className="section-title">
              Frequently Asked
              <br />
              <span className="text-gradient">Questions / សំណួរ</span>
            </h2>
          </div>

          <div data-reveal className="mx-auto max-w-[800px]">
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {faqs.map((faq, idx) => (
                <FAQItem key={faq.id || idx} item={faq} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
