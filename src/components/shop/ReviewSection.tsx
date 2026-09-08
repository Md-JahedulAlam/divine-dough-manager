import { Quote } from "lucide-react";
import { format } from "date-fns";
import { averageRating, type Review } from "@/lib/shop";
import { StarRating } from "./StarRating";

export function ReviewSection({ reviews }: { reviews: Review[] }) {
  const avg = averageRating(reviews);
  return (
    <section id="reviews" className="bg-blush py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3">Sweet Words</p>
          <h2 className="section-title">What Our Customers Say</h2>
          {reviews.length > 0 && (
            <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-card px-5 py-2.5 shadow-card">
              <StarRating value={avg} size="lg" />
              <span className="font-display text-xl font-semibold text-chocolate">{avg.toFixed(1)}/5</span>
              <span className="text-sm text-muted-foreground">· {reviews.length} reviews</span>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((r) => (
            <figure key={r.id} className="card-lift relative rounded-3xl bg-card p-6">
              <Quote className="absolute top-5 right-5 size-8 text-primary-soft" />
              <StarRating value={r.rating} size="md" />
              <blockquote className="mt-4 leading-relaxed text-foreground/80">“{r.review_text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {r.avatar_url ? (
                  <img
                    src={r.avatar_url}
                    alt={r.customer_name}
                    loading="lazy"
                    width={44}
                    height={44}
                    className="size-11 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-11 place-items-center rounded-full bg-primary-soft font-display text-lg font-semibold text-primary">
                    {r.customer_name.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="text-sm font-bold text-chocolate">{r.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(r.review_date), "MMMM d, yyyy")}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
