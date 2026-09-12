import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Cake, LogOut, Trash2, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  SHOP,
  categoriesQuery,
  productsQuery,
  reviewsQuery,
  ordersQuery,
  formatPrice
} from "@/lib/shop";
const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Sweet Crumb" },
      {
        name: "description",
        content: "Manage Sweet Crumb cakes, categories, customer reviews and incoming orders."
      },
      { property: "og:title", content: "Admin Dashboard — Sweet Crumb" },
      { property: "og:description", content: "Manage cakes, categories, reviews and orders." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" }
    ]
  }),
  component: AdminPage
});
const emptyProduct = {
  name: "",
  description: "",
  price: "",
  image_url: "",
  category_id: "",
  rating: "5",
  sizes: "6 inch, 8 inch, 10 inch"
};
function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);
  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-blush text-muted-foreground">Loading…</div>;
  }
  if (!user) return null;
  if (!isAdmin) {
    return <div className="grid min-h-screen place-items-center bg-blush px-5 text-center">
        <div className="max-w-md rounded-3xl bg-card p-8 shadow-soft">
          <h1 className="font-display text-2xl font-semibold text-chocolate">No admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account isn't a shop owner. Ask the shop owner to grant access.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Link to="/">
              <Button variant="rose">Back to shop</Button>
            </Link>
            <Button variant="chocolate-outline" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </div>;
  }
  return <Dashboard onSignOut={() => signOut()} />;
}
function Dashboard({ onSignOut }) {
  const qc = useQueryClient();
  const categories = useQuery(categoriesQuery);
  const products = useQuery(productsQuery);
  const reviews = useQuery(reviewsQuery);
  const orders = useQuery(ordersQuery);
  const invalidate = (key) => qc.invalidateQueries({ queryKey: [key] });
  return <div className="min-h-screen bg-blush pb-20">
      <header className="border-b border-border/60 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft">
              <Cake className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-semibold text-chocolate">{SHOP.name}</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Admin Dashboard
              </span>
            </span>
          </Link>
          <Button variant="chocolate-outline" onClick={onSignOut}>
            <LogOut className="mr-2 size-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {[
    { label: "Products", value: products.data?.length ?? 0 },
    { label: "Categories", value: categories.data?.length ?? 0 },
    { label: "Reviews", value: reviews.data?.length ?? 0 },
    { label: "Orders", value: orders.data?.length ?? 0 }
  ].map((s) => <div key={s.label} className="rounded-2xl bg-card p-5 shadow-card">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-display text-3xl font-semibold text-chocolate">{s.value}</p>
            </div>)}
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsPanel
    products={products.data ?? []}
    categories={categories.data ?? []}
    onChange={() => invalidate("products")}
  />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesPanel categories={categories.data ?? []} onChange={() => invalidate("categories")} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsPanel
    reviews={reviews.data ?? []}
    products={products.data ?? []}
    onChange={() => invalidate("reviews")}
  />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersPanel orders={orders.data ?? []} onChange={() => invalidate("orders")} />
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}
function Card({ children }) {
  return <div className="rounded-2xl bg-card p-6 shadow-card">{children}</div>;
}
function ProductsPanel({
  products,
  categories,
  onChange
}) {
  const [form, setForm] = useState({ ...emptyProduct });
  const [editingId, setEditingId] = useState(null);
  const reset = () => {
    setForm({ ...emptyProduct });
    setEditingId(null);
  };
  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price) || 0,
        image_url: form.image_url || null,
        category_id: form.category_id || null,
        rating: Number(form.rating) || 5,
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean)
      };
      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Product updated" : "Product added");
      reset();
      onChange();
    },
    onError: (e) => toast.error(e.message)
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product deleted");
      onChange();
    },
    onError: (e) => toast.error(e.message)
  });
  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      image_url: p.image_url ?? "",
      category_id: p.category_id ?? "",
      rating: String(p.rating),
      sizes: (p.sizes ?? []).join(", ")
    });
  };
  return <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card>
        <h2 className="font-display text-xl font-semibold text-chocolate">
          {editingId ? "Edit product" : "Add product"}
        </h2>
        <form
    className="mt-4 space-y-3"
    onSubmit={(e) => {
      e.preventDefault();
      save.mutate();
    }}
  >
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Name</Label>
            <Input id="p-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-cat">Category</Label>
            <select
    id="p-cat"
    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
    value={form.category_id}
    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
  >
              <option value="">— none —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>
                  {c.name}
                </option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-desc">Description</Label>
            <Textarea
    id="p-desc"
    value={form.description}
    onChange={(e) => setForm({ ...form, description: e.target.value })}
  />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-price">Price</Label>
              <Input
    id="p-price"
    type="number"
    step="0.01"
    required
    value={form.price}
    onChange={(e) => setForm({ ...form, price: e.target.value })}
  />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-rating">Rating</Label>
              <Input
    id="p-rating"
    type="number"
    step="0.1"
    min="0"
    max="5"
    value={form.rating}
    onChange={(e) => setForm({ ...form, rating: e.target.value })}
  />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-img">Image URL</Label>
            <Input
    id="p-img"
    placeholder="/images/chocolate-cake.jpg"
    value={form.image_url}
    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
  />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-sizes">Sizes (comma separated)</Label>
            <Input id="p-sizes" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="submit" variant="rose" disabled={save.isPending}>
              <Plus className="mr-1.5 size-4" /> {editingId ? "Save changes" : "Add product"}
            </Button>
            {editingId && <Button type="button" variant="chocolate-outline" onClick={reset}>
                Cancel
              </Button>}
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="font-display text-xl font-semibold text-chocolate">All products</h2>
        <ul className="mt-4 divide-y divide-border">
          {products.map((p) => <li key={p.id} className="flex items-center gap-3 py-3">
              <img
    src={p.image_url ?? "/images/hero.jpg"}
    alt={p.name}
    loading="lazy"
    className="size-14 rounded-xl object-cover"
  />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-chocolate">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {categories.find((c) => c.id === p.category_id)?.name ?? "Uncategorised"} ·{" "}
                  {formatPrice(p.price)} · ★ {p.rating}
                </p>
              </div>
              <Button size="sm" variant="chocolate-outline" onClick={() => startEdit(p)}>
                <Pencil className="size-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => remove.mutate(p.id)}>
                <Trash2 className="size-4" />
              </Button>
            </li>)}
          {!products.length && <li className="py-4 text-sm text-muted-foreground">No products yet.</li>}
        </ul>
      </Card>
    </div>;
}
function CategoriesPanel({ categories, onChange }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const reset = () => {
    setName("");
    setDescription("");
    setEditingId(null);
  };
  const save = useMutation({
    mutationFn: async () => {
      const payload = { name, description: description || null };
      if (editingId) {
        const { error } = await supabase.from("categories").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Category updated" : "Category added");
      reset();
      onChange();
    },
    onError: (e) => toast.error(e.message)
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category deleted");
      onChange();
    },
    onError: (e) => toast.error(e.message)
  });
  return <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card>
        <h2 className="font-display text-xl font-semibold text-chocolate">
          {editingId ? "Edit category" : "Add category"}
        </h2>
        <form
    className="mt-4 space-y-3"
    onSubmit={(e) => {
      e.preventDefault();
      save.mutate();
    }}
  >
          <div className="space-y-1.5">
            <Label htmlFor="c-name">Name</Label>
            <Input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-desc">Description</Label>
            <Textarea id="c-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="rose" disabled={save.isPending}>
              {editingId ? "Save changes" : "Add category"}
            </Button>
            {editingId && <Button type="button" variant="chocolate-outline" onClick={reset}>
                Cancel
              </Button>}
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="font-display text-xl font-semibold text-chocolate">All categories</h2>
        <ul className="mt-4 divide-y divide-border">
          {categories.map((c) => <li key={c.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-chocolate">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">{c.description ?? "—"}</p>
              </div>
              <Button
    size="sm"
    variant="chocolate-outline"
    onClick={() => {
      setEditingId(c.id);
      setName(c.name);
      setDescription(c.description ?? "");
    }}
  >
                <Pencil className="size-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => remove.mutate(c.id)}>
                <Trash2 className="size-4" />
              </Button>
            </li>)}
        </ul>
      </Card>
    </div>;
}
function ReviewsPanel({
  reviews,
  products,
  onChange
}) {
  const [form, setForm] = useState({ customer_name: "", rating: "5", review_text: "", product_id: "" });
  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("reviews").insert({
        customer_name: form.customer_name,
        rating: Number(form.rating) || 5,
        review_text: form.review_text,
        product_id: form.product_id || null
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review added");
      setForm({ customer_name: "", rating: "5", review_text: "", product_id: "" });
      onChange();
    },
    onError: (e) => toast.error(e.message)
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review deleted");
      onChange();
    },
    onError: (e) => toast.error(e.message)
  });
  return <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card>
        <h2 className="font-display text-xl font-semibold text-chocolate">Add review</h2>
        <form
    className="mt-4 space-y-3"
    onSubmit={(e) => {
      e.preventDefault();
      add.mutate();
    }}
  >
          <div className="space-y-1.5">
            <Label htmlFor="r-name">Customer name</Label>
            <Input
    id="r-name"
    required
    value={form.customer_name}
    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
  />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="r-product">Product</Label>
            <select
    id="r-product"
    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
    value={form.product_id}
    onChange={(e) => setForm({ ...form, product_id: e.target.value })}
  >
              <option value="">— general —</option>
              {products.map((p) => <option key={p.id} value={p.id}>
                  {p.name}
                </option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="r-rating">Rating</Label>
            <Input
    id="r-rating"
    type="number"
    min="1"
    max="5"
    value={form.rating}
    onChange={(e) => setForm({ ...form, rating: e.target.value })}
  />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="r-text">Review</Label>
            <Textarea
    id="r-text"
    required
    value={form.review_text}
    onChange={(e) => setForm({ ...form, review_text: e.target.value })}
  />
          </div>
          <Button type="submit" variant="rose" disabled={add.isPending}>
            Add review
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-display text-xl font-semibold text-chocolate">All reviews</h2>
        <ul className="mt-4 divide-y divide-border">
          {reviews.map((r) => <li key={r.id} className="flex items-start gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-chocolate">
                  {r.customer_name} <span className="text-sm text-primary">★ {r.rating}</span>
                </p>
                <p className="text-sm text-muted-foreground">{r.review_text}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(r.review_date).toLocaleDateString()}
                </p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => remove.mutate(r.id)}>
                <Trash2 className="size-4" />
              </Button>
            </li>)}
        </ul>
      </Card>
    </div>;
}
function OrdersPanel({
  orders,
  onChange
}) {
  const update = useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Order updated");
      onChange();
    },
    onError: (e) => toast.error(e.message)
  });
  return <Card>
      <h2 className="font-display text-xl font-semibold text-chocolate">Customer orders</h2>
      <ul className="mt-4 divide-y divide-border">
        {orders.map((o) => <li key={o.id} className="flex flex-wrap items-start gap-3 py-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-chocolate">
                {o.product_name} × {o.quantity} {o.size ? `· ${o.size}` : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                {o.customer_name} · {o.phone} · {o.delivery_address}
              </p>
              {o.custom_message && <p className="text-sm italic text-muted-foreground">“{o.custom_message}”</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleString()} · {formatPrice(o.total_price)}
              </p>
            </div>
            <select
    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
    value={o.status}
    onChange={(e) => update.mutate({ id: o.id, status: e.target.value })}
  >
              {["pending", "confirmed", "baking", "delivered", "cancelled"].map((s) => <option key={s} value={s}>
                  {s}
                </option>)}
            </select>
          </li>)}
        {!orders.length && <li className="py-4 text-sm text-muted-foreground">No orders yet.</li>}
      </ul>
    </Card>;
}
export {
  Route
};
