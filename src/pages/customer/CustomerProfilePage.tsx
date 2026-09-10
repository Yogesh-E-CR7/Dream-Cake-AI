import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Mail, Phone, Lock, Save, Check } from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredFlavor, setPreferredFlavor] = useState('Royal Red Velvet');
  const [isSaving, setIsSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    await updateProfile({
      full_name: fullName,
      phone,
    });
    setIsSaving(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {savedToast && (
        <div className="fixed top-20 right-8 z-50 rounded-2xl bg-emerald-700 text-white px-4 py-3 shadow-soft-xl flex items-center gap-2 text-xs font-semibold animate-slide-up">
          <Check className="h-4 w-4 stroke-[3]" />
          <span>Profile preferences updated successfully!</span>
        </div>
      )}

      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
          Account & Taste Preferences
        </h2>
        <p className="text-xs text-chocolate-600 mt-1">
          Manage your personal details and favorite bakery combinations
        </p>
      </div>

      <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-6 sm:p-8 shadow-soft space-y-6">
        {/* Avatar & Summary */}
        <div className="flex items-center gap-4 pb-6 border-b border-cream-200">
          <img
            src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.full_name || 'Customer')}`}
            alt={user?.full_name}
            className="h-16 w-16 rounded-full border-2 border-rose-300 object-cover shadow-sm"
          />
          <div>
            <h3 className="font-serif text-lg font-bold text-chocolate-950">{user?.full_name}</h3>
            <p className="text-xs text-chocolate-600">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              Verified Customer
            </span>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              startIcon={<User className="h-4 w-4" />}
              required
            />
            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              startIcon={<Mail className="h-4 w-4" />}
              helperText="Email is managed via authentication security"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              startIcon={<Phone className="h-4 w-4" />}
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700 mb-1.5">
                Preferred Flavor Profile
              </label>
              <select
                value={preferredFlavor}
                onChange={(e) => setPreferredFlavor(e.target.value)}
                className="w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-xs text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option>Royal Red Velvet</option>
                <option>Belgian Chocolate Truffle</option>
                <option>Madagascar Vanilla Bean</option>
                <option>Crunchy Butterscotch</option>
                <option>Persian Pistachio Saffron</option>
                <option>Tropical Alphonso Mango</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-cream-200 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
