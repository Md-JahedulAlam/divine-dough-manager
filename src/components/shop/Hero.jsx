import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
function Hero({ onOrder, avg, count }) {
  return <section id="home" className="relative min-h-[92vh] overflow-hidden">
      <img
    src="/images/hero.jpg"
    alt="Beautifully decorated layer cake in a pastel bakery"
    width={1920}
    height={1080}
    className="absolute inset-0 h-full w-full object-cover object-right"
  />
      <div className="absolute inset-0 bg-hero-veil" />
      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center px-5 pt-24 pb-16 lg:px-8">
        <div className="max-w-xl">
          <p className="eyebrow mb-4">Baked fresh every morning</p>
          <h1 className="font-display text-5xl leading-[1.05] font-semibold text-chocolate sm:text-6xl lg:text-7xl">
            Sweet Moments,
            <br />
            <span className="italic text-primary">Delicious</span> Cakes
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/75">
            Handcrafted layer cakes, cupcakes and cheesecakes made with real butter, Belgian
            chocolate and a lot of love — for birthdays, weddings and every day in between.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="rose" size="xl" asChild>
              <a href="#products">Explore Cakes</a>
            </Button>
            <Button variant="chocolate-outline" size="xl" onClick={onOrder}>
              Order Now
            </Button>
          </div>
          {count > 0 && <div className="mt-10 inline-flex items-center gap-3 rounded-full bg-card/80 px-4 py-2 shadow-card backdrop-blur">
              <StarRating value={avg} size="md" />
              <span className="text-sm font-semibold text-chocolate">
                {avg.toFixed(1)}/5 <span className="font-normal text-muted-foreground">from {count} happy customers</span>
              </span>
            </div>}
        </div>
      </div>
    </section>;
}
export {
  Hero
};
