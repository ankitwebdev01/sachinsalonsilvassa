CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE POLICY "Users can view own role" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_assign_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.assign_first_admin();

CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text NOT NULL UNIQUE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view site content" ON public.site_content
FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can add site content" ON public.site_content
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site content" ON public.site_content
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site content" ON public.site_content
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_date date NOT NULL DEFAULT current_date,
  customer_name text NOT NULL,
  service_name text NOT NULL,
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  payment_method text NOT NULL DEFAULT 'Cash',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage sales" ON public.sales
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER set_site_content_updated_at BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_sales_updated_at BEFORE UPDATE ON public.sales
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_content (content_key, content) VALUES
('business', '{"name":"Sachin Unisex Salon","address":"Silvassa - 396230, Dadra and Nagar Haveli and Daman and Diu","phone":"+919173414508","displayPhone":"091734 14508","rating":"5.0","reviewCount":345,"hours":"Monday–Sunday · 9:00 AM–10:00 PM"}'::jsonb),
('services', '[{"name":"Hair Cut","category":"Women","price":299,"description":"A personalised cut shaped to suit your face and lifestyle."},{"name":"Hair Wash & Blow Dry","category":"Women","price":399,"description":"Cleansing wash followed by a smooth salon finish."},{"name":"Hair Colour","category":"Women","price":999,"description":"Rich, even colour with a shade consultation."},{"name":"Hair Spa","category":"Women","price":799,"description":"Deep conditioning care for softer, healthier-looking hair."},{"name":"Hair Cut","category":"Men","price":199,"description":"Clean, contemporary cuts with careful finishing."},{"name":"Beard Styling","category":"Men","price":149,"description":"Precision beard shaping and detailing."},{"name":"Hair Colour","category":"Men","price":599,"description":"Natural-looking grey coverage and modern colour."},{"name":"Facial","category":"Unisex","price":699,"description":"Refreshing skin care selected for your skin needs."}]'::jsonb),
('products', '[{"name":"Nourishing Shampoo","brand":"Professional Hair Care","price":699},{"name":"Repair Hair Mask","brand":"Salon Essentials","price":899},{"name":"Smooth Finish Serum","brand":"Professional Hair Care","price":549},{"name":"Colour Protect Conditioner","brand":"Salon Essentials","price":749}]'::jsonb),
('offers', '[{"title":"First Visit Welcome","text":"Discover personalised salon care in Silvassa.","cta":"Book on WhatsApp"},{"title":"Complete Hair Ritual","text":"Haircut, wash and nourishing care tailored to you.","cta":"Enquire now"}]'::jsonb),
('reviews', '[{"quote":"Best experience and brilliant staff good service 😊","author":"Google review"},{"quote":"Nice salon with nice facilities. Personal care is taken by the owner himself.","author":"Google review"},{"quote":"Had a wonderful experience overall with haircut, facial and hair spa.","author":"Google review"}]'::jsonb),
('faqs', '[{"question":"How many types of salons exist?","answer":"Some salons are unisex and cater to both men and women, while others specialise. Sachin Unisex Salon welcomes everyone in Silvassa."},{"question":"Can I walk in for a service?","answer":"Walk-ins may be available, but contacting us on WhatsApp before your visit is recommended so we can reserve your preferred time."},{"question":"Can I get nail art done at Sachin Unisex Salon?","answer":"Service availability may change. Please message the salon on WhatsApp before visiting to confirm specialist services."},{"question":"How good are the services?","answer":"Customers have rated Sachin Unisex Salon 5.0 on Google across 345 reviews for attentive service and quality salon care."},{"question":"How can I contact Sachin Unisex Salon in Silvassa?","answer":"Tap any phone number or WhatsApp button on this website to start a personal chat with the salon."}]'::jsonb),
('pages', '{"about":"Sachin Unisex Salon is a leading salon in Silvassa, offering thoughtful hair and beauty services for women and men. Our team focuses on careful consultation, skilled service and a welcoming experience for every guest.","summary":"Whether you are visiting for a regular haircut, a fresh new style or complete grooming care, Sachin Unisex Salon brings attentive service and professional finishing together in one convenient Silvassa destination.","membership":"Enjoy more from every visit with salon privileges, seasonal care offers and personalised service recommendations."}'::jsonb);