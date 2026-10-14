export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Ambil semua angka dari string rentang seperti "Rp 1.500.000 - Rp 3.000.000"
export function parseIDRRange(text: string): number[] {
  return (text.match(/\d[\d.,]*/g) ?? [])
    .map((s) => parseInt(s.replace(/[.,]/g, ''), 10))
    .filter((n) => n >= 1000);
}
