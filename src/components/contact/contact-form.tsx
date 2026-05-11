"use client";

import { useMemo, useState } from "react";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { contactInfo, emailJsConfig, hasEmailJsConfig } from "@/lib/contact";

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(3, "Please enter a subject."),
  message: z
    .string()
    .trim()
    .min(10, "Please enter a message with at least 10 characters.")
    .max(1200, "Please keep your message under 1200 characters."),
  company: z.string().max(0),
});

type ContactFormValues = z.infer<typeof contactSchema>;
type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

function buildContactMessage(values: ContactFormValues) {
  return [
    `Subject: ${values.subject}`,
    `Email: ${values.email}`,
    `Phone: ${values.phone || "Not provided"}`,
    "",
    values.message,
  ].join("\n");
}

function buildContactParams(values: ContactFormValues) {
  return {
    email: contactInfo.supportEmail,
    to_email: contactInfo.supportEmail,
    name: values.fullName,
    time: new Date().toLocaleString(),
    message: buildContactMessage(values),
    reply_to: values.email,
  };
}

function buildAutoReplyParams(values: ContactFormValues) {
  return {
    to_email: values.email,
    email_to: values.email,
    recipient_email: values.email,
    to_name: values.fullName,
    from_name: values.fullName,
    name: values.fullName,
    from_email: values.email,
    customer_email: values.email,
    email: values.email,
    phone: values.phone || "Not provided",
    subject: values.subject,
    message: values.message,
    reply_to: values.email,
  };
}

export function ContactForm() {
  const [toast, setToast] = useState<ToastState>(null);
  const [isSending, setIsSending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      company: "",
    },
  });

  const configMissingMessage = useMemo(
    () =>
      "Contact form is not configured yet. Please set the EmailJS environment variables.",
    [],
  );

  async function onSubmit(values: ContactFormValues) {
    if (!hasEmailJsConfig) {
      setToast({ type: "error", message: configMissingMessage });
      return;
    }

    setIsSending(true);
    setToast(null);

    try {
      const sendOptions = { publicKey: emailJsConfig.publicKey };

      await emailjs.send(
        emailJsConfig.serviceId,
        emailJsConfig.contactTemplateId,
        buildContactParams(values),
        sendOptions,
      );

      await emailjs.send(
        emailJsConfig.serviceId,
        emailJsConfig.autoReplyTemplateId,
        buildAutoReplyParams(values),
        sendOptions,
      );

      reset();
      setToast({
        type: "success",
        message: "Thanks, your message was sent to Readr support.",
      });
    } catch (error) {
      const emailJsMessage =
        error instanceof EmailJSResponseStatus && error.text
          ? ` EmailJS says: ${error.text}`
          : "";

      setToast({
        type: "error",
        message: `We could not send your message.${emailJsMessage} Please try WhatsApp or email.`,
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {toast && (
        <div
          className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          role="status"
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <input
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        {...register("company")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold text-[var(--brown)]">
            Full Name
          </span>
          <input
            className="field"
            autoComplete="name"
            placeholder="Your name"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-700">{errors.fullName.message}</p>
          )}
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[var(--brown)]">
            Email Address
          </span>
          <input
            className="field"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>
          )}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold text-[var(--brown)]">
            Phone Number <span className="font-normal text-muted">(optional)</span>
          </span>
          <input
            className="field"
            autoComplete="tel"
            placeholder="+94 77 123 4567"
            {...register("phone")}
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-[var(--brown)]">
            Subject
          </span>
          <input
            className="field"
            placeholder="Order, book request, delivery..."
            {...register("subject")}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-700">{errors.subject.message}</p>
          )}
        </label>
      </div>

      <label>
        <span className="mb-2 block text-sm font-semibold text-[var(--brown)]">
          Message
        </span>
        <textarea
          className="field min-h-36 resize-y"
          placeholder="Tell us how we can help."
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-700">{errors.message.message}</p>
        )}
      </label>

      {!hasEmailJsConfig && (
        <p className="rounded-lg bg-[var(--paper)] p-3 text-sm text-muted">
          EmailJS is ready in code. Add service ID, template ID, and public key
          environment variables before using the form in production.
        </p>
      )}

      <button className="btn-primary w-full sm:w-fit" disabled={isSending} type="submit">
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {isSending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
