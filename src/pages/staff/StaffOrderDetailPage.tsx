import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus, OrderStatusHistory, OrderNote } from '../../types/database.types';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { OrderTimeline } from '../../components/order/OrderTimeline';
import { formatPrice, formatDate, formatDateTime } from '../../lib/utils';
import {
  ArrowLeft,
  ChefHat,
  Tag,
  CheckCircle,
  AlertCircle,
  FileText,
  Sparkles,
  Send,
  MessageSquare,
  ShieldCheck,
  Truck,
  PackageCheck,
  User,
  Phone,
  Mail,
  Layers,
  Calendar,
} from 'lucide-react';

export const StaffOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<OrderStatusHistory[]>([]);
  const [notes, setNotes] = useState<OrderNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Price Quote Form
  const [quotePrice, setQuotePrice] = useState<number>(0);
  const [quoteNote, setQuoteNote] = useState('');
  const [isQuoting, setIsQuoting] = useState(false);

  // Internal Kitchen Note
  const [newInternalNote, setNewInternalNote] = useState('');

  // Status message
  const [customStatusMsg, setCustomStatusMsg] = useState('');

  const loadData = async () => {
    if (!id) return;
    const ord = await OrderService.getOrderById(id);
    if (ord) {
      const [hist, orderNotes] = await Promise.all([
        OrderService.getStatusHistory(ord.id),
        OrderService.getOrderNotes(ord.id),
      ]);
      setOrder(ord);
      setHistory(hist);
      setNotes(orderNotes);
      setQuotePrice(ord.final_price || ord.estimated_price);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !user || quotePrice <= 0) return;
    setIsQuoting(true);

    await OrderService.setStaffQuote({
      order_id: order.id,
      staff_id: user.id,
      staff_name: user.full_name || 'Head Baker',
      final_price: Number(quotePrice),
      notes: quoteNote || undefined,
    });

    setIsQuoting(false);
    loadData();
  };

  const handleAdvanceStatus = async (status: OrderStatus) => {
    if (!order || !user) return;
    await OrderService.updateStatus({
      order_id: order.id,
      staff_id: user.id,
      staff_name: user.full_name || 'Head Baker',
      status,
      customMessage: customStatusMsg || undefined,
    });
    setCustomStatusMsg('');
    loadData();
  };

  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !user || !newInternalNote.trim()) return;
    await OrderService.addOrderNote(order.id, user.id, user.full_name || 'Staff', newInternalNote.trim());
    setNewInternalNote('');
    loadData();
  };

  if (isLoading || !order) {
    return <div className="p-12 text-center text-xs text-chocolate-500">Loading order processing details...</div>;
  }

  const design = order.design;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/staff/orders')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-chocolate-600 hover:text-rose-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Kitchen Queue
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-chocolate-600">
            Order #{order.order_number}
          </span>
          <StatusBadge status={order.order_status} />
        </div>
      </div>

      {/* Main Kitchen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Customer Details, Cake Visuals & Specifications (Cols: 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Card */}
          <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-5 shadow-soft space-y-3">
            <h3 className="font-serif text-base font-bold text-chocolate-950 flex items-center gap-2">
              <User className="h-4 w-4 text-rose-700" /> Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-chocolate-500 font-medium block">Name</span>
                <span className="font-bold text-chocolate-950 mt-0.5 block">{order.customer?.full_name || 'Guest'}</span>
              </div>
              <div>
                <span className="text-chocolate-500 font-medium block">Phone</span>
                <span className="font-mono text-chocolate-950 mt-0.5 block">{order.customer?.phone || '+91 98765 43210'}</span>
              </div>
              <div>
                <span className="text-chocolate-500 font-medium block">Email</span>
                <span className="text-chocolate-950 mt-0.5 block truncate">{order.customer?.email}</span>
              </div>
            </div>

            {order.customer_notes && (
              <div className="rounded-xl bg-cream-50 p-3 border border-cream-200 text-xs">
                <span className="font-bold text-chocolate-900 block mb-0.5">Customer Delivery Instructions:</span>
                <p className="text-chocolate-700">{order.customer_notes}</p>
              </div>
            )}
          </div>

          {/* Cake Images: Visual & Reference Comparison */}
          <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-5 shadow-soft space-y-4">
            <h3 className="font-serif text-base font-bold text-chocolate-950">
              Cake Concept & Reference Artwork
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                  Concept Studio Visual
                </span>
                <div className="h-48 rounded-2xl overflow-hidden bg-cream-100 border border-cream-200">
                  {design?.ai_preview_url ? (
                    <img src={design.ai_preview_url} alt="Concept" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-4xl">🎂</div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-chocolate-600">
                  Uploaded Reference Photo
                </span>
                <div className="h-48 rounded-2xl overflow-hidden bg-cream-100 border border-cream-200">
                  {design?.reference_image_url ? (
                    <img src={design.reference_image_url} alt="Reference" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-chocolate-400 p-4 text-center">
                      No custom reference photo uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Reference Analysis (if available) */}
            {design?.ai_analysis && (
              <div className="rounded-2xl bg-gold-50/70 border border-gold-200 p-4 space-y-2 text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" /> AI Reference Extraction Insights
                </span>
                <p className="text-chocolate-800 leading-relaxed">
                  {design.ai_analysis.aestheticSummary || 'Artisan tiered cake styling with delicate decorative balance.'}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                  <span className="bg-white px-2 py-0.5 rounded-md border border-gold-300 font-medium text-chocolate-900">
                    Complexity: {design.ai_analysis.complexityScore || 'Intricate'}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded-md border border-gold-300 font-medium text-chocolate-900">
                    Theme: {design.ai_analysis.theme || design.theme}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Full Specifications */}
          <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-5 shadow-soft space-y-3 text-xs">
            <h3 className="font-serif text-base font-bold text-chocolate-950">
              Kitchen Recipe & Build Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                <span className="text-[10px] uppercase font-bold text-chocolate-500 block">Occasion</span>
                <span className="font-bold text-chocolate-950 mt-0.5 block">{design?.occasion}</span>
              </div>
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                <span className="text-[10px] uppercase font-bold text-chocolate-500 block">Shape & Tiers</span>
                <span className="font-bold text-chocolate-950 mt-0.5 block">{design?.shape} • {design?.tiers} Tiers</span>
              </div>
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                <span className="text-[10px] uppercase font-bold text-chocolate-500 block">Colors</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: design?.primary_color }} />
                  <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: design?.secondary_color }} />
                  <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: design?.accent_color }} />
                </div>
              </div>
            </div>

            {design?.decorations && design.decorations.length > 0 && (
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                <span className="text-[10px] uppercase font-bold text-chocolate-500 block mb-1">
                  Handcrafted Decorations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {design.decorations.map((d, i) => (
                    <span key={i} className="bg-white px-2 py-0.5 rounded-md border border-cream-300 font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {design?.cake_message && (
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200">
                <span className="text-[10px] uppercase font-bold text-rose-800 block">Cake Inscription / Banner</span>
                <p className="font-serif italic font-bold text-chocolate-950 text-sm mt-0.5">
                  "{design.cake_message}"
                </p>
              </div>
            )}

            {design?.special_requirements && (
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200">
                <span className="text-[10px] uppercase font-bold text-chocolate-500 block">Dietary & Baker Notes</span>
                <p className="text-chocolate-800 mt-0.5">{design.special_requirements}</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Price Quoting & Status Control Station (Cols: 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Price Quoting Card (Active during PENDING_REVIEW or adjustment) */}
          <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-6 shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-bold text-chocolate-950 flex items-center gap-2">
              <Tag className="h-5 w-5 text-rose-700" /> Bakery Price Quote
            </h3>

            <div className="rounded-2xl bg-cream-50 p-3.5 border border-cream-200 space-y-1 text-xs">
              <div className="flex justify-between text-chocolate-600">
                <span>Initial Customer Estimate:</span>
                <span className="font-semibold">{formatPrice(order.estimated_price)}</span>
              </div>
              <div className="flex justify-between text-chocolate-950 font-bold pt-1 border-t border-cream-200">
                <span>Current Price:</span>
                <span className="font-serif text-base text-rose-700">
                  {formatPrice(order.final_price || order.estimated_price)}
                </span>
              </div>
            </div>

            <form onSubmit={handleSendQuote} className="space-y-3 text-xs">
              <Input
                label="Set Final Confirmed Price (₹)"
                type="number"
                value={quotePrice}
                onChange={(e) => setQuotePrice(Number(e.target.value))}
                min={100}
                required
              />

              <Textarea
                label="Notes / Quote Explanation to Customer"
                placeholder="e.g. Approved with custom sugar flower cascading flourish as requested."
                value={quoteNote}
                onChange={(e) => setQuoteNote(e.target.value)}
                rows={2}
              />

              <Button
                type="submit"
                variant="gold"
                size="md"
                className="w-full"
                isLoading={isQuoting}
                leftIcon={<Send className="h-4 w-4" />}
              >
                Send Price Quote to Customer
              </Button>
            </form>
          </div>

          {/* Kitchen Station Status Progression Controls */}
          <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-6 shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-bold text-chocolate-950 flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-rose-700" /> Advance Kitchen Station
            </h3>

            <Input
              placeholder="Optional progress note for customer..."
              value={customStatusMsg}
              onChange={(e) => setCustomStatusMsg(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button
                type="button"
                variant={order.order_status === 'PREPARING' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleAdvanceStatus('PREPARING')}
              >
                1. Baking (Prep)
              </Button>

              <Button
                type="button"
                variant={order.order_status === 'DECORATING' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleAdvanceStatus('DECORATING')}
              >
                2. Decorating
              </Button>

              <Button
                type="button"
                variant={order.order_status === 'QUALITY_CHECK' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleAdvanceStatus('QUALITY_CHECK')}
              >
                3. Quality Check
              </Button>

              <Button
                type="button"
                variant={order.order_status === 'READY' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleAdvanceStatus('READY')}
              >
                4. Ready / Boxed
              </Button>

              <Button
                type="button"
                variant={order.order_status === 'OUT_FOR_DELIVERY' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleAdvanceStatus('OUT_FOR_DELIVERY')}
              >
                5. Out for Delivery
              </Button>

              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={() => handleAdvanceStatus('COMPLETED')}
              >
                6. Mark Completed
              </Button>
            </div>
          </div>

          {/* Internal Kitchen Communication Log */}
          <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-6 shadow-soft space-y-4">
            <h3 className="font-serif text-base font-bold text-chocolate-950 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-700" /> Internal Kitchen Notes
            </h3>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-xs text-chocolate-500 italic">No internal staff notes yet.</p>
              ) : (
                notes.map((n) => (
                  <div key={n.id} className="rounded-xl bg-cream-50 p-2.5 border border-cream-200 text-xs">
                    <div className="flex justify-between items-center text-[10px] text-chocolate-500 mb-1">
                      <span className="font-bold text-chocolate-800">{n.author_name || 'Staff'}</span>
                      <span>{formatDateTime(n.created_at)}</span>
                    </div>
                    <p className="text-chocolate-800">{n.note}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddInternalNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Add private kitchen note..."
                value={newInternalNote}
                onChange={(e) => setNewInternalNote(e.target.value)}
                className="flex-1 rounded-xl border border-cream-300 px-3 py-1.5 text-xs text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-rose-400"
              />
              <Button type="submit" size="sm" variant="soft">
                Post Note
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
