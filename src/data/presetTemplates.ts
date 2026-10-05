export interface TemplateItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  rating: number;
  downloads: number;
  previewGradient: string;
  code: string;
  isUserGenerated?: boolean;
}

export const PRESET_TEMPLATES: TemplateItem[] = [
  {
    id: "lumina-store",
    title: "Lumina Storefront & WhatsApp Checkout",
    category: "E-Commerce",
    description: "Toko online modern lengkap dengan grid produk, filter kategori instan, modal detail produk, keranjang belanja interaktif, dan generator pesanan otomatis langsung ke WhatsApp.",
    tags: ["E-Commerce", "Keranjang Belanja", "WhatsApp", "Katalog Produk"],
    rating: 4.9,
    downloads: 1840,
    previewGradient: "from-amber-600/30 via-orange-950/40 to-black",
    code: `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lumina Goods - Modern Lifestyle Store</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-zinc-950">
  <!-- Top Announcement Bar -->
  <div class="bg-amber-500 text-zinc-950 text-xs font-semibold py-2 px-4 text-center tracking-wide">
    <span>Gratis Ongkir ke Seluruh Indonesia untuk Pemesanan di Atas Rp 500.000</span>
  </div>

  <!-- Header Navigation -->
  <header class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-sm shadow-lg shadow-amber-500/20">
        L
      </div>
      <div>
        <span class="font-extrabold text-base tracking-tight text-white">LUMINA GOODS</span>
        <span class="hidden sm:inline-block text-[10px] text-zinc-500 font-mono ml-2 uppercase">Official Store</span>
      </div>
    </div>

    <!-- Search Input -->
    <div class="hidden md:flex items-center relative w-72">
      <i class="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-zinc-500"></i>
      <input
        type="text"
        id="search-input"
        oninput="handleSearch(this.value)"
        placeholder="Cari jam, audio, aksesori..."
        class="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
      />
    </div>

    <!-- Right Cart Button -->
    <div class="flex items-center gap-3">
      <button onclick="toggleCart()" class="relative p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-all flex items-center gap-2">
        <i class="fa-solid fa-bag-shopping text-sm text-amber-400"></i>
        <span class="text-xs font-bold hidden sm:inline">Keranjang</span>
        <span id="cart-badge" class="bg-amber-500 text-zinc-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">0</span>
      </button>
    </div>
  </header>

  <!-- Hero Banner -->
  <section class="relative px-4 sm:px-8 py-12 sm:py-20 max-w-6xl mx-auto text-center space-y-4">
    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest">
      <i class="fa-solid fa-sparkles text-[10px]"></i> Koleksi Esensial 2026
    </span>
    <h1 class="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight">
      Desain Minimalis untuk Setiap Hari
    </h1>
    <p class="text-zinc-400 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
      Koleksi jam tangan analog, earphone nirkabel, dan aksesori kulit premium yang dirancang untuk estetika bersih serta ketahanan jangka panjang.
    </p>

    <!-- Category Filter Pills -->
    <div class="flex items-center justify-center flex-wrap gap-2 pt-6" id="category-pills">
      <button onclick="filterCategory('Semua')" class="cat-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500 text-zinc-950 transition-all">Semua</button>
      <button onclick="filterCategory('Jam Tangan')" class="cat-btn px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all">Jam Tangan</button>
      <button onclick="filterCategory('Audio')" class="cat-btn px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all">Audio</button>
      <button onclick="filterCategory('Aksesori')" class="cat-btn px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all">Aksesori</button>
    </div>
  </section>

  <!-- Product Grid -->
  <main class="flex-1 px-4 sm:px-8 pb-24 max-w-6xl mx-auto w-full">
    <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <!-- Injected via JavaScript -->
    </div>
  </main>

  <!-- Value Perks Band -->
  <section class="border-t border-zinc-900 bg-zinc-900/40 py-10 px-4 sm:px-8">
    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
      <div class="flex items-center sm:items-start gap-3 justify-center sm:justify-start">
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
          <i class="fa-solid fa-shield-check text-base"></i>
        </div>
        <div>
          <h4 class="font-bold text-sm text-white">100% Produk Original</h4>
          <p class="text-xs text-zinc-500 mt-0.5">Garansi resmi 1 tahun untuk seluruh produk.</p>
        </div>
      </div>
      <div class="flex items-center sm:items-start gap-3 justify-center sm:justify-start">
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
          <i class="fa-solid fa-truck-fast text-base"></i>
        </div>
        <div>
          <h4 class="font-bold text-sm text-white">Pengiriman Cepat</h4>
          <p class="text-xs text-zinc-500 mt-0.5">Pengiriman 1-3 hari kerja dengan resi pelacakan.</p>
        </div>
      </div>
      <div class="flex items-center sm:items-start gap-3 justify-center sm:justify-start">
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
          <i class="fa-brands fa-whatsapp text-base"></i>
        </div>
        <div>
          <h4 class="font-bold text-sm text-white">Dukungan Responsif</h4>
          <p class="text-xs text-zinc-500 mt-0.5">Layanan pelanggan siap sedia via WhatsApp.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-zinc-900 bg-zinc-950 py-6 px-4 text-center text-xs text-zinc-600">
    <p>&copy; 2026 Lumina Goods Indonesia. Hak Cipta Dilindungi.</p>
  </footer>

  <!-- Slide-out Cart Drawer -->
  <div id="cart-drawer" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm hidden justify-end transition-opacity">
    <div class="w-full max-w-md bg-zinc-900 h-full p-6 flex flex-col justify-between border-l border-zinc-800 shadow-2xl">
      <div>
        <div class="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-bag-shopping text-amber-400"></i>
            <h2 class="text-base font-bold text-white">Keranjang Belanja</h2>
          </div>
          <button onclick="toggleCart()" class="text-zinc-400 hover:text-white p-1">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div id="cart-items" class="mt-4 space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          <!-- Injected via JavaScript -->
        </div>
      </div>

      <div class="pt-4 border-t border-zinc-800 space-y-3">
        <div class="space-y-1.5 text-xs text-zinc-400">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span id="cart-subtotal" class="font-semibold text-white">Rp 0</span>
          </div>
          <div class="flex justify-between">
            <span>Ongkir</span>
            <span class="text-emerald-400 font-semibold">Gratis</span>
          </div>
          <div class="flex justify-between pt-1 border-t border-zinc-800 text-sm font-bold text-white">
            <span>Total Akhir</span>
            <span id="cart-total" class="text-amber-400">Rp 0</span>
          </div>
        </div>

        <!-- Customer Form -->
        <div class="space-y-2 pt-2 text-xs">
          <input type="text" id="cust-name" placeholder="Nama Lengkap Anda..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500" />
          <textarea id="cust-address" rows="2" placeholder="Alamat Pengiriman Lengkap..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"></textarea>
        </div>

        <button onclick="checkoutWhatsApp()" class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer">
          <i class="fa-brands fa-whatsapp text-base"></i>
          <span>Checkout Langsung via WhatsApp</span>
        </button>
      </div>
    </div>
  </div>

  <script>
    const products = [
      {
        id: "prod-1",
        name: "Analog Minimalist Watch v2",
        category: "Jam Tangan",
        price: 749000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
        badge: "BEST SELLER",
        desc: "Jam tangan quartz presisi dengan bodi stainless steel 316L dan tali kulit asli tahan air 5 ATM."
      },
      {
        id: "prod-2",
        name: "Studio Pro Wireless Headphone",
        category: "Audio",
        price: 1499000,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
        badge: "UNGGULAN",
        desc: "Peredam bising aktif (ANC) hibrida dengan driver titanium 40mm dan baterai hingga 45 jam."
      },
      {
        id: "prod-3",
        name: "Smart Pulse Band Series X",
        category: "Jam Tangan",
        price: 1199000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop",
        badge: "TERBARU",
        desc: "Pelacak kebugaran layar AMOLED cerah dengan sensor detak jantung real-time dan SpO2."
      },
      {
        id: "prod-4",
        name: "Artisan Leather Bi-Fold Wallet",
        category: "Aksesori",
        price: 389000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
        badge: null,
        desc: "Dompet kulit sapi samak nabati dengan 8 slot kartu dan proteksi pemindai nirkabel RFID."
      },
      {
        id: "prod-5",
        name: "True Wireless Pods Bass Edition",
        category: "Audio",
        price: 599000,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop",
        badge: null,
        desc: "Earphone TWS berdesain ergonomis dengan sertifikasi tahan percikan air IPX5 dan low-latency gaming mode."
      },
      {
        id: "prod-6",
        name: "Matte Black Desk Tech Mat",
        category: "Aksesori",
        price: 249000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
        badge: null,
        desc: "Alas meja kerja kulit sintetis premium antiselip untuk kenyamanan mouse dan keyboard sehari-hari."
      }
    ];

    let cart = [];
    let activeCat = 'Semua';
    let searchKeyword = '';

    function formatRupiah(num) {
      return 'Rp ' + Number(num).toLocaleString('id-ID');
    }

    function renderProducts() {
      const grid = document.getElementById('product-grid');
      const filtered = products.filter(p => {
        const matchCat = activeCat === 'Semua' || p.category === activeCat;
        const matchSearch = p.name.toLowerCase().includes(searchKeyword.toLowerCase()) || p.desc.toLowerCase().includes(searchKeyword.toLowerCase());
        return matchCat && matchSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full py-16 text-center text-zinc-500 text-xs">Tidak ada produk yang cocok dengan pencarian Anda.</div>';
        return;
      }

      grid.innerHTML = filtered.map(p => \`
        <div class="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden p-4 group flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 shadow-xl">
          <div class="space-y-3">
            <div class="aspect-square bg-zinc-800 rounded-2xl overflow-hidden relative">
              <img src="\${p.image}" alt="\${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
              \${p.badge ? \`<span class="absolute top-3 left-3 bg-amber-500 text-zinc-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md tracking-wider">\${p.badge}</span>\` : ''}
              <span class="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-400 flex items-center gap-1">
                <i class="fa-solid fa-star text-[9px]"></i> \${p.rating}
              </span>
            </div>
            <div>
              <span class="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">\${p.category}</span>
              <h3 class="font-bold text-white text-sm mt-0.5 group-hover:text-amber-400 transition-colors">\${p.name}</h3>
              <p class="text-zinc-400 text-xs mt-1 line-clamp-2 leading-relaxed">\${p.desc}</p>
            </div>
          </div>
          <div class="pt-4 border-t border-zinc-800/80 mt-4 flex items-center justify-between gap-2">
            <div>
              <span class="text-[10px] text-zinc-500 block">Harga</span>
              <span class="text-sm font-extrabold text-white">\${formatRupiah(p.price)}</span>
            </div>
            <button onclick="addToCart('\${p.id}')" class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/10">
              <i class="fa-solid fa-plus text-[10px]"></i> Tambah
            </button>
          </div>
        </div>
      \`).join('');
    }

    function filterCategory(cat) {
      activeCat = cat;
      const btns = document.querySelectorAll('.cat-btn');
      btns.forEach(b => {
        if (b.textContent.trim() === cat) {
          b.className = 'cat-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500 text-zinc-950 transition-all';
        } else {
          b.className = 'cat-btn px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all';
        }
      });
      renderProducts();
    }

    function handleSearch(val) {
      searchKeyword = val;
      renderProducts();
    }

    function toggleCart() {
      const drawer = document.getElementById('cart-drawer');
      drawer.classList.toggle('hidden');
      drawer.classList.toggle('flex');
    }

    function addToCart(id) {
      const prod = products.find(p => p.id === id);
      if (!prod) return;
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ ...prod, qty: 1 });
      }
      renderCart();
    }

    function changeQty(id, delta) {
      const item = cart.find(i => i.id === id);
      if (!item) return;
      item.qty += delta;
      if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
      }
      renderCart();
    }

    function renderCart() {
      const list = document.getElementById('cart-items');
      const badge = document.getElementById('cart-badge');
      const totalEl = document.getElementById('cart-total');
      const subtotalEl = document.getElementById('cart-subtotal');
      
      const totalQty = cart.reduce((acc, cur) => acc + cur.qty, 0);
      badge.textContent = totalQty;

      if (cart.length === 0) {
        list.innerHTML = '<div class="text-zinc-500 text-xs text-center py-12 space-y-1"><i class="fa-solid fa-basket-shopping text-2xl mb-2 block"></i><p>Keranjang belanja kosong.</p></div>';
        totalEl.textContent = 'Rp 0';
        subtotalEl.textContent = 'Rp 0';
        return;
      }

      let subtotal = 0;
      list.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        return \`
          <div class="p-3 bg-zinc-950/80 rounded-2xl border border-zinc-800 flex items-center justify-between gap-3">
            <img src="\${item.image}" alt="\${item.name}" class="w-12 h-12 rounded-xl object-cover shrink-0">
            <div class="flex-1 min-w-0">
              <p class="font-bold text-xs text-white truncate">\${item.name}</p>
              <p class="text-amber-400 text-xs font-semibold mt-0.5">\${formatRupiah(item.price)}</p>
            </div>
            <div class="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1">
              <button onclick="changeQty('\${item.id}', -1)" class="text-zinc-400 hover:text-white text-xs px-1">-</button>
              <span class="text-xs font-bold text-white">\${item.qty}</span>
              <button onclick="changeQty('\${item.id}', 1)" class="text-zinc-400 hover:text-white text-xs px-1">+</button>
            </div>
          </div>
        \`;
      }).join('');

      subtotalEl.textContent = formatRupiah(subtotal);
      totalEl.textContent = formatRupiah(subtotal);
    }

    function checkoutWhatsApp() {
      if (cart.length === 0) {
        alert('Keranjang belanja Anda masih kosong.');
        return;
      }
      const name = document.getElementById('cust-name').value.trim() || 'Pelanggan';
      const address = document.getElementById('cust-address').value.trim() || '-';
      
      let total = 0;
      let msg = 'Halo Lumina Goods, saya ingin konfirmasi pesanan:\\n\\n';
      msg += 'Nama: ' + name + '\\n';
      msg += 'Alamat: ' + address + '\\n\\n';
      msg += 'Rincian Pesanan:\\n';
      
      cart.forEach((item, idx) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        msg += (idx + 1) + '. ' + item.name + ' x' + item.qty + ' = ' + formatRupiah(itemTotal) + '\\n';
      });
      
      msg += '\\nTotal Pembayaran: ' + formatRupiah(total) + '\\n\\nMohon info ketersediaan stok & metode transfer.';
      window.open('https://wa.me/6281234567890?text=' + encodeURIComponent(msg), '_blank');
    }

    // Initial render
    renderProducts();
    renderCart();
  </script>
</body>
</html>`
  },
  {
    id: "omnipulse-saas",
    title: "OmniPulse SaaS & Analytics Dashboard",
    category: "Dashboard",
    description: "Antarmuka dashboard analitik perusahaan dengan visualisasi grafik SVG tren pendapatan, metrik KPI ringkasan, tabel data transaksi dengan penapis status, dan navigasi sidebar.",
    tags: ["Dashboard", "SaaS", "Data Visualization", "Data Table"],
    rating: 5.0,
    downloads: 2410,
    previewGradient: "from-blue-600/30 via-indigo-950/40 to-black",
    code: `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OmniPulse - Enterprise Analytics</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col md:flex-row antialiased selection:bg-blue-600 selection:text-white">
  <!-- Sidebar -->
  <aside class="w-full md:w-64 bg-zinc-900/70 border-r border-zinc-800 p-5 flex flex-col justify-between shrink-0">
    <div class="space-y-6">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 font-bold">
          <i class="fa-solid fa-chart-line text-sm"></i>
        </div>
        <div>
          <span class="font-extrabold tracking-tight text-white block leading-tight">OmniPulse</span>
          <span class="text-[10px] text-zinc-500 font-mono">Enterprise v2.4</span>
        </div>
      </div>

      <nav class="space-y-1 text-xs">
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20">
          <i class="fa-solid fa-gauge-high w-4"></i> Ringkasan Utama
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-medium transition-colors">
          <i class="fa-solid fa-chart-simple w-4"></i> Analitik Pendapatan
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-medium transition-colors">
          <i class="fa-solid fa-users w-4"></i> Manajemen Pelanggan
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-medium transition-colors">
          <i class="fa-solid fa-receipt w-4"></i> Faktur & Tagihan
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 font-medium transition-colors">
          <i class="fa-solid fa-sliders w-4"></i> Pengaturan Sistem
        </a>
      </nav>
    </div>

    <!-- User Profile Badge -->
    <div class="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs">
          AR
        </div>
        <div class="min-w-0">
          <p class="text-xs font-bold text-white truncate">Alex Rivera</p>
          <p class="text-[10px] text-zinc-500 truncate">Head of Analytics</p>
        </div>
      </div>
      <button class="text-zinc-500 hover:text-white text-xs p-1"><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
    </div>
  </aside>

  <!-- Main Content Area -->
  <main class="flex-1 flex flex-col min-w-0 overflow-y-auto">
    <!-- Top Bar -->
    <header class="h-16 px-6 border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <h2 class="text-sm sm:text-base font-bold text-white">Dashboard Analitik</h2>
        <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">Live Data Sync</span>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
          <button onclick="setTimeRange('7 Hari')" id="range-7" class="px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white">7 Hari</button>
          <button onclick="setTimeRange('30 Hari')" id="range-30" class="px-2.5 py-1 rounded-lg bg-zinc-800 text-white font-semibold">30 Hari</button>
          <button onclick="setTimeRange('90 Hari')" id="range-90" class="px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white">90 Hari</button>
        </div>
        <button onclick="alert('Mengunduh rekapan CSV...')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20">
          <i class="fa-solid fa-cloud-arrow-down text-xs"></i>
          <span class="hidden sm:inline">Ekspor CSV</span>
        </button>
      </div>
    </header>

    <!-- Dashboard Content -->
    <div class="p-6 space-y-6">
      <!-- 4 Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div class="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Pendapatan</span>
            <i class="fa-solid fa-wallet text-blue-400"></i>
          </div>
          <div class="text-2xl font-black text-white" id="stat-revenue">Rp 428,5 Jt</div>
          <div class="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <i class="fa-solid fa-arrow-trend-up"></i> +14.8% <span class="text-zinc-500 font-normal">vs bulan lalu</span>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div class="flex items-center justify-between text-zinc-400 text-xs">
            <span>Pengguna Aktif</span>
            <i class="fa-solid fa-users text-indigo-400"></i>
          </div>
          <div class="text-2xl font-black text-white" id="stat-users">12.480</div>
          <div class="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <i class="fa-solid fa-arrow-trend-up"></i> +8.2% <span class="text-zinc-500 font-normal">pelanggan baru</span>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div class="flex items-center justify-between text-zinc-400 text-xs">
            <span>Tingkat Konversi</span>
            <i class="fa-solid fa-bullseye text-amber-400"></i>
          </div>
          <div class="text-2xl font-black text-white">3.64%</div>
          <div class="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <i class="fa-solid fa-arrow-trend-up"></i> +0.5% <span class="text-zinc-500 font-normal">dari trial</span>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div class="flex items-center justify-between text-zinc-400 text-xs">
            <span>Tingkat Churn</span>
            <i class="fa-solid fa-user-minus text-rose-400"></i>
          </div>
          <div class="text-2xl font-black text-white">1.12%</div>
          <div class="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <i class="fa-solid fa-arrow-trend-down"></i> -0.3% <span class="text-zinc-500 font-normal">retensi naik</span>
          </div>
        </div>
      </div>

      <!-- SVG Line Chart Area -->
      <div class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-white">Grafik Pertumbuhan Pendapatan</h3>
            <p class="text-xs text-zinc-500">Estimasi tren perolehan bulanan tahun fiskal berjalan</p>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <span class="inline-flex items-center gap-1.5 text-blue-400"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Pendapatan Aktual</span>
            <span class="inline-flex items-center gap-1.5 text-zinc-500"><span class="w-2.5 h-2.5 rounded-full bg-zinc-700"></span> Target</span>
          </div>
        </div>

        <!-- Simulated SVG Trend Chart -->
        <div class="w-full h-48 sm:h-64 relative flex items-end">
          <svg class="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
            <!-- Grid Lines -->
            <line x1="0" y1="40" x2="800" y2="40" stroke="#27272a" stroke-dasharray="4" stroke-width="1" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#27272a" stroke-dasharray="4" stroke-width="1" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="#27272a" stroke-dasharray="4" stroke-width="1" />
            <line x1="0" y1="220" x2="800" y2="220" stroke="#3f3f46" stroke-width="1" />

            <!-- Gradient Area -->
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#2563eb" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            <polygon points="0,220 0,180 130,150 260,170 390,110 520,90 650,50 800,30 800,220" fill="url(#chartGradient)" />

            <!-- Smooth Trend Line -->
            <polyline
              fill="none"
              stroke="#3b82f6"
              stroke-width="3"
              points="0,180 130,150 260,170 390,110 520,90 650,50 800,30"
            />

            <!-- Circles at points -->
            <circle cx="130" cy="150" r="4" fill="#3b82f6" />
            <circle cx="260" cy="170" r="4" fill="#3b82f6" />
            <circle cx="390" cy="110" r="4" fill="#3b82f6" />
            <circle cx="520" cy="90" r="4" fill="#3b82f6" />
            <circle cx="650" cy="50" r="4" fill="#3b82f6" />
            <circle cx="800" cy="30" r="5" fill="#60a5fa" stroke="#ffffff" stroke-width="2" />
          </svg>
        </div>
        <div class="flex justify-between text-[11px] text-zinc-500 font-mono pt-2 border-t border-zinc-800/60">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span><span>Jul (Aktual)</span>
        </div>
      </div>

      <!-- Transactions & Customer Table -->
      <div class="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-bold text-white">Transaksi & Pelanggan Terbaru</h3>
            <p class="text-xs text-zinc-500">Daftar langganan aktif dan transaksi pembayaran masuk</p>
          </div>
          <div class="flex items-center gap-2">
            <input
              type="text"
              id="table-search"
              oninput="filterTable(this.value)"
              placeholder="Cari pelanggan..."
              class="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-zinc-800 text-zinc-400 font-mono text-[11px]">
                <th class="py-3 px-3">Pelanggan</th>
                <th class="py-3 px-3">Paket SaaS</th>
                <th class="py-3 px-3">Tanggal</th>
                <th class="py-3 px-3">Status</th>
                <th class="py-3 px-3 text-right">Nilai Tagihan</th>
              </tr>
            </thead>
            <tbody id="table-body" class="divide-y divide-zinc-800/60 text-zinc-300">
              <!-- Injected via JavaScript -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>

  <script>
    const transactions = [
      { name: "PT Teknologi Nusantara", email: "billing@teknus.id", plan: "Enterprise Annual", date: "Hari ini, 14:20", status: "Sukses", amount: "Rp 36.000.000" },
      { name: "Sinar Abadi Creative", email: "finance@sinarabadi.co", plan: "Pro Monthly", date: "Kemarin, 19:10", status: "Sukses", amount: "Rp 1.490.000" },
      { name: "Klinik Medika Utama", email: "admin@medikautama.org", plan: "Pro Annual", date: "03 Okt 2026", status: "Sukses", amount: "Rp 14.900.000" },
      { name: "Bistro Rasa Indonesia", email: "owner@bistrorasa.com", plan: "Starter Monthly", date: "02 Okt 2026", status: "Tertunda", amount: "Rp 490.000" },
      { name: "Akademi Coding Pintar", email: "halo@codingpintar.sch.id", plan: "Pro Monthly", date: "01 Okt 2026", status: "Sukses", amount: "Rp 1.490.000" }
    ];

    function renderTable(data) {
      const tbody = document.getElementById('table-body');
      tbody.innerHTML = data.map(t => \`
        <tr class="hover:bg-zinc-800/30 transition-colors">
          <td class="py-3 px-3">
            <span class="font-bold text-white block">\${t.name}</span>
            <span class="text-[10px] text-zinc-500 font-mono">\${t.email}</span>
          </td>
          <td class="py-3 px-3"><span class="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-medium text-[10px]">\${t.plan}</span></td>
          <td class="py-3 px-3 text-zinc-400 font-mono text-[11px]">\${t.date}</td>
          <td class="py-3 px-3">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${t.status === 'Sukses' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}">\${t.status}</span>
          </td>
          <td class="py-3 px-3 text-right font-extrabold text-white font-mono">\${t.amount}</td>
        </tr>
      \`).join('');
    }

    function filterTable(keyword) {
      const q = keyword.toLowerCase();
      const filtered = transactions.filter(t => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.plan.toLowerCase().includes(q));
      renderTable(filtered);
    }

    function setTimeRange(range) {
      document.getElementById('range-7').className = 'px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white';
      document.getElementById('range-30').className = 'px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white';
      document.getElementById('range-90').className = 'px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white';

      if (range === '7 Hari') {
        document.getElementById('range-7').className = 'px-2.5 py-1 rounded-lg bg-zinc-800 text-white font-semibold';
        document.getElementById('stat-revenue').textContent = 'Rp 94,2 Jt';
        document.getElementById('stat-users').textContent = '3.820';
      } else if (range === '30 Hari') {
        document.getElementById('range-30').className = 'px-2.5 py-1 rounded-lg bg-zinc-800 text-white font-semibold';
        document.getElementById('stat-revenue').textContent = 'Rp 428,5 Jt';
        document.getElementById('stat-users').textContent = '12.480';
      } else {
        document.getElementById('range-90').className = 'px-2.5 py-1 rounded-lg bg-zinc-800 text-white font-semibold';
        document.getElementById('stat-revenue').textContent = 'Rp 1.18 M';
        document.getElementById('stat-users').textContent = '34.190';
      }
    }

    renderTable(transactions);
  </script>
</body>
</html>`
  },
  {
    id: "gusto-bistro",
    title: "Gusto Artisan Bistro & Specialty Cafe",
    category: "Restoran",
    description: "Situs web kuliner & kafe modern lengkap dengan pemilih kategori menu hidangan (kopi, makanan utama, pastry), modal reservasi meja online terintegrasi, jam operasional, dan ulasan tamu.",
    tags: ["Restoran", "Menu Digital", "Reservasi Meja", "Kuliner & Kafe"],
    rating: 4.8,
    downloads: 1620,
    previewGradient: "from-amber-700/30 via-yellow-950/40 to-black",
    code: `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gusto Artisan Bistro & Cafe</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    .serif-title { font-family: 'Playfair Display', serif; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-[#0b0806] text-amber-50 min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-zinc-950">
  <!-- Sticky Header -->
  <header class="sticky top-0 z-40 bg-[#0b0806]/90 backdrop-blur-md border-b border-amber-900/30 px-6 sm:px-12 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span class="text-xl font-bold tracking-widest text-amber-400 serif-title">GUSTO BISTRO</span>
      <span class="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">Buka Sekarang (08.00 - 22.00)</span>
    </div>

    <nav class="hidden md:flex items-center gap-6 text-xs text-amber-200/70 font-medium">
      <a href="#menu" class="hover:text-amber-400 transition-colors">Daftar Menu</a>
      <a href="#cerita" class="hover:text-amber-400 transition-colors">Filosofi Kami</a>
      <a href="#ulasan" class="hover:text-amber-400 transition-colors">Ulasan Tamu</a>
      <a href="#kontak" class="hover:text-amber-400 transition-colors">Lokasi & Jam</a>
    </nav>

    <button onclick="openBookingModal()" class="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer">
      Reservasi Meja
    </button>
  </header>

  <!-- Hero Banner -->
  <section class="relative py-20 sm:py-32 px-6 max-w-4xl mx-auto text-center space-y-5">
    <span class="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest">
      Artisan Roastery & Dining Space
    </span>
    <h1 class="text-4xl sm:text-7xl font-bold text-white tracking-tight serif-title leading-tight">
      Kelezatan Klasik dengan Sentuhan Modern
    </h1>
    <p class="text-amber-200/70 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
      Sajian biji kopi spesialti pilihan nusantara, pasta artisan buatan tangan, dan pastry hangat yang dipanggang segar setiap pagi untuk pengalaman bersantap istimewa.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-3 pt-3">
      <a href="#menu" class="px-6 py-3 rounded-full bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-all">Lihat Menu Lengkap</a>
      <button onclick="openBookingModal()" class="px-6 py-3 rounded-full bg-zinc-900 border border-amber-900/40 text-amber-300 font-semibold text-xs hover:bg-zinc-800 transition-all">Pesan Meja Tamu</button>
    </div>
  </section>

  <!-- Menu Section with Interactive Filters -->
  <section id="menu" class="max-w-6xl mx-auto px-6 py-16 w-full space-y-8">
    <div class="text-center space-y-2">
      <h2 class="text-2xl sm:text-4xl font-bold text-amber-400 serif-title">Pilihan Menu Terfavorit</h2>
      <p class="text-xs sm:text-sm text-amber-200/60">Diramu dari bahan organik lokal dengan dedikasi cita rasa tinggi</p>
    </div>

    <!-- Filter Buttons -->
    <div class="flex items-center justify-center flex-wrap gap-2" id="menu-filters">
      <button onclick="filterMenu('Semua')" class="m-filter-btn px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-zinc-950 transition-all">Semua</button>
      <button onclick="filterMenu('Kopi')" class="m-filter-btn px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-950 border border-amber-900/40 text-amber-200 hover:text-white transition-all">Kopi Spesialti</button>
      <button onclick="filterMenu('Makanan Utama')" class="m-filter-btn px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-950 border border-amber-900/40 text-amber-200 hover:text-white transition-all">Makanan Utama</button>
      <button onclick="filterMenu('Pastry')" class="m-filter-btn px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-950 border border-amber-900/40 text-amber-200 hover:text-white transition-all">Artisan Pastry</button>
    </div>

    <!-- Menu Grid -->
    <div id="menu-grid" class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <!-- Injected via JavaScript -->
    </div>
  </section>

  <!-- Story & Philosophy -->
  <section id="cerita" class="border-y border-amber-900/30 bg-zinc-950/60 py-16 px-6">
    <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div class="aspect-4/3 rounded-3xl overflow-hidden border border-amber-900/30">
        <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop" alt="Cafe Atmosphere" class="w-full h-full object-cover">
      </div>
      <div class="space-y-4">
        <span class="text-xs font-mono text-amber-400 uppercase tracking-widest">Sejak 2021</span>
        <h2 class="text-3xl font-bold text-white serif-title">Ruang Hangat untuk Percakapan Berharga</h2>
        <p class="text-xs sm:text-sm text-amber-200/70 leading-relaxed">
          Gusto didirikan atas kecintaan pada secangkir kopi yang jujur dan hidangan yang menenangkan jiwa. Kami bermitra langsung dengan petani kopi di dataran tinggi Gayo dan Priangan, memastikan setiap cangkir membawa cerita tanah asalnya.
        </p>
        <div class="grid grid-cols-2 gap-4 pt-2">
          <div class="p-4 rounded-2xl bg-zinc-900/60 border border-amber-900/30">
            <span class="text-2xl font-bold text-amber-400 font-mono">100%</span>
            <p class="text-xs text-amber-200/70 mt-1">Single origin biji kopi arabika terkurasi.</p>
          </div>
          <div class="p-4 rounded-2xl bg-zinc-900/60 border border-amber-900/30">
            <span class="text-2xl font-bold text-amber-400 font-mono">0 Bahan Kimia</span>
            <p class="text-xs text-amber-200/70 mt-1">Ragi alami & mentega tanpa pengawet.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Location & Footer -->
  <footer id="kontak" class="border-t border-amber-900/30 py-12 px-6 max-w-6xl mx-auto w-full text-xs text-amber-200/60 space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div>
        <h4 class="font-bold text-white serif-title text-sm mb-2">Lokasi & Kunjungan</h4>
        <p>Jl. Senopati Raya No. 42, Kebayoran Baru, Jakarta Selatan</p>
        <p class="mt-1">Telepon: (021) 728-9012</p>
      </div>
      <div>
        <h4 class="font-bold text-white serif-title text-sm mb-2">Jam Operasional</h4>
        <p>Senin - Jumat: 08.00 - 22.00 WIB</p>
        <p class="mt-1">Sabtu - Minggu: 07.30 - 23.00 WIB</p>
      </div>
      <div>
        <h4 class="font-bold text-white serif-title text-sm mb-2">Reservasi Khusus</h4>
        <p>Untuk acara privat, katering korporat, atau ruang rapat:</p>
        <p class="mt-1 text-amber-400 font-semibold">reservasi@gustobistro.id</p>
      </div>
    </div>
    <div class="text-center pt-6 border-t border-amber-900/20 text-[11px]">
      &copy; 2026 Gusto Artisan Bistro. Semua Hak Cipta Dilindungi.
    </div>
  </footer>

  <!-- Booking Modal -->
  <div id="booking-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden items-center justify-center p-4">
    <div class="bg-zinc-950 border border-amber-900/50 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-amber-900/30 pb-3">
        <h3 class="font-bold text-white serif-title text-base">Reservasi Meja Gusto</h3>
        <button onclick="closeBookingModal()" class="text-amber-200/60 hover:text-white p-1"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form onsubmit="handleBookingSubmit(event)" class="space-y-3 text-xs">
        <div class="space-y-1">
          <label class="text-amber-200/80 font-medium">Nama Tamu:</label>
          <input type="text" id="b-name" required placeholder="Contoh: Sarah Wijaya" class="w-full bg-zinc-900 border border-amber-900/40 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="space-y-1">
            <label class="text-amber-200/80 font-medium">Tanggal:</label>
            <input type="date" id="b-date" required class="w-full bg-zinc-900 border border-amber-900/40 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400" />
          </div>
          <div class="space-y-1">
            <label class="text-amber-200/80 font-medium">Waktu Sesi:</label>
            <select id="b-time" class="w-full bg-zinc-900 border border-amber-900/40 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400">
              <option>12:00 (Makan Siang)</option>
              <option>14:00 (Coffee Time)</option>
              <option selected>18:30 (Makan Malam)</option>
              <option>20:00 (Dinner Late)</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="space-y-1">
            <label class="text-amber-200/80 font-medium">Jumlah Tamu:</label>
            <select id="b-guests" class="w-full bg-zinc-900 border border-amber-900/40 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400">
              <option>2 Orang</option>
              <option>4 Orang</option>
              <option>6 Orang</option>
              <option>Lebih dari 6 (Grup)</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-amber-200/80 font-medium">Pilihan Area:</label>
            <select id="b-area" class="w-full bg-zinc-900 border border-amber-900/40 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400">
              <option>Indoor Bebas Asap</option>
              <option>Outdoor Terrace</option>
              <option>VIP Bar Counter</option>
            </select>
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-amber-200/80 font-medium">Catatan Khusus (Alergi / Perayaan):</label>
          <input type="text" id="b-notes" placeholder="Opsional: Meja dekat jendela / Ulang tahun" class="w-full bg-zinc-900 border border-amber-900/40 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400" />
        </div>
        <button type="submit" class="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs mt-2 transition-all flex items-center justify-center gap-2">
          <i class="fa-brands fa-whatsapp"></i> Konfirmasi via WhatsApp
        </button>
      </form>
    </div>
  </div>

  <script>
    const menuItems = [
      { name: "Truffle Mushroom Fettuccine", cat: "Makanan Utama", price: 88000, desc: "Pasta segar buatan tangan dengan saus krim jamur liar, minyak truffle putih, dan keju Grana Padano.", badge: "CHEF'S PICK" },
      { name: "Wagyu Sirloin Steak 200g", cat: "Makanan Utama", price: 195000, desc: "Daging sapi Wagyu MB5 dengan kentang tumbuk halus rosemary dan saus lada hitam khas Gusto.", badge: "FAVORIT" },
      { name: "Artisan Pour-Over Gayo Honey", cat: "Kopi", price: 42000, desc: "Biji kopi arabika single origin proses honey dengan aroma melati segar dan keasaman buah persik.", badge: "SINGLE ORIGIN" },
      { name: "Signature Spanish Latte", cat: "Kopi", price: 46000, desc: "Espresso ganda dipadukan dengan susu kental manis dan taburan bubuk kayu manis Ceylon.", badge: null },
      { name: "Classic French Butter Croissant", cat: "Pastry", price: 32000, desc: "Pastry berlapis renyah dipanggang dengan mentega Elle & Vire murni dari Prancis.", badge: "FRESH BAKED" },
      { name: "Pistachio Raspberry Tartlet", cat: "Pastry", price: 48000, desc: "Kulit tart renyah dengan krim diplomat kacang pistachio dan selai buah frambos asam manis.", badge: null }
    ];

    let currentFilter = 'Semua';

    function renderMenu() {
      const grid = document.getElementById('menu-grid');
      const filtered = menuItems.filter(m => currentFilter === 'Semua' || m.cat === currentFilter);
      grid.innerHTML = filtered.map(m => \`
        <div class="p-5 rounded-3xl bg-zinc-950/80 border border-amber-900/30 flex justify-between items-start gap-4 hover:border-amber-500/40 transition-all">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-white text-sm serif-title">\${m.name}</h3>
              \${m.badge ? \`<span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">\${m.badge}</span>\` : ''}
            </div>
            <p class="text-xs text-amber-200/60 leading-relaxed">\${m.desc}</p>
          </div>
          <span class="text-amber-400 font-extrabold text-sm whitespace-nowrap font-mono">Rp \${m.price.toLocaleString('id-ID')}</span>
        </div>
      \`).join('');
    }

    function filterMenu(cat) {
      currentFilter = cat;
      const btns = document.querySelectorAll('.m-filter-btn');
      btns.forEach(b => {
        if (b.textContent.trim() === cat || (cat === 'Kopi' && b.textContent.includes('Kopi')) || (cat === 'Pastry' && b.textContent.includes('Pastry'))) {
          b.className = 'm-filter-btn px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-zinc-950 transition-all';
        } else {
          b.className = 'm-filter-btn px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-950 border border-amber-900/40 text-amber-200 hover:text-white transition-all';
        }
      });
      renderMenu();
    }

    function openBookingModal() {
      const m = document.getElementById('booking-modal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    function closeBookingModal() {
      const m = document.getElementById('booking-modal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    function handleBookingSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('b-name').value;
      const date = document.getElementById('b-date').value;
      const time = document.getElementById('b-time').value;
      const guests = document.getElementById('b-guests').value;
      const area = document.getElementById('b-area').value;
      const notes = document.getElementById('b-notes').value || '-';

      const msg = 'Halo Gusto Bistro, saya ingin reservasi meja:\\n' +
        'Nama: ' + name + '\\n' +
        'Tanggal: ' + date + '\\n' +
        'Sesi: ' + time + '\\n' +
        'Jumlah Tamu: ' + guests + '\\n' +
        'Area: ' + area + '\\n' +
        'Catatan: ' + notes;

      window.open('https://wa.me/6281234567890?text=' + encodeURIComponent(msg), '_blank');
      closeBookingModal();
    }

    renderMenu();
  </script>
</body>
</html>`
  },
  {
    id: "apex-agency",
    title: "Apex Creative Digital & Tech Agency",
    category: "Landing Page",
    description: "Landing page agensi kreatif profesional dengan showcase portofolio proyek klien terfilter, paket harga layanan transparan, accordion FAQ, dan formulir konsultasi proyek instan.",
    tags: ["Landing Page", "Agensi Kreatif", "Portofolio", "Studi Kasus"],
    rating: 4.9,
    downloads: 2190,
    previewGradient: "from-purple-600/30 via-violet-950/40 to-black",
    code: `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Agency - Creative Digital Studio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    h1, h2, h3, .syne { font-family: 'Syne', sans-serif; }
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-black text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-purple-600 selection:text-white">
  <!-- Header -->
  <header class="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-6 sm:px-12 py-4 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="text-xl font-black tracking-widest text-purple-400 syne">APEX.</span>
      <span class="text-[10px] text-zinc-600 font-mono hidden sm:inline uppercase">Digital Studio</span>
    </div>

    <nav class="hidden md:flex items-center gap-8 text-xs text-zinc-400 font-medium">
      <a href="#layanan" class="hover:text-purple-400 transition-colors">Layanan</a>
      <a href="#karya" class="hover:text-purple-400 transition-colors">Portofolio</a>
      <a href="#harga" class="hover:text-purple-400 transition-colors">Paket Biaya</a>
      <a href="#faq" class="hover:text-purple-400 transition-colors">FAQ</a>
    </nav>

    <button onclick="openConsultModal()" class="px-4 py-2 rounded-full border border-purple-500/40 bg-purple-600/15 text-purple-300 text-xs font-semibold hover:bg-purple-600 hover:text-white transition-all cursor-pointer">
      Mulai Proyek
    </button>
  </header>

  <!-- Hero Section -->
  <section class="py-24 sm:py-36 text-center px-6 max-w-5xl mx-auto space-y-6">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
      <i class="fa-solid fa-code text-[10px]"></i> Rekayasa Web & Desain Antarmuka Berkelas
    </div>
    <h1 class="text-4xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight">
      Membangun Identitas Visual & Produk Digital Visioner
    </h1>
    <p class="text-zinc-400 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
      Kami berkolaborasi dengan startup teknologi dan brand ambisius untuk mendesain antarmuka berkonversi tinggi, aplikasi web kilat, dan identitas merek yang tak terlupakan.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
      <button onclick="openConsultModal()" class="px-6 py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer">
        Konsultasikan Kebutuhan Anda
      </button>
      <a href="#karya" class="px-6 py-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs transition-colors">
        Jelajahi Studi Kasus
      </a>
    </div>
  </section>

  <!-- Client Logos Ticker -->
  <div class="border-y border-zinc-900 bg-zinc-950/40 py-8 px-6 text-center">
    <p class="text-[11px] font-mono uppercase tracking-widest text-zinc-600 mb-6">Dipercaya oleh Perusahaan Terkemuka</p>
    <div class="flex items-center justify-center flex-wrap gap-8 sm:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all font-mono text-xs font-bold tracking-wider text-zinc-400">
      <span>NOVALAB AI</span>
      <span>NEXUS FINTECH</span>
      <span>AURORA HEALTH</span>
      <span>LUMINA GOODS</span>
      <span>VELOX MOTORS</span>
    </div>
  </div>

  <!-- Services Grid -->
  <section id="layanan" class="py-20 px-6 max-w-6xl mx-auto space-y-12 w-full">
    <div class="text-center space-y-2 max-w-xl mx-auto">
      <h2 class="text-3xl font-extrabold text-white">Kapabilitas & Layanan</h2>
      <p class="text-xs text-zinc-500">Kombinasi sains visual dan rekayasa kode modern untuk akselerasi bisnis Anda.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4 hover:border-purple-500/40 transition-all">
        <div class="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-sm">
          <i class="fa-solid fa-palette"></i>
        </div>
        <h3 class="text-base font-bold text-white">UI/UX & Product Design</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">Riset pengguna menyeluruh, wireframing cepat, prototype interaktif Figma, dan design system skalabel.</p>
      </div>

      <div class="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4 hover:border-purple-500/40 transition-all">
        <div class="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
          <i class="fa-solid fa-code"></i>
        </div>
        <h3 class="text-base font-bold text-white">Frontend Web Architecture</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">Pengembangan web modern berbasis React, Astro, dan Tailwind CSS dengan skor kecepatan 99+ Core Web Vitals.</p>
      </div>

      <div class="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4 hover:border-purple-500/40 transition-all">
        <div class="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <h3 class="text-base font-bold text-white">AI Tools & Integrations</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">Penyematan asisten AI generatif, integrasi API cerdas, dan workflow otomatis untuk meningkatkan efisiensi operasional.</p>
      </div>
    </div>
  </section>

  <!-- Portfolio Section -->
  <section id="karya" class="py-20 px-6 max-w-6xl mx-auto space-y-10 w-full border-t border-zinc-900">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h2 class="text-3xl font-extrabold text-white">Studi Kasus Pilihan</h2>
        <p class="text-xs text-zinc-500 mt-1">Hasil karya nyata yang memberikan dampak nyata pada pertumbuhan klien.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4 group">
        <div class="aspect-16/10 rounded-2xl overflow-hidden bg-zinc-900 relative">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" alt="Fintech" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <div class="space-y-1">
          <span class="text-[10px] text-purple-400 font-mono uppercase">Fintech & Wealth Management</span>
          <h3 class="text-lg font-bold text-white">Nexus Global Banking Platform</h3>
          <p class="text-xs text-zinc-400 leading-relaxed">Redesain aplikasi perbankan digital institusi dengan peningkatan rasio onboarding sebesar +140%.</p>
        </div>
      </div>

      <div class="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-4 group">
        <div class="aspect-16/10 rounded-2xl overflow-hidden bg-zinc-900 relative">
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop" alt="Analytics" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <div class="space-y-1">
          <span class="text-[10px] text-purple-400 font-mono uppercase">AI & Big Data</span>
          <h3 class="text-lg font-bold text-white">NovaLab Predictive Analytics Engine</h3>
          <p class="text-xs text-zinc-400 leading-relaxed">Dashboard interaktif pemantauan tren pasar saham real-time dengan latensi sub-detik.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing Packages -->
  <section id="harga" class="py-20 px-6 max-w-6xl mx-auto space-y-10 w-full border-t border-zinc-900">
    <div class="text-center space-y-2">
      <h2 class="text-3xl font-extrabold text-white">Investasi & Paket Kerja Sama</h2>
      <p class="text-xs text-zinc-500">Transparansi ruang lingkup pengerjaan tanpa biaya tersembunyi.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-6 flex flex-col justify-between">
        <div class="space-y-4">
          <span class="text-xs font-mono text-zinc-500 uppercase">Starter Sprint</span>
          <h3 class="text-2xl font-black text-white">Rp 15 Jt</h3>
          <p class="text-xs text-zinc-400 leading-relaxed">Cocok untuk validasi MVP, landing page produk baru, atau portofolio pribadi.</p>
          <ul class="space-y-2 text-xs text-zinc-300">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> Landing page 1 halaman responsif</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> Desain UI kustom Figma</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> Waktu pengerjaan 10 hari</li>
          </ul>
        </div>
        <button onclick="openConsultModal('Starter Sprint')" class="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-800 transition-colors">Pilih Paket</button>
      </div>

      <div class="p-6 rounded-3xl bg-zinc-950 border border-purple-500/50 space-y-6 flex flex-col justify-between relative shadow-xl shadow-purple-600/10">
        <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase">Paling Populer</span>
        <div class="space-y-4">
          <span class="text-xs font-mono text-purple-400 uppercase">Growth Studio</span>
          <h3 class="text-2xl font-black text-white">Rp 35 Jt</h3>
          <p class="text-xs text-zinc-400 leading-relaxed">Solusi lengkap untuk brand dan bisnis berkembang dengan kebutuhan fitur interaktif.</p>
          <ul class="space-y-2 text-xs text-zinc-300">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> Web multi-halaman interaktif</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> Integrasi formulir, WhatsApp & CMS</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> Optimasi SEO teknikal & Core Web Vitals</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> Dukungan revisi & garansi 30 hari</li>
          </ul>
        </div>
        <button onclick="openConsultModal('Growth Studio')" class="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all">Pilih Paket</button>
      </div>

      <div class="p-6 rounded-3xl bg-zinc-950 border border-zinc-900 space-y-6 flex flex-col justify-between">
        <div class="space-y-4">
          <span class="text-xs font-mono text-zinc-500 uppercase">Enterprise Custom</span>
          <h3 class="text-2xl font-black text-white">Kustom</h3>
          <p class="text-xs text-zinc-400 leading-relaxed">Untuk arsitektur aplikasi skala penuh, platform SaaS, dan tim engineering khusus.</p>
          <ul class="space-y-2 text-xs text-zinc-300">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> Rekayasa fullstack kustom</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> Audit keamanan & performa tinggi</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-purple-400"></i> Dedicated Project Lead & SLA</li>
          </ul>
        </div>
        <button onclick="openConsultModal('Enterprise Custom')" class="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-800 transition-colors">Hubungi Kami</button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="mt-auto border-t border-zinc-900 py-8 px-6 text-center text-xs text-zinc-600">
    <p>&copy; 2026 Apex Creative Digital Agency. Semua Hak Dilindungi.</p>
  </footer>

  <!-- Consultation Modal -->
  <div id="consult-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden items-center justify-center p-4">
    <div class="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 class="font-bold text-white text-base">Konsultasi Proyek Apex</h3>
        <button onclick="closeConsultModal()" class="text-zinc-500 hover:text-white p-1"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form onsubmit="handleConsultSubmit(event)" class="space-y-3 text-xs">
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Nama / Perusahaan:</label>
          <input type="text" id="c-name" required placeholder="Contoh: Budi Santoso (PT Inovasi)" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500" />
        </div>
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Pilihan Paket / Kebutuhan:</label>
          <select id="c-plan" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500">
            <option>Growth Studio (Rp 35 Jt)</option>
            <option>Starter Sprint (Rp 15 Jt)</option>
            <option>Enterprise Custom</option>
            <option>Konsultasi Desain & Redesain</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Deskripsi Singkat Rencana Proyek:</label>
          <textarea id="c-desc" rows="3" required placeholder="Jelaskan kebutuhan, target peluncuran, atau referensi visual yang diinginkan..." class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"></textarea>
        </div>
        <button type="submit" class="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs mt-2 transition-all flex items-center justify-center gap-2">
          <i class="fa-brands fa-whatsapp"></i> Kirim Brief via WhatsApp
        </button>
      </form>
    </div>
  </div>

  <script>
    function openConsultModal(planName) {
      if (planName) {
        const select = document.getElementById('c-plan');
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.includes(planName)) {
            select.selectedIndex = i;
            break;
          }
        }
      }
      const m = document.getElementById('consult-modal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    function closeConsultModal() {
      const m = document.getElementById('consult-modal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    function handleConsultSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('c-name').value;
      const plan = document.getElementById('c-plan').value;
      const desc = document.getElementById('c-desc').value;

      const msg = 'Halo Apex Agency, saya ingin mengajukan konsultasi proyek:\\n\\n' +
        'Nama/Perusahaan: ' + name + '\\n' +
        'Paket yang Diminati: ' + plan + '\\n' +
        'Rencana Proyek: ' + desc + '\\n\\n' +
        'Mohon informasi jadwal sesi diskusi atau proposal teknisnya.';

      window.open('https://wa.me/6281234567890?text=' + encodeURIComponent(msg), '_blank');
      closeConsultModal();
    }
  </script>
</body>
</html>`
  },
  {
    id: "medika-clinic",
    title: "Medika Health Clinic & Care",
    category: "Kesehatan",
    description: "Situs portal layanan klinik kesehatan lengkap dengan jadwal poliklinik dokter spesialis, paket pemeriksaan medis rutin, dan formulir booking janji temu pasien instan.",
    tags: ["Klinik", "Dokter", "Kesehatan", "Janji Temu Medis"],
    rating: 4.8,
    downloads: 1390,
    previewGradient: "from-emerald-600/30 via-teal-950/40 to-black",
    code: `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medika Health Clinic & Diagnostic</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-zinc-950">
  <!-- Top Emergency Contact Bar -->
  <div class="bg-emerald-600 text-zinc-950 px-6 py-2 text-xs font-bold flex items-center justify-between">
    <div class="flex items-center gap-2">
      <i class="fa-solid fa-phone-volume"></i>
      <span>Layanan Darurat & Ambulans 24 Jam: (021) 500-MEDIKA / 0811-9988-7766</span>
    </div>
    <span class="hidden sm:inline-block font-mono">Akreditasi Paripurna Kemenkes RI</span>
  </div>

  <!-- Header Navigation -->
  <header class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-6 sm:px-12 py-3.5 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-sm">
        <i class="fa-solid fa-notes-medical"></i>
      </div>
      <div>
        <span class="font-extrabold text-base tracking-tight text-white block leading-tight">MEDIKA CARE</span>
        <span class="text-[10px] text-zinc-500 font-mono">Klinik Pratama & Diagnostik</span>
      </div>
    </div>

    <nav class="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
      <a href="#layanan" class="hover:text-emerald-400 transition-colors">Poliklinik</a>
      <a href="#dokter" class="hover:text-emerald-400 transition-colors">Jadwal Dokter</a>
      <a href="#checkup" class="hover:text-emerald-400 transition-colors">Paket Medical Checkup</a>
      <a href="#lokasi" class="hover:text-emerald-400 transition-colors">Kontak & Lokasi</a>
    </nav>

    <button onclick="openBookingModal()" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer">
      Buat Janji Temu
    </button>
  </header>

  <!-- Hero Section -->
  <section class="py-16 sm:py-24 px-6 max-w-5xl mx-auto text-center space-y-4">
    <span class="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest">
      Kesehatan Keluarga adalah Prioritas Utama
    </span>
    <h1 class="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight">
      Layanan Medis Terpadu, Modern & Terpercaya
    </h1>
    <p class="text-zinc-400 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
      Konsultasi dokter spesialis berpengalaman, fasilitas laboratorium diagnostik mutakhir, dan rekam medis digital untuk kenyamanan seluruh anggota keluarga.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-3 pt-3">
      <button onclick="openBookingModal()" class="px-5 py-3 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 transition-all">Pilih Dokter & Jadwal</button>
      <a href="#checkup" class="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-xs hover:text-white transition-colors">Paket Medical Checkup</a>
    </div>
  </section>

  <!-- Poliklinik & Layanan Grid -->
  <section id="layanan" class="py-12 px-6 max-w-6xl mx-auto w-full space-y-6">
    <div class="text-center space-y-1">
      <h2 class="text-2xl font-bold text-white">Poliklinik Spesialisasi</h2>
      <p class="text-xs text-zinc-500">Penanganan terarah sesuai kebutuhan diagnosis medis Anda</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 hover:border-emerald-500/40 transition-all">
        <div class="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-sm">
          <i class="fa-solid fa-stethoscope"></i>
        </div>
        <h3 class="font-bold text-white text-sm">Poli Dokter Umum</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">Pemeriksaan keluhan kesehatan rutin, konsultasi preventif, dan rujukan spesialis.</p>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 hover:border-emerald-500/40 transition-all">
        <div class="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center text-sm">
          <i class="fa-solid fa-tooth"></i>
        </div>
        <h3 class="font-bold text-white text-sm">Poli Gigi & Mulut</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">Scaling karang gigi, penambalan estetis, pencabutan, dan perawatan saluran akar.</p>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 hover:border-emerald-500/40 transition-all">
        <div class="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center text-sm">
          <i class="fa-solid fa-baby"></i>
        </div>
        <h3 class="font-bold text-white text-sm">Spesialis Anak (Pediatri)</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">Imunisasi wajib & tambahan, pemantauan tumbuh kembang balita, dan konsultasi gizi.</p>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 hover:border-emerald-500/40 transition-all">
        <div class="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center text-sm">
          <i class="fa-solid fa-flask-vial"></i>
        </div>
        <h3 class="font-bold text-white text-sm">Laboratorium Klinis</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">Tes darah lengkap, panel fungsi hati/ginjal, gula darah, dan tes diagnostik cepat.</p>
      </div>
    </div>
  </section>

  <!-- Doctor Directory -->
  <section id="dokter" class="py-16 px-6 max-w-6xl mx-auto w-full space-y-8 border-t border-zinc-900">
    <div class="text-center space-y-1">
      <h2 class="text-2xl font-bold text-white">Tim Dokter Ahli Medika</h2>
      <p class="text-xs text-zinc-500">Pilih dokter terpercaya dan tentukan jadwal kunjungan tanpa perlu antre lama</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div class="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div class="aspect-4/3 rounded-2xl overflow-hidden bg-zinc-800">
          <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop" alt="Dokter" class="w-full h-full object-cover">
        </div>
        <div>
          <span class="text-[10px] text-emerald-400 font-mono font-bold uppercase">Spesialis Penyakit Dalam (Sp.PD)</span>
          <h3 class="font-bold text-white text-sm mt-0.5">dr. Haryo Dananjaya, Sp.PD</h3>
          <p class="text-xs text-zinc-500 mt-1">Jadwal: Senin, Rabu & Jumat (16.00 - 20.00 WIB)</p>
        </div>
        <button onclick="openBookingModal('dr. Haryo Dananjaya, Sp.PD')" class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 font-bold text-xs text-zinc-200 transition-colors">
          Pilih Dokter Ini
        </button>
      </div>

      <div class="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div class="aspect-4/3 rounded-2xl overflow-hidden bg-zinc-800">
          <img src="https://images.unsplash.com/photo-1594824813576-9051d9571343?q=80&w=800&auto=format&fit=crop" alt="Dokter" class="w-full h-full object-cover">
        </div>
        <div>
          <span class="text-[10px] text-amber-400 font-mono font-bold uppercase">Spesialis Anak (Sp.A)</span>
          <h3 class="font-bold text-white text-sm mt-0.5">dr. Amanda Savitri, Sp.A</h3>
          <p class="text-xs text-zinc-500 mt-1">Jadwal: Selasa & Kamis (09.00 - 13.00 WIB)</p>
        </div>
        <button onclick="openBookingModal('dr. Amanda Savitri, Sp.A')" class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 font-bold text-xs text-zinc-200 transition-colors">
          Pilih Dokter Ini
        </button>
      </div>

      <div class="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div class="aspect-4/3 rounded-2xl overflow-hidden bg-zinc-800">
          <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop" alt="Dokter" class="w-full h-full object-cover">
        </div>
        <div>
          <span class="text-[10px] text-blue-400 font-mono font-bold uppercase">Dokter Gigi (drg.)</span>
          <h3 class="font-bold text-white text-sm mt-0.5">drg. Kevin Wardhana</h3>
          <p class="text-xs text-zinc-500 mt-1">Jadwal: Setiap Hari Kerja (10.00 - 17.00 WIB)</p>
        </div>
        <button onclick="openBookingModal('drg. Kevin Wardhana')" class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 font-bold text-xs text-zinc-200 transition-colors">
          Pilih Dokter Ini
        </button>
      </div>
    </div>
  </section>

  <!-- Medical Checkup Packages -->
  <section id="checkup" class="py-16 px-6 max-w-6xl mx-auto w-full space-y-8 border-t border-zinc-900">
    <div class="text-center space-y-1">
      <h2 class="text-2xl font-bold text-white">Paket Medical Checkup (MCU)</h2>
      <p class="text-xs text-zinc-500">Pendeteksian dini untuk investasi kesehatan masa depan</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <span class="text-xs font-mono text-zinc-500 uppercase">MCU Silver Basic</span>
        <h3 class="text-2xl font-black text-white">Rp 450.000</h3>
        <p class="text-xs text-zinc-400">Pemeriksaan darah rutin, tes urin, kolesterol total, gula darah puasa, dan fisik dokter umum.</p>
        <button onclick="openBookingModal('Paket MCU Silver')" class="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors">Daftar Paket</button>
      </div>

      <div class="p-6 rounded-3xl bg-zinc-900/60 border border-emerald-500/50 space-y-4 shadow-lg shadow-emerald-500/10">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-emerald-400 uppercase">MCU Gold Komprehensif</span>
          <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">REKOMENDASI</span>
        </div>
        <h3 class="text-2xl font-black text-white">Rp 890.000</h3>
        <p class="text-xs text-zinc-400">Seluruh tes Silver + Profil lipid lengkap (HDL/LDL), fungsi ginjal (ureum/kreatinin), asam urat, dan EKG jantung.</p>
        <button onclick="openBookingModal('Paket MCU Gold')" class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all">Daftar Paket</button>
      </div>

      <div class="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <span class="text-xs font-mono text-zinc-500 uppercase">MCU Platinum Executive</span>
        <h3 class="text-2xl font-black text-white">Rp 1.650.000</h3>
        <p class="text-xs text-zinc-400">Seluruh tes Gold + Rontgen thoraks dada, USG abdomen atas/bawah, konsultasi dokter spesialis penyakit dalam.</p>
        <button onclick="openBookingModal('Paket MCU Platinum')" class="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors">Daftar Paket</button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer id="lokasi" class="mt-auto border-t border-zinc-900 bg-zinc-950 py-8 px-6 text-center text-xs text-zinc-500">
    <div class="max-w-4xl mx-auto space-y-2">
      <p class="font-bold text-white">Klinik Pratama & Laboratorium Medika Care</p>
      <p>Jl. Boulevard Barat Raya No. 18, Kelapa Gading, Jakarta Utara | Telp: (021) 458-1234</p>
      <p class="text-[11px] text-zinc-600 pt-2">&copy; 2026 Medika Care. Hak Cipta Dilindungi.</p>
    </div>
  </footer>

  <!-- Booking Modal -->
  <div id="booking-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden items-center justify-center p-4">
    <div class="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 class="font-bold text-white text-base">Buat Janji Temu Medika</h3>
        <button onclick="closeBookingModal()" class="text-zinc-500 hover:text-white p-1"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form onsubmit="handleBookingSubmit(event)" class="space-y-3 text-xs">
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Nama Pasien:</label>
          <input type="text" id="p-name" required placeholder="Contoh: Rina Anggraini" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        </div>
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Nomor WhatsApp / Kontak:</label>
          <input type="tel" id="p-phone" required placeholder="Contoh: 081234567890" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        </div>
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Dokter / Layanan Pilihan:</label>
          <select id="p-doctor" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500">
            <option>dr. Haryo Dananjaya, Sp.PD (Penyakit Dalam)</option>
            <option>dr. Amanda Savitri, Sp.A (Anak)</option>
            <option>drg. Kevin Wardhana (Gigi & Mulut)</option>
            <option>Dokter Umum / Konsultasi Pertama</option>
            <option>Paket MCU Silver (Rp 450.000)</option>
            <option>Paket MCU Gold (Rp 890.000)</option>
            <option>Paket MCU Platinum (Rp 1.650.000)</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="space-y-1">
            <label class="text-zinc-400 font-medium">Rencana Tanggal:</label>
            <input type="date" id="p-date" required class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div class="space-y-1">
            <label class="text-zinc-400 font-medium">Sesi Waktu:</label>
            <select id="p-session" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500">
              <option>Pagi (09.00 - 12.00)</option>
              <option>Siang (13.00 - 16.00)</option>
              <option selected>Sore / Malam (16.00 - 20.00)</option>
            </select>
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Keluhan Singkat (Opsional):</label>
          <input type="text" id="p-symptom" placeholder="Contoh: Demam 3 hari / Cek kesehatan rutin" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        </div>

        <button type="submit" class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs mt-2 transition-all flex items-center justify-center gap-2">
          <i class="fa-brands fa-whatsapp"></i> Konfirmasi Booking via WhatsApp
        </button>
      </form>
    </div>
  </div>

  <script>
    function openBookingModal(presetDoctor) {
      if (presetDoctor) {
        const select = document.getElementById('p-doctor');
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.includes(presetDoctor)) {
            select.selectedIndex = i;
            break;
          }
        }
      }
      const m = document.getElementById('booking-modal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    function closeBookingModal() {
      const m = document.getElementById('booking-modal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    function handleBookingSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('p-name').value;
      const phone = document.getElementById('p-phone').value;
      const doctor = document.getElementById('p-doctor').value;
      const date = document.getElementById('p-date').value;
      const session = document.getElementById('p-session').value;
      const symptom = document.getElementById('p-symptom').value || '-';

      const msg = 'Halo Medika Care, saya ingin mendaftar janji temu medis:\\n\\n' +
        'Nama Pasien: ' + name + '\\n' +
        'Kontak: ' + phone + '\\n' +
        'Dokter/Layanan: ' + doctor + '\\n' +
        'Tanggal Kunjungan: ' + date + ' (' + session + ')\\n' +
        'Keluhan Singkat: ' + symptom + '\\n\\n' +
        'Mohon konfirmasi nomor antrean klinik.';

      window.open('https://wa.me/6281234567890?text=' + encodeURIComponent(msg), '_blank');
      closeBookingModal();
    }
  </script>
</body>
</html>`
  },
  {
    id: "educore-academy",
    title: "EduCore Tech Academy & Online Courses",
    category: "Edukasi",
    description: "Platform kursus daring dan bootcamp teknologi modern dengan katalog pencarian kelas, rincian silabus terstruktur, profil mentor industri, dan formulir pendaftaran konsultasi belajar gratis.",
    tags: ["Edukasi", "Kursus Online", "Bootcamp", "Silabus"],
    rating: 4.9,
    downloads: 1780,
    previewGradient: "from-blue-600/30 via-cyan-950/40 to-black",
    code: `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EduCore Tech Academy</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-zinc-950">
  <!-- Header -->
  <header class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-6 sm:px-12 py-3.5 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-xl bg-cyan-500 flex items-center justify-center text-zinc-950 font-black text-sm">
        <i class="fa-solid fa-graduation-cap"></i>
      </div>
      <div>
        <span class="font-extrabold text-base tracking-tight text-white block leading-tight">EDUCORE</span>
        <span class="text-[10px] text-zinc-500 font-mono">Tech Career Accelerator</span>
      </div>
    </div>

    <nav class="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
      <a href="#kursus" class="hover:text-cyan-400 transition-colors">Daftar Kursus</a>
      <a href="#keunggulan" class="hover:text-cyan-400 transition-colors">Metode Belajar</a>
      <a href="#alumni" class="hover:text-cyan-400 transition-colors">Kisah Sukses</a>
      <a href="#faq" class="hover:text-cyan-400 transition-colors">FAQ</a>
    </nav>

    <button onclick="openEnrollModal()" class="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer">
      Konsultasi Gratis
    </button>
  </header>

  <!-- Hero Section -->
  <section class="py-16 sm:py-24 px-6 max-w-5xl mx-auto text-center space-y-4">
    <span class="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
      Batch Pendaftaran Oktober 2026 Dibuka
    </span>
    <h1 class="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight">
      Kuasai Keahlian Digital Masa Depan Bersama Mentor Praktisi
    </h1>
    <p class="text-zinc-400 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
      Kurikulum intensif berbasis proyek nyata: Fullstack Engineering, UI/UX Design, Data Science, dan Artificial Intelligence dengan pendampingan karir intensif.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-3 pt-3">
      <a href="#kursus" class="px-5 py-3 rounded-xl bg-cyan-500 text-zinc-950 font-bold text-xs hover:bg-cyan-400 transition-all">Jelajahi Pilihan Kelas</a>
      <button onclick="openEnrollModal()" class="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-xs hover:text-white transition-colors">Tes Bakat & Karier</button>
    </div>
  </section>

  <!-- Stats Strip -->
  <div class="border-y border-zinc-800/80 bg-zinc-900/40 py-8 px-6">
    <div class="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
      <div>
        <div class="text-2xl sm:text-3xl font-black text-white">42.000+</div>
        <p class="text-xs text-zinc-500 mt-1">Alumni Tersalurkan Kerja</p>
      </div>
      <div>
        <div class="text-2xl sm:text-3xl font-black text-cyan-400">94%</div>
        <p class="text-xs text-zinc-500 mt-1">Tingkat Penyerapan Karir</p>
      </div>
      <div>
        <div class="text-2xl sm:text-3xl font-black text-white">180+</div>
        <p class="text-xs text-zinc-500 mt-1">Hiring Partner Perusahaan</p>
      </div>
      <div>
        <div class="text-2xl sm:text-3xl font-black text-amber-400">4.9/5</div>
        <p class="text-xs text-zinc-500 mt-1">Skor Ulasan Mahasiswa</p>
      </div>
    </div>
  </div>

  <!-- Course Catalog -->
  <section id="kursus" class="py-16 px-6 max-w-6xl mx-auto w-full space-y-8">
    <div class="text-center space-y-1">
      <h2 class="text-2xl sm:text-3xl font-bold text-white">Program Belajar Unggulan</h2>
      <p class="text-xs text-zinc-500">Pilih spesialisasi yang sesuai dengan arah karier teknologi impian Anda</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
        <div class="space-y-3">
          <div class="aspect-16/10 rounded-2xl overflow-hidden bg-zinc-800 relative">
            <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop" alt="Web Dev" class="w-full h-full object-cover">
            <span class="absolute top-3 left-3 bg-cyan-500 text-zinc-950 font-bold text-[9px] px-2 py-0.5 rounded uppercase">Fullstack</span>
          </div>
          <div>
            <h3 class="font-bold text-white text-base">Modern Fullstack React & Node.js</h3>
            <p class="text-xs text-zinc-400 mt-1 leading-relaxed">Bangun aplikasi web enterprise dari nol menggunakan React, Next.js, TypeScript, PostgreSQL, dan Tailwind CSS.</p>
          </div>
          <div class="flex items-center gap-3 text-xs text-zinc-500 pt-1">
            <span><i class="fa-solid fa-clock text-cyan-400 mr-1"></i> 14 Minggu</span>
            <span><i class="fa-solid fa-layer-group text-cyan-400 mr-1"></i> 24 Proyek</span>
          </div>
        </div>
        <div class="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <span class="text-base font-extrabold text-white">Rp 2.490.000</span>
          <button onclick="openEnrollModal('Fullstack React & Node.js')" class="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors">Daftar Kelas</button>
        </div>
      </div>

      <div class="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
        <div class="space-y-3">
          <div class="aspect-16/10 rounded-2xl overflow-hidden bg-zinc-800 relative">
            <img src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop" alt="UI UX" class="w-full h-full object-cover">
            <span class="absolute top-3 left-3 bg-purple-500 text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase">UI/UX</span>
          </div>
          <div>
            <h3 class="font-bold text-white text-base">UI/UX Product Design Masterclass</h3>
            <p class="text-xs text-zinc-400 mt-1 leading-relaxed">Kuasai riset pengguna, wireframing, design system kompleks di Figma, hingga usability testing langsung.</p>
          </div>
          <div class="flex items-center gap-3 text-xs text-zinc-500 pt-1">
            <span><i class="fa-solid fa-clock text-purple-400 mr-1"></i> 10 Minggu</span>
            <span><i class="fa-solid fa-layer-group text-purple-400 mr-1"></i> 18 Portofolio</span>
          </div>
        </div>
        <div class="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <span class="text-base font-extrabold text-white">Rp 1.950.000</span>
          <button onclick="openEnrollModal('UI/UX Product Design')" class="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors">Daftar Kelas</button>
        </div>
      </div>

      <div class="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
        <div class="space-y-3">
          <div class="aspect-16/10 rounded-2xl overflow-hidden bg-zinc-800 relative">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" alt="AI & Data" class="w-full h-full object-cover">
            <span class="absolute top-3 left-3 bg-emerald-500 text-zinc-950 font-bold text-[9px] px-2 py-0.5 rounded uppercase">AI & Data</span>
          </div>
          <div>
            <h3 class="font-bold text-white text-base">Applied AI & Data Science Python</h3>
            <p class="text-xs text-zinc-400 mt-1 leading-relaxed">Analisis data bisnis, machine learning praktis, dan integrasi Large Language Models (LLM) ke aplikasi.</p>
          </div>
          <div class="flex items-center gap-3 text-xs text-zinc-500 pt-1">
            <span><i class="fa-solid fa-clock text-emerald-400 mr-1"></i> 12 Minggu</span>
            <span><i class="fa-solid fa-layer-group text-emerald-400 mr-1"></i> 15 Lab Data</span>
          </div>
        </div>
        <div class="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <span class="text-base font-extrabold text-white">Rp 2.790.000</span>
          <button onclick="openEnrollModal('Applied AI & Data Science')" class="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors">Daftar Kelas</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="mt-auto border-t border-zinc-900 bg-zinc-950 py-8 px-6 text-center text-xs text-zinc-500">
    <p>&copy; 2026 EduCore Tech Academy. Platform Pelatihan Profesional Berizin Resmi.</p>
  </footer>

  <!-- Enrollment Modal -->
  <div id="enroll-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden items-center justify-center p-4">
    <div class="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 class="font-bold text-white text-base">Pendaftaran & Konsultasi Kursus</h3>
        <button onclick="closeEnrollModal()" class="text-zinc-500 hover:text-white p-1"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form onsubmit="handleEnrollSubmit(event)" class="space-y-3 text-xs">
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Nama Lengkap:</label>
          <input type="text" id="e-name" required placeholder="Contoh: Dimas Pratama" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500" />
        </div>
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Nomor WhatsApp:</label>
          <input type="tel" id="e-phone" required placeholder="Contoh: 081234567890" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500" />
        </div>
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Program Kursus Pilihan:</label>
          <select id="e-course" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500">
            <option>Modern Fullstack React & Node.js</option>
            <option>UI/UX Product Design Masterclass</option>
            <option>Applied AI & Data Science Python</option>
            <option>Konsultasi Pemilihan Jurusan Karier</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Latar Belakang Saat Ini:</label>
          <select id="e-bg" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500">
            <option>Pemula Tanpa Pengalaman Coding</option>
            <option>Mahasiswa Teknik Informatika / Ilmu Komputer</option>
            <option>Profesional yang Ingin Pindah Karier (Career Switch)</option>
          </select>
        </div>
        <button type="submit" class="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs mt-2 transition-all flex items-center justify-center gap-2">
          <i class="fa-brands fa-whatsapp"></i> Hubungi Konsultan Karier
        </button>
      </form>
    </div>
  </div>

  <script>
    function openEnrollModal(presetCourse) {
      if (presetCourse) {
        const select = document.getElementById('e-course');
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.includes(presetCourse)) {
            select.selectedIndex = i;
            break;
          }
        }
      }
      const m = document.getElementById('enroll-modal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    function closeEnrollModal() {
      const m = document.getElementById('enroll-modal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    function handleEnrollSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('e-name').value;
      const phone = document.getElementById('e-phone').value;
      const course = document.getElementById('e-course').value;
      const bg = document.getElementById('e-bg').value;

      const msg = 'Halo EduCore Academy, saya ingin konsultasi pendaftaran kelas:\\n\\n' +
        'Nama: ' + name + '\\n' +
        'WhatsApp: ' + phone + '\\n' +
        'Pilihan Kelas: ' + course + '\\n' +
        'Latar Belakang: ' + bg + '\\n\\n' +
        'Mohon info jadwal batch terdekat dan rincian silabus lengkapnya.';

      window.open('https://wa.me/6281234567890?text=' + encodeURIComponent(msg), '_blank');
      closeEnrollModal();
    }
  </script>
</body>
</html>`
  },
  {
    id: "propertikita-estate",
    title: "PropertiKita Luxury Real Estate & Living",
    category: "Properti",
    description: "Portal jual-beli & sewa properti mewah dengan filter tipe hunian, spesifikasi detail kamar & luas tanah, simulator kalkulator KPR interaktif real-time, dan formulir private tour.",
    tags: ["Properti", "Real Estate", "Kalkulator KPR", "Hunian Mewah"],
    rating: 4.8,
    downloads: 1250,
    previewGradient: "from-emerald-700/30 via-slate-950/40 to-black",
    code: `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PropertiKita - Exclusive Luxury Real Estate</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-zinc-950">
  <!-- Header -->
  <header class="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-6 sm:px-12 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-sm">
        <i class="fa-solid fa-building"></i>
      </div>
      <div>
        <span class="font-extrabold text-base tracking-tight text-white block leading-tight">PROPERTIKITA</span>
        <span class="text-[10px] text-zinc-500 font-mono">Premium Real Estate</span>
      </div>
    </div>

    <nav class="hidden md:flex items-center gap-8 text-xs text-zinc-400 font-medium">
      <a href="#properti" class="hover:text-emerald-400 transition-colors">Koleksi Hunian</a>
      <a href="#kpr" class="hover:text-emerald-400 transition-colors">Simulasi KPR</a>
      <a href="#keunggulan" class="hover:text-emerald-400 transition-colors">Standar Kurasi</a>
      <a href="#kontak" class="hover:text-emerald-400 transition-colors">Kontak Agen</a>
    </nav>

    <button onclick="openTourModal()" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer">
      Jadwalkan Private Tour
    </button>
  </header>

  <!-- Hero Banner with Property Search -->
  <section class="relative py-20 px-6 max-w-5xl mx-auto text-center space-y-5">
    <span class="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest">
      Koleksi Residensial & Villa Eksklusif
    </span>
    <h1 class="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight">
      Temukan Hunian Mewah Impian di Lokasi Terbaik
    </h1>
    <p class="text-zinc-400 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
      Daftar properti premium terverifikasi legalitas dengan arsitektur elegan di kawasan strategis Jakarta, Bali, Bandung, dan Surabaya.
    </p>

    <!-- Search / Filter Card -->
    <div class="pt-4 max-w-3xl mx-auto">
      <div class="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
        <div>
          <label class="text-[10px] text-zinc-500 font-mono uppercase px-2">Tipe Properti</label>
          <select id="s-type" onchange="filterProperties()" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1">
            <option value="all">Semua Tipe</option>
            <option value="Villa">Villa Mewah</option>
            <option value="Rumah">Modern Residence</option>
            <option value="Penthouse">Penthouse & Apartemen</option>
          </select>
        </div>
        <div>
          <label class="text-[10px] text-zinc-500 font-mono uppercase px-2">Lokasi / Kota</label>
          <select id="s-city" onchange="filterProperties()" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 mt-1">
            <option value="all">Semua Kota</option>
            <option value="Jakarta">Jakarta Selatan</option>
            <option value="Bali">Badung, Bali</option>
            <option value="Bandung">Dago, Bandung</option>
          </select>
        </div>
        <div class="flex items-end">
          <button onclick="filterProperties()" class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span>Cari Properti</span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Property Grid -->
  <section id="properti" class="py-12 px-6 max-w-6xl mx-auto w-full space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">Properti Unggulan</h2>
        <p class="text-xs text-zinc-500">Hunian berlegalitas SHM/HGB terverifikasi siap huni</p>
      </div>
    </div>

    <div id="prop-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Injected via JavaScript -->
    </div>
  </section>

  <!-- Interactive Mortgage / KPR Simulator -->
  <section id="kpr" class="py-16 px-6 max-w-4xl mx-auto w-full space-y-8 border-t border-zinc-900">
    <div class="text-center space-y-1">
      <h2 class="text-2xl sm:text-3xl font-bold text-white">Simulasi Angsuran KPR</h2>
      <p class="text-xs text-zinc-500">Hitung estimasi cicilan bulanan sesuai harga properti dan tenor pinjaman</p>
    </div>

    <div class="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6 shadow-2xl">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-xs text-zinc-400 font-medium">Harga Properti (Rp):</label>
          <input type="number" id="kpr-price" value="3500000000" step="50000000" oninput="calculateKPR()" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500" />
        </div>

        <div class="space-y-2">
          <label class="text-xs text-zinc-400 font-medium">Uang Muka / DP (%):</label>
          <div class="flex items-center gap-3">
            <input type="range" id="kpr-dp" min="10" max="50" value="20" oninput="calculateKPR()" class="flex-1 accent-emerald-500" />
            <span id="kpr-dp-val" class="font-mono text-xs font-bold text-emerald-400 w-12 text-right">20%</span>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs text-zinc-400 font-medium">Suku Bunga KPR Efektif / Tahun (%):</label>
          <input type="number" id="kpr-rate" value="6.5" step="0.1" oninput="calculateKPR()" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500" />
        </div>

        <div class="space-y-2">
          <label class="text-xs text-zinc-400 font-medium">Jangka Waktu / Tenor:</label>
          <select id="kpr-tenor" onchange="calculateKPR()" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500">
            <option value="5">5 Tahun (60 Bulan)</option>
            <option value="10">10 Tahun (120 Bulan)</option>
            <option value="15" selected>15 Tahun (180 Bulan)</option>
            <option value="20">20 Tahun (240 Bulan)</option>
          </select>
        </div>
      </div>

      <!-- Result Card -->
      <div class="p-5 rounded-2xl bg-zinc-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs text-zinc-500 font-mono block">Estimasi Angsuran Bulanan:</span>
          <span id="kpr-monthly" class="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">Rp 24.380.000 / bln</span>
        </div>
        <button onclick="openTourModal()" class="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shrink-0">
          Konsultasi Pengajuan KPR
        </button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer id="kontak" class="mt-auto border-t border-zinc-900 bg-zinc-950 py-8 px-6 text-center text-xs text-zinc-500">
    <p>&copy; 2026 PropertiKita Real Estate. Anggota Asosiasi Real Estate Indonesia (REI).</p>
  </footer>

  <!-- Private Tour Modal -->
  <div id="tour-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden items-center justify-center p-4">
    <div class="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 class="font-bold text-white text-base">Jadwalkan Private Tour</h3>
        <button onclick="closeTourModal()" class="text-zinc-500 hover:text-white p-1"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form onsubmit="handleTourSubmit(event)" class="space-y-3 text-xs">
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Nama Lengkap:</label>
          <input type="text" id="t-name" required placeholder="Contoh: Hendra Kusuma" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        </div>
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Nomor WhatsApp / Telepon:</label>
          <input type="tel" id="t-phone" required placeholder="Contoh: 081234567890" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        </div>
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Unit Properti yang Diminati:</label>
          <select id="t-prop" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500">
            <option>Villa Canggu Oasis (Bali)</option>
            <option>The Senopati Residence (Jakarta)</option>
            <option>Dago Panoramic Hillside (Bandung)</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-zinc-400 font-medium">Rencana Tanggal Kunjungan:</label>
          <input type="date" id="t-date" required class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        </div>
        <button type="submit" class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs mt-2 transition-all flex items-center justify-center gap-2">
          <i class="fa-brands fa-whatsapp"></i> Konfirmasi ke Private Advisor
        </button>
      </form>
    </div>
  </div>

  <script>
    const properties = [
      {
        id: "p1",
        title: "Villa Canggu Oasis Tropical",
        type: "Villa",
        city: "Bali",
        price: 5800000000,
        beds: 4,
        baths: 4,
        area: 450,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop"
      },
      {
        id: "p2",
        title: "The Senopati Modern Residence",
        type: "Rumah",
        city: "Jakarta",
        price: 9200000000,
        beds: 5,
        baths: 5,
        area: 520,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop"
      },
      {
        id: "p3",
        title: "Dago Panoramic Hillside Retreat",
        type: "Rumah",
        city: "Bandung",
        price: 4200000000,
        beds: 3,
        baths: 3,
        area: 380,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"
      }
    ];

    function formatRupiah(num) {
      return 'Rp ' + Number(num).toLocaleString('id-ID');
    }

    function renderProperties(list) {
      const grid = document.getElementById('prop-grid');
      grid.innerHTML = list.map(p => \`
        <div class="rounded-3xl bg-zinc-900/60 border border-zinc-800 overflow-hidden space-y-4 p-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div class="space-y-3">
            <div class="aspect-16/10 rounded-2xl overflow-hidden bg-zinc-800 relative">
              <img src="\${p.image}" alt="\${p.title}" class="w-full h-full object-cover">
              <span class="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md text-emerald-400 font-bold text-[10px] px-2.5 py-1 rounded-md">\${p.city}</span>
            </div>
            <div>
              <span class="text-[10px] text-zinc-500 font-mono uppercase">\${p.type} Eksklusif</span>
              <h3 class="font-bold text-white text-base mt-0.5">\${p.title}</h3>
              <p class="text-emerald-400 font-extrabold text-sm mt-1">\${formatRupiah(p.price)}</p>
            </div>
            <div class="flex items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-800/60">
              <span><i class="fa-solid fa-bed text-zinc-500 mr-1"></i> \${p.beds} Kamar</span>
              <span><i class="fa-solid fa-bath text-zinc-500 mr-1"></i> \${p.baths} Mandi</span>
              <span><i class="fa-solid fa-ruler-combined text-zinc-500 mr-1"></i> \${p.area} m²</span>
            </div>
          </div>
          <button onclick="openTourModal('\${p.title}')" class="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 font-bold text-xs text-zinc-200 transition-colors">
            Jadwalkan Kunjungan
          </button>
        </div>
      \`).join('');
    }

    function filterProperties() {
      const type = document.getElementById('s-type').value;
      const city = document.getElementById('s-city').value;
      const filtered = properties.filter(p => {
        const matchType = type === 'all' || p.type === type;
        const matchCity = city === 'all' || p.city === city;
        return matchType && matchCity;
      });
      renderProperties(filtered);
    }

    function calculateKPR() {
      const price = parseFloat(document.getElementById('kpr-price').value) || 0;
      const dpPercent = parseFloat(document.getElementById('kpr-dp').value) || 20;
      document.getElementById('kpr-dp-val').textContent = dpPercent + '%';
      const annualRate = (parseFloat(document.getElementById('kpr-rate').value) || 6.5) / 100;
      const tenorYears = parseInt(document.getElementById('kpr-tenor').value) || 15;

      const principal = price * (1 - dpPercent / 100);
      const monthlyRate = annualRate / 12;
      const months = tenorYears * 12;

      let monthly = 0;
      if (monthlyRate > 0) {
        monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      } else {
        monthly = principal / months;
      }

      document.getElementById('kpr-monthly').textContent = formatRupiah(Math.round(monthly)) + ' / bln';
    }

    function openTourModal(propTitle) {
      if (propTitle) {
        const select = document.getElementById('t-prop');
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.includes(propTitle)) {
            select.selectedIndex = i;
            break;
          }
        }
      }
      const m = document.getElementById('tour-modal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    function closeTourModal() {
      const m = document.getElementById('tour-modal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    function handleTourSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('t-name').value;
      const phone = document.getElementById('t-phone').value;
      const prop = document.getElementById('t-prop').value;
      const date = document.getElementById('t-date').value;

      const msg = 'Halo PropertiKita, saya ingin menjadwalkan private viewing properti:\\n\\n' +
        'Nama: ' + name + '\\n' +
        'Kontak: ' + phone + '\\n' +
        'Unit Properti: ' + prop + '\\n' +
        'Rencana Tanggal: ' + date + '\\n\\n' +
        'Mohon konfirmasi ketersediaan advisor properti.';

      window.open('https://wa.me/6281234567890?text=' + encodeURIComponent(msg), '_blank');
      closeTourModal();
    }

    renderProperties(properties);
    calculateKPR();
  </script>
</body>
</html>`
  }
];
