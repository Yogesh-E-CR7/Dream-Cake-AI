import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { DesignService } from '../../services/design.service';
import { CakeDesign } from '../../types/database.types';
import { formatPrice, formatDate } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { EmptyState, LoadingSkeleton } from '../../components/ui/EmptyState';
import {
  Wand2,
  Copy,
  Trash2,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  Heart,
} from 'lucide-react';

export const SavedDesignsPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [designs, setDesigns] = useState<CakeDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDesigns = async () => {
    if (user) {
      const list = await DesignService.getDesigns(user.id);
      setDesigns(list);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadDesigns();
  }, [user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this design?')) {
      await DesignService.deleteDesign(id);
      loadDesigns();
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      const copy = await DesignService.duplicateDesign(id, user.id);
      if (copy) loadDesigns();
    }
  };

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await DesignService.toggleFavorite(id);
    loadDesigns();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
            My Saved Cake Designs
          </h2>
          <p className="text-xs text-chocolate-600 mt-1">
            All your AI-assisted custom creations, drafts, and concepts
          </p>
        </div>

        <Link to="/customer/design">
          <Button variant="primary" size="md" leftIcon={<Wand2 className="h-4 w-4" />}>
            Create New Design
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : designs.length === 0 ? (
        <EmptyState
          title="No cake designs yet"
          description="Start creating your first dream cake with real-time AI assistance, custom sculpting, and dynamic pricing."
          actionLabel="Design My Cake"
          onAction={() => navigate('/customer/design')}
          actionIcon={<Wand2 className="h-4 w-4" />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <div
              key={design.id}
              className="rounded-3xl bg-white border border-cream-200/90 overflow-hidden shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between group"
            >
              {/* Visual Thumbnail */}
              <div className="relative h-56 w-full bg-cream-100 flex items-center justify-center overflow-hidden">
                {design.ai_preview_url || design.reference_image_url ? (
                  <img
                    src={design.ai_preview_url || design.reference_image_url}
                    alt={design.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-5xl">🎂</div>
                )}

                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                  <span className="rounded-md bg-chocolate-950/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {design.occasion}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(design.id, e)}
                    className="rounded-full bg-white/90 p-2 text-chocolate-600 shadow-md hover:text-rose-600 transition-colors"
                  >
                    <Heart
                      className={`h-4 w-4 ${design.is_favorite ? 'fill-rose-600 text-rose-600' : ''}`}
                    />
                  </button>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                  <span
                    className="h-4 w-4 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: design.primary_color || '#FFF1F4' }}
                  />
                  <span
                    className="h-4 w-4 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: design.secondary_color || '#BE123C' }}
                  />
                  <span
                    className="h-4 w-4 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: design.accent_color || '#D4AF37' }}
                  />
                </div>
              </div>

              {/* Details & Metadata */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-chocolate-950 line-clamp-1">
                    {design.name}
                  </h3>
                  <p className="text-xs text-chocolate-600 mt-1">
                    {design.shape} • {design.tiers} {design.tiers === 1 ? 'Tier' : 'Tiers'} • {design.theme}
                  </p>
                  <p className="text-[11px] text-chocolate-500 mt-1">
                    Last updated {formatDate(design.updated_at)}
                  </p>
                </div>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-chocolate-500 block">
                      Estimated
                    </span>
                    <span className="font-serif text-xl font-bold text-rose-700">
                      {formatPrice(design.estimated_price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleDuplicate(design.id, e)}
                      className="p-2 rounded-xl text-chocolate-500 hover:bg-cream-100 hover:text-chocolate-800 transition-colors"
                      title="Duplicate design"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(design.id, e)}
                      className="p-2 rounded-xl text-chocolate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete design"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link to={`/customer/design?id=${design.id}`}>
                      <Button size="sm" variant="soft">
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/customer/orders/request?designId=${design.id}`}>
                      <Button size="sm" variant="gold" leftIcon={<ShoppingBag className="h-3.5 w-3.5" />}>
                        Order
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
