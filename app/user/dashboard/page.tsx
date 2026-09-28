"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserData = {
  id?: string;
  userId?: string;
  nama?: string;
  name?: string;
  email?: string;
};

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser: UserData = JSON.parse(userData);

      if (!parsedUser.id && !parsedUser.userId) {
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      setUser(parsedUser);
    } catch {
      localStorage.removeItem("user");
      router.replace("/login");
      return;
    }

    setMemuat(false);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("user");
    router.replace("/login");
  }

  if (memuat) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f7f2] text-[#526b59]">
        Memuat dashboard...
      </main>
    );
  }

  const namaPengguna = user?.nama || user?.name || "Pengguna";

  const menu = [
    {
      judul: "Buat Laporan",
      deskripsi: "Laporkan sampah yang ingin disetorkan.",
      ikon: "＋",
      tujuan: "/user/laporan",
    },
    {
      judul: "Riwayat Laporan",
      deskripsi: "Lihat laporan setoran dan status penanganannya.",
      ikon: "▤",
      tujuan: "/user/riwayat",
    },
    {
      judul: "Transaksi",
      deskripsi: "Lihat riwayat setoran dan total insentif yang didapat.",
      ikon: "Rp",
      tujuan: "/user/transaksi",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f3f7f2] font-sans text-[#263b30]">
      <header className="border-b border-[#e0e9df] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-[#2f693e]">
              Setor Sampah
            </p>
            <p className="text-xs text-[#849285]">Layanan Pelaporan Warga</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-[#dce5db] px-4 py-2 text-sm font-semibold text-[#536758] transition hover:bg-[#f5f8f4]"
          >
            Keluar
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 rounded-2xl bg-[#397b4b] px-6 py-8 text-white shadow-sm sm:px-9">
          <p className="text-sm font-medium text-white/80">
            Dashboard Pengguna
          </p>

          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            Halo, {namaPengguna}!
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
            Selamat datang di Setor Sampah. Kamu bisa membuat laporan setoran,
            memantau status laporan, dan melihat transaksi insentif di sini.
          </p>
        </div>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#2b4432]">
            Menu Pengguna
          </h2>
          <p className="mt-1 text-sm text-[#718074]">
            Pilih layanan yang ingin kamu buka.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menu.map((item) => (
            <button
              key={item.tujuan}
              type="button"
              onClick={() => router.push(item.tujuan)}
              className="group rounded-2xl border border-[#e0e9df] bg-white p-6 text-left shadow-[0_4px_18px_rgba(44,76,50,0.04)] transition hover:-translate-y-0.5 hover:border-[#b8d2ba] hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf3e9] text-lg font-extrabold text-[#397b4b] transition group-hover:bg-[#dcebdd]">
                {item.ikon}
              </div>

              <h3 className="text-lg font-bold text-[#2b4432]">
                {item.judul}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-[#718074]">
                {item.deskripsi}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#397b4b]">
                Buka menu
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[#dcebdd] bg-[#f4f9f3] px-5 py-4">
          <p className="text-sm leading-6 text-[#607663]">
            <strong>Info:</strong> Insentif akan dihitung berdasarkan berat
            sampah dan harga per kilogram setelah laporan diterima.
          </p>
        </div>
      </section>
    </main>
  );
}