"use client";

import React, { useState } from "react";
import { contactData } from "@/data/content";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto max-w-7xl border-t border-border px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Kiri: Ajakan & kanal sosial media */}
        <div className="lg:col-span-5">
          <h2
            id="contact-heading"
            className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl"
          >
            {contactData.heading}
          </h2>
          <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-muted">
            {contactData.description}
          </p>

          <ul className="mt-10 divide-y divide-border border-y border-border">
            {contactData.socials.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex items-center justify-between py-3.5 text-sm transition-colors hover:text-accent"
                >
                  <span className="font-medium text-ink group-hover:text-accent">
                    {item.label}
                  </span>
                  <span className="text-muted group-hover:text-accent">
                    {item.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Kanan: Form kontak tampilan saja */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-surface/60 p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-ink"
                >
                  Nama
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (submitted) setSubmitted(false);
                  }}
                  placeholder="Nama lengkap Anda"
                  className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-ink"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (submitted) setSubmitted(false);
                  }}
                  placeholder="nama@email.com"
                  className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-ink"
              >
                Pesan
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (submitted) setSubmitted(false);
                }}
                placeholder="Ceritakan singkat proyek, kebutuhan, atau jadwal kolaborasi."
                className="mt-2 w-full resize-none rounded-xl border border-border bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <MagneticButton
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
              >
                Kirim pesan
              </MagneticButton>

              {submitted ? (
                <p
                  role="status"
                  aria-live="polite"
                  className="text-sm font-medium text-accent"
                >
                  Pesan tercatat (mode template). Untuk respons cepat, hubungi lewat email.
                </p>
              ) : (
                <p className="text-xs text-muted">
                  Formulir ini belum terhubung ke backend.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
