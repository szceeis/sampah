// app/detail-kategori/page.tsx

import React from 'react';

// Simulasi data One-to-Many: 1 Jenis Sampah punya Banyak Laporan Sampah
const kategoriData = {
  id: 1,
  namaJenis: 'Plastik Botol',
  kategori: 'Anorganik',
  totalLaporan: 3,
  laporanList: [
    { id: 101, warga: 'Ahmad', alamat: 'Jl. Melati No. 12', berat: '2.5 kg', status: 'Selesai' },
    { id: 102, warga: 'Siti', alamat: 'Jl. Mawar No. 5', berat: '1.0 kg', status: 'Proses' },
    { id: 103, warga: 'Joko', alamat: 'Jl. Kenanga No. 8', berat: '4.2 kg', status: 'Menunggu' },
  ]
};

export default function DetailKategoriPage() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '3rem 1.5rem', 
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#1e293b'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
            Detail Jenis Sampah 
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
        
          </p>
        </div>

        {/* Card Info Utama */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          padding: '1.5rem 2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' 
        }}>
          <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Kategori: {kategoriData.kategori}
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: '0.25rem 0 1rem 0' }}>
            {kategoriData.namaJenis}
          </h2>
          <div style={{ display: 'inline-block', backgroundColor: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
            Total Terkait: <strong>{kategoriData.totalLaporan} Laporan Sampah</strong>
          </div>
        </div>

        {/* List / Tabel Data 'Many' */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' 
        }}>
          <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#334155', margin: 0 }}>
              Daftar Laporan dengan Jenis Sampah Ini :
            </h3>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '1rem 1.5rem' }}>ID Laporan</th>
                <th style={{ padding: '1rem 1.5rem' }}>Pelapor</th>
                <th style={{ padding: '1rem 1.5rem' }}>Alamat</th>
                <th style={{ padding: '1rem 1.5rem' }}>Berat</th>
                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {kategoriData.laporanList.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>#{item.id}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{item.warga}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{item.alamat}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{item.berat}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      backgroundColor: item.status === 'Selesai' ? '#dcfce7' : item.status === 'Proses' ? '#e0f2fe' : '#fef3c7',
                      color: item.status === 'Selesai' ? '#15803d' : item.status === 'Proses' ? '#0369a1' : '#b45309',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}