import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mockBooks, mockOrders } from "@/lib/data/mock";
import { type Book, type BookFilters, type CartItem, type CartLine, type Order } from "@/types";

const CART_COOKIE = "bookhaven-cart";

function filterBooks(books: Book[], filters?: BookFilters) {
  return books.filter((book) => {
    const query = filters?.query?.toLowerCase().trim();
    const matchesQuery =
      !query ||
      [book.title, book.author, book.category].some((value) =>
        value.toLowerCase().includes(query),
      );
    const matchesCategory = !filters?.category || filters.category === "all" || book.category === filters.category;
    const matchesCondition = !filters?.condition || filters.condition === "all" || book.condition === filters.condition;
    const matchesPrice = !filters?.maxPrice || book.price <= Number(filters.maxPrice);
    return matchesQuery && matchesCategory && matchesCondition && matchesPrice;
  });
}

export async function getBooks(filters?: BookFilters) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return filterBooks(mockBooks, filters);
  }

  let query = supabase.from("books").select("*").order("created_at", { ascending: false });
  if (filters?.category && filters.category !== "all") query = query.eq("category", filters.category);
  if (filters?.condition && filters.condition !== "all") query = query.eq("condition", filters.condition);
  if (filters?.maxPrice) query = query.lte("price", Number(filters.maxPrice));
  if (filters?.query) query = query.or(`title.ilike.%${filters.query}%,author.ilike.%${filters.query}%`);

  const { data } = await query;
  return (data as Book[] | null) ?? filterBooks(mockBooks, filters);
}

export async function getFeaturedBooks() {
  const books = await getBooks();
  return books.filter((book) => book.featured).slice(0, 4);
}

export async function getBookBySlug(slug: string) {
  const books = await getBooks();
  return books.find((book) => book.slug === slug) ?? null;
}

export async function getBookById(id: string) {
  const books = await getBooks();
  return books.find((book) => book.id === id) ?? null;
}

export async function getCategories() {
  const books = await getBooks();
  return [...new Set(books.map((book) => book.category))].sort();
}

export async function getMarketplaceStats() {
  const books = await getBooks();
  return {
    books: books.length,
    sellers: [...new Set(books.map((book) => book.seller_name))].length,
    orders: mockOrders.length + 24,
  };
}

export async function getCartItems(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE)?.value;
  if (!raw) return [];

  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export async function getCartLines(): Promise<CartLine[]> {
  const cart = await getCartItems();
  const books = await getBooks();

  return cart
    .map((item) => {
      const book = books.find((entry) => entry.id === item.bookId);
      if (!book) return null;
      return {
        book,
        quantity: item.quantity,
        lineTotal: book.price * item.quantity,
      };
    })
    .filter(Boolean) as CartLine[];
}

export async function getCartSummary() {
  const lines = await getCartLines();
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  return {
    lines,
    subtotal,
    shipping: lines.length ? 450 : 0,
    total: subtotal + (lines.length ? 450 : 0),
  };
}

export async function getDashboardBooks() {
  return getBooks();
}

export async function getOrders(): Promise<Order[]> {
  const admin = createSupabaseAdminClient();
  if (!admin) return mockOrders;

  const { data } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return (data as Order[] | null) ?? mockOrders;
}

export async function getOrderById(id: string) {
  const admin = createSupabaseAdminClient();
  if (!admin) return mockOrders.find((order) => order.id === id) ?? null;

  const { data } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  return (data as Order | null) ?? null;
}