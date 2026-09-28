"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Laporan = {
  id: string;
  beratKg: number | null;
  createdAt: string;
  jenisSampah?: {
    namaJenis?: string;
  } | null;
  wilayah?: {
    namaWilayah?: string;
  } | null;
  status?: {
    namaStatus?: string;
  } | null;
};

function formatTanggal(tanggal: string) {
  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function tampilkanStatus(status?: string) {
  const nilai = (status || "PENDING").toUpperCase();

  if (
    nilai.includes("DITERIMA") ||
    nilai.includes("DISETUJUI") ||
    nilai.includes("SELESAI")
  ) {
    return {
      label: "Diterima",
      className: "bg-green-100 text-green-700",
    };
  }

  if (nilai.includes("DITOLAK") || nilai.includes("TOLAK")) {
    return {
      label: "Ditolak",
      className: "bg-red-100 text-red-700",
    };
  }

  return {
    label: "Menunggu",
    className: "bg-amber-100 text-amber-700",
  };
}

export default function RiwayatLaporanPage() {
  const router = useRouter();

  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let masihAktif = true;

    async function ambilRiwayat() {
      try {
        const userData = localStorage.getItem("user");

        if (!userData) {
          router.replace("/login");
          return;
        }

        let userId = "";

        try {
          const user = JSON.parse(userData);
          userId = user.id || user.userId || "";
        } catch {
          localStorage.removeItem("user");
          router.replace("/login");
          return;
        }

        if (!userId) {
          localStorage.removeItem("user");
          router.replace("/login");
          return;
        }

        const response = await fetch(
          `/api/laporan/riwayat?userId=${encodeURIComponent(userId)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Gagal mengambil riwayat laporan."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Data riwayat dari server tidak sesuai format.");
        }

        if (masihAktif) {
          setLaporan(data);
        }
      } catch (err) {
        if (masihAktif) {
          setError(
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan saat memuat riwayat."
          );
        }
      } finally {
        if (masihAktif) {
          setMemuat(false);
        }
      }
    }

    ambilRiwayat();

    return () => {
      masihAktif = false;
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f3f7f2] font-sans text-[#263b30]">
      <header className="border-b border-[#e0e9df] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-[#2f693e]">
              Setor Sampah
            </p>
            <p className="text-xs text-[#849285]">Riwayat Laporan</p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/user/dashboard")}
            className="rounded-xl border border-[#dce5db] px-4 py-2 text-sm font-semibold text-[#536758] transition hover:bg-[#f5f8f4]"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <button
          type="button"
          onClick={() => router.push("/user/dashboard")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[#526b59] transition hover:bg-[#e5eee4] hover:text-[#28583c]"
        >
          <span className="text-lg" aria-hidden="true">
            ←
          </span>
          Kembali ke Dashboard
        </button>

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-[#397b4b]">
            Aktivitas Setoran
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#243c2c]">
            Riwayat Laporan
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718074]">
            Lihat laporan sampah yang sudah kamu kirim dan pantau status
            penanganannya.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[#e0e9df] bg-white shadow-sm">
          <div className="border-b border-[#e8eee7] bg-[#fbfdfb] px-5 py-5 sm:px-7">
            <h2 className="text-lg font-bold text-[#2b4432]">
              Daftar Laporan
            </h2>
            <p className="mt-1 text-sm text-[#879387]">
              {memuat
                ? "Sedang memuat data..."
                : `${laporan.length} laporan ditemukan`}
            </p>
          </div>

          {memuat ? (
            <div className="px-6 py-12 text-center text-sm text-[#718074]">
              Memuat riwayat laporan...
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-[#718074]">
                Riwayat belum bisa ditampilkan.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-[#397b4b] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#2f693e]"
              >
                Coba Lagi
              </button>
            </div>
          ) : laporan.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf3e9] text-2xl text-[#397b4b]">
                ▤
              </div>
              <h3 className="font-bold text-[#2b4432]">
                Belum ada laporan
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718074]">
                Laporan setoran yang kamu kirim akan muncul di halaman ini.
              </p>
              <button
                type="button"
                onClick={() => router.push("/user/laporan")}
                className="mt-5 rounded-xl bg-[#397b4b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2f693e]"
              >
                Buat Laporan
              </button>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#e8eee7] bg-[#fbfdfb] text-xs uppercase tracking-wide text-[#718074]">
                      <th className="px-6 py-4 font-semibold">Tanggal</th>
                      <th className="px-6 py-4 font-semibold">Jenis Sampah</th>
                      <th className="px-6 py-4 font-semibold">Wilayah</th>
                      <th className="px-6 py-4 font-semibold">Berat</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {laporan.map((item) => {
                      const status = tampilkanStatus(
                        item.status?.namaStatus
                      );

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-[#eef2ed] last:border-0"
                        >
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[#536758]">
                            {formatTanggal(item.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#2b4432]">
                            {item.jenisSampah?.namaJenis || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#536758]">
                            {item.wilayah?.namaWilayah || "-"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[#536758]">
                            {item.beratKg == null
                              ? "-"
                              : `${item.beratKg.toLocaleString("id-ID")} kg`}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-[#eef2ed] md:hidden">
                {laporan.map((item) => {
                  const status = tampilkanStatus(
                    item.status?.namaStatus
                  );

                  return (
                    <article key={item.id} className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-[#2b4432]">
                            {item.jenisSampah?.namaJenis || "-"}
                          </h3>
                          <p className="mt-1 text-xs text-[#89978b]">
                            {formatTanggal(item.createdAt)}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-[#f7faf6] p-3">
                          <p className="text-xs text-[#89978b]">Wilayah</p>
                          <p className="mt-1 text-sm font-semibold text-[#2b4432]">
                            {item.wilayah?.namaWilayah || "-"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#f7faf6] p-3">
                          <p className="text-xs text-[#89978b]">Berat</p>
                          <p className="mt-1 text-sm font-semibold text-[#2b4432]">
                            {item.beratKg == null
                              ? "-"
                              : `${item.beratKg.toLocaleString("id-ID")} kg`}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}