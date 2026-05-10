export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabasePublishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || "book-images",
  payHereMerchantId: process.env.PAYHERE_MERCHANT_ID || "",
  payHereMerchantSecret: process.env.PAYHERE_MERCHANT_SECRET || "",
  payHereSandbox: process.env.PAYHERE_SANDBOX !== "false",
  firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  firebaseMessagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  firebaseMeasurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

export const hasSupabase = Boolean(env.supabaseUrl && env.supabasePublishableKey);
export const hasSupabaseAdmin = Boolean(
  env.supabaseUrl && env.supabaseServiceRoleKey,
);
export const hasPayHere = Boolean(
  env.payHereMerchantId && env.payHereMerchantSecret,
);
export const hasFirebase = Boolean(
  env.firebaseApiKey &&
    env.firebaseAuthDomain &&
    env.firebaseProjectId &&
    env.firebaseAppId,
);
