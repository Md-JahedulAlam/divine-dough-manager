import { cn } from "@/lib/utils";
function CategorySection({
  categories,
  products,
  selected,
  onSelect
}) {
  const coverFor = (c) => products.find((p) => p.category_id === c.id && p.image_url)?.image_url;
  const countFor = (c) => products.filter((p) => p.category_id === c.id).length;
  return <section id="categories" className="bg-blush py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-3">Our Collection</p>
          <h2 className="section-title">Browse by Category</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => {
    const cover = coverFor(c);
    const active = selected === c.id;
    return <button
      key={c.id}
      onClick={() => {
        onSelect(active ? null : c.id);
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
      }}
      className={cn(
        "card-lift group relative overflow-hidden rounded-3xl bg-card text-left ring-2 ring-transparent",
        active && "ring-primary"
      )}
    >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {cover ? <img
      src={cover}
      alt={c.name}
      loading="lazy"
      width={600}
      height={450}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    /> : <div className="grid h-full place-items-center font-display text-4xl text-primary/40">
                      {c.name.charAt(0)}
                    </div>}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-semibold text-chocolate">{c.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {countFor(c)} {countFor(c) === 1 ? "item" : "items"}
                  </p>
                </div>
              </button>;
  })}
        </div>
      </div>
    </section>;
}
export {
  CategorySection
};
