import React, { useEffect, useState } from 'react';
import { CakeService } from '../../services/cake.service';
import { AdminService } from '../../services/admin.service';
import { CakeCategory, CakeFlavor, Frosting, CakeSize, Decoration } from '../../types/database.types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { formatPrice } from '../../lib/utils';
import {
  FolderTree,
  Cake,
  Sparkles,
  Scale,
  Palette,
  Plus,
  Edit2,
  Check,
} from 'lucide-react';

export const AdminCatalogPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'flavors' | 'frostings' | 'sizes' | 'decorations'>('flavors');

  const [categories, setCategories] = useState<CakeCategory[]>([]);
  const [flavors, setFlavors] = useState<CakeFlavor[]>([]);
  const [frostings, setFrostings] = useState<Frosting[]>([]);
  const [sizes, setSizes] = useState<CakeSize[]>([]);
  const [decorations, setDecorations] = useState<Decoration[]>([]);

  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    const [cats, flvs, frsts, szs, decs] = await Promise.all([
      CakeService.getCategories(),
      CakeService.getFlavors(),
      CakeService.getFrostings(),
      CakeService.getSizes(),
      CakeService.getDecorations(),
    ]);
    setCategories(cats);
    setFlavors(flvs);
    setFrostings(frsts);
    setSizes(szs);
    setDecorations(decs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (activeTab === 'categories') await AdminService.saveCategory(editingItem);
    else if (activeTab === 'flavors') await AdminService.saveFlavor(editingItem);
    else if (activeTab === 'frostings') await AdminService.saveFrosting(editingItem);
    else if (activeTab === 'sizes') await AdminService.saveSize(editingItem);
    else if (activeTab === 'decorations') await AdminService.saveDecoration(editingItem);

    setIsModalOpen(false);
    setEditingItem(null);
    loadData();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
            Catalog & Ingredient Master Console
          </h2>
          <p className="text-xs text-chocolate-600 mt-1">
            Manage bakery menu items, flavors, sizes, modifiers and decorations in real time
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setEditingItem({
              id: `custom-${Date.now()}`,
              name: '',
              description: '',
              price_modifier: 0,
              base_price: 799,
              active: true,
              image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
            });
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add New {activeTab.slice(0, -1)}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-cream-100 p-1 border border-cream-200 overflow-x-auto scrollbar-none">
        {[
          { key: 'flavors', label: 'Gourmet Flavors', icon: Cake, count: flavors.length },
          { key: 'frostings', label: 'Frostings', icon: Sparkles, count: frostings.length },
          { key: 'sizes', label: 'Sizes & Servings', icon: Scale, count: sizes.length },
          { key: 'decorations', label: 'Decorations', icon: Palette, count: decorations.length },
          { key: 'categories', label: 'Occasion Categories', icon: FolderTree, count: categories.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                isActive ? 'bg-white text-rose-700 shadow-xs' : 'text-chocolate-600 hover:text-chocolate-950'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span className="text-[10px] bg-cream-200 text-chocolate-700 px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Data Table */}
      <div className="rounded-3xl bg-white/95 border border-cream-200 overflow-hidden shadow-soft">
        <div className="divide-y divide-cream-100">
          {activeTab === 'flavors' &&
            flavors.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-cream-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <img src={item.image_url} alt={item.name} className="h-12 w-12 rounded-xl object-cover border border-cream-200 shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-chocolate-950 text-sm">{item.name}</h4>
                    <p className="text-xs text-chocolate-600 mt-0.5 line-clamp-1">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-semibold text-xs text-rose-700">+{formatPrice(item.price_modifier)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl text-chocolate-500 hover:bg-cream-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {activeTab === 'frostings' &&
            frostings.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-cream-50/60 transition-colors">
                <div>
                  <h4 className="font-serif font-bold text-chocolate-950 text-sm">{item.name}</h4>
                  <p className="text-xs text-chocolate-600 mt-0.5">{item.description}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-semibold text-xs text-rose-700">+{formatPrice(item.price_modifier)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl text-chocolate-500 hover:bg-cream-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {activeTab === 'sizes' &&
            sizes.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-cream-50/60 transition-colors">
                <div>
                  <h4 className="font-serif font-bold text-chocolate-950 text-sm">{item.name}</h4>
                  <p className="text-xs text-chocolate-600 mt-0.5">{item.servings}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-semibold text-xs text-rose-700">+{formatPrice(item.price_modifier)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl text-chocolate-500 hover:bg-cream-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {activeTab === 'decorations' &&
            decorations.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-cream-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.image_url}</span>
                  <div>
                    <h4 className="font-serif font-bold text-chocolate-950 text-sm">{item.name}</h4>
                    <p className="text-xs text-chocolate-600 mt-0.5">{item.category} • {item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-semibold text-xs text-rose-700">+{formatPrice(item.price_modifier)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl text-chocolate-500 hover:bg-cream-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {activeTab === 'categories' &&
            categories.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-cream-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <img src={item.image_url} alt={item.name} className="h-12 w-12 rounded-xl object-cover border border-cream-200 shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-chocolate-950 text-sm">{item.name}</h4>
                    <p className="text-xs text-chocolate-600 mt-0.5">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-semibold text-xs text-rose-700">Base {formatPrice(item.base_price)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl text-chocolate-500 hover:bg-cream-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Edit / Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Edit ${activeTab.slice(0, -1)}`}
        maxWidth="md"
      >
        {editingItem && (
          <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
            <Input
              label="Item Name"
              value={editingItem.name || ''}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              required
            />

            <Input
              label="Description / Details"
              value={editingItem.description || ''}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
            />

            <Input
              label={editingItem.base_price !== undefined ? 'Base Price (₹)' : 'Price Modifier (₹)'}
              type="number"
              value={editingItem.base_price !== undefined ? editingItem.base_price : editingItem.price_modifier || 0}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (editingItem.base_price !== undefined) {
                  setEditingItem({ ...editingItem, base_price: val });
                } else {
                  setEditingItem({ ...editingItem, price_modifier: val });
                }
              }}
              required
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-cream-200">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Save to Catalog
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
