import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cake, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOP } from "@/lib/shop";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "#home" },
  { label: "Categories", href: "#categories" },
  { label: "Products", href: "#products" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export function Navbar({ onOrder }: { onOrder: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled ? "bg-cream/90 shadow-card backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#home" className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft">
            <Cake className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl font-semibold text-chocolate">{SHOP.name}</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              {SHOP.tagline}
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/admin" className="text-xs font-semibold text-muted-foreground hover:text-primary">
            Admin
          </Link>
          <Button variant="rose" onClick={onOrder}>
            Order Now
          </Button>
        </div>

        <button
          className="grid size-10 place-items-center rounded-full bg-card text-chocolate shadow-card md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="mx-4 mb-4 rounded-2xl bg-card p-5 shadow-soft md:hidden">
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 font-semibold text-foreground hover:bg-primary-soft"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/admin" className="block rounded-xl px-3 py-2 text-sm text-muted-foreground">
                Admin
              </Link>
            </li>
          </ul>
          <Button
            variant="rose"
            className="mt-4 w-full"
            onClick={() => {
              setOpen(false);
              onOrder();
            }}
          >
            Order Now
          </Button>
        </div>
      )}
    </header>
  );
}
