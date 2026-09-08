import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Category = Tables<"categories">;
export type Product = Tables<"products">;
export type Review = Tables<"reviews">;
export type Order = Tables<"orders">;

export const SHOP = {
  name: "Sweet Crumb",
  tagline: "Artisan Cake Boutique",
  phone: "+880 1700-000000",
  email: "hello@sweetcrumb.com",
  address: "House 12, Road 5, Dhanmondi, Dhaka 1205",
  hours: [
    { day: "Mon – Thu", time: "9:00 AM – 9:00 PM" },
    { day: "Fri – Sat", time: "9:00 AM – 11:00 PM" },
    { day: "Sunday", time: "10:00 AM – 8:00 PM" },
  ],
};

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("popularity", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const reviewsQuery = queryOptions({
  queryKey: ["reviews"],
  queryFn: async (): Promise<Review[]> => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("review_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const ordersQuery = queryOptions({
  queryKey: ["orders"],
  queryFn: async (): Promise<Order[]> => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const formatPrice = (n: number) => `$${Number(n).toFixed(2)}`;

export const averageRating = (reviews: Review[]) =>
  reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
