import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useDesignerStore } from '../../stores/designerStore';
import { DesignService } from '../../services/design.service';
import { OrderService } from '../../services/order.service';
import { CakeDesign, Order } from '../../types/database.types';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { formatPrice, formatDate } from '../../lib/utils';
import {
  Sparkles,
  Wand2,
  ArrowRight,
  Heart,
  Clock,
  Cake,
  Star,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';

export const CustomerHomePage: React.FC = () => {
  const { user } = useAuthStore();
  const { updateDesign, setStep, categories, loadCatalog } = useDesignerStore();
  const navigate = useNavigate();

  const [recentDesigns, setRecentDesigns] = useState<CakeDesign[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCatalog();
    const loadUserData = async () => {
      if (user) {
        const [designs, orders] = await Promise.all([
          DesignService.getDesigns(user.id),
          OrderService.getOrders(user.id),
        ]);
        setRecentDesigns(designs.slice(0, 4));
        setActiveOrders(orders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.order_status)));
      }
      setIsLoading(false);
    };
    loadUserData();
  }, [user]);

  const handleOccasionClick = (occasionName: string) => {
    updateDesign({
      occasion: occasionName,
      name: `${occasionName} Celebration Cake`,
    });
    setStep(2);
    navigate('/customer/design');
  };

  const occasions = [
    { name: 'Birthday', icon: '🎂', description: 'Milestone celebrations & vibrant parties' },
    { name: 'Wedding', icon: '💍', description: 'Architectural multi-tier grand centerpieces' },
    { name: 'Anniversary', icon: '❤️', description: 'Romantic silhouettes & edible roses' },
    { name: 'Baby Shower', icon: '👶', description: 'Sweet pastels, clouds & delicate toppers' },
    { name: 'Graduation', icon: '🎓', description: 'Golden accents & achievement honors' },
    { name: 'Celebration', icon: '🎉', description: 'Corporate, festivities & triumphs' },
    { name: 'Kids & Cartoon', icon: '🧒', description: 'Fun 3D characters & colorful themes' },
    { name: 'Custom Creation', icon: '✨', description: 'Pure creative freedom with AI Stylist' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Active Order Banner if any */}
      {activeOrders.length > 0 && (
        <div className="rounded-3xl bg-gradient-to-r from-rose-900 via-burgundy-900 to-chocolate-950 text-white p-5 sm:p-6 shadow-soft-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-gold-400 border border-white/10">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-gold-300 tracking-wider">
                  Active Cake Order in Progress
                </span>
                <span className="font-mono text-xs text-cream-200">#{activeOrders[0].order_number}</span>
              </div>
              <h4 className="font-serif text-lg font-bold text-white mt-0.5">
                {activeOrders[0].design?.name || 'Custom Handcrafted Cake'}
              </h4>
              <p className="text-xs text-rose-200 mt-1">
                Requested for {formatDate(activeOrders[0].requested_date)} • {activeOrders[0].requested_time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={activeOrders[0].order_status} />
            <Link to={`/customer/orders/${activeOrders[0].id}`}>
              <Button size="sm" variant="gold" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Track Timeline
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EF] to-rose-50/50 border border-cream-200/90 p-8 sm:p-12 shadow-soft-lg overflow-hidden">
        {/* Glows */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-gold-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-100/80 px-3 py-1 text-xs font-semibold text-rose-900 border border-rose-200">
            <Sparkles className="h-3.5 w-3.5 text-rose-600" />
            AI-Assisted Bakery Studio
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-chocolate-950 leading-tight">
            Create a Cake That’s <br />
            <span className="bg-gradient-to-r from-rose-700 via-rose-600 to-burgundy-700 bg-clip-text text-transparent">
              Uniquely Yours.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-chocolate-700 leading-relaxed max-w-xl font-normal">
            Tell us what you’re imagining. Our AI will help you turn it into a beautiful cake concept with live 3D visualization and real-time artisan pricing.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link to="/customer/design">
              <Button size="lg" variant="primary" leftIcon={<Wand2 className="h-5 w-5" />}>
                Design My Cake
              </Button>
            </Link>
            <a href="#occasions">
              <Button size="lg" variant="secondary">
                Explore Occasions
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Occasion Selection Section */}
      <div id="occasions" className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-serif text-2xl font-bold text-chocolate-950">
              Select an Occasion
            </h3>
            <p className="text-xs text-chocolate-600 mt-1">
              Choose your celebration type to begin your tailored design session
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {occasions.map((occ) => (
            <div
              key={occ.name}
              onClick={() => handleOccasionClick(occ.name)}
              className="group rounded-2xl bg-white border border-cream-200 p-5 shadow-soft hover:shadow-soft-lg hover:border-rose-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">
                  {occ.icon}
                </span>
                <h4 className="font-serif text-base font-bold text-chocolate-950 group-hover:text-rose-700 transition-colors">
                  {occ.name}
                </h4>
                <p className="text-xs text-chocolate-600 mt-1 line-clamp-2">
                  {occ.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between text-xs font-semibold text-rose-700">
                <span>Start Design</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Saved Designs */}
      {recentDesigns.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-chocolate-950">
                Your Saved Designs
              </h3>
              <p className="text-xs text-chocolate-600 mt-1">
                Pick up where you left off or request baking
              </p>
            </div>
            <Link to="/customer/designs" className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1">
              View All ({recentDesigns.length}) <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentDesigns.map((design) => (
              <div
                key={design.id}
                className="rounded-2xl bg-white border border-cream-200 overflow-hidden shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 w-full bg-cream-100 flex items-center justify-center overflow-hidden">
                  {design.ai_preview_url || design.reference_image_url ? (
                    <img
                      src={design.ai_preview_url || design.reference_image_url}
                      alt={design.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">🎂</span>
                  )}
                  <span className="absolute top-2.5 left-2.5 rounded-md bg-chocolate-950/75 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {design.occasion}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-chocolate-950 line-clamp-1">
                      {design.name}
                    </h4>
                    <p className="text-xs text-chocolate-600 mt-0.5">
                      {design.shape} • {design.tiers} {design.tiers === 1 ? 'Tier' : 'Tiers'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-cream-100">
                    <span className="font-serif text-base font-bold text-rose-700">
                      {formatPrice(design.estimated_price)}
                    </span>
                    <Link to={`/customer/design?id=${design.id}`}>
                      <Button size="sm" variant="soft">
                        Open Studio
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
