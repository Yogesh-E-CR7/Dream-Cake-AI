-- ==============================================================================
-- DREAM CAKE AI — DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) MIGRATION
-- ==============================================================================

-- 1. EXTENSIONS & CUSTOM TYPES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'staff', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE design_status AS ENUM ('DRAFT', 'READY', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE generation_type AS ENUM ('CHAT', 'REFERENCE_ANALYSIS', 'PREVIEW', 'SUGGESTION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_type AS ENUM ('PICKUP', 'DELIVERY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'PENDING_REVIEW',
        'PRICE_CONFIRMATION',
        'CONFIRMED',
        'PREPARING',
        'DECORATING',
        'QUALITY_CHECK',
        'READY',
        'OUT_FOR_DELIVERY',
        'COMPLETED',
        'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    preferred_flavor TEXT,
    preferred_frosting TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Home',
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CAKE CATALOG & CONFIGURATION
CREATE TABLE IF NOT EXISTS cake_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    base_price NUMERIC(10, 2) NOT NULL DEFAULT 600.00,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cake_flavors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    price_modifier NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS frostings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price_modifier NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cake_sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    weight_kg NUMERIC(4, 2) NOT NULL,
    servings TEXT NOT NULL,
    price_modifier NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS decorations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price_modifier NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    active BOOLEAN NOT NULL DEFAULT true
);

-- 4. CAKE DESIGNS & AI GENERATIONS
CREATE TABLE IF NOT EXISTS cake_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    occasion TEXT NOT NULL,
    category_id UUID REFERENCES cake_categories(id),
    flavor_id UUID REFERENCES cake_flavors(id),
    frosting_id UUID REFERENCES frostings(id),
    size_id UUID REFERENCES cake_sizes(id),
    shape TEXT NOT NULL DEFAULT 'Round',
    tiers INTEGER NOT NULL DEFAULT 1,
    theme TEXT NOT NULL DEFAULT 'Modern Luxury',
    primary_color TEXT NOT NULL DEFAULT '#FDF2F4',
    secondary_color TEXT NOT NULL DEFAULT '#BE123C',
    accent_color TEXT NOT NULL DEFAULT '#D4AF37',
    decorations JSONB NOT NULL DEFAULT '[]'::jsonb,
    cake_message TEXT,
    special_requirements TEXT,
    reference_image_url TEXT,
    ai_preview_url TEXT,
    ai_analysis JSONB,
    estimated_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status design_status NOT NULL DEFAULT 'DRAFT',
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    design_id UUID REFERENCES cake_designs(id) ON DELETE SET NULL,
    generation_type generation_type NOT NULL,
    prompt TEXT,
    input_data JSONB,
    output_data JSONB,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'COMPLETED',
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ORDERS, HISTORY & NOTES
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    design_id UUID NOT NULL REFERENCES cake_designs(id),
    assigned_staff_id UUID REFERENCES profiles(id),
    order_type order_type NOT NULL DEFAULT 'DELIVERY',
    delivery_address_id UUID REFERENCES addresses(id),
    requested_date DATE NOT NULL,
    requested_time TEXT NOT NULL,
    customer_notes TEXT,
    estimated_price NUMERIC(10, 2) NOT NULL,
    final_price NUMERIC(10, 2),
    customer_confirmed_price BOOLEAN NOT NULL DEFAULT false,
    payment_status payment_status NOT NULL DEFAULT 'PENDING',
    order_status order_status NOT NULL DEFAULT 'PENDING_REVIEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status order_status NOT NULL,
    message TEXT NOT NULL,
    updated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id),
    note TEXT NOT NULL,
    internal BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'ORDER_UPDATE',
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    provider TEXT NOT NULL DEFAULT 'mock_gateway',
    transaction_id TEXT NOT NULL,
    status payment_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cake_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cake_flavors ENABLE ROW LEVEL SECURITY;
ALTER TABLE frostings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cake_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE decorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cake_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Helper functions to check roles
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE auth_user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles viewable by self or staff/admin" ON profiles;
CREATE POLICY "Public profiles viewable by self or staff/admin"
    ON profiles FOR SELECT
    USING (auth_user_id = auth.uid() OR current_user_role() IN ('staff', 'admin'));

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth_user_id = auth.uid() OR current_user_role() = 'admin');

DROP POLICY IF EXISTS "Allow user profile creation" ON profiles;
CREATE POLICY "Allow user profile creation"
    ON profiles FOR INSERT
    WITH CHECK (auth_user_id = auth.uid() OR current_user_role() = 'admin');

-- Cake Catalog Policies (Public read, admin write)
DROP POLICY IF EXISTS "Public read for active categories" ON cake_categories;
CREATE POLICY "Public read for active categories" ON cake_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write for categories" ON cake_categories;
CREATE POLICY "Admin write for categories" ON cake_categories FOR ALL USING (current_user_role() = 'admin');

DROP POLICY IF EXISTS "Public read for active flavors" ON cake_flavors;
CREATE POLICY "Public read for active flavors" ON cake_flavors FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write for flavors" ON cake_flavors;
CREATE POLICY "Admin write for flavors" ON cake_flavors FOR ALL USING (current_user_role() = 'admin');

DROP POLICY IF EXISTS "Public read for frostings" ON frostings;
CREATE POLICY "Public read for frostings" ON frostings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write for frostings" ON frostings;
CREATE POLICY "Admin write for frostings" ON frostings FOR ALL USING (current_user_role() = 'admin');

DROP POLICY IF EXISTS "Public read for sizes" ON cake_sizes;
CREATE POLICY "Public read for sizes" ON cake_sizes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write for sizes" ON cake_sizes;
CREATE POLICY "Admin write for sizes" ON cake_sizes FOR ALL USING (current_user_role() = 'admin');

DROP POLICY IF EXISTS "Public read for decorations" ON decorations;
CREATE POLICY "Public read for decorations" ON decorations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin write for decorations" ON decorations;
CREATE POLICY "Admin write for decorations" ON decorations FOR ALL USING (current_user_role() = 'admin');

-- Addresses Policies
DROP POLICY IF EXISTS "Users manage own addresses" ON addresses;
CREATE POLICY "Users manage own addresses"
    ON addresses FOR ALL
    USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- Cake Designs Policies
DROP POLICY IF EXISTS "Users manage own designs" ON cake_designs;
CREATE POLICY "Users manage own designs"
    ON cake_designs FOR ALL
    USING (
        user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()) 
        OR current_user_role() IN ('staff', 'admin')
    );

-- Orders Policies
DROP POLICY IF EXISTS "Customers view own orders, Staff/Admin view all" ON orders;
CREATE POLICY "Customers view own orders, Staff/Admin view all"
    ON orders FOR SELECT
    USING (
        user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
        OR current_user_role() IN ('staff', 'admin')
    );

DROP POLICY IF EXISTS "Customers can create orders" ON orders;
CREATE POLICY "Customers can create orders"
    ON orders FOR INSERT
    WITH CHECK (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Customer can confirm price, Staff/Admin can update orders" ON orders;
CREATE POLICY "Customer can confirm price, Staff/Admin can update orders"
    ON orders FOR UPDATE
    USING (
        user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
        OR current_user_role() IN ('staff', 'admin')
    );

-- Order Status History & Notes
DROP POLICY IF EXISTS "View order history" ON order_status_history;
CREATE POLICY "View order history" ON order_status_history FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff/Admin manage history" ON order_status_history;
CREATE POLICY "Staff/Admin manage history" ON order_status_history FOR INSERT WITH CHECK (current_user_role() IN ('staff', 'admin'));

DROP POLICY IF EXISTS "Staff/Admin view order notes" ON order_notes;
CREATE POLICY "Staff/Admin view order notes" ON order_notes FOR SELECT USING (current_user_role() IN ('staff', 'admin'));

DROP POLICY IF EXISTS "Staff/Admin create order notes" ON order_notes;
CREATE POLICY "Staff/Admin create order notes" ON order_notes FOR INSERT WITH CHECK (current_user_role() IN ('staff', 'admin'));

-- Notifications Policies
DROP POLICY IF EXISTS "Users view own notifications" ON notifications;
CREATE POLICY "Users view own notifications"
    ON notifications FOR ALL
    USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));
