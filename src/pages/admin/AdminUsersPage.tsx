import React, { useEffect, useState } from 'react';
import { AdminService } from '../../services/admin.service';
import { Profile, UserRole } from '../../types/database.types';
import { formatDate } from '../../lib/utils';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Users, Search, ShieldCheck, ChefHat, User, Check } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const loadUsers = async () => {
    const list = await AdminService.getAllUsers();
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await AdminService.updateUserRole(userId, newRole);
    loadUsers();
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
          User & Staff Role Management
        </h2>
        <p className="text-xs text-chocolate-600 mt-1">
          Assign elevated access roles for bakery staff, head chefs, and system administrators
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-3xl bg-white/95 border border-cream-200 p-4 shadow-soft flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex gap-2">
          {['ALL', 'customer', 'staff', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                roleFilter === r
                  ? 'bg-purple-800 text-white border-purple-800 shadow-xs'
                  : 'bg-cream-50 text-chocolate-700 border-cream-200 hover:bg-cream-100'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white/95 border border-cream-200 overflow-hidden shadow-soft">
        <div className="divide-y divide-cream-100">
          {filtered.map((u) => (
            <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream-50/60 transition-colors">
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.full_name)}`}
                  alt={u.full_name}
                  className="h-10 w-10 rounded-full border border-cream-300 object-cover shrink-0"
                />
                <div>
                  <h4 className="font-serif font-bold text-chocolate-950 text-sm">{u.full_name}</h4>
                  <p className="text-xs text-chocolate-600">{u.email}</p>
                  <span className="text-[10px] text-chocolate-400 font-mono">
                    Member since {formatDate(u.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-xs font-semibold text-chocolate-600">Role:</span>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                  className="rounded-xl border border-cream-300 bg-white px-3 py-1.5 text-xs font-semibold text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-purple-400"
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Bakery Staff</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
