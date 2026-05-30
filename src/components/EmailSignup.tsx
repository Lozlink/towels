"use client";

import { useId, useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";
import { CheckCircleIcon } from "./icons";

function isValidEmail(value: string): boolean {
  const at = value.indexOf("@");
  return at >= 1 && value.indexOf(".") > at;
}

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const inputId = useId();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValidEmail(email.trim())) {
      setError(true);
      return;
    }
    setError(false);
    setSubmitted(true);
  }

  return (
    <section id="signup" className="pb-24 max-[680px]:pb-[68px]">
      <div className="wrap-wide">
        <Reveal className="relative overflow-hidden rounded-[2px] rounded-tr-[44px] bg-terracotta px-12 py-16 text-left text-white shadow-brand-lg max-[680px]:px-[26px] max-[680px]:py-12">
          <div className="signup-deco absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="signup-weave absolute inset-0" aria-hidden="true" />

          <div className="relative z-[2] grid grid-cols-12 items-center gap-x-12 gap-y-8">
            <div className="col-span-12 lg:col-span-6">
              <p className="index-tag mb-5 flex items-center gap-3 text-white/85">
                <span className="h-px w-9 bg-white/40" aria-hidden="true" />
                Join the weave
              </p>
              <h2 className="display-lg max-w-[12ch] font-semibold text-white">
                10% off your first order.
              </h2>
            </div>

            <div className="col-span-12 lg:col-span-6">
              <p className="mb-7 max-w-[44ch] text-lg text-white/90">
                Join the list for a single welcome code, restock news, and the
                occasional quiet note. No noise.
              </p>

              {submitted ? (
                <div className="flex max-w-[460px] items-center gap-3 rounded-[2px] border border-white/30 bg-white/15 p-[22px] text-[19px] font-semibold">
                  <CheckCircleIcon className="h-[26px] w-[26px] flex-none" />
                  <span>
                    You&apos;re in. Check your inbox for{" "}
                    <strong>BAMBOO10</strong>.
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex max-w-[460px] gap-2.5 max-[680px]:flex-col"
                >
                  <label htmlFor={inputId} className="sr-only">
                    Email address
                  </label>
                  <input
                    id={inputId}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="you@email.com.au"
                    aria-invalid={error}
                    className={`flex-1 rounded-full border-none bg-bone-2 px-5 py-4 text-base text-ink outline-none focus:outline focus:outline-[3px] ${
                      error ? "outline-white" : "focus:outline-white/55"
                    }`}
                  />
                  <button
                    type="submit"
                    className="whitespace-nowrap rounded-full bg-kelp px-7 py-4 text-base font-semibold text-white transition-[background,transform] hover:-translate-y-px hover:bg-[#2c3531]"
                  >
                    Get my code
                  </button>
                </form>
              )}

              <p className="mt-[18px] text-xs text-white/70">
                Unsubscribe anytime. We never share your details.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
