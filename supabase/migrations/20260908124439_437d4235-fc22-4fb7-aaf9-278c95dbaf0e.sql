-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- First signed-up user becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text,
  rating numeric(2,1) NOT NULL DEFAULT 5.0,
  review_count integer NOT NULL DEFAULT 0,
  sizes text[] NOT NULL DEFAULT ARRAY['1 lb','2 lb','3 lb'],
  popularity integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are public" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reviews
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  avatar_url text,
  rating integer NOT NULL DEFAULT 5,
  review_text text NOT NULL,
  review_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are public" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  size text,
  custom_message text,
  customer_name text NOT NULL,
  phone text NOT NULL,
  delivery_address text NOT NULL,
  delivery_date date,
  status text NOT NULL DEFAULT 'pending',
  total_price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can place an order" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed data
INSERT INTO public.categories (id, name, description, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111101','Birthday Cakes','Festive cakes made for celebrating another sweet year.',1),
  ('11111111-1111-1111-1111-111111111102','Wedding Cakes','Elegant tiered cakes for your most special day.',2),
  ('11111111-1111-1111-1111-111111111103','Chocolate Cakes','Rich, decadent and irresistibly chocolatey.',3),
  ('11111111-1111-1111-1111-111111111104','Vanilla Cakes','Classic, light and timeless favourites.',4),
  ('11111111-1111-1111-1111-111111111105','Red Velvet','Velvety crimson layers with cream cheese frosting.',5),
  ('11111111-1111-1111-1111-111111111106','Cupcakes','Bite-sized joy in every flavour.',6),
  ('11111111-1111-1111-1111-111111111107','Cheesecakes','Silky, creamy and baked to perfection.',7),
  ('11111111-1111-1111-1111-111111111108','Custom Cakes','Designed just for you, from sketch to slice.',8);

INSERT INTO public.products (id, category_id, name, description, price, image_url, rating, review_count, sizes, popularity) VALUES
  ('22222222-2222-2222-2222-222222222201','11111111-1111-1111-1111-111111111101','Confetti Celebration Cake','Pastel buttercream layers with rainbow sprinkles and a fluffy vanilla sponge.',38.00,'/images/birthday-cake.jpg',4.9,124,ARRAY['1 lb','2 lb','3 lb'],98),
  ('22222222-2222-2222-2222-222222222202','11111111-1111-1111-1111-111111111102','Blush Rose Wedding Cake','Three tiers of almond sponge with delicate sugar roses and ivory fondant.',320.00,'/images/wedding-cake.jpg',5.0,56,ARRAY['3 tier','4 tier','5 tier'],72),
  ('22222222-2222-2222-2222-222222222203','11111111-1111-1111-1111-111111111103','Midnight Chocolate Truffle','Dark Belgian chocolate sponge, silky ganache and chocolate curls.',42.00,'/images/chocolate-cake.jpg',4.9,210,ARRAY['1 lb','2 lb','3 lb'],100),
  ('22222222-2222-2222-2222-222222222204','11111111-1111-1111-1111-111111111104','Vanilla Bean & Strawberry','Madagascar vanilla sponge with fresh strawberries and Chantilly cream.',34.00,'/images/vanilla-cake.jpg',4.8,143,ARRAY['1 lb','2 lb','3 lb'],85),
  ('22222222-2222-2222-2222-222222222205','11111111-1111-1111-1111-111111111105','Classic Red Velvet','Crimson cocoa layers with tangy cream cheese frosting.',36.00,'/images/red-velvet.jpg',4.9,167,ARRAY['1 lb','2 lb','3 lb'],90),
  ('22222222-2222-2222-2222-222222222206','11111111-1111-1111-1111-111111111106','Signature Cupcake Box','Six assorted cupcakes: chocolate, vanilla, red velvet and salted caramel.',18.00,'/images/cupcakes.jpg',4.7,302,ARRAY['Box of 6','Box of 12','Box of 24'],95),
  ('22222222-2222-2222-2222-222222222207','11111111-1111-1111-1111-111111111107','Berry New York Cheesecake','Baked cheesecake on a buttery crust, crowned with fresh berry compote.',40.00,'/images/cheesecake.jpg',4.8,98,ARRAY['6 inch','8 inch','10 inch'],80),
  ('22222222-2222-2222-2222-222222222208','11111111-1111-1111-1111-111111111108','Hand-Painted Floral Cake','Bespoke fondant design with hand-painted florals and gold leaf accents.',95.00,'/images/custom-cake.jpg',5.0,41,ARRAY['2 lb','3 lb','5 lb'],60);

INSERT INTO public.reviews (product_id, customer_name, rating, review_text, review_date) VALUES
  ('22222222-2222-2222-2222-222222222203','Nusrat Jahan',5,'The chocolate truffle cake was unbelievably rich and moist. Everyone at the party asked where it was from!','2026-08-28'),
  ('22222222-2222-2222-2222-222222222202','Emily Carter',5,'Our wedding cake was a dream. Beautifully crafted sugar roses and it tasted even better than it looked.','2026-08-15'),
  ('22222222-2222-2222-2222-222222222201','Rafiq Ahmed',5,'Ordered a birthday cake for my daughter. Fresh, fluffy and delivered right on time. Highly recommended.','2026-08-30'),
  ('22222222-2222-2222-2222-222222222206','Sophia Lee',4,'Cupcakes were adorable and delicious. The salted caramel one is my new favourite.','2026-09-02'),
  ('22222222-2222-2222-2222-222222222205','Tanvir Hossain',5,'Best red velvet in town. The cream cheese frosting is perfectly balanced, not too sweet.','2026-09-04'),
  ('22222222-2222-2222-2222-222222222207','Maria Gonzalez',5,'The berry cheesecake was silky smooth. Will definitely order again for our next family dinner.','2026-09-06');