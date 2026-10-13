CREATE POLICY "Salon owners read uploaded media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'salon-media' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Salon owners upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'salon-media' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Salon owners remove media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'salon-media' AND private.has_role(auth.uid(), 'admin'));
CREATE TABLE public.appointments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_at timestamptz NOT NULL DEFAULT now(), customer_name text NOT NULL, phone text NOT NULL, service_name text NOT NULL, preferred_at timestamptz NOT NULL, status text NOT NULL DEFAULT 'New' CHECK (status IN ('New','Confirmed','Completed','Cancelled')));
GRANT SELECT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage appointments" ON public.appointments FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE TABLE public.expenses (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), expense_date date NOT NULL DEFAULT CURRENT_DATE, description text NOT NULL, amount numeric(12,2) NOT NULL CHECK (amount > 0), created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage expenses" ON public.expenses FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE FUNCTION public.request_salon_appointment(customer text, contact text, service text, preferred timestamptz) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_id uuid;
BEGIN
IF length(trim(customer)) NOT BETWEEN 2 AND 100 OR contact !~ '^\+?[0-9]{10,15}$' OR length(trim(service)) NOT BETWEEN 1 AND 150 OR preferred <= now() OR preferred > now() + interval '180 days' THEN RAISE EXCEPTION 'Please check your name, phone, service and future appointment time.'; END IF;
PERFORM pg_advisory_xact_lock(hashtext(contact));
IF (SELECT count(*) FROM public.appointments WHERE phone=contact AND created_at > now()-interval '1 hour') >= 3 THEN RAISE EXCEPTION 'Please wait before requesting another appointment, or contact us on WhatsApp.'; END IF;
INSERT INTO public.appointments(customer_name,phone,service_name,preferred_at) VALUES(trim(customer),contact,trim(service),preferred) RETURNING id INTO new_id;
RETURN new_id;
END $$;
REVOKE ALL ON FUNCTION public.request_salon_appointment(text,text,text,timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_salon_appointment(text,text,text,timestamptz) TO anon, authenticated;
