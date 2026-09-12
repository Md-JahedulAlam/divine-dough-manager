import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";
function ProductSection({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  onView,
  onOrder
}) {
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState("all");
  const [minRating, setMinRating] = useState("0");
  const [sort, setSort] = useState("popular");
  const catName = (id) => categories.find((c) => c.id === id)?.name;
  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (selectedCategory && p.category_id !== selectedCategory) return false;
      if (search && !`${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())) return false;
      const pr = Number(p.price);
      if (price === "lt30" && pr >= 30) return false;
      if (price === "30-60" && (pr < 30 || pr > 60)) return false;
      if (price === "gt60" && pr <= 60) return false;
      if (Number(p.rating) < Number(minRating)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return Number(a.price) - Number(b.price);
      if (sort === "price-desc") return Number(b.price) - Number(a.price);
      if (sort === "rating") return Number(b.rating) - Number(a.rating);
      return b.popularity - a.popularity;
    });
    return list;
  }, [products, selectedCategory, search, price, minRating, sort]);
  return <section id="products" className="py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-3">Freshly Baked</p>
          <h2 className="section-title">Our Cakes</h2>
        </div>

        {
    /* Category chips */
  }
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          <Chip active={!selectedCategory} onClick={() => onSelectCategory(null)}>
            All
          </Chip>
          {categories.map((c) => <Chip key={c.id} active={selectedCategory === c.id} onClick={() => onSelectCategory(c.id)}>
              {c.name}
            </Chip>)}
        </div>

        {
    /* Filters */
  }
        <div className="mb-10 grid gap-3 rounded-3xl bg-card p-4 shadow-card md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search cakes..."
    className="h-11 rounded-full pl-9"
  />
          </div>
          <Select value={price} onValueChange={setPrice}>
            <SelectTrigger className="h-11 w-full rounded-full md:w-40">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any price</SelectItem>
              <SelectItem value="lt30">Under $30</SelectItem>
              <SelectItem value="30-60">$30 – $60</SelectItem>
              <SelectItem value="gt60">Over $60</SelectItem>
            </SelectContent>
          </Select>
          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger className="h-11 w-full rounded-full md:w-40">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any rating</SelectItem>
              <SelectItem value="4">4★ & up</SelectItem>
              <SelectItem value="4.5">4.5★ & up</SelectItem>
              <SelectItem value="5">5★ only</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v)}>
            <SelectTrigger className="h-11 w-full rounded-full md:w-44">
              <SlidersHorizontal className="mr-1 size-4 text-muted-foreground" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? <div className="rounded-3xl border border-dashed p-16 text-center text-muted-foreground">
            No cakes match your filters yet. Try another category or search.
          </div> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => <ProductCard
    key={p.id}
    product={p}
    categoryName={catName(p.category_id)}
    onView={() => onView(p)}
    onOrder={() => onOrder(p)}
  />)}
          </div>}
      </div>
    </section>;
}
function Chip({
  active,
  onClick,
  children
}) {
  return <button
    onClick={onClick}
    className={cn(
      "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
      active ? "bg-chocolate text-chocolate-foreground" : "bg-card text-foreground/75 shadow-card hover:bg-primary-soft"
    )}
  >
      {children}
    </button>;
}
export {
  ProductSection
};
