// app/penanganan-laporan/page.tsx

import React from 'react';

// Simulasi data Many-to-Many lewat tabel perantara (Penanganan / Penjemputan)
const penangananData = {
  idJadwal: 501,
  tanggal: '24 Agustus 2026',
  status: 'Sedang Berjalan',
  petugasList: [
    { id: 1, nama: 'Budi Santoso', role: 'Petugas Lapangan' },
    { id: 2, nama: 'Siti Aminah', role: 'Koordinator Wilayah' },
  ],
  laporanList: [
    { id: 101, warga: 'Ahmad', alamat: 'Jl. Melati No. 12', jenis: 'Plastik Botol' },
    { id: 102, warga: 'Joko', alamat: 'Jl. Kenanga No. 8', jenis: 'Kardus Bekas' },
  ]
};

export default function ManyToManyPage() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '3rem 1.5rem', 
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#1e293b'
    }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
            Penanganan Laporan 
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
        
          </p>
        </div>

        {/* Grid Informasi Many-to-Many */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Kolom Petugas (Banyak) */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            padding: '1.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' 
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#334155', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              Daftar Petugas (Banyak):
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {penangananData.petugasList.map((p) => (
                <li key={p.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #f8fafc' }}>
                  <strong style={{ display: 'block', color: '#0f172a' }}>{p.nama}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.role}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom Laporan (Banyak) */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            padding: '1.5rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' 
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#334155', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              Menangani Laporan (Banyak):
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {penangananData.laporanList.map((l) => (
                <li key={l.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #f8fafc' }}>
                  <strong style={{ display: 'block', color: '#0f172a' }}>#{l.id} - {l.warga}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{l.alamat} ({l.jenis})</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Info Hubungan */}
        <div style={{ 
          backgroundColor: '#eff6ff', 
          border: '1px solid #bfdbfe', 
          borderRadius: '8px', 
          padding: '1rem 1.5rem',
          fontSize: '0.9rem',
          color: '#1e40af'
        }}>
          <strong>Catatan Relasi:</strong> Satu tim petugas bisa dikerahkan untuk menyelesaikan berbagai laporan warga sekaligus secara bersamaan.
        </div>

      </div>
    </main>
  );
}