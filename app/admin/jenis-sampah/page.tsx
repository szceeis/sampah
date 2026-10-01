"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";

interface JenisSampah {
  id: string;
  namaJenis: string;
  hargaPerKg: number;
  deskripsi?: string;
}

export default function JenisSampahPage() {
  const [jenisSampahList, setJenisSampahList] = useState<JenisSampah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State form tambah jenis sampah baru
  const [namaJenis, setNamaJenis] = useState("");
  const [hargaPerKg, setHargaPerKg] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchJenisSampah = async () => {
    try {
      setError("");
      const res = await fetch("/api/jenis-sampah");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal memuat data jenis sampah.");
      }

      setJenisSampahList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat jenis sampah:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memuat data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJenisSampah();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaJenis || !hargaPerKg) {
      alert("Nama jenis sampah dan harga wajib diisi!");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/jenis-sampah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaJenis,
          hargaPerKg: Number(hargaPerKg),
          deskripsi,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menambahkan jenis sampah");
      }

      // Reset form & muat ulang data
      setNamaJenis("");
      setHargaPerKg("");
      setDeskripsi("");
      fetchJenisSampah();
      alert("Jenis sampah berhasil ditambahkan!");
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <main style={styles.page}>
      <header style={styles.navbar}>
        <div style={styles.navbarInner}>
          <Link href="/admin/dashboard" style={styles.brand}>
            <span style={styles.brandIcon}>♻</span>
            <span>
              <strong style={styles.brandName}>Setor Sampah</strong>
              <small style={styles.brandCaption}>Panel Admin</small>
            </span>
          </Link>

          <Link href="/admin/dashboard" style={styles.backButton}>
            <span aria-hidden="true">←</span>
            Kembali ke Dashboard
          </Link>
        </div>
      </header>

      <section style={styles.container}>
        <div style={styles.heading}>
          <div>
            <p style={styles.eyebrow}>PENGELOLAAN DATA</p>
            <h1 style={styles.title}>Jenis Sampah & Harga</h1>
            <p style={styles.subtitle}>
              Atur jenis sampah dan nominal insentif atau harga per kg.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchJenisSampah}
            style={styles.refreshButton}
          >
            ↻ <span>Muat ulang</span>
          </button>
        </div>

        {/* Layout Grid: Form Tambah di Kiri, Daftar di Kanan */}
        <div style={styles.contentGrid}>
          {/* Form Tambah Jenis Sampah */}
          <div style={styles.formCard}>
            <h2 style={styles.cardSectionTitle}>Tambah Jenis Sampah</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nama Jenis Sampah</label>
                <input
                  type="text"
                  placeholder="Contoh: Plastik / Kertas"
                  value={namaJenis}
                  onChange={(e) => setNamaJenis(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Harga / Insentif per Kg (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 3500"
                  value={hargaPerKg}
                  onChange={(e) => setHargaPerKg(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Deskripsi (Opsional)</label>
                <textarea
                  placeholder="Keterangan singkat jenis sampah..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  style={styles.textarea}
                />
              </div>

              <button type="submit" disabled={submitting} style={styles.submitButton}>
                {submitting ? "Menyimpan..." : "Simpan Jenis Sampah"}
              </button>
            </form>
          </div>

          {/* List Daftar Jenis Sampah */}
          <div style={styles.listContainer}>
            <h2 style={styles.cardSectionTitle}>Daftar Kategori Sampah</h2>
            {loading ? (
              <div style={styles.messageBox}>
                <div style={styles.spinner} />
                <p style={styles.messageText}>Memuat data...</p>
              </div>
            ) : error ? (
              <div style={styles.messageBox}>
                <p style={{ color: "#b91c1c" }}>{error}</p>
              </div>
            ) : jenisSampahList.length === 0 ? (
              <div style={styles.messageBox}>
                <p style={styles.messageText}>Belum ada data jenis sampah.</p>
              </div>
            ) : (
              <div style={styles.cardGrid}>
                {jenisSampahList.map((item) => (
                  <article key={item.id} style={styles.card}>
                    <div>
                      <span style={styles.badge}>Aktif</span>
                      <h3 style={styles.itemTitle}>{item.namaJenis}</h3>
                      {item.deskripsi && (
                        <p style={styles.itemDesc}>{item.deskripsi}</p>
                      )}
                    </div>
                    <div style={styles.priceBox}>
                      <span style={styles.priceLabel}>Harga / kg</span>
                      <span style={styles.priceValue}>{formatRupiah(item.hargaPerKg)}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: { [key: string]: CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "#f3f7f4",
    color: "#18352b",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  navbar: {
    width: "100%",
    background: "#ffffff",
    borderBottom: "1px solid #e1eae4",
  },
  navbarInner: {
    maxWidth: "1180px",
    minHeight: "74px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    textDecoration: "none",
    color: "#08784e",
  },
  brandIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "grid",
    placeItems: "center",
    background: "#e0f4e8",
    color: "#08784e",
    fontSize: "23px",
  },
  brandName: {
    display: "block",
    fontSize: "16px",
    lineHeight: 1.3,
  },
  brandCaption: {
    display: "block",
    color: "#75877d",
    fontSize: "11px",
    marginTop: "2px",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    border: "1px solid #d7e5dc",
    borderRadius: "9px",
    color: "#176b4a",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 600,
    background: "#ffffff",
  },
  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "38px 24px 60px",
  },
  heading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    marginBottom: "25px",
  },
  eyebrow: {
    margin: "0 0 8px",
    color: "#168257",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.3px",
  },
  title: {
    margin: 0,
    color: "#18352b",
    fontSize: "30px",
    lineHeight: 1.2,
    fontWeight: 800,
  },
  subtitle: {
    margin: "9px 0 0",
    color: "#718078",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  refreshButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    border: "1px solid #cfe2d6",
    borderRadius: "9px",
    color: "#176b4a",
    background: "#ffffff",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "24px",
    alignItems: "start",
  },
  formCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "15px",
    border: "1px solid #e1eae4",
    boxShadow: "0 3px 12px rgba(22, 65, 43, 0.04)",
  },
  listContainer: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "15px",
    border: "1px solid #e1eae4",
    boxShadow: "0 3px 12px rgba(22, 65, 43, 0.04)",
  },
  cardSectionTitle: {
    margin: "0 0 18px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#18352b",
  },
  form: {
    display: "grid",
    gap: "16px",
  },
  inputGroup: {
    display: "grid",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#4a6355",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d2e0d7",
    fontSize: "13px",
    outline: "none",
  },
  textarea: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d2e0d7",
    fontSize: "13px",
    outline: "none",
    minHeight: "80px",
    resize: "vertical",
  },
  submitButton: {
    background: "#08784e",
    color: "#ffffff",
    padding: "11px",
    border: 0,
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "13px",
    marginTop: "6px",
  },
  cardGrid: {
    display: "grid",
    gap: "14px",
  },
  card: {
    padding: "16px",
    background: "#f9fbfa",
    border: "1px solid #e5ede7",
    borderRadius: "11px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    background: "#dcfce7",
    color: "#166534",
    fontSize: "10px",
    fontWeight: 800,
    padding: "3px 8px",
    borderRadius: "20px",
  },
  itemTitle: {
    margin: "8px 0 4px",
    fontSize: "16px",
    fontWeight: 800,
    color: "#1c3b2e",
  },
  itemDesc: {
    margin: 0,
    fontSize: "12px",
    color: "#738a7e",
  },
  priceBox: {
    textAlign: "right",
  },
  priceLabel: {
    display: "block",
    fontSize: "11px",
    color: "#84968c",
  },
  priceValue: {
    display: "block",
    fontSize: "15px",
    fontWeight: 800,
    color: "#08784e",
    marginTop: "2px",
  },
  messageBox: {
    padding: "30px",
    textAlign: "center",
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: "3px solid #dcebe1",
    borderTopColor: "#168257",
    borderRadius: "50%",
    margin: "0 auto 10px",
  },
  messageText: {
    color: "#7c8981",
    fontSize: "13px",
  },
};