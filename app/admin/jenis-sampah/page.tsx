"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";

interface Penjemputan {
  id: string;
  tanggalJemput: string;
  status: string;
  laporan: {
    id: string;
    alamat: string;
    beratKg: number | null;
    user: { nama: string; noHp: string };
    jenisSampah: { namaJenis: string };
    wilayah: { namaWilayah: string };
  };
  petugas: {
    nama: string;
  };
}

export default function PenjemputanPage() {
  const [penjemputanList, setPenjemputanList] = useState<Penjemputan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPenjemputan = async () => {
    try {
      setError("");
      const res = await fetch("/api/penjemputan");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal memuat jadwal penjemputan.");
      }

      setPenjemputanList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat penjemputan:", err);
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
    fetchPenjemputan();
  }, []);

  const formatTanggal = (tanggal: string) => {
    if (!tanggal) return "Jadwal belum ditentukan";

    const date = new Date(tanggal);
    if (Number.isNaN(date.getTime())) return "Tanggal tidak valid";

    return date.toLocaleString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status: string): CSSProperties => {
    const value = status?.toUpperCase() || "";

    if (value.includes("SELESAI") || value.includes("DIANGKUT")) {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (value.includes("BATAL") || value.includes("TOLAK")) {
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      background: "#fef3c7",
      color: "#92400e",
    };
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
            <p style={styles.eyebrow}>PENGELOLAAN OPERASIONAL</p>
            <h1 style={styles.title}>Jadwal Penjemputan</h1>
            <p style={styles.subtitle}>
              Pantau jadwal pengangkutan dan informasi petugas yang bertugas.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPenjemputan}
            style={styles.refreshButton}
          >
            ↻ <span>Muat ulang</span>
          </button>
        </div>

        <div style={styles.summary}>
          <div style={styles.summaryIcon}>▣</div>
          <div>
            <p style={styles.summaryLabel}>Total jadwal</p>
            <p style={styles.summaryValue}>{penjemputanList.length}</p>
          </div>
        </div>

        {loading ? (
          <div style={styles.messageBox}>
            <div style={styles.spinner} />
            <p style={styles.messageTitle}>Memuat jadwal...</p>
            <p style={styles.messageText}>
              Sedang mengambil data penjemputan sampah.
            </p>
          </div>
        ) : error ? (
          <div style={styles.messageBox}>
            <div style={styles.messageIconError}>!</div>
            <p style={styles.messageTitle}>Data belum bisa ditampilkan</p>
            <p style={styles.messageText}>{error}</p>
            <button
              type="button"
              onClick={fetchPenjemputan}
              style={styles.retryButton}
            >
              Coba lagi
            </button>
          </div>
        ) : penjemputanList.length === 0 ? (
          <div style={styles.messageBox}>
            <div style={styles.emptyIcon}>▤</div>
            <p style={styles.messageTitle}>Belum ada jadwal penjemputan</p>
            <p style={styles.messageText}>
              Jadwal yang sudah dibuat akan muncul di halaman ini.
            </p>
          </div>
        ) : (
          <div style={styles.cardGrid}>
            {penjemputanList.map((item) => (
              <article key={item.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.cardTopText}>
                    <p style={styles.cardLabel}>JADWAL PENJEMPUTAN</p>
                    <h2 style={styles.cardTitle}>
                      {item.laporan?.jenisSampah?.namaJenis || "Jenis sampah"}
                    </h2>
                  </div>

                  <span style={{ ...styles.status, ...getStatusStyle(item.status) }}>
                    {item.status || "MENUNGGU"}
                  </span>
                </div>

                <div style={styles.datePanel}>
                  <span style={styles.dateIcon}>◷</span>
                  <div>
                    <p style={styles.detailLabel}>Waktu penjemputan</p>
                    <p style={styles.dateText}>
                      {formatTanggal(item.tanggalJemput)}
                    </p>
                  </div>
                </div>

                <div style={styles.details}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailIcon}>⚖</span>
                    <div>
                      <p style={styles.detailLabel}>Berat sampah</p>
                      <p style={styles.detailValue}>
                        {item.laporan?.beratKg ?? "-"} kg
                      </p>
                    </div>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.detailIcon}>⌖</span>
                    <div>
                      <p style={styles.detailLabel}>Wilayah</p>
                      <p style={styles.detailValue}>
                        {item.laporan?.wilayah?.namaWilayah || "-"}
                      </p>
                    </div>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.detailIcon}>⌂</span>
                    <div>
                      <p style={styles.detailLabel}>Alamat penjemputan</p>
                      <p style={styles.detailValue}>
                        {item.laporan?.alamat || "Alamat belum tersedia"}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={styles.peoplePanel}>
                  <div style={styles.person}>
                    <div style={styles.avatar}>P</div>
                    <div>
                      <p style={styles.detailLabel}>Pelapor</p>
                      <p style={styles.personName}>
                        {item.laporan?.user?.nama || "-"}
                      </p>
                      <p style={styles.personPhone}>
                        {item.laporan?.user?.noHp || "-"}
                      </p>
                    </div>
                  </div>

                  <div style={styles.personDivider} />

                  <div style={styles.person}>
                    <div style={{ ...styles.avatar, background: "#d1fae5" }}>
                      ♙
                    </div>
                    <div>
                      <p style={styles.detailLabel}>Petugas bertugas</p>
                      <p style={styles.personName}>
                        {item.petugas?.nama || "Belum ditentukan"}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
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
    whiteSpace: "nowrap",
  },
  summary: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    width: "fit-content",
    minWidth: "190px",
    padding: "16px 20px",
    marginBottom: "24px",
    background: "#ffffff",
    border: "1px solid #e1eae4",
    borderRadius: "13px",
    boxShadow: "0 3px 12px rgba(22, 65, 43, 0.04)",
  },
  summaryIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    display: "grid",
    placeItems: "center",
    background: "#e3f5e9",
    color: "#08784e",
    fontSize: "21px",
  },
  summaryLabel: {
    margin: 0,
    color: "#7b8981",
    fontSize: "12px",
  },
  summaryValue: {
    margin: "3px 0 0",
    color: "#18352b",
    fontSize: "23px",
    fontWeight: 800,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    minWidth: 0,
    padding: "21px",
    background: "#ffffff",
    border: "1px solid #e1eae4",
    borderRadius: "15px",
    boxShadow: "0 5px 18px rgba(22, 65, 43, 0.05)",
  },
  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
    paddingBottom: "17px",
    borderBottom: "1px solid #edf1ee",
  },
  cardTopText: {
    minWidth: 0,
  },
  cardLabel: {
    margin: "0 0 6px",
    color: "#87958c",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "1px",
  },
  cardTitle: {
    margin: 0,
    color: "#1d3b2e",
    fontSize: "18px",
    fontWeight: 800,
    overflowWrap: "anywhere",
  },
  status: {
    flexShrink: 0,
    padding: "6px 9px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.3px",
  },
  datePanel: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    margin: "16px 0",
    padding: "13px",
    borderRadius: "10px",
    background: "#f1f8f3",
  },
  dateIcon: {
    color: "#168257",
    fontSize: "21px",
    lineHeight: 1,
  },
  dateText: {
    margin: "4px 0 0",
    color: "#24533d",
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1.5,
  },
  details: {
    display: "grid",
    gap: "15px",
    padding: "2px 0 18px",
  },
  detailRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
  },
  detailIcon: {
    width: "28px",
    height: "28px",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "8px",
    background: "#f1f5f2",
    color: "#527060",
    fontSize: "15px",
  },
  detailLabel: {
    margin: 0,
    color: "#849188",
    fontSize: "11px",
    lineHeight: 1.4,
  },
  detailValue: {
    margin: "3px 0 0",
    color: "#344b3e",
    fontSize: "13px",
    fontWeight: 600,
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },
  peoplePanel: {
    padding: "15px 0 0",
    borderTop: "1px solid #edf1ee",
    display: "grid",
    gap: "13px",
  },
  person: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
  },
  avatar: {
    width: "34px",
    height: "34px",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    background: "#e4f0e8",
    color: "#176b4a",
    fontSize: "13px",
    fontWeight: 800,
  },
  personName: {
    margin: "2px 0 0",
    color: "#304b3c",
    fontSize: "12px",
    fontWeight: 700,
  },
  personPhone: {
    margin: "2px 0 0",
    color: "#829087",
    fontSize: "11px",
  },
  personDivider: {
    height: "1px",
    background: "#f0f3f1",
  },
  messageBox: {
    minHeight: "220px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 20px",
    background: "#ffffff",
    border: "1px solid #e1eae4",
    borderRadius: "15px",
    textAlign: "center",
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #dcebe1",
    borderTopColor: "#168257",
    borderRadius: "50%",
    marginBottom: "15px",
  },
  messageTitle: {
    margin: "10px 0 0",
    color: "#254333",
    fontSize: "16px",
    fontWeight: 800,
  },
  messageText: {
    maxWidth: "430px",
    margin: "7px 0 0",
    color: "#7c8981",
    fontSize: "13px",
    lineHeight: 1.6,
  },
  messageIconError: {
    width: "38px",
    height: "38px",
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: "20px",
    fontWeight: 800,
  },
  emptyIcon: {
    color: "#8aa998",
    fontSize: "35px",
  },
  retryButton: {
    marginTop: "17px",
    padding: "9px 16px",
    border: 0,
    borderRadius: "8px",
    background: "#08784e",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },
};