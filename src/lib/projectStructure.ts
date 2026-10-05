/**
 * Generator struktur proyek fullstack multi-file berstandar modern (Vite, React, TypeScript, TanStack Router, Bun).
 * Menghasilkan arsitektur berkas lengkap sesuai spesifikasi Lovable & Vite Enterprise.
 * Catatan: Kepatuhan penuh terhadap aturan Zero-Emoji.
 */

export interface ProjectFileEntry {
  path: string;
  name: string;
  content: string;
  language: string;
  category: "config" | "source" | "public" | "doc" | "meta";
}

export function generateProjectFiles(params: {
  projectName: string;
  projectConfig?: {
    webType?: string;
    theme?: string;
    targetAudience?: string;
    mainFeatures?: string[];
  };
  htmlCode?: string;
  dbCollections?: Record<string, any[]>;
  mode?: "frontend" | "fullstack" | "prd";
}): Record<string, string> {
  const {
    projectName = "Satusite Web App",
    projectConfig = {},
    htmlCode = "",
    dbCollections = {},
    mode = "fullstack"
  } = params;

  const slug = (projectName || "satusite-app")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "app";

  const webType = projectConfig.webType || "Modern Fullstack Web Application";
  const theme = projectConfig.theme || "Dark Minimalist & Sleek";
  const features = projectConfig.mainFeatures && projectConfig.mainFeatures.length > 0
    ? projectConfig.mainFeatures
    : ["Katalog & Filter", "Manajemen Data CRUD", "Integrasi WhatsApp Direct"];

  const usersData = dbCollections.users || [
    { id: "usr_1", name: "Budi Santoso", role: "Superadmin", email: "admin@satusite.com", status: "Aktif" },
    { id: "usr_2", name: "Siti Rahma", role: "Staff Kasir", email: "siti@satusite.com", status: "Aktif" },
    { id: "usr_3", name: "Dewi Lestari", role: "Pelanggan", email: "dewi@gmail.com", status: "Aktif" }
  ];

  const itemsData = dbCollections.items || dbCollections.products || [
    { id: "item_1", name: "Paket Premium Solution", category: "Core", price: 450000, stock: 24, status: "Tersedia" },
    { id: "item_2", name: "Paket Standard Starter", category: "Basic", price: 180000, stock: 50, status: "Tersedia" },
    { id: "item_3", name: "Paket Enterprise Scaled", category: "Pro", price: 950000, stock: 12, status: "Tersedia" }
  ];

  const files: Record<string, string> = {};

  // 1. .lovable/project.json
  files[".lovable/project.json"] = JSON.stringify({
    name: slug,
    displayName: projectName,
    version: "1.0.0",
    framework: "vite-react-typescript",
    router: "@tanstack/react-router",
    styling: "tailwindcss",
    uiKit: "shadcn-ui",
    runtime: "bun",
    createdAt: new Date().toISOString(),
    projectMetadata: {
      type: webType,
      themePalette: theme,
      mode: mode,
      features: features
    },
    agentSettings: {
      zeroEmoji: true,
      strictTypeScript: true,
      codeQuality: "production-grade"
    }
  }, null, 2);

  // 2. public/favicon.svg
  files["public/favicon.svg"] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#09090b"/>
  <path d="M7 16L16 7L25 16L16 25L7 16Z" fill="#2563eb" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
  <circle cx="16" cy="16" r="3" fill="#60a5fa"/>
</svg>`;

  // 3. public/robots.txt
  files["public/robots.txt"] = `User-agent: *
Allow: /
Sitemap: https://${slug}.vercel.app/sitemap.xml
`;

  // 4. src/assets/logo.svg
  files["src/assets/logo.svg"] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
</svg>`;

  // 5. src/components/ui/Button.tsx
  files["src/components/ui/Button.tsx"] = `import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-sm focus:ring-blue-500",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 focus:ring-zinc-600",
    outline: "border border-zinc-700 hover:bg-zinc-800 text-zinc-200 focus:ring-zinc-600",
    ghost: "hover:bg-zinc-800/60 text-zinc-300 hover:text-white",
    danger: "bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500"
  };

  return (
    <button
      className={\`\${base} \${sizes[size]} \${variants[variant]} \${className}\`}
      {...props}
    >
      {children}
    </button>
  );
};
`;

  // 6. src/components/ui/Card.tsx
  files["src/components/ui/Card.tsx"] = `import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={\`bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-5 shadow-sm \${className}\`}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60 mb-4">
    <div>
      <h3 className="font-semibold text-white text-sm">{title}</h3>
      {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
`;

  // 7. src/components/ui/Navbar.tsx
  files["src/components/ui/Navbar.tsx"] = `import React, { useState } from 'react';

export interface NavbarProps {
  title?: string;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title = "${projectName}",
  cartCount = 0,
  onOpenCart
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
            SS
          </div>
          <span className="font-bold text-sm tracking-tight text-white">{title}</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400">
          <a href="#hero" className="hover:text-white transition-colors">Beranda</a>
          <a href="#catalog" className="hover:text-white transition-colors">Katalog & Produk</a>
          <a href="#features" className="hover:text-white transition-colors">Fitur Unggulan</a>
          <a href="#admin" className="hover:text-white transition-colors">Admin Panel</a>
        </nav>

        <div className="flex items-center gap-2">
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all"
              aria-label="Keranjang Pesanan"
            >
              <span className="text-xs font-mono font-medium">Keranjang ({cartCount})</span>
            </button>
          )}

          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-sm"
          >
            Hubungi Kami
          </a>
        </div>
      </div>
    </header>
  );
};
`;

  // 8. src/components/ui/Hero.tsx
  files["src/components/ui/Hero.tsx"] = `import React from 'react';
import { Button } from './Button';

export interface HeroProps {
  title?: string;
  tagline?: string;
  onExplore?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  title = "${projectName}",
  tagline = "Solusi digital terintegrasi dirancang dengan arsitektur modern, tata letak responsif, dan performa tinggi.",
  onExplore
}) => {
  return (
    <section id="hero" className="relative py-20 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        <span>${webType}</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
        {title}
      </h1>

      <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
        {tagline}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button variant="primary" size="lg" onClick={onExplore}>
          Jelajahi Sekarang
        </Button>
        <a href="#admin">
          <Button variant="outline" size="lg">
            Akses Panel Admin
          </Button>
        </a>
      </div>
    </section>
  );
};
`;

  // 9. src/components/ui/CatalogGrid.tsx
  files["src/components/ui/CatalogGrid.tsx"] = `import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
}

export interface CatalogGridProps {
  items: CatalogItem[];
  onAddToCart?: (item: CatalogItem) => void;
}

export const CatalogGrid: React.FC<CatalogGridProps> = ({ items, onAddToCart }) => {
  return (
    <section id="catalog" className="py-12 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Katalog & Penawaran</h2>
          <p className="text-xs text-zinc-400">Pilihan produk dan layanan siap pakai</p>
        </div>
        <span className="text-xs font-mono text-zinc-500">{items.length} Item Tersedia</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono text-[10px]">
                  {item.category}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-medium">
                  {item.status}
                </span>
              </div>
              <h3 className="font-semibold text-white text-base">{item.name}</h3>
              <p className="text-xs text-zinc-400">Stok sisa: {item.stock} unit</p>
            </div>

            <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-white">
                Rp {item.price.toLocaleString('id-ID')}
              </span>
              <Button size="sm" variant="primary" onClick={() => onAddToCart && onAddToCart(item)}>
                Pesan
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
`;

  // 10. src/hooks/useCart.ts
  files["src/hooks/useCart.ts"] = `import { useState, useCallback } from 'react';

export interface CartEntry {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function useCart() {
  const [items, setItems] = useState<CartEntry[]>([]);

  const addItem = useCallback((item: { id: string; name: string; price: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const getWhatsAppMessage = useCallback((customerName = 'Pelanggan') => {
    const list = items.map((i) => \`- \${i.name} (\${i.quantity}x) = Rp \${(i.price * i.quantity).toLocaleString('id-ID')}\`).join('\\n');
    return \`Halo, saya \${customerName}. Saya ingin memesan pesanan berikut:\\n\\n\${list}\\n\\nTotal: Rp \${totalAmount.toLocaleString('id-ID')}\\nMohon informasi ketersediaan dan metode pembayaran.\`;
  }, [items, totalAmount]);

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    totalAmount,
    totalCount,
    getWhatsAppMessage
  };
}
`;

  // 11. src/hooks/useDatabase.ts
  files["src/hooks/useDatabase.ts"] = `import { useState, useEffect, useCallback } from 'react';

export function useDatabase<T extends { id: string }>(collectionName: string, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(() => {
    try {
      const stored = localStorage.getItem(\`satusite_db_\${collectionName}\`);
      return stored ? JSON.parse(stored) : initialData;
    } catch {
      return initialData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(\`satusite_db_\${collectionName}\`, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage sync failed:", e);
    }
  }, [collectionName, data]);

  const insert = useCallback((record: T) => {
    setData((prev) => [record, ...prev]);
  }, []);

  const update = useCallback((id: string, updates: Partial<T>) => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }, []);

  const remove = useCallback((id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    data,
    insert,
    update,
    remove
  };
}
`;

  // 12. src/hooks/useTheme.ts
  files["src/hooks/useTheme.ts"] = `import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return {
    isDark,
    toggleTheme: () => setIsDark((prev) => !prev)
  };
}
`;

  // 13. src/lib/utils.ts
  files["src/lib/utils.ts"] = `export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
`;

  // 14. src/lib/db.ts
  files["src/lib/db.ts"] = `export interface SeedDatabase {
  users: Array<{ id: string; name: string; role: string; email: string; status: string }>;
  items: Array<{ id: string; name: string; category: string; price: number; stock: number; status: string }>;
}

export const INITIAL_DATABASE: SeedDatabase = {
  users: ${JSON.stringify(usersData, null, 2)},
  items: ${JSON.stringify(itemsData, null, 2)}
};
`;

  // 15. src/lib/whatsapp.ts
  files["src/lib/whatsapp.ts"] = `export function createWhatsAppDirectLink(phoneNumber: string, message: string): string {
  const cleaned = phoneNumber.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return \`https://wa.me/\${cleaned}?text=\${encoded}\`;
}
`;

  // 16. src/routes/index.tsx
  files["src/routes/index.tsx"] = `import React from 'react';
import { Navbar } from '../components/ui/Navbar';
import { Hero } from '../components/ui/Hero';
import { CatalogGrid } from '../components/ui/CatalogGrid';
import { useCart } from '../hooks/useCart';
import { INITIAL_DATABASE } from '../lib/db';
import { createWhatsAppDirectLink } from '../lib/whatsapp';

export default function IndexRoute() {
  const cart = useCart();

  const handleCheckoutWA = () => {
    const text = cart.getWhatsAppMessage();
    const url = createWhatsAppDirectLink("6281234567890", text);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      <Navbar
        title="${projectName}"
        cartCount={cart.totalCount}
        onOpenCart={handleCheckoutWA}
      />
      
      <main className="flex-1">
        <Hero
          title="${projectName}"
          onExplore={() => {
            const el = document.getElementById("catalog");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <CatalogGrid
          items={INITIAL_DATABASE.items}
          onAddToCart={(item) => cart.addItem({ id: item.id, name: item.name, price: item.price })}
        />
      </main>

      <footer className="py-8 border-t border-zinc-800 text-center text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} ${projectName}. Hak Cipta Dilindungi.</p>
        <p className="mt-1 font-mono text-[10px]">Dibangun dengan Satusite Studio Fullstack Generator</p>
      </footer>
    </div>
  );
}
`;

  // 17. src/routes/admin.tsx
  files["src/routes/admin.tsx"] = `import React, { useState } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import { INITIAL_DATABASE } from '../lib/db';
import { Button } from '../components/ui/Button';

export default function AdminRoute() {
  const users = useDatabase('users', INITIAL_DATABASE.users);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    users.insert({
      id: "usr_" + Date.now(),
      name: newUserName.trim(),
      email: newUserEmail.trim() || "user@example.com",
      role: "Staff",
      status: "Aktif"
    });
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Panel Administrasi Data</h1>
          <p className="text-xs text-zinc-400">Manajemen Pengguna & Entitas Database AppDB</p>
        </div>
        <a href="/">
          <Button variant="outline" size="sm">Kembali ke Storefront</Button>
        </a>
      </div>

      <form onSubmit={handleAddUser} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Nama Anggota..."
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          className="px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
        />
        <input
          type="email"
          placeholder="Email Akun..."
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          className="px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
        />
        <Button variant="primary" size="sm" type="submit">Tambah Data</Button>
      </form>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-mono">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Email</th>
              <th className="p-3">Peran</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/50">
            {users.data.map((u) => (
              <tr key={u.id}>
                <td className="p-3 font-mono text-[11px] text-zinc-500">{u.id}</td>
                <td className="p-3 font-medium text-white">{u.name}</td>
                <td className="p-3 text-zinc-400">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 text-emerald-400">{u.status}</td>
                <td className="p-3 text-right">
                  <button onClick={() => users.remove(u.id)} className="text-rose-400 hover:text-rose-300">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;

  // 18. src/routes/checkout.tsx
  files["src/routes/checkout.tsx"] = `import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function CheckoutRoute() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 flex items-center justify-center">
      <Card className="max-w-md w-full text-center space-y-4">
        <h1 className="text-xl font-bold text-white">Ringkasan Checkout</h1>
        <p className="text-xs text-zinc-400">Silakan konfirmasi pesanan Anda untuk diteruskan ke tim layanan kami.</p>
        <a href="/">
          <Button variant="primary" size="md">Kembali ke Beranda</Button>
        </a>
      </Card>
    </div>
  );
}
`;

  // 19. src/test/App.test.tsx
  files["src/test/App.test.tsx"] = `import { describe, it, expect } from 'bun:test';

describe('App Test Suite', () => {
  it('should verify project metadata initialization', () => {
    const appName = "${projectName}";
    expect(appName).toBeDefined();
    expect(appName.length).toBeGreaterThan(0);
  });

  it('should validate zero-emoji enforcement rule', () => {
    const rawName = "${projectName}";
    const emojiRegex = /\\p{Extended_Pictographic}/u;
    expect(emojiRegex.test(rawName)).toBe(false);
  });
});
`;

  // 20. src/router.tsx
  files["src/router.tsx"] = `import React from 'react';
import IndexRoute from './routes/index';
import AdminRoute from './routes/admin';

export function AppRouter() {
  const path = typeof window !== 'undefined' ? window.location.hash : '';
  if (path === '#admin') {
    return <AdminRoute />;
  }
  return <IndexRoute />;
}
`;

  // 21. src/routeTree.gen.ts
  files["src/routeTree.gen.ts"] = `/* eslint-disable */
// Auto-generated by Satusite Studio Router Engine
export const RouteManifest = {
  routes: {
    '/': {
      component: 'src/routes/index.tsx',
      title: 'Storefront & Landing'
    },
    '/admin': {
      component: 'src/routes/admin.tsx',
      title: 'Database CRUD Admin'
    },
    '/checkout': {
      component: 'src/routes/checkout.tsx',
      title: 'Order Checkout'
    }
  }
} as const;
`;

  // 22. src/server.ts (Hanya diikutsertakan pada mode fullstack)
  if (mode === "fullstack") {
    files["src/server.ts"] = `import { INITIAL_DATABASE } from './lib/db';

const server = Bun.serve({
  port: process.env.PORT || 3000,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/api/items') {
      return new Response(JSON.stringify(INITIAL_DATABASE.items), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/api/users') {
      return new Response(JSON.stringify(INITIAL_DATABASE.users), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(Bun.file('./dist/index.html'));
  }
});

console.log(\`[SERVER] Server berjalan pada http://localhost:\${server.port}\`);
`;
  }

  // 23. src/start.ts
  files["src/start.ts"] = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './router';
import './styles.css';

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
  );
}
`;

  // 24. src/styles.css
  files["src/styles.css"] = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #2563eb;
  --color-accent: #3b82f6;
  --bg-dark: #09090b;
  --bg-card: #121215;
  --border-subtle: #27272a;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-dark);
  color: #f4f4f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #09090b;
}
::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3f3f46;
}
`;

  // 25. .gitignore
  files[".gitignore"] = `# Dependencies
node_modules
.pnp
.pnp.js

# Production output
dist
build
.output

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
bun.lockb

# Editor
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;

  // 26. .prettierignore
  files[".prettierignore"] = `dist
node_modules
.output
package-lock.json
bun.lock
`;

  // 27. .prettierrc
  files[".prettierrc"] = JSON.stringify({
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: "none",
    printWidth: 100
  }, null, 2);

  // 28. AGENTS.md
  files["AGENTS.md"] = `## Pedoman Sistem & AI Agent

- **Zero Emojis**: Jangan pernah menggunakan karakter emoji atau emotikon pada kode sumber, antarmuka, dan dokumentasi.
- **Arsitektur**: Menggunakan Vite, React 18, TypeScript, Tailwind CSS, dan TanStack Router.
- **Desain**: Terapkan palet proporsional 60-30-10 dengan kontras tinggi WCAG AA.
- **Data**: In-memory relational store tersinkronisasi otomatis dengan localStorage.
`;

  // 29. bun.lock
  files["bun.lock"] = `# Bun Lockfile v1
# Generated by Satusite Studio
`;

  // 30. bunfig.toml
  files["bunfig.toml"] = `[install]
production = false
exact = false

[test]
root = "src/test"
`;

  // 31. components.json
  files["components.json"] = JSON.stringify({
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "default",
    "rsc": false,
    "tsx": true,
    "tailwind": {
      "config": "tailwind.config.js",
      "css": "src/styles.css",
      "baseColor": "zinc",
      "cssVariables": true
    },
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils"
    }
  }, null, 2);

  // 32. eslint.config.js
  files["eslint.config.js"] = `export default [
  {
    ignores: ["dist/**", "node_modules/**"]
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
];
`;

  // 33. package.json
  files["package.json"] = JSON.stringify({
    name: slug,
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc && vite build",
      preview: "vite preview",
      ...(mode === "fullstack" ? { server: "bun run src/server.ts" } : {}),
      test: "bun test"
    },
    dependencies: {
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "@tanstack/react-router": "^1.31.2",
      "lucide-react": "^0.475.0",
      "clsx": "^2.1.1",
      "tailwind-merge": "^2.6.0"
    },
    devDependencies: {
      "@types/react": "^18.3.12",
      "@types/react-dom": "^18.3.1",
      "@vitejs/plugin-react": "^4.3.4",
      "typescript": "^5.6.3",
      "vite": "^6.0.7",
      "tailwindcss": "^3.4.17",
      "autoprefixer": "^10.4.20",
      "postcss": "^8.4.49"
    }
  }, null, 2);

  // 34. README.md
  const isFullstack = mode === "fullstack";
  files["README.md"] = `# ${projectName}

Repositori web ${isFullstack ? "fullstack mandiri" : "frontend modern (SPA)"} yang dihasilkan oleh Satusite Studio AI Agent.

## Struktur Repositori
\`\`\`
.lovable/
  └── project.json
public/
  ├── favicon.svg
  └── robots.txt
src/
  ├── assets/
  ├── components/ui/
  ├── hooks/
  ├── lib/
  ├── routes/
  ├── test/
  ├── router.tsx
  ├── routeTree.gen.ts
${isFullstack ? "  ├── server.ts\n" : ""}  ├── start.ts
  └── styles.css
.gitignore
.prettierrc
AGENTS.md
bunfig.toml
components.json
package.json
tsconfig.json
\`\`\`

## Cara Menjalankan

### Menggunakan Bun (Direkomendasikan)
\`\`\`bash
bun install
bun run dev
\`\`\`
${isFullstack ? `
### Menjalankan Backend Server (Mode Fullstack)
\`\`\`bash
bun run server
\`\`\`
` : ""}
### Menggunakan Node.js / NPM
\`\`\`bash
npm install
npm run dev
\`\`\`

## Deployment
- **Vercel**: \`npx vercel\`
- **Netlify**: Hubungkan repositori GitHub atau drag & drop folder \`dist\`
`;

  // 35. tsconfig.json
  files["tsconfig.json"] = JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      useDefineForClassFields: true,
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      paths: {
        "@/*": ["./src/*"]
      }
    },
    include: ["src"]
  }, null, 2);

  // 36. index.html (Root Vite entrypoint & standalone preview runnable)
  files["index.html"] = htmlCode || `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-950 text-white min-h-screen">
  <div id="root">
    <div class="p-8 text-center space-y-4">
      <h1 class="text-2xl font-bold">${projectName}</h1>
      <p class="text-zinc-400 text-sm">${webType}</p>
    </div>
  </div>
  <script type="module" src="/src/start.ts"></script>
</body>
</html>`;

  return files;
}
