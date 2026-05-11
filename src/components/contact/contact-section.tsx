import { Mail, PhoneCall } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { contactInfo } from "@/lib/contact";

type ContactSectionProps = {
  compact?: boolean;
};

export function ContactSection({ compact = false }: ContactSectionProps) {
  return (
    <section className={compact ? "container-shell mt-6" : "container-shell py-8 sm:py-10"}>
      <div className="surface mx-auto max-w-3xl p-5 sm:p-6">
        <span className="badge badge-amber">Contact Readr</span>
        <h2 className="mt-4 text-2xl font-black text-[var(--brown)] sm:text-3xl">
          Need help finding a book?
        </h2>
        <p className="mt-3 leading-7 text-muted">
          Send us a message about orders, delivery, returns, or book requests.
          We will reply as soon as possible.
        </p>

        <div className="mt-6">
          <ContactForm />
        </div>

        <div className="mt-6 grid gap-2 border-t border-[var(--border)] pt-4 sm:grid-cols-3">
          <a
            href={`mailto:${contactInfo.supportEmail}`}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm font-semibold hover:bg-[var(--paper)]"
          >
            <Mail className="h-4 w-4 shrink-0 text-[var(--gold)]" />
            <span className="truncate">{contactInfo.supportEmail}</span>
          </a>
          <a
            href={`tel:${contactInfo.whatsappNumber.replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm font-semibold hover:bg-[var(--paper)]"
          >
            <PhoneCall className="h-4 w-4 shrink-0 text-[var(--gold)]" />
            <span>{contactInfo.whatsappNumber}</span>
          </a>
          <a
            href={contactInfo.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm font-semibold text-green-800 hover:bg-green-100"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
              viewBox="0 0 32 32"
              fill="currentColor"
            >
              <path d="M16.04 3.2c-7.03 0-12.75 5.72-12.75 12.75 0 2.25.59 4.45 1.72 6.38L3.2 28.8l6.62-1.74a12.66 12.66 0 0 0 6.21 1.58h.01c7.03 0 12.75-5.72 12.75-12.75S23.07 3.2 16.04 3.2Zm0 23.3h-.01c-1.87 0-3.71-.5-5.32-1.45l-.38-.23-3.93 1.03 1.05-3.83-.25-.39a10.5 10.5 0 0 1-1.61-5.68c0-5.77 4.69-10.46 10.46-10.46 2.79 0 5.42 1.09 7.39 3.07a10.38 10.38 0 0 1 3.06 7.39c0 5.77-4.69 10.55-10.46 10.55Zm5.74-7.83c-.31-.16-1.86-.92-2.15-1.02-.29-.11-.5-.16-.71.16-.21.31-.81 1.02-.99 1.23-.18.21-.37.24-.68.08-.31-.16-1.33-.49-2.54-1.56-.94-.84-1.57-1.87-1.75-2.18-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.62s1.13 3.05 1.29 3.26c.16.21 2.23 3.4 5.4 4.77.75.32 1.34.52 1.8.66.76.24 1.45.21 1.99.13.61-.09 1.86-.76 2.13-1.5.26-.73.26-1.36.18-1.5-.08-.13-.29-.21-.61-.37Z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
