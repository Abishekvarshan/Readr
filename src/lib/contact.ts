export const contactInfo = {
  supportEmail: "readrbooks.lk@gmail.com",
  whatsappNumber: "+94 76 370 6278",
  whatsappUrl:
    "https://wa.me/94763706278?text=Hi%20Readr%2C%20I%27m%20interested%20in%20your%20books.",
};

export const emailJsConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
  contactTemplateId:
    process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
    "",
  autoReplyTemplateId:
    process.env.NEXT_PUBLIC_EMAILJS_AUTO_REPLY_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
    "",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
};

export const hasEmailJsConfig = Boolean(
  emailJsConfig.serviceId &&
    emailJsConfig.contactTemplateId &&
    emailJsConfig.autoReplyTemplateId &&
    emailJsConfig.publicKey,
);
