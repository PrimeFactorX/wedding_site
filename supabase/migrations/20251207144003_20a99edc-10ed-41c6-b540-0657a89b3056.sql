-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'customer', 'business');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_az TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subcategories table
CREATE TABLE public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    name_az TEXT NOT NULL,
    slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (category_id, slug)
);

-- Create businesses table
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    phone TEXT,
    whatsapp TEXT,
    instagram TEXT,
    address TEXT,
    city TEXT DEFAULT 'Bakı',
    is_active BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    average_rating DECIMAL(2,1) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_services junction table
CREATE TABLE public.business_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (business_id, subcategory_id)
);

-- Create business_media table
CREATE TABLE public.business_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    media_url TEXT NOT NULL,
    media_type TEXT DEFAULT 'image',
    caption TEXT,
    service_tag TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create review_replies table (business can reply to reviews)
CREATE TABLE public.review_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL UNIQUE,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    reply_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscription_plans table
CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    duration_months INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_subscriptions table
CREATE TABLE public.business_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expiring', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create favorites table (customers can save businesses)
CREATE TABLE public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, business_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  
  -- Default role is customer
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update average rating
CREATE OR REPLACE FUNCTION public.update_business_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.businesses
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.reviews
      WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
    )
  WHERE id = COALESCE(NEW.business_id, OLD.business_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger for rating updates
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_business_rating();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Profiles: Users can read all profiles, update their own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles: Only admins can manage, users can read their own
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Categories: Public read, admin write
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Subcategories: Public read, admin write
CREATE POLICY "Subcategories are viewable by everyone" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Admins can manage subcategories" ON public.subcategories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Businesses: Public can view active & approved, owners can manage their own
CREATE POLICY "Public can view active approved businesses" ON public.businesses 
  FOR SELECT USING (is_active = true AND is_approved = true);
CREATE POLICY "Owners can view own business" ON public.businesses 
  FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners can update own business" ON public.businesses 
  FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Authenticated users can create business" ON public.businesses 
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins can manage all businesses" ON public.businesses 
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Business services: Public read, business owners can manage
CREATE POLICY "Business services are viewable by everyone" ON public.business_services FOR SELECT USING (true);
CREATE POLICY "Owners can manage own business services" ON public.business_services 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid())
  );

-- Business media: Public read for active businesses, owners can manage
CREATE POLICY "Public can view media of active businesses" ON public.business_media 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND is_active = true AND is_approved = true)
  );
CREATE POLICY "Owners can view own media" ON public.business_media 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid())
  );
CREATE POLICY "Owners can manage own business media" ON public.business_media 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid())
  );

-- Reviews: Public read, customers can create/update their own
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews" ON public.reviews 
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND public.has_role(auth.uid(), 'customer')
  );
CREATE POLICY "Users can update own reviews" ON public.reviews 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews 
  FOR DELETE USING (auth.uid() = user_id);

-- Review replies: Public read, business owners can manage
CREATE POLICY "Review replies are viewable by everyone" ON public.review_replies FOR SELECT USING (true);
CREATE POLICY "Business owners can reply to reviews" ON public.review_replies 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid())
  );
CREATE POLICY "Business owners can update own replies" ON public.review_replies 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid())
  );

-- Subscription plans: Public read, admin write
CREATE POLICY "Subscription plans are viewable by everyone" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Business subscriptions: Owners can view own, admins can manage all
CREATE POLICY "Owners can view own subscriptions" ON public.business_subscriptions 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid())
  );
CREATE POLICY "Admins can manage all subscriptions" ON public.business_subscriptions 
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Favorites: Users can manage their own
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO public.categories (name, name_az, slug, description) VALUES
('Xonça', 'Xonça hazırlanması', 'xonca', 'Nişan və toy xonçaları'),
('Beauty', 'Gözəllik salonları', 'beauty', 'Makiyaj, saç, dırnaq və s.'),
('Decor', 'Dekor hazırlanması', 'decor', 'Toy və mərasim dekorasiyaları'),
('Venue', 'Restoranlar və toy zalları', 'venue', 'Toy məkanları və restoranlar'),
('Photo', 'Foto / video çəkiliş', 'photo', 'Peşəkar foto və video xidmətləri'),
('Cake', 'Tort və şirniyyat', 'cake', 'Toy tortları və şirniyyatlar'),
('DJ', 'DJ və musiqi', 'dj', 'Musiqi və əyləncə xidmətləri'),
('Bridal', 'Gəlinlik mağazaları', 'bridal', 'Gəlinliklər və aksesuarlar'),
('Groom', 'Bəy kostyumları', 'groom', 'Kişi geyimləri və aksesuarlar');

-- Insert subcategories for Beauty
INSERT INTO public.subcategories (category_id, name, name_az, slug)
SELECT id, 'Nails', 'Dırnaq', 'nails' FROM public.categories WHERE slug = 'beauty'
UNION ALL
SELECT id, 'Hair', 'Saç', 'hair' FROM public.categories WHERE slug = 'beauty'
UNION ALL
SELECT id, 'Makeup', 'Makiyaj', 'makeup' FROM public.categories WHERE slug = 'beauty'
UNION ALL
SELECT id, 'Eyebrow Lamination', 'Qaş laminasiya', 'eyebrow' FROM public.categories WHERE slug = 'beauty'
UNION ALL
SELECT id, 'Eyelashes', 'Kirpik', 'eyelashes' FROM public.categories WHERE slug = 'beauty'
UNION ALL
SELECT id, 'Hair Color', 'Saç rəngi', 'hair-color' FROM public.categories WHERE slug = 'beauty'
UNION ALL
SELECT id, 'Gel Polish', 'Gel-lak', 'gel-polish' FROM public.categories WHERE slug = 'beauty'
UNION ALL
SELECT id, 'Brazilian Blowout', 'Braziliyan feni', 'brazilian' FROM public.categories WHERE slug = 'beauty';

-- Insert subcategories for other categories
INSERT INTO public.subcategories (category_id, name, name_az, slug)
SELECT id, 'Wedding Xonça', 'Toy xonçası', 'wedding-xonca' FROM public.categories WHERE slug = 'xonca'
UNION ALL
SELECT id, 'Engagement Xonça', 'Nişan xonçası', 'engagement-xonca' FROM public.categories WHERE slug = 'xonca'
UNION ALL
SELECT id, 'Henna Xonça', 'Xına xonçası', 'henna-xonca' FROM public.categories WHERE slug = 'xonca';

INSERT INTO public.subcategories (category_id, name, name_az, slug)
SELECT id, 'Wedding Halls', 'Toy zalları', 'wedding-halls' FROM public.categories WHERE slug = 'venue'
UNION ALL
SELECT id, 'Restaurants', 'Restoranlar', 'restaurants' FROM public.categories WHERE slug = 'venue'
UNION ALL
SELECT id, 'Outdoor Venues', 'Açıq məkanlar', 'outdoor' FROM public.categories WHERE slug = 'venue';

INSERT INTO public.subcategories (category_id, name, name_az, slug)
SELECT id, 'Photography', 'Foto çəkiliş', 'photography' FROM public.categories WHERE slug = 'photo'
UNION ALL
SELECT id, 'Videography', 'Video çəkiliş', 'videography' FROM public.categories WHERE slug = 'photo'
UNION ALL
SELECT id, 'Drone', 'Dron çəkiliş', 'drone' FROM public.categories WHERE slug = 'photo';

INSERT INTO public.subcategories (category_id, name, name_az, slug)
SELECT id, 'Wedding Cakes', 'Toy tortları', 'wedding-cakes' FROM public.categories WHERE slug = 'cake'
UNION ALL
SELECT id, 'Sweets', 'Şirniyyatlar', 'sweets' FROM public.categories WHERE slug = 'cake'
UNION ALL
SELECT id, 'Custom Cakes', 'Xüsusi tortlar', 'custom-cakes' FROM public.categories WHERE slug = 'cake';

INSERT INTO public.subcategories (category_id, name, name_az, slug)
SELECT id, 'DJ Services', 'DJ xidmətləri', 'dj-services' FROM public.categories WHERE slug = 'dj'
UNION ALL
SELECT id, 'Live Music', 'Canlı musiqi', 'live-music' FROM public.categories WHERE slug = 'dj'
UNION ALL
SELECT id, 'MC Services', 'Aparıcı xidmətləri', 'mc' FROM public.categories WHERE slug = 'dj';

INSERT INTO public.subcategories (category_id, name, name_az, slug)
SELECT id, 'Wedding Decoration', 'Toy dekorasiyası', 'wedding-decor' FROM public.categories WHERE slug = 'decor'
UNION ALL
SELECT id, 'Flower Arrangements', 'Gül tərtibi', 'flowers' FROM public.categories WHERE slug = 'decor'
UNION ALL
SELECT id, 'Balloon Decoration', 'Şar dekorasiyası', 'balloons' FROM public.categories WHERE slug = 'decor';

INSERT INTO public.subcategories (category_id, name, name_az, slug)
SELECT id, 'Wedding Dresses', 'Gəlinliklər', 'wedding-dresses' FROM public.categories WHERE slug = 'bridal'
UNION ALL
SELECT id, 'Bridal Accessories', 'Gəlin aksesuarları', 'bridal-accessories' FROM public.categories WHERE slug = 'bridal';

INSERT INTO public.subcategories (category_id, name, name_az, slug)
SELECT id, 'Groom Suits', 'Bəy kostyumları', 'groom-suits' FROM public.categories WHERE slug = 'groom'
UNION ALL
SELECT id, 'Groom Accessories', 'Bəy aksesuarları', 'groom-accessories' FROM public.categories WHERE slug = 'groom';

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, duration_months, price) VALUES
('1 Aylıq', 1, 29.99),
('3 Aylıq', 3, 79.99),
('6 Aylıq', 6, 149.99),
('12 Aylıq', 12, 249.99);