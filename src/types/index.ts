export type UserRole = "customer" | "seller" | "admin";

export type BookCondition = "new" | "like_new" | "good" | "fair" | "acceptable";

export type OrderStatus = "pending" | "paid" | "cancelled" | "failed";

export type PaymentStatus = "unpaid" | "paid" | "refunded" | "failed";

export type Book = {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  category: string;
  condition: BookCondition;
  language: string;
  price: number;
  stock: number;
  featured: boolean;
  image_url: string;
  seller_name: string;
  isbn?: string | null;
  published_year?: number | null;
  created_at?: string;
};

export type CartItem = {
  bookId: string;
  quantity: number;
};

export type CartLine = {
  book: Book;
  quantity: number;
  lineTotal: number;
};

export type OrderItem = {
  id?: string;
  order_id?: string;
  book_id: string;
  quantity: number;
  unit_price: number;
  title: string;
};

export type Order = {
  id: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  currency: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payhere_payment_id?: string | null;
  created_at?: string;
  items?: OrderItem[];
};

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
};

export type BookFilters = {
  query?: string;
  category?: string;
  condition?: string;
  maxPrice?: string;
};