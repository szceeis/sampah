"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

interface Penjemputan {
  id: string;
  tanggalJemput: string;
  status: string;
  laporan: {
    id: string;
    alamat: string;
    beratKg: number;
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

  const fetchPenjemputan = useCallback(async () => {
    setError("");

    try {
      const res = await fetch("/api/penjemputan");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal memuat data penjemputan.");
      }

      setPenjemputanList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat penjemputan", err);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memuat data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPenjemputan();
  }, [fetchPenjemputan]);

  const formatTanggal = (tanggal: string) => {
    if (!tanggal) return "-";

    const parsedDate = new Date(tanggal);
    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status: string) => {
    const value = (status || "").toUpperCase();

    if (value.includes("SELESAI") || value.includes("DIANGKUT")) {
      return {
        background: "#e8f5ed",
        color: "#187345",
        dot: "#23965d",
      };
    }

    if (value.includes("BATAL") || value.includes("TOLAK")) {
      return {
        background: "#fff0f0",
        color: "#b42318",
        dot: "#e04444",
      };
    }

    if (value.includes("JALAN") || value.includes("PROSES")) {
      return {
        background: "#eaf2ff",
        color: "#2459b3",
        dot: "#3978d4",
      };
    }

    return {
      background: "#fff5df",
      color: "#956000",
      dot: "#e6a126",
    };
  };

  const jumlahTerjadwal = penjemputanList.filter((item) => {
    const status = (item.status || "").toUpperCase();
    return !status.includes("SELESAI") && !status.includes("BATAL");
  }).length;

  const jumlahSelesai = penjemputanList.filter((item) => {
    const status = (item.status || "").toUpperCase();
    return status.includes("SELESAI") || status.includes("DIANGKUT");
  }).length;

  const jumlahBatal = penjemputanList.filter((item) => {
    const status = (item.status || "").toUpperCase();
    return status.includes("BATAL") || status.includes("TOLAK");
  }).length;

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loadingBox}>
          <div style={styles.loadingIcon}>♻</div>
          <h2 style={styles.loadingTitle}>Memuat jadwal...</h2>
          <p style={styles.mutedText}>
            Sedang mengambil data penjemputan.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.brandBlock}>
            <div style={styles.brandIcon}>♻</div>
            <div>
              <div style={styles.brandName}>Setor Sampah</div>
              <div style={styles.brandSub}>Panel Administrator</div>
            </div>
          </div>

          <Link href="/admin/dashboard" style={styles.backLink}>
            <span aria-hidden="true">←</span>
            Kembali ke Dashboard
          </Link>
        </header>

        <section style={styles.pageIntro}>
          <div>
            <div style={styles.eyebrow}>PENGELOLAAN OPERASIONAL</div>
            <h1 style={styles.title}>Jadwal Penjemputan</h1>
            <p style={styles.subtitle}>
              Pantau jadwal pengangkutan sampah dan informasi petugas yang
              bertugas.
            </p>
          </div>

          <button onClick={fetchPenjemputan} style={styles.refreshButton}>
            <span aria-hidden="true">↻</span> Muat Ulang
          </button>
        </section>

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#eaf2ff", color: "#3267bd" }}>
              ▣
            </div>
            <div>
              <div style={styles.statLabel}>Total Jadwal</div>
              <div style={styles.statValue}>{penjemputanList.length}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#fff4df", color: "#ad7200" }}>
              ◷
            </div>
            <div>
              <div style={styles.statLabel}>Terjadwal / Berjalan</div>
              <div style={styles.statValue}>{jumlahTerjadwal}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#e8f5ed", color: "#16834b" }}>
              ✓
            </div>
            <div>
              <div style={styles.statLabel}>Selesai</div>
              <div style={styles.statValue}>{jumlahSelesai}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#fff0f0", color: "#c33b3b" }}>
              ×
            </div>
            <div>
              <div style={styles.statLabel}>Dibatalkan</div>
              <div style={styles.statValue}>{jumlahBatal}</div>
            </div>
          </div>
        </section>

        <section style={styles.listSection}>
          <div style={styles.listHeader}>
            <div>
              <h2 style={styles.listTitle}>Daftar Penjemputan</h2>
              <p style={styles.listSubtitle}>
                Rincian jadwal, laporan warga, dan petugas.
              </p>
            </div>

            <span style={styles.countBadge}>
              {penjemputanList.length} jadwal
            </span>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <strong>Data tidak berhasil dimuat.</strong>
              <div>{error}</div>
              <button onClick={fetchPenjemputan} style={styles.errorRetry}>
                Coba lagi
              </button>
            </div>
          )}

          {!error && penjemputanList.length === 0 && (
            <div style={styles.emptyBox}>
              <div style={styles.emptyIcon}>▣</div>
              <h3 style={styles.emptyTitle}>Belum ada jadwal penjemputan</h3>
              <p style={styles.mutedText}>
                Jadwal yang dibuat dari laporan warga akan muncul di halaman ini.
              </p>
              <Link href="/admin/penanganan" style={styles.emptyLink}>
                Lihat laporan masuk →
              </Link>
            </div>
          )}

          <div style={styles.cards}>
            {penjemputanList.map((item) => {
              const statusStyle = getStatusStyle(item.status);

              return (
                <article key={item.id} style={styles.scheduleCard}>
                  <div style={styles.cardTop}>
                    <div style={styles.cardHeading}>
                      <div style={styles.cardIcon}>🚚</div>
                      <div>
                        <div style={styles.cardEyebrow}>JADWAL PENJEMPUTAN</div>
                        <h3 style={styles.cardTitle}>
                          {item.laporan?.jenisSampah?.namaJenis ||
                            "Jenis sampah"}
                        </h3>
                      </div>
                    </div>

                    <span
                      style={{
                        ...styles.statusBadge,
                        background: statusStyle.background,
                        color: statusStyle.color,
                      }}
                    >
                      <span
                        style={{
                          ...styles.statusDot,
                          background: statusStyle.dot,
                        }}
                      />
                      {item.status || "MENUNGGU"}
                    </span>
                  </div>

                  <div style={styles.datePanel}>
                    <div style={styles.dateIcon}>▦</div>
                    <div>
                      <div style={styles.dateLabel}>Tanggal dan waktu jemput</div>
                      <div style={styles.dateValue}>
                        {formatTanggal(item.tanggalJemput)}
                      </div>
                    </div>
                  </div>

                  <div style={styles.detailsGrid}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>⚖</span>
                      <div>
                        <div style={styles.detailLabel}>Berat sampah</div>
                        <div style={styles.detailValue}>
                          {Number(item.laporan?.beratKg || 0).toLocaleString(
                            "id-ID",
                            { maximumFractionDigits: 2 }
                          )}{" "}
                          kg
                        </div>
                      </div>
                    </div>

                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>⌖</span>
                      <div>
                        <div style={styles.detailLabel}>Wilayah</div>
                        <div style={styles.detailValue}>
                          {item.laporan?.wilayah?.namaWilayah || "-"}
                        </div>
                      </div>
                    </div>

                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>⌂</span>
                      <div>
                        <div style={styles.detailLabel}>Alamat penjemputan</div>
                        <div style={styles.detailValue}>
                          {item.laporan?.alamat || "-"}
                        </div>
                      </div>
                    </div>

                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>♙</span>
                      <div>
                        <div style={styles.detailLabel}>Pelapor</div>
                        <div style={styles.detailValue}>
                          {item.laporan?.user?.nama || "-"}
                        </div>
                        <div style={styles.detailSub}>
                          {item.laporan?.user?.noHp || "Nomor HP tidak tersedia"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={styles.cardBottom}>
                    <div style={styles.officerBlock}>
                      <div style={styles.officerAvatar}>P</div>
                      <div>
                        <div style={styles.officerLabel}>Petugas bertugas</div>
                        <div style={styles.officerName}>
                          {item.petugas?.nama || "Belum ditentukan"}
                        </div>
                      </div>
                    </div>

                    <div style={styles.scheduleId}>
                      Kode: {item.id.slice(0, 8).toUpperCase()}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <footer style={styles.footer}>
          Setor Sampah <span>·</span> Panel Administrator
        </footer>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f3f7f4",
    color: "#20342a",
    fontFamily: "Arial, Helvetica, sans-serif",
    padding: "0 22px 40px",
  },
  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
  },
  header: {
    minHeight: "76px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    borderBottom: "1px solid #dfe9e1",
    marginBottom: "30px",
  },
  brandBlock: { display: "flex", alignItems: "center", gap: "10px" },
  brandIcon: {
    width: "39px",
    height: "39px",
    borderRadius: "11px",
    display: "grid",
    placeItems: "center",
    background: "#dff2e6",
    color: "#087847",
    fontSize: "23px",
  },
  brandName: { fontSize: "15px", fontWeight: 800, color: "#174b32" },
  brandSub: { fontSize: "11px", color: "#829188", marginTop: "3px" },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 13px",
    background: "#fff",
    border: "1px solid #dce7de",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#365744",
    fontSize: "12px",
    fontWeight: 700,
  },
  pageIntro: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    marginBottom: "23px",
  },
  eyebrow: {
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.4px",
    color: "#198452",
    marginBottom: "8px",
  },
  title: { fontSize: "27px", fontWeight: 800, margin: 0, color: "#1e3529" },
  subtitle: {
    fontSize: "13px",
    lineHeight: 1.6,
    color: "#718077",
    margin: "8px 0 0",
  },
  refreshButton: {
    padding: "10px 15px",
    border: "1px solid #cfe0d3",
    borderRadius: "8px",
    background: "#fff",
    color: "#176c43",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "14px",
    marginBottom: "30px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "17px",
    borderRadius: "11px",
    background: "#fff",
    border: "1px solid #e1eae3",
    boxShadow: "0 3px 12px rgba(25, 60, 39, 0.035)",
  },
  statIcon: {
    width: "43px",
    height: "43px",
    flexShrink: 0,
    borderRadius: "10px",
    display: "grid",
    placeItems: "center",
    fontSize: "21px",
    fontWeight: 800,
  },
  statLabel: { fontSize: "11px", color: "#78877d", marginBottom: "5px" },
  statValue: { fontSize: "23px", fontWeight: 800, color: "#21372a" },
  listSection: {
    background: "#fff",
    border: "1px solid #e1eae3",
    borderRadius: "13px",
    padding: "22px",
    boxShadow: "0 4px 18px rgba(25, 60, 39, 0.035)",
  },
  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    paddingBottom: "18px",
    borderBottom: "1px solid #edf1ed",
    marginBottom: "18px",
  },
  listTitle: { fontSize: "17px", fontWeight: 800, margin: 0, color: "#21372a" },
  listSubtitle: { fontSize: "12px", color: "#87938b", margin: "5px 0 0" },
  countBadge: {
    padding: "7px 10px",
    borderRadius: "20px",
    background: "#eaf5ed",
    color: "#197348",
    fontSize: "11px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  cards: { display: "grid", gap: "15px" },
  scheduleCard: {
    border: "1px solid #e2eae4",
    borderRadius: "11px",
    padding: "20px",
    background: "#fff",
  },
  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "17px",
  },
  cardHeading: { display: "flex", alignItems: "center", gap: "11px" },
  cardIcon: {
    width: "42px",
    height: "42px",
    display: "grid",
    placeItems: "center",
    borderRadius: "10px",
    background: "#eaf5ed",
    color: "#16834b",
    fontSize: "20px",
    flexShrink: 0,
  },
  cardEyebrow: {
    color: "#829087",
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "1px",
    marginBottom: "4px",
  },
  cardTitle: { fontSize: "16px", fontWeight: 800, color: "#26392d", margin: 0 },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    borderRadius: "20px",
    padding: "7px 10px",
    fontSize: "10px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  statusDot: { width: "6px", height: "6px", borderRadius: "50%" },
  datePanel: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "12px 14px",
    borderRadius: "9px",
    background: "#f5faf6",
    border: "1px solid #e6f0e8",
    marginBottom: "17px",
  },
  dateIcon: {
    width: "34px",
    height: "34px",
    display: "grid",
    placeItems: "center",
    borderRadius: "8px",
    background: "#dff2e6",
    color: "#187345",
    fontSize: "16px",
    flexShrink: 0,
  },
  dateLabel: { fontSize: "10px", color: "#7b8a80", marginBottom: "4px" },
  dateValue: { fontSize: "13px", fontWeight: 800, color: "#284533" },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "17px",
  },
  detailItem: { display: "flex", alignItems: "flex-start", gap: "9px" },
  detailIcon: {
    width: "26px",
    height: "26px",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "7px",
    background: "#f0f5f1",
    color: "#47745a",
    fontSize: "13px",
  },
  detailLabel: { fontSize: "10px", color: "#89958d", marginBottom: "4px" },
  detailValue: {
    fontSize: "12px",
    lineHeight: 1.5,
    color: "#34483a",
    fontWeight: 700,
    overflowWrap: "anywhere",
  },
  detailSub: { fontSize: "11px", color: "#87938b", marginTop: "3px" },
  cardBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    borderTop: "1px solid #edf1ed",
    paddingTop: "14px",
  },
  officerBlock: { display: "flex", alignItems: "center", gap: "9px" },
  officerAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#eaf2ff",
    color: "#3267bd",
    fontSize: "12px",
    fontWeight: 800,
  },
  officerLabel: { fontSize: "10px", color: "#89958d", marginBottom: "3px" },
  officerName: { fontSize: "12px", fontWeight: 800, color: "#34483a" },
  scheduleId: { color: "#9aa59d", fontSize: "10px" },
  errorBox: {
    padding: "15px",
    border: "1px solid #f4c7c7",
    borderRadius: "9px",
    background: "#fff5f5",
    color: "#a32e2e",
    fontSize: "12px",
    lineHeight: 1.6,
  },
  errorRetry: {
    display: "block",
    marginTop: "10px",
    border: "1px solid #e8b4b4",
    borderRadius: "6px",
    background: "#fff",
    color: "#a32e2e",
    padding: "7px 10px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },
  emptyBox: {
    textAlign: "center",
    padding: "45px 15px",
    border: "1px dashed #d9e5dc",
    borderRadius: "10px",
    background: "#fbfdfb",
  },
  emptyIcon: {
    width: "46px",
    height: "46px",
    margin: "0 auto 12px",
    borderRadius: "12px",
    display: "grid",
    placeItems: "center",
    background: "#eaf5ed",
    color: "#16834b",
    fontSize: "22px",
  },
  emptyTitle: { fontSize: "14px", fontWeight: 800, margin: "0 0 6px" },
  emptyLink: {
    display: "inline-block",
    marginTop: "15px",
    color: "#16834b",
    fontSize: "12px",
    fontWeight: 800,
    textDecoration: "none",
  },
  mutedText: { fontSize: "12px", color: "#89958d", margin: 0 },
  loadingBox: {
    maxWidth: "420px",
    margin: "15vh auto",
    textAlign: "center",
    background: "#fff",
    border: "1px solid #e1eae3",
    borderRadius: "13px",
    padding: "35px 20px",
  },
  loadingIcon: { fontSize: "30px", color: "#16834b", marginBottom: "10px" },
  loadingTitle: { fontSize: "16px", margin: "0 0 7px" },
  footer: {
    textAlign: "center",
    color: "#99a49c",
    fontSize: "11px",
    padding: "24px 0 0",
  },
};