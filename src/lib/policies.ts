export type PolicySection = {
  title: string;
  body?: string[];
  items?: string[];
};

export type Policy = {
  title: string;
  description: string;
  updatedAt: string;
  sections: PolicySection[];
};

export const policies = {
  refund: {
    title: "Refund Policy",
    description:
      "How Readr handles returns, exchanges, refunds, damaged books, and return shipping.",
    updatedAt: "May 11, 2026",
    sections: [
      {
        title: "Returns",
        body: [
          "Readr accepts return requests within 7 days from the date you receive your order. To be eligible for a return, the book must be unused, in the same condition that you received it, and returned with any original packaging or order information supplied with the delivery.",
          "Because Readr sells second-hand books, normal signs of prior use that were clearly listed on the product page are not considered defects. Please review the book condition, images, and description before placing your order.",
        ],
      },
      {
        title: "Refunds",
        body: [
          "After we receive and inspect the returned item, we will notify you whether your refund has been approved. Approved refunds are issued to the original payment method used at checkout.",
          "Delivery or shipping charges from the original order are not refundable unless the return is due to our error, a wrong item, or a damaged or defective item.",
        ],
      },
      {
        title: "Exchanges",
        body: [
          "If you receive the wrong book or need an exchange for an available replacement copy, contact us within 7 days of receiving your order. Exchanges depend on product availability, because many listed books are single-copy second-hand items.",
        ],
      },
      {
        title: "Non-Returnable Items",
        items: [
          "Books returned after the 7-day return period.",
          "Books that have been used, damaged, marked, or altered after delivery.",
          "Items sold as final sale, clearance, or non-returnable.",
          "Gift cards, downloadable products, or digital items, if offered.",
        ],
      },
      {
        title: "Damaged or Defective Items",
        body: [
          "If your item arrives damaged, defective, or different from what you ordered, please contact us as soon as possible and within 48 hours of delivery. We may request photos or order details so we can arrange a replacement, exchange, or refund depending on availability.",
        ],
      },
      {
        title: "Return Shipping",
        body: [
          "You are responsible for return shipping costs unless the return is due to our error, a wrong item, or an item that arrived damaged or defective. When the issue is our responsibility, we will guide you on the return process.",
        ],
      },
      {
        title: "Processing Time",
        body: [
          "Approved refunds and exchanges are usually processed within 5 business days after we receive the returned item. Your bank, card issuer, or payment provider may take additional time to show the refund in your account.",
        ],
      },
      {
        title: "Contact Us",
        body: [
          "For return, refund, or exchange requests, contact Readr customer support using the contact details provided on our website or in your order communication. Please include your order number, name, and the reason for the request.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "How Readr collects, uses, protects, and shares customer information.",
    updatedAt: "May 11, 2026",
    sections: [
      {
        title: "Information We Collect",
        body: [
          "When you use Readr, we may collect information you provide during account registration, checkout, or support requests, including your name, email address, phone number, delivery address, and order details.",
          "We may also collect basic technical information such as your IP address, browser type, device information, pages viewed, and interactions with our website through cookies or similar technologies.",
        ],
      },
      {
        title: "Payment Information",
        body: [
          "Payments are processed through trusted third-party payment providers such as PayHere. Readr does not store your full card details. Payment providers may collect and process payment information according to their own security and privacy practices.",
        ],
      },
      {
        title: "How We Use Information",
        items: [
          "To process orders, payments, delivery, returns, refunds, and customer support requests.",
          "To communicate with you about your account, purchases, order status, and service updates.",
          "To improve Readr, personalize the shopping experience, and maintain website performance.",
          "To detect and prevent fraud, unauthorized activity, abuse, and security issues.",
          "To comply with legal, tax, accounting, payment, and regulatory obligations.",
        ],
      },
      {
        title: "Information Sharing",
        body: [
          "We do not sell your personal information. We may share information with service providers who help us operate Readr, process payments, deliver orders, host systems, provide analytics, or support customers. These providers are expected to handle your information securely and only for the services they provide to us.",
          "We may also disclose information when required by law, legal process, payment network rules, fraud prevention requirements, or to protect the rights, safety, and security of Readr, our customers, and others.",
        ],
      },
      {
        title: "Cookies and Tracking",
        body: [
          "Readr may use cookies and similar technologies to keep the website working, remember preferences, analyze traffic, and improve the shopping experience. You can adjust cookie settings in your browser, but some website features may not work correctly if cookies are disabled.",
        ],
      },
      {
        title: "Data Security",
        body: [
          "We use reasonable technical and organizational measures to protect personal information from unauthorized access, loss, misuse, alteration, or disclosure. However, no internet transmission or electronic storage method is completely secure, so we cannot guarantee absolute security.",
        ],
      },
      {
        title: "Data Retention",
        body: [
          "We keep personal information only for as long as needed to provide our services, complete transactions, resolve disputes, maintain records, prevent fraud, and comply with legal obligations.",
        ],
      },
      {
        title: "Your Requests",
        body: [
          "You may contact us to request access, correction, or deletion of your personal information, subject to legal, operational, payment, and record-keeping requirements.",
        ],
      },
      {
        title: "Changes to This Policy",
        body: [
          "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.",
        ],
      },
      {
        title: "Contact Us",
        body: [
          "If you have questions about this Privacy Policy or how Readr handles personal information, contact us using the contact details provided on our website.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms and Conditions",
    description:
      "The terms governing use of Readr and purchases made through the website.",
    updatedAt: "May 11, 2026",
    sections: [
      {
        title: "Use of the Website",
        items: [
          "You must provide accurate, current, and complete information when creating an account, placing an order, or contacting us.",
          "You are responsible for maintaining the confidentiality of your account details and for activity under your account.",
          "You must not use Readr for unlawful, fraudulent, abusive, or unauthorized purposes.",
          "If you are under 18 years old, you should use Readr only with the involvement of a parent or guardian.",
        ],
      },
      {
        title: "Product Information and Pricing",
        body: [
          "Readr lists second-hand books and related book products. We try to provide accurate titles, descriptions, images, conditions, prices, and availability. However, minor differences may occur, especially with used books.",
          "Prices are shown in Sri Lankan Rupees unless stated otherwise. Prices, availability, discounts, and promotions may change without notice before an order is confirmed.",
        ],
      },
      {
        title: "Orders and Payments",
        body: [
          "By placing an order, you make an offer to buy the selected products. We may accept, reject, or cancel an order for reasons including product unavailability, pricing or listing errors, payment issues, delivery limitations, or suspected fraud.",
          "You agree to provide valid payment and billing information. Payments may be processed by third-party payment providers such as PayHere. We do not store or have access to your full card details.",
        ],
      },
      {
        title: "Shipping and Delivery",
        body: [
          "Readr offers islandwide delivery within Sri Lanka where courier service is available. Estimated delivery is usually 2 to 5 business days after order confirmation, but delivery times may vary based on location, courier availability, public holidays, weather, or other circumstances outside our control.",
          "You are responsible for providing a complete and accurate delivery address and reachable contact number. Additional delivery fees may apply if an order must be resent because of incorrect delivery details or failed delivery attempts.",
        ],
      },
      {
        title: "Returns and Refunds",
        body: [
          "Returns, refunds, exchanges, damaged items, and return shipping are handled according to our Refund Policy. Please review the Refund Policy before completing your purchase.",
        ],
      },
      {
        title: "Intellectual Property",
        body: [
          "All Readr website content, including text, layout, graphics, logos, images, and software, is owned by Readr or its licensors and is protected by applicable intellectual property laws. You may not copy, reproduce, distribute, modify, or use our content without prior written permission, except as allowed by law.",
        ],
      },
      {
        title: "Limitation of Liability",
        body: [
          "To the maximum extent permitted by law, Readr will not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the website or products purchased through it.",
          "Readr does not guarantee that the website will always be available, uninterrupted, error-free, or free from harmful components.",
        ],
      },
      {
        title: "Changes and Termination",
        body: [
          "We may update these Terms and Conditions at any time by posting the revised version on this page. We may suspend or terminate access to Readr if we believe a user has violated these terms or used the website improperly.",
        ],
      },
      {
        title: "Contact Us",
        body: [
          "If you have questions about these Terms and Conditions, contact Readr using the contact details provided on our website.",
        ],
      },
    ],
  },
} satisfies Record<string, Policy>;
