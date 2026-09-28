// app/profile-petugas/page.tsx

import React from 'react';

const petugasData = {
  id: 1,
  userId: 105,
  nama: 'Budi Santoso',
  email: 'budi.petugas@example.com', 
  role: 'Petugas Lapangan', 
  noHp: '081234567890',
  status: 'Aktif',
};

export default function ProfilePetugasPage() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '3rem 1rem', 
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#1e293b'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        {/* Header Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
            Profil Petugas
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            
          </p>
        </div>

        {/* Card Utama */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          padding: '2rem', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' 
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              marginRight: '1rem' 
            }}>
              {petugasData.nama.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>{petugasData.nama}</h2>
              <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: '500' }}>{petugasData.role}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>EMAIL AKUN (USER)</span>
              <strong style={{ fontSize: '0.95rem', color: '#334155' }}>{petugasData.email}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>NOMOR TELEPON</span>
              <strong style={{ fontSize: '0.95rem', color: '#334155' }}>{petugasData.noHp}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>STATUS</span>
              <span style={{ 
                backgroundColor: '#dcfce7', 
                color: '#15803d', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '9999px', 
                fontSize: '0.8rem', 
                fontWeight: '600',
                display: 'inline-block'
              }}>
                {petugasData.status}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>USER ID (RELASI)</span>
              <strong style={{ fontSize: '0.95rem', color: '#334155' }}>#{petugasData.userId}</strong>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}