import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/shop/Navbar";
import { Hero } from "@/components/shop/Hero";
import { CategorySection } from "@/components/shop/CategorySection";
import { ProductSection } from "@/components/shop/ProductSection";
import { ProductDetailsModal } from "@/components/shop/ProductDetailsModal";
import { ReviewSection } from "@/components/shop/ReviewSection";
import { OrderModal } from "@/components/shop/OrderModal";
import { AboutSection, ContactSection, Footer } from "@/components/shop/AboutContact";
import {
  averageRating,
  categoriesQuery,
  productsQuery,
  reviewsQuery,
  type Product,
} from "@/lib/shop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sweet Crumb — Handcrafted Cakes & Cupcakes in Dhaka" },
      {
        name: "description",
        content:
          "Order handcrafted birthday, wedding, chocolate and custom cakes from Sweet Crumb. Baked fresh daily with real butter and Belgian chocolate.",
      },
      { property: "og:title", content: "Sweet Crumb — Handcrafted Cakes & Cupcakes" },
      {
        property: "og:description",
        content: "Birthday, wedding and custom cakes baked fresh daily. Order online for same-day delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: products = [] } = useQuery(productsQuery);
  const { data: reviews = [] } = useQuery(reviewsQuery);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  const openOrder = (p: Product | null) => {
    setOrderProduct(p);
    setDetailsProduct(null);
    setOrderOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar onOrder={() => openOrder(null)} />
      <main>
        <Hero onOrder={() => openOrder(null)} avg={averageRating(reviews)} count={reviews.length} />
        <CategorySection
          categories={categories}
          products={products}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <ProductSection
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onView={setDetailsProduct}
          onOrder={openOrder}
        />
        <ReviewSection reviews={reviews} />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />

      <ProductDetailsModal
        product={detailsProduct}
        categoryName={categories.find((c) => c.id === detailsProduct?.category_id)?.name}
        reviews={reviews}
        onClose={() => setDetailsProduct(null)}
        onOrder={openOrder}
      />
      <OrderModal
        open={orderOpen}
        products={products}
        initialProduct={orderProduct}
        onClose={() => setOrderOpen(false)}
      />
    </div>
  );
}
