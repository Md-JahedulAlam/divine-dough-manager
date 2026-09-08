import { Button } from "@/components/ui/button";
import { formatPrice, type Product } from "@/lib/shop";
import { StarRating } from "./StarRating";

export function ProductCard({
  product,
  categoryName,
  onView,
  onOrder,
}: {
  product: Product;
  categoryName?: string;
  onView: () => void;
  onOrder: () => void;
}) {
  return (
    <article className="card-lift group flex flex-col overflow-hidden rounded-3xl bg-card">
      <button onClick={onView} className="relative aspect-square overflow-hidden bg-muted text-left">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            width={600}
            height={600}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground">No image</div>
        )}
        {categoryName && (
          <span className="absolute top-3 left-3 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-bold tracking-wide text-chocolate backdrop-blur">
            {categoryName}
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug font-semibold text-chocolate">{product.name}</h3>
          <span className="shrink-0 font-display text-lg font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <StarRating value={Number(product.rating)} />
          <span className="text-xs font-semibold text-foreground/70">
            {Number(product.rating).toFixed(1)} ({product.review_count})
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="chocolate-outline" onClick={onView}>
            View Details
          </Button>
          <Button variant="rose" onClick={onOrder}>
            Order Now
          </Button>
        </div>
      </div>
    </article>
  );
}
