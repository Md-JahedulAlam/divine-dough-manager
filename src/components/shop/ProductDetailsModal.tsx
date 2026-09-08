import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice, type Product, type Review } from "@/lib/shop";
import { StarRating } from "./StarRating";
import { format } from "date-fns";

export function ProductDetailsModal({
  product,
  categoryName,
  reviews,
  onClose,
  onOrder,
}: {
  product: Product | null;
  categoryName?: string;
  reviews: Review[];
  onClose: () => void;
  onOrder: (p: Product) => void;
}) {
  const productReviews = product ? reviews.filter((r) => r.product_id === product.id) : [];

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl p-0 sm:max-w-3xl">
        {product && (
          <div className="grid md:grid-cols-2">
            <div className="aspect-square bg-muted md:aspect-auto md:min-h-full">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="p-6 sm:p-8">
              {categoryName && <p className="eyebrow mb-2">{categoryName}</p>}
              <DialogTitle className="font-display text-2xl leading-tight font-semibold text-chocolate sm:text-3xl">
                {product.name}
              </DialogTitle>
              <div className="mt-3 flex items-center gap-2">
                <StarRating value={Number(product.rating)} size="md" />
                <span className="text-sm font-semibold">
                  {Number(product.rating).toFixed(1)}{" "}
                  <span className="font-normal text-muted-foreground">({product.review_count} reviews)</span>
                </span>
              </div>
              <p className="mt-4 font-display text-3xl font-semibold text-primary">{formatPrice(product.price)}</p>
              <DialogDescription className="mt-4 leading-relaxed text-foreground/75">
                {product.description}
              </DialogDescription>

              <div className="mt-6">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Available sizes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <span key={s} className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <Button variant="rose" size="xl" className="mt-6 w-full" onClick={() => onOrder(product)}>
                Order This Cake
              </Button>

              <div className="mt-8">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Customer reviews</p>
                {productReviews.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">No reviews yet for this cake.</p>
                ) : (
                  <ul className="mt-3 space-y-4">
                    {productReviews.map((r) => (
                      <li key={r.id} className="rounded-2xl bg-cream p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-chocolate">{r.customer_name}</span>
                          <StarRating value={r.rating} />
                        </div>
                        <p className="mt-1.5 text-sm text-foreground/75">{r.review_text}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {format(new Date(r.review_date), "MMM d, yyyy")}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
