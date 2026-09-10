# 🎂 Dream Cake AI

> **"Design Your Dream Cake. AI Helps You Create It."**
>
> A production-grade, full-stack AI-assisted custom cake design and ordering platform combining artisan bakery craftsmanship with real-time 3D concept visualization, structured image reference analysis, conversational AI pastry styling, transparent dynamic pricing, and end-to-end bakery kitchen operations.

---

## 🌟 Key Features

### 1. 🎨 14-Step Artisan Cake Designer Studio
- **Step-by-Step Customizer**:
  - **Step 1 — Occasion**: Birthday, Wedding, Anniversary, Baby Shower, Graduation, Celebration, Kids, Custom.
  - **Step 2 — Cake Style**: Classic, Haute Couture Designer, Edible Photo Cake, Themed Sculpted, Bento, Bespoke AI.
  - **Step 3 — Shape**: Round, Square, Heart, Rectangle, Custom Hexagon.
  - **Step 4 — Weight & Servings**: 0.5 kg (Petite Bento) up to 5.0 kg+ (Gala Showpiece) with guest servings calculator.
  - **Step 5 — Multi-Tier Architecture**: 1, 2, or 3+ reinforced structural tiers.
  - **Step 6 — Gourmet Flavors**: Belgian Chocolate Truffle, Royal Red Velvet, Madagascar Vanilla Bean, Crunchy Butterscotch, Persian Pistachio Saffron, Alphonso Mango, and more.
  - **Step 7 — Frosting & Icings**: Swiss Meringue Buttercream, Whipped Chantilly, Chocolate Ganache Gloss, Tangy Cream Cheese, Artisan Fondant.
  - **Step 8 — Aesthetic Themes**: Floral Luxury, Modern Minimalist, Kids & Cartoon, Rustic Vintage, Royal Gold.
  - **Step 9 — Color Tinting**: Real-time Hex Color Pickers and curated bakery swatches for Primary, Secondary (Drip/Borders), and Accent (Gold highlights).
  - **Step 10 — Handcrafted Decorations**: Edible 24K Gold Leaf, Hand-piped Sugar Roses, Fresh Organic Berries, Laser-cut Acrylic Toppers, Chocolate Shards, Vintage Lambeth Piping.
  - **Step 11 — Calligraphy Inscription**: Live message rendering directly on cake banner/topper.
  - **Step 12 — Dietary & Baker Notes**: Custom dietary requests (eggless, less sweet, nut-free).
  - **Step 13 — Reference Image Upload & AI Analysis**: Upload high-res photos (JPG/PNG/WEBP) for instant visual attribute extraction.
  - **Step 14 — AI Photorealistic Preview**: Synthesize high-definition generative concept previews before ordering.

### 2. 🤖 Pluggable AI Service & Stylist
- **Core Product Principle**: *The customer is ALWAYS in control.* AI is an assistant that suggests, recommends, and analyzes—never silently overriding user specifications.
- **Interactive Chat Stylist**: Context-aware recommendations with `Apply Suggestions` and `Keep My Design` buttons.
- **Reference Image Analyzer**: Automatically extracts detected theme, shape, tier count, palette swatches, frosting technique, decorations, and complexity score (`Standard`, `Intricate`, `Masterpiece`).
- **Mock / Real Toggle**: Zero setup required out of the box via `MockAIService`, with clean interface abstraction for live OpenAI / Gemini / Stable Diffusion / Replicate backends.

### 3. 💰 Live Dynamic Pricing Engine
- Transparent, real-time price calculation combining:
  $$\text{Price} = \text{Base Category} + \text{Size} + \text{Flavor} + \text{Frosting} + \text{Decorations} + \text{Tier Surcharge} + \text{Complexity Modifier}$$
- Clear disclaimer that estimated price is confirmed by head chef before baking.

### 4. 📦 10-Step Order Tracking & Negotiation
- **Workflow**:
  1. `PENDING_REVIEW` — Customer submits request.
  2. `PRICE_CONFIRMATION` — Bakery evaluates complexity and quotes final price.
  3. `CONFIRMED` — Customer explicitly reviews & confirms final price.
  4. `PREPARING` — Sponges baked and fillings infused.
  5. `DECORATING` — Artisan piped roses and decorations applied.
  6. `QUALITY_CHECK` — Head chef inspects finish and packaging.
  7. `READY` — Boxed in climate-controlled temperature box.
  8. `OUT_FOR_DELIVERY` — Dispatched with delivery coordinates.
  9. `COMPLETED` — Handed over for celebration.
  10. `CANCELLED` — Order cancellation flow with status tracking.

### 5. 🧑‍🍳 Bakery Kitchen Operations Board (Staff Portal)
- Live kitchen workstation queue filtered by station (`Pending Review`, `Baking`, `Decorating`, `Quality Check`, `Ready`, `Delivered`).
- Feasibility check tools and price quoting modal.
- Internal kitchen staff communication notes.

### 6. 👑 Executive Admin Management Console
- Real-time revenue charts, order distribution, and flavor popularity trends.
- Full CRUD catalog management for Categories, Flavors, Frostings, Sizes, and Decorations.
- Dynamic pricing engine matrix allowing admins to change baseline prices and complexity multipliers without code changes.
- Role-based Access Control (RBAC) user management.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Date-fns, Canvas Confetti |
| **State Management** | Zustand |
| **Styling & Design Tokens** | Custom Tailwind Bakery Theme (Ivory Cream, Crimson Rose, Burgundy, Dark Chocolate, Champagne Gold), Playfair Display & Plus Jakarta Sans typography |
| **Backend & Database** | Supabase PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security (RLS) |
| **AI Architecture** | `AIService` Interface with `MockAIService` & `RealAIService` adapter |
| **Testing** | Vitest unit test suite |

---

## 🚀 Quick Start

### 1. Installation
```bash
# Clone or open the repository
cd "Dream Cake "

# Install dependencies
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
# Supabase Backend Configuration (Optional for mock mode)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Mode Toggles ('mock' or 'real')
VITE_AI_MODE=mock
VITE_PAYMENT_MODE=mock
VITE_STORAGE_MODE=mock
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts (1-Click Instant Login)

You can use the 1-click quick demo buttons on the landing page or top bar to test all user roles:

| Role | Email | Password | Access Area |
|---|---|---|---|
| **Customer** | `customer@dreamcake.ai` | `password123` | `/customer/home`, `/customer/design`, `/customer/orders` |
| **Bakery Staff** | `staff@dreamcake.ai` | `password123` | `/staff/dashboard`, `/staff/orders` |
| **Admin** | `admin@dreamcake.ai` | `password123` | `/admin/dashboard`, `/admin/catalog`, `/admin/pricing`, `/admin/users` |

---

## 🗄️ Database Schema & Supabase Setup

### 1. SQL Migrations
Execute `supabase/migrations/20260909_init_schema.sql` in the Supabase SQL Editor to initialize:
- Custom ENUM types (`user_role`, `order_status`, `design_status`, etc.)
- Tables: `profiles`, `customer_profiles`, `addresses`, `cake_categories`, `cake_flavors`, `frostings`, `cake_sizes`, `decorations`, `cake_designs`, `ai_generations`, `orders`, `order_status_history`, `order_notes`, `notifications`, `payments`.
- Row Level Security (RLS) policies for Customer, Staff, and Admin isolation.
- Storage buckets (`avatars`, `cake-references`, `cake-previews`, `cake-assets`).

### 2. Seed Data
Execute `supabase/seed.sql` to populate the catalog with rich gourmet flavors, artisan frostings, sizes, and handcrafted decoration items.

---

## 🧪 Running Tests
```bash
npm test
```
Runs the Vitest suite verifying the dynamic pricing engine calculations, multi-tier surcharges, and complexity modifiers.

---

## 📁 Project Structure

```
dream-cake-ai/
├── src/
│   ├── components/
│   │   ├── cake/          # CakePreviewCanvas, CakeSummaryCard, AICakeAssistant, ReferenceAnalyzerModal
│   │   ├── layout/        # Header, CustomerLayout, StaffLayout, AdminLayout
│   │   ├── order/         # OrderTimeline, PriceConfirmationModal, OrderCard
│   │   └── ui/            # Button, Input, Select, Textarea, Modal, Stepper, ColorPicker, ImageUploader, PriceBreakdown, etc.
│   ├── lib/
│   │   ├── mockData.ts    # Realistic catalog, flavor, and order mock seed data
│   │   ├── storage.ts     # Persistent local database manager & sync layer
│   │   ├── supabase.ts    # Supabase client initializer
│   │   └── utils.ts       # cn helper, formatPrice, formatDate, getOrderStatusBadge
│   ├── pages/
│   │   ├── auth/          # AuthLandingPage, ForgotPassword, ResetPassword
│   │   ├── customer/      # CustomerHomePage, CakeDesignerPage, SavedDesignsPage, OrderRequestPage, CustomerOrdersPage, etc.
│   │   ├── staff/         # StaffDashboardPage, StaffOrdersPage, StaffOrderDetailPage
│   │   ├── admin/         # AdminDashboardPage, AdminCatalogPage, AdminPricingPage, AdminUsersPage
│   │   └── AccessDeniedPage.tsx
│   ├── services/          # AuthService, CakeService, DesignService, OrderService, PricingService, AIService, NotificationService, AdminService
│   ├── stores/            # authStore, designerStore, notificationStore
│   ├── styles/            # index.css with custom design tokens
│   ├── types/             # database.types.ts, ai.types.ts
│   ├── App.tsx            # Main router with protected route guards
│   └── main.tsx
├── supabase/
│   ├── migrations/        # PostgreSQL schema DDL with comprehensive RLS
│   └── seed.sql           # Rich catalog seed data
├── tests/                 # Automated Vitest test suite
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📜 License
MIT © 2026 Dream Cake AI. All rights reserved.
