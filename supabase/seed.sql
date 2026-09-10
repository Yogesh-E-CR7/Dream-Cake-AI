-- ==============================================================================
-- DREAM CAKE AI — INITIAL CATALOG & REALISTIC SEED DATA
-- ==============================================================================

-- 1. CAKE CATEGORIES
INSERT INTO cake_categories (name, slug, description, image_url, base_price, active) VALUES
('Birthday', 'birthday', 'Celebrate milestones with vibrant, joyous handcrafted cake designs.', 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600&auto=format&fit=crop&q=80', 799.00, true),
('Wedding', 'wedding', 'Sophisticated multi-tier architectural masterpieces for your special day.', 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80', 2499.00, true),
('Anniversary', 'anniversary', 'Romantic heart shapes, subtle pastels and edible floral decorations.', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80', 999.00, true),
('Kids & Cartoon', 'kids', 'Fun, colorful 3D themed character cakes that bring stories to life.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80', 899.00, true),
('Baby Shower', 'baby-shower', 'Gentle pastels, sweet cloud motifs, and delicate keepsake toppers.', 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&auto=format&fit=crop&q=80', 949.00, true),
('Graduation', 'graduation', 'Academic caps, diplomas, and customized celebratory gold accents.', 'https://images.unsplash.com/photo-1532499016263-f2c3e89de9cd?w=600&auto=format&fit=crop&q=80', 899.00, true),
('Celebration', 'celebration', 'Luxurious modern cakes for corporate events, parties, and triumphs.', 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80', 1099.00, true),
('Custom AI Creation', 'custom', 'Pure creative freedom powered by the Dream Cake AI generative studio.', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&auto=format&fit=crop&q=80', 899.00, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. CAKE FLAVORS
INSERT INTO cake_flavors (name, description, image_url, price_modifier, active) VALUES
('Belgian Chocolate Truffle', 'Rich dark chocolate sponge layered with smooth 54% Callebaut truffle ganache.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80', 150.00, true),
('Madagascar Vanilla Bean', 'Light, fluffy sponge infused with aromatic organic vanilla bean caviar.', 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=300&auto=format&fit=crop&q=80', 50.00, true),
('Royal Red Velvet', 'Velvety crimson cocoa crumb paired with our signature light cream cheese pairing.', 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=300&auto=format&fit=crop&q=80', 180.00, true),
('Crunchy Butterscotch', 'Caramelized praline crunch folded into golden brown sugar butter sponge.', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&auto=format&fit=crop&q=80', 120.00, true),
('Classic Black Forest', 'Kirsch-soaked chocolate sponge with tart sour cherries and whipped Chantilly.', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=300&auto=format&fit=crop&q=80', 140.00, true),
('White Forest Blossom', 'White chocolate shavings with wild berry compote and delicate vanilla cream.', 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=300&auto=format&fit=crop&q=80', 130.00, true),
('Fresh Strawberry Rose', 'Sun-ripened strawberry puree with a whisper of organic Damask rosewater.', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&auto=format&fit=crop&q=80', 160.00, true),
('Tropical Alphonso Mango', 'Pure Ratnagiri Alphonso mango mousse between tender coconut sponge.', 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=300&auto=format&fit=crop&q=80', 200.00, true),
('Persian Pistachio Saffron', 'Finely ground green pistachios infused with Kashmiri saffron strands.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80', 250.00, true),
('Salted Caramel Espresso', 'Dark espresso soak balanced with sea-salted artisan dairy caramel.', 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=300&auto=format&fit=crop&q=80', 170.00, true)
ON CONFLICT DO NOTHING;

-- 3. FROSTINGS
INSERT INTO frostings (name, description, price_modifier, active) VALUES
('Swiss Meringue Buttercream', 'Silky, velvety, and balanced in sweetness with high stability.', 80.00, true),
('Whipped Chantilly Cream', 'Ultra-light, airy, and refreshing cream with subtle vanilla notes.', 0.00, true),
('Chocolate Ganache Gloss', 'Decadent, rich melted dark chocolate glaze with a mirror finish.', 140.00, true),
('Tangy Cream Cheese', 'Smooth, mildly tart premium Philadelphia style cream cheese.', 120.00, true),
('Artisan Sugar Fondant', 'Flawless porcelain smooth surface ideal for intricate sculpting.', 220.00, true)
ON CONFLICT DO NOTHING;

-- 4. CAKE SIZES
INSERT INTO cake_sizes (name, weight_kg, servings, price_modifier, active) VALUES
('0.5 kg (Bento / Petite)', 0.50, '2 - 4 servings', 0.00, true),
('1.0 kg (Classic Small)', 1.00, '6 - 8 servings', 350.00, true),
('1.5 kg (Party Medium)', 1.50, '10 - 12 servings', 650.00, true),
('2.0 kg (Celebration Large)', 2.00, '14 - 18 servings', 950.00, true),
('3.0 kg (Grand Multi-tier)', 3.00, '22 - 28 servings', 1550.00, true),
('4.0 kg (Royal Banquet)', 4.00, '30 - 38 servings', 2150.00, true),
('5.0 kg+ (Gala Showpiece)', 5.00, '40 - 55 servings', 2850.00, true)
ON CONFLICT DO NOTHING;

-- 5. DECORATIONS
INSERT INTO decorations (name, category, description, image_url, price_modifier, active) VALUES
('Handcrafted Edible Sugar Roses', 'Flowers', 'Artisan hand-piped sugar petal roses with gold tipped edges.', '🌸', 220.00, true),
('Fresh Organic Berries & Figs', 'Fruits', 'Fresh raspberries, blueberries, blackberries and cut mission figs.', '🍓', 180.00, true),
('24K Edible Gold Leaf Accents', 'Gold Accents', 'Gleaming genuine 24-karat gold leaf flakes applied by hand.', '✨', 250.00, true),
('Artisan Chocolate Drip & Shards', 'Chocolates', 'Rich dark chocolate dripping cascades with hand-tempered geometric shards.', '🍫', 140.00, true),
('Acrylic Laser Cut Name Topper', 'Toppers', 'Custom laser cut golden acrylic calligraphy cake topper.', '🎂', 160.00, true),
('Vintage Royal Lambeth Piping', 'Piping', 'Intricate Victorian ruffles and vintage scroll borders.', '🎀', 190.00, true),
('Edible High-Res Photo Print', 'Edible Prints', 'Crystal clear edible icing sheet printing with food-grade colors.', '🖼️', 150.00, true),
('Sparkling Pearl & Gold Sprinkles', 'Sprinkles', 'Crisp chocolate-centered metallic pearls in various sizes.', '⭐', 80.00, true),
('3D Custom Clay/Sugar Character', 'Figures', 'Detailed miniature sculpted figurine based on your theme.', '🧸', 350.00, true)
ON CONFLICT DO NOTHING;
