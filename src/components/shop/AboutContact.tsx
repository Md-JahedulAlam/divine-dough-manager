import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { SHOP } from "@/lib/shop";

export function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <div className="relative">
          <img
            src="/images/custom-cake.jpg"
            alt="Hand-painted floral cake from Sweet Crumb"
            loading="lazy"
            width={1024}
            height={1024}
            className="aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-soft"
          />
          <div className="absolute -right-4 -bottom-6 rounded-3xl bg-card px-6 py-4 shadow-lift sm:right-8">
            <p className="font-display text-4xl font-semibold text-primary">12+</p>
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Years of baking</p>
          </div>
        </div>
        <div>
          <p className="eyebrow mb-3">About Us</p>
          <h2 className="section-title">Baked with butter, sugar &amp; a little magic</h2>
          <p className="mt-6 leading-relaxed text-foreground/75">
            {SHOP.name} started as a tiny home kitchen in Dhanmondi and grew into the neighbourhood's
            favourite cake boutique. Every cake is baked to order using real butter, farm-fresh eggs
            and Belgian chocolate — never mixes, never shortcuts.
          </p>
          <p className="mt-4 leading-relaxed text-foreground/75">
            From a child's first birthday to a three-tier wedding centrepiece, we design each cake
            around your story, so it looks stunning and tastes even better.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-4 text-sm">
            {["Baked fresh daily", "Custom designs", "Same-day delivery", "Eggless options"].map((t) => (
              <li key={t} className="flex items-center gap-2 font-semibold text-chocolate">
                <span className="size-2 rounded-full bg-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="bg-blush py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3">Visit Us</p>
          <h2 className="section-title">Get in Touch</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <InfoCard icon={<Phone />} title="Phone" lines={[SHOP.phone]} />
            <InfoCard icon={<Mail />} title="Email" lines={[SHOP.email]} />
            <InfoCard icon={<MapPin />} title="Address" lines={[SHOP.address]} />
            <div className="rounded-3xl bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-primary [&_svg]:size-5">
                  <Clock />
                </span>
                <p className="font-bold text-chocolate">Opening Hours</p>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {SHOP.hours.map((h) => (
                  <li key={h.day} className="flex justify-between">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className="font-semibold">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-3">
              {[
                { icon: <Facebook />, label: "Facebook" },
                { icon: <Instagram />, label: "Instagram" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="grid size-11 place-items-center rounded-full bg-card text-chocolate shadow-card transition-colors hover:bg-primary hover:text-primary-foreground [&_svg]:size-5"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="min-h-[360px] overflow-hidden rounded-3xl bg-card shadow-card lg:col-span-3">
            <iframe
              title="Shop location map"
              src="https://www.google.com/maps?q=Dhanmondi,Dhaka&output=embed"
              className="h-full min-h-[360px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <div className="flex items-start gap-3 rounded-3xl bg-card p-5 shadow-card">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary [&_svg]:size-5">
        {icon}
      </span>
      <div>
        <p className="font-bold text-chocolate">{title}</p>
        {lines.map((l) => (
          <p key={l} className="text-sm text-muted-foreground">{l}</p>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-chocolate py-10 text-chocolate-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-sm sm:flex-row lg:px-8">
        <p className="font-display text-xl font-semibold">{SHOP.name}</p>
        <p className="opacity-70">© {new Date().getFullYear()} {SHOP.name}. Baked with love in Dhaka.</p>
      </div>
    </footer>
  );
}
