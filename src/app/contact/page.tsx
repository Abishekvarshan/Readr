import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/contact-section";

export const metadata: Metadata = {
  title: "Contact Us | Readr",
  description: "Contact Readr support by email, phone, or WhatsApp.",
};

export default function ContactPage() {
  return <ContactSection />;
}
