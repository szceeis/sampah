
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  nama: string;
  email: string;
  role?: string;
}

export default function UserIndexPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);

      if (!parsedUser.id || !parsedUser.nama || !parsedUser.email) {
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Data user tidak valid:", error);
      localStorage.removeItem("user");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const handleLaporan = () => {
    router.push("/user/laporan");
  };

  if (loading || !user) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f7f2",
          fontFamily: "Arial, sans-serif",
          color: "#397b4b",
        }}
      >
        Memuat dashboard...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f7f2",
        fontFamily: "Arial, sans-serif",
        padding: "35px 20px",
        color: "#263b30",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* NAVBAR */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            padding: "18px 25px",
            background: "#ffffff",
            border: "1px solid #e0e9df",
            borderRadius: "14px",
            boxShadow: "0 4px 15px rgba(31, 65, 40, 0.05)",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "#e5f0e3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
              }}
            >
              ♻
            </div>

            <div>
              <h2
                style={{
                  fontSize: "19px",
                  fontWeight: "800",
                  margin: 0,
                  color: "#397b4b",
                }}
              >
                Setor Sampah
              </h2>
              <p
                style={{
                  fontSize: "12px",
                  color: "#8a998d",
                  margin: "4px 0 0",
                }}
              >
                Portal Pelaporan Warga
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 17px",
              background: "#ffffff",
              color: "#c24141",
              border: "1px solid #f0caca",
              borderRadius: "9px",
              fontWeight: "bold",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </header>

        {/* SAPAAN */}
        <section
          style={{
            background: "linear-gradient(120deg, #397b4b, #559765)",
            padding: "35px",
            borderRadius: "18px",
            color: "#ffffff",
            marginBottom: "25px",
            boxShadow: "0 8px 22px rgba(57, 123, 75, 0.15)",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: "600",
              letterSpacing: "1px",
              color: "#dcecdf",
              margin: "0 0 12px",
            }}
          >
            DASHBOARD WARGA
          </p>

          <h1
            style={{
              fontSize: "30px",
              fontWeight: "800",
              lineHeight: "1.3",
              margin: "0 0 12px",
            }}
          >
            Halo, {user.nama}!
          </h1>

          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.8",
              color: "#edf6ee",
              margin: 0,
              maxWidth: "600px",
            }}
          >
            Selamat datang di Setor Sampah. Kamu bisa
            membuat laporan penumpukan sampah di
            lingkungan sekitar melalui halaman ini.
          </p>
        </section>

        {/* INFORMASI AKUN */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e0e9df",
            borderRadius: "15px",
            padding: "25px",
            marginBottom: "25px",
            boxShadow: "0 4px 15px rgba(31, 65, 40, 0.04)",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "800",
              margin: "0 0 20px",
              color: "#294333",
            }}
          >
            Informasi Akun
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <div
              style={{
                background: "#f7faf6",
                border: "1px solid #e5eee3",
                borderRadius: "10px",
                padding: "16px",
              }}
            >
              <p
                style={{
                  color: "#879589",
                  fontSize: "12px",
                  margin: "0 0 8px",
                }}
              >
                Nama Lengkap
              </p>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#294333",
                  margin: 0,
                  overflowWrap: "anywhere",
                }}
              >
                {user.nama}
              </p>
            </div>

            <div
              style={{
                background: "#f7faf6",
                border: "1px solid #e5eee3",
                borderRadius: "10px",
                padding: "16px",
              }}
            >
              <p
                style={{
                  color: "#879589",
                  fontSize: "12px",
                  margin: "0 0 8px",
                }}
              >
                Email
              </p>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#294333",
                  margin: 0,
                  overflowWrap: "anywhere",
                }}
              >
                {user.email}
              </p>
            </div>

            <div
              style={{
                background: "#f7faf6",
                border: "1px solid #e5eee3",
                borderRadius: "10px",
                padding: "16px",
              }}
            >
              <p
                style={{
                  color: "#879589",
                  fontSize: "12px",
                  margin: "0 0 8px",
                }}
              >
                Status Akun
              </p>
              <span
                style={{
                  display: "inline-block",
                  background: "#e5f4e7",
                  color: "#397b4b",
                  borderRadius: "20px",
                  padding: "5px 12px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                Warga Aktif
              </span>
            </div>
          </div>
        </section>

        {/* MENU LAPORAN */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e0e9df",
            borderRadius: "15px",
            padding: "27px",
            boxShadow: "0 4px 15px rgba(31, 65, 40, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "18px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "14px",
                background: "#e5f0e3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "27px",
                flexShrink: 0,
              }}
            >
              📋
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
              <h2
                style={{
                  fontSize: "19px",
                  fontWeight: "800",
                  color: "#294333",
                  margin: "2px 0 9px",
                }}
              >
                Buat Laporan Sampah
              </h2>

              <p
                style={{
                  fontSize: "14px",
                  color: "#78867a",
                  lineHeight: "1.8",
                  margin: "0 0 20px",
                }}
              >
                Temukan penumpukan sampah di lingkungan
                sekitar? Isi formulir laporan agar petugas
                dapat mengetahui lokasi dan kondisi sampah
                yang perlu ditangani.
              </p>

              <button
                onClick={handleLaporan}
                style={{
                  display: "inline-block",
                  padding: "12px 22px",
                  background: "#397b4b",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "9px",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#2f693e";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#397b4b";
                }}
              >
                + Buat Form Laporan
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            textAlign: "center",
            padding: "25px 10px 5px",
            color: "#8a998d",
            fontSize: "12px",
          }}
        >
          © {new Date().getFullYear()} Setor Sampah. Bersama jaga lingkungan.
        </footer>
      </div>
    </main>
  );
}