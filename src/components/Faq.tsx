"use client";

import { useState } from "react";
import { FAQS } from "@/lib/faqs-data";
import { Reveal } from "./Reveal";

export function Faq() {
  // Single-open accordion, mirroring the source behaviour.
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="section bg-gradient-to-b from-bone to-bone-2" id="faq">
      <div className="wrap-wide">
        <div className="grid grid-cols-12 gap-x-16 gap-y-10">
          <Reveal className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-[100px]">
              <p className="index-tag mb-5 flex items-center gap-3">
                <b>05</b>
                <span className="h-px w-9 bg-ink-40" aria-hidden="true" />
                FAQ
              </p>
              <h2 className="display-lg max-w-[7ch] font-semibold">
                Good questions.
              </h2>
              <p className="mt-6 max-w-[34ch] text-[15px] text-ink-70">
                Straight answers — including the one everyone should ask about
                &ldquo;bamboo&rdquo;.
              </p>
            </div>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-8">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            const panelId = `faq-panel-${faq.id}`;
            const buttonId = `faq-trigger-${faq.id}`;
            return (
              <div key={faq.id} className="border-b border-line">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="faq-trigger flex w-full items-center justify-between gap-5 px-1 py-[26px] text-left font-display text-[21px] font-semibold text-ink"
                  >
                    {faq.question}
                    <span
                      className="faq-plus relative flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full border-[1.5px] border-line"
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="faq-answer"
                  data-open={isOpen}
                >
                  <div>
                    <div className="max-w-[660px] px-1 pb-[26px] text-base text-ink-70 [&_p:last-child]:mb-0 [&_p]:mb-[0.8em]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
