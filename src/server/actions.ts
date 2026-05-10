"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { absoluteUrl, slugify } from "@/lib/utils";
import { bookSchema, cartSchema, checkoutSchema, loginSchema, signupSchema } from "@/lib/validations";
import { getCartItems, getCartSummary } from "@/lib/data/queries";
import { env } from "@/lib/config";
import { type CartItem } from "@/types";

const CART_COOKIE = "bookhaven-cart";
const FIREBASE_SESSION_COOKIE = "firebase_session";

function formValue(formData: FormData, key: string) {
  return formData.get(key)?.toString() ?? "";
}

async function ensureSellerRole() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return true;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["seller", "admin"].includes(profile.role)) {
    redirect("/login?next=/dashboard");
  }

  return user;
}

export async function signupAction(formData: FormData) {
  const payload = signupSchema.parse({
    fullName: formValue(formData, "fullName"),
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
  });

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/signup?message=Configure Supabase to enable authentication");
  }

  const { error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      emailRedirectTo: absoluteUrl("/auth/callback"),
      data: { full_name: payload.fullName },
    },
  });

  if (error) {
    redirect(`/signup?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Account created. Please check your email if confirmation is enabled.");
}

export async function loginAction(formData: FormData) {
  const payload = loginSchema.parse({
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
  });

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/login?message=Configure Supabase to enable authentication");
  }

  const { error } = await supabase.auth.signInWithPassword(payload);
  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  const cookieStore = await cookies();
  cookieStore.delete(FIREBASE_SESSION_COOKIE);
  redirect("/");
}

export async function addToCartAction(formData: FormData) {
  const payload = cartSchema.parse({
    bookId: formValue(formData, "bookId"),
    quantity: formValue(formData, "quantity") || 1,
  });

  const cookieStore = await cookies();
  const current = await getCartItems();
  const existing = current.find((item) => item.bookId === payload.bookId);

  let next: CartItem[];
  if (existing) {
    next = current.map((item) =>
      item.bookId === payload.bookId
        ? { ...item, quantity: Math.min(item.quantity + payload.quantity, 10) }
        : item,
    );
  } else {
    next = [...current, payload];
  }

  cookieStore.set(CART_COOKIE, JSON.stringify(next), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  revalidatePath("/cart");
  revalidatePath("/checkout");
  redirect("/cart");
}

export async function updateCartItemAction(formData: FormData) {
  const payload = cartSchema.parse({
    bookId: formValue(formData, "bookId"),
    quantity: formValue(formData, "quantity") || 1,
  });

  const cookieStore = await cookies();
  const current = await getCartItems();
  const next = current
    .map((item) =>
      item.bookId === payload.bookId ? { ...item, quantity: payload.quantity } : item,
    )
    .filter((item) => item.quantity > 0);

  cookieStore.set(CART_COOKIE, JSON.stringify(next), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function removeCartItemAction(formData: FormData) {
  const bookId = formValue(formData, "bookId");
  const cookieStore = await cookies();
  const current = await getCartItems();
  const next = current.filter((item) => item.bookId !== bookId);

  cookieStore.set(CART_COOKIE, JSON.stringify(next), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function createBookAction(formData: FormData) {
  await ensureSellerRole();
  const file = formData.get("image") as File | null;
  let imageUrl = formValue(formData, "imageUrl");

  const parsed = bookSchema.parse({
    title: formValue(formData, "title"),
    author: formValue(formData, "author"),
    description: formValue(formData, "description"),
    category: formValue(formData, "category"),
    condition: formValue(formData, "condition"),
    language: formValue(formData, "language"),
    price: formValue(formData, "price"),
    stock: formValue(formData, "stock"),
    imageUrl,
    sellerName: formValue(formData, "sellerName"),
    featured: formValue(formData, "featured") === "on",
    isbn: formValue(formData, "isbn"),
    publishedYear: formValue(formData, "publishedYear") || undefined,
  });

  const admin = createSupabaseAdminClient();
  if (!admin) {
    redirect("/dashboard/books?message=Add SUPABASE_SERVICE_ROLE_KEY to enable CRUD and uploads");
  }

  if (file && file.size > 0) {
    const extension = file.name.split(".").pop();
    const path = `books/${Date.now()}-${slugify(parsed.title)}.${extension}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await admin.storage
      .from(env.storageBucket)
      .upload(path, bytes, { contentType: file.type, upsert: false });

    if (!uploadError) {
      const { data } = admin.storage.from(env.storageBucket).getPublicUrl(path);
      imageUrl = data.publicUrl;
    }
  }

  const slug = slugify(`${parsed.title}-${parsed.author}`);
  await admin.from("books").insert({
    slug,
    title: parsed.title,
    author: parsed.author,
    description: parsed.description,
    category: parsed.category,
    condition: parsed.condition,
    language: parsed.language,
    price: parsed.price,
    stock: parsed.stock,
    image_url: imageUrl,
    seller_name: parsed.sellerName,
    isbn: parsed.isbn || null,
    published_year: parsed.publishedYear || null,
    featured: parsed.featured,
  });

  revalidatePath("/books");
  revalidatePath("/dashboard/books");
  redirect("/dashboard/books?message=Book created successfully");
}

export async function updateBookAction(formData: FormData) {
  await ensureSellerRole();
  const admin = createSupabaseAdminClient();
  if (!admin) redirect("/dashboard/books?message=Configure Supabase service role");

  const id = formValue(formData, "id");
  const parsed = bookSchema.parse({
    id,
    title: formValue(formData, "title"),
    author: formValue(formData, "author"),
    description: formValue(formData, "description"),
    category: formValue(formData, "category"),
    condition: formValue(formData, "condition"),
    language: formValue(formData, "language"),
    price: formValue(formData, "price"),
    stock: formValue(formData, "stock"),
    imageUrl: formValue(formData, "imageUrl"),
    sellerName: formValue(formData, "sellerName"),
    featured: formValue(formData, "featured") === "on",
    isbn: formValue(formData, "isbn"),
    publishedYear: formValue(formData, "publishedYear") || undefined,
  });

  await admin
    .from("books")
    .update({
      title: parsed.title,
      author: parsed.author,
      description: parsed.description,
      category: parsed.category,
      condition: parsed.condition,
      language: parsed.language,
      price: parsed.price,
      stock: parsed.stock,
      image_url: parsed.imageUrl,
      seller_name: parsed.sellerName,
      isbn: parsed.isbn || null,
      published_year: parsed.publishedYear || null,
      featured: parsed.featured,
      slug: slugify(`${parsed.title}-${parsed.author}`),
    })
    .eq("id", id);

  revalidatePath("/books");
  revalidatePath("/dashboard/books");
}

export async function deleteBookAction(formData: FormData) {
  await ensureSellerRole();
  const admin = createSupabaseAdminClient();
  if (!admin) redirect("/dashboard/books?message=Configure Supabase service role");

  await admin.from("books").delete().eq("id", formValue(formData, "id"));
  revalidatePath("/books");
  revalidatePath("/dashboard/books");
}

export async function createCheckoutOrderAction(formData: FormData) {
  const payload = checkoutSchema.parse({
    customerName: formValue(formData, "customerName"),
    customerEmail: formValue(formData, "customerEmail"),
    customerPhone: formValue(formData, "customerPhone"),
    customerAddress: formValue(formData, "customerAddress"),
  });

  const summary = await getCartSummary();
  if (!summary.lines.length) {
    redirect("/cart");
  }

  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();
  if (!admin) {
    redirect("/checkout?message=Configure Supabase service role to create orders");
  }

  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const orderId = `ord_${crypto.randomUUID().slice(0, 8)}`;

  await admin.from("orders").insert({
    id: orderId,
    user_id: user?.id ?? null,
    customer_name: payload.customerName,
    customer_email: payload.customerEmail,
    customer_phone: payload.customerPhone,
    customer_address: payload.customerAddress,
    total_amount: summary.total,
    currency: "LKR",
    order_status: "pending",
    payment_status: "unpaid",
  });

  await admin.from("order_items").insert(
    summary.lines.map((line) => ({
      order_id: orderId,
      book_id: line.book.id,
      quantity: line.quantity,
      unit_price: line.book.price,
      title: line.book.title,
    })),
  );

  redirect(`/checkout?order_id=${orderId}`);
}
