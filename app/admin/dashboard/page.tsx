"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AdminUser = {
  nama: string;
  email: string;
};

const menu = [
  { label: "Dashboard", href: "/admin", icon: "▦" },
  { label: "Penanganan Laporan", href: "/admin/penanganan", icon: "▤" },
  { label: "Penjemputan", href: "/admin/penjemputan", icon: "🚚" },
  { label: "Jenis Sampah & Harga", href: "/admin/jenis-sampah", icon: "♻" },
  { label: "Transaksi Insentif", href: "/admin/transaksi", icon: "Rp" },
];

export default function AdminIndexPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      router.replace("/login");
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      setUser({
        nama: parsed.nama || "Admin",
        email: parsed.email || "",
      });
    } catch {
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>♻</div>
          <div>
            <div style={styles.brandName}>Setor Sampah</div>
            <div style={styles.brandCaption}>Admin Panel</div>
          </div>
        </div>

        <div style={styles.navCaption}>MENU UTAMA</div>

        <nav style={styles.nav}>
          {menu.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...styles.navItem,
                ...(index === 0 ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={styles.sidebarBottom}>
          <div style={styles.adminBadge}>A</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={styles.sidebarUserName}>{user?.nama || "Admin"}</div>
            <div style={styles.sidebarUserRole}>Administrator</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            style={styles.logoutIcon}
          >
            ↪
          </button>
        </div>
      </aside>

      <section style={styles.content}>
        <header style={styles.topbar}>
          <div>
            <div style={styles.breadcrumb}>Panel Admin / Dashboard</div>
            <h1 style={styles.pageTitle}>Dashboard</h1>
          </div>

          <div style={styles.topbarRight}>
            <div style={styles.topbarUser}>
              <div style={styles.topbarAvatar}>A</div>
              <div>
                <div style={styles.topbarName}>{user?.nama || "Admin"}</div>
                <div style={styles.topbarRole}>Administrator</div>
              </div>
            </div>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Keluar
            </button>
          </div>
        </header>

        <div style={styles.welcomePanel}>
          <div>
            <div style={styles.welcomeEyebrow}>PUSAT KONTROL</div>
            <h2 style={styles.welcomeTitle}>
              Halo, {user?.nama || "Admin"}!
            </h2>
            <p style={styles.welcomeText}>
              Pantau aktivitas laporan warga dan kelola layanan Setor Sampah
              melalui panel admin.
            </p>
          </div>
          <div style={styles.welcomeDecoration}>♻</div>
        </div>

        <section style={styles.section}>
          <div style={styles.sectionHeading}>
            <div>
              <h2 style={styles.sectionTitle}>Ringkasan Pengelolaan</h2>
              <p style={styles.sectionSubtitle}>
                Akses cepat ke fitur utama administrator.
              </p>
            </div>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: "#e8f5ed" }}>
                <span style={{ color: "#16834b" }}>▤</span>
              </div>
              <div style={styles.statLabel}>Laporan Warga</div>
              <div style={styles.statDescription}>
                Lihat dan proses laporan yang masuk.
              </div>
              <Link href="/admin/penanganan" style={styles.statLink}>
                Buka penanganan <span>→</span>
              </Link>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: "#e5f4f3" }}>
                <span style={{ color: "#0f766e" }}>🚚</span>
              </div>
              <div style={styles.statLabel}>Jadwal Penjemputan</div>
              <div style={styles.statDescription}>
                Pantau jadwal pengangkutan sampah.
              </div>
              <Link href="/admin/penjemputan" style={styles.statLink}>
                Buka penjemputan <span>→</span>
              </Link>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: "#eaf0ff" }}>
                <span style={{ color: "#3159bd" }}>♻</span>
              </div>
              <div style={styles.statLabel}>Jenis Sampah & Harga</div>
              <div style={styles.statDescription}>
                Atur jenis sampah dan nominal insentif per kg.
              </div>
              <Link href="/admin/jenis-sampah" style={styles.statLink}>
                Kelola data <span>→</span>
              </Link>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: "#fff0f5" }}>
                <span style={{ color: "#be185d", fontWeight: 800 }}>Rp</span>
              </div>
              <div style={styles.statLabel}>Transaksi Insentif</div>
              <div style={styles.statDescription}>
                Tinjau rincian insentif dari laporan yang diterima.
              </div>
              <Link href="/admin/transaksi" style={styles.statLink}>
                Lihat transaksi <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section style={styles.bottomGrid}>
          <div style={styles.infoCard}>
            <h2 style={styles.infoTitle}>Alur Kerja Admin</h2>
            <p style={styles.infoText}>
              Gunakan menu penanganan untuk memeriksa laporan warga. Setelah
              laporan diproses, admin dapat mengelola penjemputan dan memantau
              insentif sesuai harga jenis sampah.
            </p>
            <Link href="/admin/penanganan" style={styles.primaryButton}>
              Periksa laporan
            </Link>
          </div>

          <div style={styles.accountCard}>
            <h2 style={styles.infoTitle}>Akun Admin</h2>
            <div style={styles.accountRow}>
              <span>Nama</span>
              <strong>{user?.nama || "Admin"}</strong>
            </div>
            <div style={styles.accountRow}>
              <span>Email</span>
              <strong style={{ overflowWrap: "anywhere" }}>
                {user?.email || "-"}
              </strong>
            </div>
            <div style={styles.accountRow}>
              <span>Hak akses</span>
              <strong>Administrator</strong>
            </div>
          </div>
        </section>

        <footer style={styles.footer}>
          Setor Sampah · Panel Administrator
        </footer>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#f5f8f6",
    color: "#1f2937",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "250px",
    minWidth: "250px",
    minHeight: "100vh",
    background: "#123d2d",
    color: "white",
    padding: "24px 15px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "4px 9px 28px",
    borderBottom: "1px solid rgba(255,255,255,0.13)",
  },
  brandIcon: {
    width: "39px",
    height: "39px",
    borderRadius: "11px",
    background: "#e0f2e8",
    color: "#12633d",
    display: "grid",
    placeItems: "center",
    fontSize: "23px",
    fontWeight: 800,
  },
  brandName: { fontSize: "15px", fontWeight: 800 },
  brandCaption: {
    color: "#b6d4c4",
    fontSize: "11px",
    marginTop: "4px",
  },
  navCaption: {
    color: "#9fc1ae",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.2px",
    padding: "26px 12px 11px",
  },
  nav: { display: "flex", flexDirection: "column", gap: "5px" },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 13px",
    borderRadius: "8px",
    color: "#d4e5dc",
    fontSize: "13px",
    textDecoration: "none",
    fontWeight: 600,
  },
  navItemActive: {
    background: "#19734b",
    color: "white",
  },
  navIcon: {
    width: "22px",
    textAlign: "center",
    fontSize: "16px",
  },
  sidebarBottom: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    marginTop: "auto",
    padding: "17px 7px 3px",
    borderTop: "1px solid rgba(255,255,255,0.13)",
  },
  adminBadge: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#d1fae5",
    color: "#166534",
    display: "grid",
    placeItems: "center",
    fontSize: "13px",
    fontWeight: 800,
  },
  sidebarUserName: {
    fontSize: "12px",
    fontWeight: 700,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  sidebarUserRole: {
    color: "#b6d4c4",
    fontSize: "10px",
    marginTop: "3px",
  },
  logoutIcon: {
    color: "#e1f0e7",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
  },
  content: {
    flex: 1,
    minWidth: 0,
    padding: "0 30px 25px",
  },
  topbar: {
    minHeight: "82px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    borderBottom: "1px solid #e1e9e3",
    marginBottom: "25px",
  },
  breadcrumb: {
    fontSize: "11px",
    color: "#7b8b81",
    marginBottom: "5px",
  },
  pageTitle: { fontSize: "22px", fontWeight: 800, margin: 0 },
  topbarRight: { display: "flex", alignItems: "center", gap: "17px" },
  topbarUser: { display: "flex", alignItems: "center", gap: "9px" },
  topbarAvatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#dcefe2",
    color: "#17633e",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    fontSize: "13px",
  },
  topbarName: { fontSize: "12px", fontWeight: 700 },
  topbarRole: { color: "#849187", fontSize: "10px", marginTop: "3px" },
  logoutButton: {
    padding: "9px 13px",
    border: "1px solid #d6e3d9",
    borderRadius: "7px",
    background: "white",
    color: "#3f5b49",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },
  welcomePanel: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(110deg, #08784a, #15945a)",
    color: "white",
    borderRadius: "13px",
    padding: "27px 30px",
    marginBottom: "27px",
    minHeight: "145px",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  welcomeEyebrow: {
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.4px",
    color: "#c9f2d9",
    marginBottom: "10px",
  },
  welcomeTitle: { fontSize: "25px", fontWeight: 800, margin: "0 0 8px" },
  welcomeText: {
    color: "#e0f6e9",
    fontSize: "13px",
    lineHeight: 1.6,
    maxWidth: "560px",
    margin: 0,
  },
  welcomeDecoration: {
    position: "absolute",
    right: "32px",
    top: "8px",
    fontSize: "105px",
    color: "rgba(255,255,255,0.12)",
    transform: "rotate(-15deg)",
  },
  section: { marginBottom: "24px" },
  sectionHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  sectionTitle: { fontSize: "17px", fontWeight: 800, margin: "0 0 5px" },
  sectionSubtitle: { fontSize: "12px", color: "#78867d", margin: 0 },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "14px",
  },
  statCard: {
    background: "white",
    border: "1px solid #e1e9e3",
    borderRadius: "11px",
    padding: "18px",
    minHeight: "185px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  statIcon: {
    width: "37px",
    height: "37px",
    borderRadius: "9px",
    display: "grid",
    placeItems: "center",
    fontSize: "18px",
    marginBottom: "13px",
  },
  statLabel: { fontSize: "14px", fontWeight: 800, marginBottom: "6px" },
  statDescription: {
    color: "#7a867e",
    fontSize: "11px",
    lineHeight: 1.6,
    flex: 1,
  },
  statLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#16804b",
    fontSize: "11px",
    fontWeight: 800,
    textDecoration: "none",
    borderTop: "1px solid #edf1ed",
    paddingTop: "12px",
    marginTop: "13px",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.3fr) minmax(240px, 1fr)",
    gap: "15px",
  },
  infoCard: {
    background: "white",
    border: "1px solid #e1e9e3",
    borderRadius: "11px",
    padding: "20px",
  },
  accountCard: {
    background: "white",
    border: "1px solid #e1e9e3",
    borderRadius: "11px",
    padding: "20px",
  },
  infoTitle: { fontSize: "14px", fontWeight: 800, margin: "0 0 12px" },
  infoText: {
    fontSize: "12px",
    color: "#748078",
    lineHeight: 1.7,
    margin: "0 0 16px",
  },
  primaryButton: {
    display: "inline-block",
    background: "#147b4a",
    color: "white",
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: 800,
  },
  accountRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    borderBottom: "1px solid #edf1ed",
    padding: "9px 0",
    fontSize: "11px",
  },
  footer: {
    textAlign: "center",
    color: "#98a49c",
    fontSize: "10px",
    paddingTop: "25px",
  },
};