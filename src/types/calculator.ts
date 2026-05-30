export interface CalculatorInput {
  modal: number;
  minatPekerjaan: string[];
  keahlianUtama: string[];
}

export interface BusinessRecommendation {
  nama: string;
  deskripsi: string;
  estimasiBiayaAwal: string;
  levelRisiko: 'Rendah' | 'Sedang' | 'Tinggi';
  potensiPendapatanBulanan: string;
  alasanKesesuaian: string;
}
