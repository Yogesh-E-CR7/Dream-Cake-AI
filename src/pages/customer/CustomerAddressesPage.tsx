import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { localDb } from '../../lib/storage';
import { Address } from '../../types/database.types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { MapPin, Plus, Trash2, Check, Home, Briefcase } from 'lucide-react';

export const CustomerAddressesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [label, setLabel] = useState('Home');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [postalCode, setPostalCode] = useState('560038');

  const loadAddresses = () => {
    if (user) {
      setAddresses(localDb.getAddresses(user.id));
    }
  };

  useEffect(() => {
    loadAddresses();
    if (user) {
      setFullName(user.full_name);
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    localDb.saveAddress({
      id: `addr-${Date.now()}`,
      user_id: user.id,
      label,
      full_name: fullName,
      phone,
      address_line_1: line1,
      city,
      state: 'Karnataka',
      postal_code: postalCode,
      country: 'India',
      is_default: addresses.length === 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsModalOpen(false);
    setLine1('');
    loadAddresses();
  };

  const handleDelete = (id: string) => {
    localDb.deleteAddress(id);
    loadAddresses();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
            Delivery Addresses
          </h2>
          <p className="text-xs text-chocolate-600 mt-1">
            Manage your saved delivery locations for smooth cake dispatch
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add New Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="rounded-3xl bg-white border border-cream-200/90 p-5 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                  {addr.label === 'Home' ? <Home className="h-3 w-3" /> : <Briefcase className="h-3 w-3" />}
                  {addr.label}
                </span>

                {addr.is_default && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Default
                  </span>
                )}
              </div>

              <h4 className="font-serif font-bold text-chocolate-950 mt-2 text-base">
                {addr.full_name}
              </h4>
              <p className="text-xs text-chocolate-600 mt-1 leading-relaxed">
                {addr.address_line_1}
                <br />
                {addr.city}, {addr.state} — {addr.postal_code}
              </p>
              <p className="text-xs text-chocolate-500 mt-2 font-mono">{addr.phone}</p>
            </div>

            <div className="pt-3 border-t border-cream-200 flex justify-end">
              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                className="p-2 text-chocolate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Delete address"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Delivery Address"
        maxWidth="md"
      >
        <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1">
              Address Label
            </label>
            <div className="flex gap-2">
              {['Home', 'Office', 'Venue / Party Hall', 'Other'].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLabel(l)}
                  className={`px-3 py-1.5 rounded-xl border font-semibold ${
                    label === l
                      ? 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-300'
                      : 'border-cream-200 hover:bg-cream-50 text-chocolate-700'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Recipient Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <Input
            label="Street Address / Building / Flat"
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <Input
              label="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-cream-200">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
