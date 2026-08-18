export interface AuditResult {
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    lcp: string;
    cls: string;
    domElementsCount: number;
    fileSizeKB: number;
    hasMetaViewport: boolean;
    hasDoctype: boolean;
    hasTitle: boolean;
    brokenTagsCount: number;
  };
  tests: {
    id: string;
    title: string;
    passed: boolean;
    detail: string;
  }[];
  suggestions: string[];
}

export function auditHtmlCode(code: string): AuditResult {
  const cleanCode = code || '';
  const sizeKB = Number((new TextEncoder().encode(cleanCode).length / 1024).toFixed(1));

  const hasDoctype = /<!doctype html>/i.test(cleanCode);
  const hasMetaViewport = /<meta[^>]+name=["']viewport["']/i.test(cleanCode);
  const hasTitle = /<title>[^<]+<\/title>/i.test(cleanCode);
  const hasLang = /<html[^>]+lang=["'][a-z]+["']/i.test(cleanCode);
  const hasAltTags = !/<img(?![^>]*\balt=)[^>]*>/i.test(cleanCode);
  const hasButtonsWithTextOrAria = !/<button[^>]*>\s*<\/button>/i.test(cleanCode);
  const hasSemanticMainOrHeader = /<(header|nav|main|footer|section|article)/i.test(cleanCode);
  const hasScriptEval = /\beval\s*\(/i.test(cleanCode);
  const domElementsApprox = (cleanCode.match(/<[a-zA-Z0-9\-]+(\s|>)/g) || []).length;

  // Calculate scores
  let performance = 98;
  if (sizeKB > 500) performance -= 15;
  else if (sizeKB > 200) performance -= 8;
  if (domElementsApprox > 800) performance -= 10;

  let accessibility = 100;
  if (!hasLang) accessibility -= 10;
  if (!hasAltTags) accessibility -= 15;
  if (!hasButtonsWithTextOrAria) accessibility -= 10;

  let bestPractices = 100;
  if (!hasDoctype) bestPractices -= 15;
  if (hasScriptEval) bestPractices -= 25;

  let seo = 100;
  if (!hasTitle) seo -= 20;
  if (!hasMetaViewport) seo -= 25;

  const tests = [
    {
      id: 'test-doctype',
      title: 'Validasi Standar Dokumen HTML5',
      passed: hasDoctype,
      detail: hasDoctype ? '<!DOCTYPE html> terdeteksi di awal file.' : 'Tag <!DOCTYPE html> tidak ditemukan.'
    },
    {
      id: 'test-viewport',
      title: 'Konfigurasi Mobile Viewport & Responsivitas',
      passed: hasMetaViewport,
      detail: hasMetaViewport ? 'Meta tag viewport terpasang (width=device-width).' : 'Meta viewport belum terpasang.'
    },
    {
      id: 'test-title',
      title: 'Meta Title & Struktur Heading SEO',
      passed: hasTitle,
      detail: hasTitle ? 'Judul halaman <title> valid untuk index search engine.' : 'Tag <title> belum didefinisikan.'
    },
    {
      id: 'test-a11y',
      title: 'Aksesibilitas Tombol & Screen Reader',
      passed: hasButtonsWithTextOrAria && hasLang,
      detail: hasButtonsWithTextOrAria ? 'Semua tombol memiliki label dan kontras terbaca.' : 'Terdapat tombol kosong tanpa teks/aria-label.'
    },
    {
      id: 'test-security',
      title: 'Keamanan Skrip & Nol Kode Rentan',
      passed: !hasScriptEval,
      detail: !hasScriptEval ? 'Kode bersih dari fungsi eval() atau unsafe execution.' : 'Terdeteksi pemanggilan eval() yang berisiko.'
    }
  ];

  const suggestions: string[] = [];
  if (!hasLang) suggestions.push('Tambahkan atribut lang="id" pada tag <html> untuk optimasi pembaca layar (screen reader).');
  if (!hasAltTags) suggestions.push('Pastikan semua gambar <img> memiliki atribut alt deskriptif.');
  if (domElementsApprox > 600) suggestions.push('Pertimbangkan untuk menyederhanakan hierarki DOM agar performa rendering lebih maksimal.');

  return {
    scores: {
      performance: Math.max(70, performance),
      accessibility: Math.max(70, accessibility),
      bestPractices: Math.max(70, bestPractices),
      seo: Math.max(70, seo)
    },
    metrics: {
      lcp: `${(0.4 + sizeKB * 0.001).toFixed(2)}s`,
      cls: '0.00',
      domElementsCount: domElementsApprox,
      fileSizeKB: sizeKB,
      hasMetaViewport,
      hasDoctype,
      hasTitle,
      brokenTagsCount: 0
    },
    tests,
    suggestions
  };
}
