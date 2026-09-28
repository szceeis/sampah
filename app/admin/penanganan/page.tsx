"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

interface Laporan {
  id: string;
  alamat: string;
  beratKg: number;
  deskripsi: string;
  createdAt: string;
  user: { nama: string; noHp: string };
  jenisSampah: { namaJenis: string };
  wilayah: { namaWilayah: string };
  status: { namaStatus: string } | null;
}

export default function PenangananPage() {
  const [laporanList, setLaporanList] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Ganti dengan ID petugas yang valid dari database saat sudah tersedia.
  const petugasIdDefault = "ISI_PETUGAS_ID_DULU";

  const fetchLaporan = useCallback(async () => {
    setError("");

    try {
      const res = await fetch("/api/laporan");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal memuat laporan.");
      }

      setLaporanList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat data", err);
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLaporan();
  }, [fetchLaporan]);

  const handleUpdateStatus = async (
    laporanId: string,
    statusBaru: string
  ) => {
    const catatan = prompt("Masukkan catatan penanganan (opsional):");
    if (catatan === null) return;

    setProcessingId(laporanId);

    try {
      const res = await fetch(`/api/laporan/${laporanId}/penanganan`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petugasId: petugasIdDefault,
          namaStatus: statusBaru,
          catatan,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Status laporan berhasil diubah!");
        await fetchLaporan();
      } else {
        alert(result.message || "Gagal mengubah status.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleJadwalkan = async (laporanId: string) => {
    const petugasId = prompt("Masukkan ID Petugas:");
    if (!petugasId) return;

    const tanggal = prompt(
      "Masukkan tanggal dan waktu jemput (contoh: 2026-06-15T10:30):"
    );
    if (!tanggal) return;

    setProcessingId(laporanId);

    try {
      const res = await fetch("/api/penjemputan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          laporanId,
          petugasId,
          tanggalJemput: tanggal,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Berhasil dijadwalkan!");
        await fetchLaporan();
      } else {
        alert(result.message || "Gagal membuat jadwal.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setProcessingId(null);
    }
  };

  const totalLaporan = laporanList.length;
  const jumlahMenunggu = laporanList.filter((item) => {
    const status = item.status?.namaStatus?.toUpperCase() || "MENUNGGU";
    return status === "PENDING" || status === "MENUNGGU";
  }).length;

  const jumlahDiterima = laporanList.filter((item) => {
    const status = item.status?.namaStatus?.toUpperCase() || "";
    return status === "DITERIMA";
  }).length;

  const jumlahSelesai = laporanList.filter((item) => {
    const status = item.status?.namaStatus?.toUpperCase() || "";
    return status === "SELESAI";
  }).length;

  const getStatusStyle = (statusNama: string) => {
    const status = statusNama.toUpperCase();

    if (status === "DITERIMA") {
      return {
        background: "#e8f5ed",
        color: "#187345",
        dot: "#23965d",
      };
    }

    if (status === "DITOLAK") {
      return {
        background: "#fff0f0",
        color: "#b42318",
        dot: "#e04444",
      };
    }

    if (status === "SELESAI") {
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

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loadingBox}>
          <div style={styles.loadingIcon}>♻</div>
          <h2 style={styles.loadingTitle}>Memuat laporan...</h2>
          <p style={styles.mutedText}>Sedang mengambil data dari server.</p>
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
            <div style={styles.eyebrow}>PENGELOLAAN DATA</div>
            <h1 style={styles.title}>Penanganan Laporan</h1>
            <p style={styles.subtitle}>
              Periksa laporan warga, perbarui status, dan atur jadwal
              penjemputan sampah.
            </p>
          </div>

          <button onClick={fetchLaporan} style={styles.refreshButton}>
            <span aria-hidden="true">↻</span> Muat Ulang
          </button>
        </section>

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#eaf2ff", color: "#3267bd" }}>
              ▤
            </div>
            <div>
              <div style={styles.statLabel}>Total Laporan</div>
              <div style={styles.statValue}>{totalLaporan}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#fff4df", color: "#ad7200" }}>
              ◷
            </div>
            <div>
              <div style={styles.statLabel}>Menunggu</div>
              <div style={styles.statValue}>{jumlahMenunggu}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#e8f5ed", color: "#16834b" }}>
              ✓
            </div>
            <div>
              <div style={styles.statLabel}>Diterima</div>
              <div style={styles.statValue}>{jumlahDiterima}</div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#eaf2ff", color: "#3267bd" }}>
              ♧
            </div>
            <div>
              <div style={styles.statLabel}>Selesai Diangkut</div>
              <div style={styles.statValue}>{jumlahSelesai}</div>
            </div>
          </div>
        </section>

        <section style={styles.listSection}>
          <div style={styles.listHeader}>
            <div>
              <h2 style={styles.listTitle}>Daftar Laporan Masuk</h2>
              <p style={styles.listSubtitle}>
                Semua laporan yang tercatat pada sistem.
              </p>
            </div>
            <span style={styles.countBadge}>{totalLaporan} laporan</span>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <strong>Data tidak berhasil dimuat.</strong>
              <div>{error}</div>
              <button onClick={fetchLaporan} style={styles.errorRetry}>
                Coba lagi
              </button>
            </div>
          )}

          {!error && laporanList.length === 0 && (
            <div style={styles.emptyBox}>
              <div style={styles.emptyIcon}>▤</div>
              <h3 style={styles.emptyTitle}>Belum ada laporan</h3>
              <p style={styles.mutedText}>
                Laporan warga yang masuk akan ditampilkan di sini.
              </p>
            </div>
          )}

          <div style={styles.cards}>
            {laporanList.map((item) => {
              const statusNama = item.status?.namaStatus || "MENUNGGU";
              const statusStyle = getStatusStyle(statusNama);
              const isProcessing = processingId === item.id;

              return (
                <article key={item.id} style={styles.reportCard}>
                  <div style={styles.reportTop}>
                    <div style={styles.reportHeading}>
                      <div style={styles.reportCategoryIcon}>♻</div>
                      <div>
                        <h3 style={styles.reportName}>
                          {item.jenisSampah?.namaJenis || "Jenis sampah"}
                        </h3>
                        <div style={styles.reportMeta}>
                          ID: {item.id.slice(0, 8).toUpperCase()}
                        </div>
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
                      {statusNama}
                    </span>
                  </div>

                  <div style={styles.weightBox}>
                    <div style={styles.weightLabel}>Berat sampah</div>
                    <div style={styles.weightValue}>
                      {Number(item.beratKg || 0).toLocaleString("id-ID", {
                        maximumFractionDigits: 2,
                      })}
                      <span> kg</span>
                    </div>
                  </div>

                  <div style={styles.detailsGrid}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>⌖</span>
                      <div>
                        <div style={styles.detailLabel}>Wilayah</div>
                        <div style={styles.detailValue}>
                          {item.wilayah?.namaWilayah || "-"}
                        </div>
                      </div>
                    </div>

                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>▣</span>
                      <div>
                        <div style={styles.detailLabel}>Tanggal laporan</div>
                        <div style={styles.detailValue}>
                          {new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>

                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>⌂</span>
                      <div>
                        <div style={styles.detailLabel}>Alamat penjemputan</div>
                        <div style={styles.detailValue}>{item.alamat || "-"}</div>
                      </div>
                    </div>

                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>♙</span>
                      <div>
                        <div style={styles.detailLabel}>Nama pelapor</div>
                        <div style={styles.detailValue}>
                          {item.user?.nama || "-"}
                        </div>
                        <div style={styles.detailSub}>
                          {item.user?.noHp || "Nomor HP tidak tersedia"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {item.deskripsi && (
                    <div style={styles.descriptionBox}>
                      <div style={styles.descriptionLabel}>Catatan pelapor</div>
                      <p style={styles.descriptionText}>{item.deskripsi}</p>
                    </div>
                  )}

                  <div style={styles.actionArea}>
                    <div style={styles.actionLabel}>Tindakan admin</div>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleUpdateStatus(item.id, "DITERIMA")}
                        disabled={isProcessing}
                        style={{ ...styles.actionButton, ...styles.acceptButton }}
                      >
                        ✓ Terima
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(item.id, "DITOLAK")}
                        disabled={isProcessing}
                        style={{ ...styles.actionButton, ...styles.rejectButton }}
                      >
                        ✕ Tolak
                      </button>

                      <button
                        onClick={() => handleJadwalkan(item.id)}
                        disabled={isProcessing}
                        style={{ ...styles.actionButton, ...styles.scheduleButton }}
                      >
                        ▣ Jadwalkan Jemput
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(item.id, "SELESAI")}
                        disabled={isProcessing}
                        style={{ ...styles.actionButton, ...styles.doneButton }}
                      >
                        ✓ Selesai Diangkut
                      </button>
                    </div>

                    {isProcessing && (
                      <div style={styles.processingText}>
                        Sedang memproses tindakan...
                      </div>
                    )}
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
  reportCard: {
    border: "1px solid #e2eae4",
    borderRadius: "11px",
    padding: "20px",
    background: "#fff",
  },
  reportTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "15px",
  },
  reportHeading: { display: "flex", alignItems: "center", gap: "11px" },
  reportCategoryIcon: {
    width: "40px",
    height: "40px",
    display: "grid",
    placeItems: "center",
    borderRadius: "10px",
    background: "#eaf5ed",
    color: "#16834b",
    fontSize: "21px",
    flexShrink: 0,
  },
  reportName: { fontSize: "16px", fontWeight: 800, color: "#26392d", margin: 0 },
  reportMeta: { fontSize: "10px", color: "#9aa59d", marginTop: "5px" },
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
  weightBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f7faf7",
    border: "1px solid #edf2ed",
    borderRadius: "8px",
    padding: "10px 13px",
    marginBottom: "16px",
  },
  weightLabel: { fontSize: "11px", color: "#77867c" },
  weightValue: { fontSize: "16px", fontWeight: 800, color: "#176d43" },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginBottom: "15px",
  },
  detailItem: { display: "flex", alignItems: "flex-start", gap: "9px" },
  detailIcon: {
    width: "25px",
    height: "25px",
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
  descriptionBox: {
    borderLeft: "3px solid #b9d9c4",
    background: "#f8faf8",
    padding: "10px 12px",
    borderRadius: "0 7px 7px 0",
    marginBottom: "16px",
  },
  descriptionLabel: {
    fontSize: "10px",
    fontWeight: 800,
    color: "#7d8b81",
    marginBottom: "5px",
  },
  descriptionText: {
    fontSize: "12px",
    lineHeight: 1.6,
    color: "#526157",
    margin: 0,
    whiteSpace: "pre-wrap",
  },
  actionArea: { borderTop: "1px solid #edf1ed", paddingTop: "14px" },
  actionLabel: {
    fontSize: "10px",
    fontWeight: 800,
    color: "#7e8c82",
    marginBottom: "10px",
  },
  actionButtons: { display: "flex", flexWrap: "wrap", gap: "8px" },
  actionButton: {
    border: "none",
    borderRadius: "7px",
    padding: "10px 13px",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 800,
    cursor: "pointer",
  },
  acceptButton: { background: "#2875d7" },
  rejectButton: { background: "#d94848" },
  scheduleButton: { background: "#7654c8" },
  doneButton: { background: "#16834b" },
  processingText: { color: "#7b887f", fontSize: "11px", marginTop: "10px" },
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
  loadingIcon: {
    fontSize: "30px",
    color: "#16834b",
    marginBottom: "10px",
  },
  loadingTitle: { fontSize: "16px", margin: "0 0 7px" },
  footer: {
    textAlign: "center",
    color: "#99a49c",
    fontSize: "11px",
    padding: "24px 0 0",
  },
};