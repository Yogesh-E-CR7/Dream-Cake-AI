import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../src/services/order.service';
import { localDb } from '../src/lib/storage';

// Mock Supabase module to prevent network timeouts during local unit testing
vi.mock('../src/lib/supabase', () => ({
  supabase: null,
  isSupabaseConfigured: false,
}));

describe('OrderService & Lifecycle State Transitions', () => {
  beforeEach(() => {
    localDb.init();
  });

  it('retrieves seeded orders with enriched relations', async () => {
    const orders = await OrderService.getOrders();
    expect(orders.length).toBeGreaterThan(0);
    const firstOrder = orders[0];
    expect(firstOrder.id).toBeDefined();
    expect(firstOrder.order_status).toBeDefined();
  });

  it('creates an order request with initial PENDING_REVIEW status', async () => {
    const newOrder = await OrderService.createOrder({
      user_id: 'usr-customer-1',
      design_id: 'dsg-1',
      order_type: 'PICKUP',
      requested_date: '2026-10-15',
      requested_time: '14:00 - 16:00',
      estimated_price: 1850,
      customer_notes: 'Please add birthday candles',
    });

    expect(newOrder.id).toBeDefined();
    expect(newOrder.order_status).toBe('PENDING_REVIEW');
    expect(newOrder.estimated_price).toBe(1850);
  });

  it('allows staff to quote final price transitioning status to PRICE_CONFIRMATION', async () => {
    const orders = await OrderService.getOrders();
    const targetOrder = orders[0];

    const updated = await OrderService.setStaffQuote({
      order_id: targetOrder.id,
      staff_id: 'usr-staff-1',
      staff_name: 'Chef Marco',
      final_price: 2200,
      notes: 'Structural dowels and hand-sculpted roses included.',
    });

    expect(updated).not.toBeNull();
    expect(updated!.final_price).toBe(2200);
    expect(updated!.order_status).toBe('PRICE_CONFIRMATION');
  });

  it('allows customer to confirm price and advance to CONFIRMED state', async () => {
    const orders = await OrderService.getOrders();
    const targetOrder = orders[0];

    const confirmed = await OrderService.confirmCustomerPrice(targetOrder.id, 'usr-customer-1');
    expect(confirmed).not.toBeNull();
    expect(confirmed!.order_status).toBe('CONFIRMED');
    expect(confirmed!.customer_confirmed_price).toBe(true);
  });

  it('advances kitchen statuses sequentially (PREPARING -> DECORATING -> READY)', async () => {
    const orders = await OrderService.getOrders();
    const targetOrder = orders[0];

    const prep = await OrderService.updateStatus({
      order_id: targetOrder.id,
      staff_id: 'usr-staff-1',
      staff_name: 'Chef Marco',
      status: 'PREPARING',
    });
    expect(prep!.order_status).toBe('PREPARING');

    const decor = await OrderService.updateStatus({
      order_id: targetOrder.id,
      staff_id: 'usr-staff-1',
      staff_name: 'Chef Marco',
      status: 'DECORATING',
    });
    expect(decor!.order_status).toBe('DECORATING');

    const ready = await OrderService.updateStatus({
      order_id: targetOrder.id,
      staff_id: 'usr-staff-1',
      staff_name: 'Chef Marco',
      status: 'READY',
    });
    expect(ready!.order_status).toBe('READY');
  });
});
