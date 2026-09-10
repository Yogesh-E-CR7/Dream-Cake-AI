import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { DesignService } from '../../services/design.service';
import { OrderService } from '../../services/order.service';
import { CakeService } from '../../services/cake.service';
import { CakeDesign, Address, CakeFlavor, Frosting, CakeSize } from '../../types/database.types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { formatPrice } from '../../lib/utils';
import { localDb } from '../../lib/storage';
import {
  ShoppingBag,
  Calendar,
  Clock,
  MapPin,
  Check,
  AlertCircle,
  ShieldCheck,
  Truck,
  Store,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

export const OrderRequestPage: React.FC = () => {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [design, setDesign] = useState<CakeDesign | null>(null);
  const [flavors, setFlavors] = useState<CakeFlavor[]>([]);
  const [frostings, setFrostings] = useState<Frosting[]>([]);
  const [sizes, setSizes] = useState<CakeSize[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [orderType, setOrderType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [requestedDate, setRequestedDate] = useState(() => {
    const d = new Date(Date.now() + 3 * 86400000);
    return d.toISOString().split('T')[0];
  });
  const [requestedTime, setRequestedTime] = useState('4:00 PM - 6:00 PM');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [confirmedSpecs, setConfirmedSpecs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const designId = searchParams.get('designId');
      if (!designId) {
        navigate('/customer/designs');
        return;
      }

      const [d, flvs, frsts, szs] = await Promise.all([
        DesignService.getDesignById(designId),
        CakeService.getFlavors(),
        CakeService.getFrostings(),
        CakeService.getSizes(),
      ]);

      const userAddresses = localDb.getAddresses(user.id);

      setDesign(d);
      setFlavors(flvs);
      setFrostings(frsts);
      setSizes(szs);
      setAddresses(userAddresses);
      if (userAddresses.length > 0) {
        setSelectedAddressId(userAddresses[0].id);
      }
      setIsLoading(false);
    };
    load();
  }, [user, searchParams]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user || !design) return;
    if (!confirmedSpecs) {
      setError('Please review and confirm that your cake specifications are correct.');
      return;
    }
    if (!requestedDate) {
      setError('Please select a requested date for your cake.');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await OrderService.createOrder({
        user_id: user.id,
        design_id: design.id,
        order_type: orderType,
        delivery_address_id: orderType === 'DELIVERY' ? selectedAddressId || undefined : undefined,
        requested_date: requestedDate,
        requested_time: requestedTime,
        customer_notes: customerNotes,
        estimated_price: design.estimated_price,
      });

      navigate(`/customer/orders/${order.id}`);
    } catch (e: any) {
      setError(e.message || 'Could not submit order request.');
      setIsSubmitting(false);
    }
  };

  if (isLoading || !design) {
    return <div className="p-12 text-center text-xs text-chocolate-500">Loading order configuration...</div>;
  }

  const flavor = flavors.find((f) => f.id === design.flavor_id);
  const frosting = frostings.find((fr) => fr.id === design.frosting_id);
  const size = sizes.find((s) => s.id === design.size_id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-chocolate-600 hover:text-rose-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Studio
      </button>

      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
          Review & Request Your Dream Cake
        </h2>
        <p className="text-xs text-chocolate-600 mt-1">
          Review every specification before submitting to our master kitchen review queue
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Cake Specifications Summary (Cols: 7) */}
        <div className="md:col-span-7 rounded-3xl bg-white/95 border border-cream-200/90 p-6 shadow-soft space-y-5">
          <div className="flex items-start gap-4">
            <div className="h-28 w-28 rounded-2xl overflow-hidden bg-cream-100 border border-cream-200 shrink-0">
              {design.ai_preview_url || design.reference_image_url ? (
                <img
                  src={design.ai_preview_url || design.reference_image_url}
                  alt={design.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-4xl">🎂</div>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                {design.occasion}
              </span>
              <h3 className="font-serif text-lg font-bold text-chocolate-950 mt-1">
                {design.name}
              </h3>
              <p className="text-xs text-chocolate-600 mt-0.5">
                {design.shape} • {design.tiers} {design.tiers === 1 ? 'Tier' : 'Tiers'} • {size?.name}
              </p>
            </div>
          </div>

          {/* Specifications Matrix */}
          <div className="rounded-2xl bg-cream-50 p-4 border border-cream-200 divide-y divide-cream-200 text-xs space-y-2.5">
            <div className="flex justify-between items-center pt-1 first:pt-0">
              <span className="text-chocolate-500 font-medium">Gourmet Flavor</span>
              <span className="font-semibold text-chocolate-950">{flavor?.name || 'Belgian Chocolate'}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-chocolate-500 font-medium">Frosting</span>
              <span className="font-semibold text-chocolate-950">{frosting?.name || 'Buttercream'}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-chocolate-500 font-medium">Design Theme</span>
              <span className="font-semibold text-chocolate-950">{design.theme}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-chocolate-500 font-medium">Color Palette</span>
              <div className="flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full border border-cream-400" style={{ backgroundColor: design.primary_color }} />
                <span className="h-4 w-4 rounded-full border border-cream-400" style={{ backgroundColor: design.secondary_color }} />
                <span className="h-4 w-4 rounded-full border border-cream-400" style={{ backgroundColor: design.accent_color }} />
              </div>
            </div>
            {design.decorations && design.decorations.length > 0 && (
              <div className="flex justify-between items-start pt-2">
                <span className="text-chocolate-500 font-medium">Decorations</span>
                <span className="font-semibold text-chocolate-950 text-right max-w-[200px]">
                  {design.decorations.join(', ')}
                </span>
              </div>
            )}
            {design.cake_message && (
              <div className="flex justify-between items-center pt-2">
                <span className="text-chocolate-500 font-medium">Inscription</span>
                <span className="font-serif italic font-bold text-rose-800">"{design.cake_message}"</span>
              </div>
            )}
            {design.special_requirements && (
              <div className="flex justify-between items-start pt-2">
                <span className="text-chocolate-500 font-medium">Dietary / Notes</span>
                <span className="font-medium text-chocolate-800 text-right max-w-[220px]">
                  {design.special_requirements}
                </span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-amber-950">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Transparent Bakery Pricing
            </span>
            <p className="leading-relaxed">
              Estimated Price: <span className="font-bold font-serif text-rose-700 text-sm">{formatPrice(design.estimated_price)}</span>.
              The bakery will review all custom structural details and send you a finalized price quote to confirm before baking starts.
            </p>
          </div>
        </div>

        {/* Right: Delivery & Order Details Form (Cols: 5) */}
        <div className="md:col-span-5 space-y-5">
          <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-6 shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-bold text-chocolate-950">
              Fulfillment & Schedule
            </h3>

            {/* Delivery / Pickup Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrderType('DELIVERY')}
                className={`p-3 rounded-2xl border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 ${
                  orderType === 'DELIVERY'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-200'
                    : 'border-cream-200 text-chocolate-700 hover:bg-cream-50'
                }`}
              >
                <Truck className="h-5 w-5" />
                <span>Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('PICKUP')}
                className={`p-3 rounded-2xl border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 ${
                  orderType === 'PICKUP'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-200'
                    : 'border-cream-200 text-chocolate-700 hover:bg-cream-50'
                }`}
              >
                <Store className="h-5 w-5" />
                <span>Store Pickup</span>
              </button>
            </div>

            {/* Date & Time Slot */}
            <Input
              label="Celebration Date"
              type="date"
              value={requestedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setRequestedDate(e.target.value)}
              startIcon={<Calendar className="h-4 w-4" />}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                Preferred Time Slot
              </label>
              <select
                value={requestedTime}
                onChange={(e) => setRequestedTime(e.target.value)}
                className="w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-xs text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option>10:00 AM - 12:00 PM</option>
                <option>12:00 PM - 2:00 PM</option>
                <option>2:00 PM - 4:00 PM</option>
                <option>4:00 PM - 6:00 PM</option>
                <option>6:00 PM - 8:00 PM</option>
              </select>
            </div>

            {/* Address Selection if Delivery */}
            {orderType === 'DELIVERY' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700">
                  Delivery Address
                </label>
                {addresses.length > 0 ? (
                  <div className="space-y-2">
                    {addresses.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => setSelectedAddressId(a.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedAddressId === a.id
                            ? 'border-rose-600 bg-rose-50/80 ring-2 ring-rose-200 font-medium'
                            : 'border-cream-200 hover:bg-cream-50'
                        }`}
                      >
                        <span className="font-bold text-chocolate-950 block">{a.label} — {a.full_name}</span>
                        <p className="text-chocolate-600 text-[11px] mt-0.5">{a.address_line_1}, {a.city}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs text-chocolate-600">
                    Default bakery delivery coordinates registered.
                  </div>
                )}
              </div>
            )}

            <Textarea
              label="Delivery / Handover Instructions"
              placeholder="e.g. Ring bell, gate entry code #420, contact phone on arrival..."
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              rows={2}
            />

            {/* Mandatory Confirmation Checkbox */}
            <div className="pt-2 border-t border-cream-200">
              <label className="flex items-start gap-2 text-xs text-chocolate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedSpecs}
                  onChange={(e) => setConfirmedSpecs(e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-400"
                />
                <span className="font-medium">
                  I confirm that my cake specifications are correct. I understand the bakery will evaluate and confirm the final quote.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              leftIcon={<ShoppingBag className="h-5 w-5" />}
            >
              Submit Cake Request
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
