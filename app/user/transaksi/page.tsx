"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Laporan = {
  id: string;
  userId: string;
  beratKg: number | null;
  jumlah?: number | null;
  createdAt: string;
  jenisSampah?: {
    namaJenis?: string;
    hargaPerKg?: number | null;
  } | null;
  status?: {
    namaStatus?: string;
  } | null;
};

function formatRupiah(nominal: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nominal);
}

function formatTanggal(tanggal: string) {
  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function statusTampilan(status?: string) {
  const normalized = (status || "MENUNGGU").toUpperCase();

  if (
    normalized.includes("TERIMA") ||
    normalized.includes("DISETUJUI") ||
    normalized.includes("SELESAI")
  ) {
    return {
      label: "Diterima",
      className: "bg-green-100 text-green-700",
      diterima: true,
    };
  }

  if (normalized.includes("TOLAK") || normalized.includes("DITOLAK")) {
    return {
      label: "Ditolak",
      className: "bg-red-100 text-red-700",
      diterima: false,
    };
  }

  return {
    label: "Menunggu",
    className: "bg-amber-100 text-amber-700",
    diterima: false,
  };
}

export default function TransaksiUserPage() {
  const router = useRouter();

  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [pesanError, setPesanError] = useState("");

  useEffect(() => {
    let masihAktif = true;

    async function ambilTransaksi() {
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

        const response = await fetch("/api/laporan");

        if (!response.ok) {
          throw new Error(`Gagal mengambil data transaksi (HTTP ${response.status}).`);
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Format data laporan dari server tidak sesuai.");
        }

        if (!masihAktif) return;

        const laporanMilikUser = (data as Laporan[]).filter(
          (item) => item.userId === userId
        );

        setLaporan(laporanMilikUser);
      } catch (error) {
        if (!masihAktif) return;

        setPesanError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memuat transaksi."
        );
      } finally {
        if (masihAktif) {
          setMemuat(false);
        }
      }
    }

    ambilTransaksi();

    return () => {
      masihAktif = false;
    };
  }, [router]);

  const transaksiDiterima = laporan.filter((item) =>
    statusTampilan(item.status?.namaStatus).diterima
  );

  const totalBeratDiterima = transaksiDiterima.reduce(
    (total, item) => total + Number(item.beratKg ?? item.jumlah ?? 0),
    0
  );

  const totalInsentif = transaksiDiterima.reduce((total, item) => {
    const berat = Number(item.beratKg ?? item.jumlah ?? 0);
    const harga = Number(item.jenisSampah?.hargaPerKg ?? 0);
    return total + berat * harga;
  }, 0);

  return (
    <main className="min-h-screen bg-[#f3f7f2] font-sans text-[#263b30]">
      <header className="border-b border-[#e0e9df] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-[#2f693e]">
              Setor Sampah
            </p>
            <p className="text-xs text-[#849285]">Transaksi Pengguna</p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/user/dashboard")}
            className="rounded-xl border border-[#dce5db] px-4 py-2 text-sm font-semibold text-[#536758] transition hover:bg-[#f5f8f4]"
          >
            Kembali
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-[#397b4b]">
            Ringkasan Setoran
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#243c2c]">
            Transaksi Saya
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718074]">
            Pantau riwayat setoran, status laporan, dan insentif dari sampah
            yang sudah diterima.
          </p>
        </div>

        {pesanError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {pesanError}
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#e0e9df] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#718074]">
              Total Insentif Diterima
            </p>
            <p className="mt-3 text-2xl font-extrabold text-[#2f693e]">
              {memuat ? "Memuat..." : formatRupiah(totalInsentif)}
            </p>
            <p className="mt-2 text-xs text-[#89978b]">
              Dihitung dari laporan berstatus diterima
            </p>
          </div>

          <div className="rounded-2xl border border-[#e0e9df] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#718074]">
              Berat Setoran Diterima
            </p>
            <p className="mt-3 text-2xl font-extrabold text-[#2b4432]">
              {memuat ? "Memuat..." : `${totalBeratDiterima.toLocaleString("id-ID")} kg`}
            </p>
            <p className="mt-2 text-xs text-[#89978b]">
              Total berat dari laporan yang diterima
            </p>
          </div>

          <div className="rounded-2xl border border-[#e0e9df] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#718074]">
              Jumlah Laporan
            </p>
            <p className="mt-3 text-2xl font-extrabold text-[#2b4432]">
              {memuat ? "Memuat..." : laporan.length}
            </p>
            <p className="mt-2 text-xs text-[#89978b]">
              Semua laporan yang kamu kirim
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e0e9df] bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-[#e8eee7] bg-[#fbfdfb] px-5 py-5 sm:px-7">
            <h2 className="text-lg font-bold text-[#2b4432]">
              Riwayat Transaksi
            </h2>
            <p className="text-sm text-[#879387]">
              Daftar laporan setoran beserta status dan perhitungan insentif.
            </p>
          </div>

          {memuat ? (
            <div className="px-6 py-12 text-center text-sm text-[#718074]">
              Memuat riwayat transaksi...
            </div>
          ) : laporan.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf3e9] text-2xl text-[#397b4b]">
                ▤
              </div>
              <h3 className="font-bold text-[#2b4432]">
                Belum ada transaksi
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
                      <th className="px-6 py-4 font-semibold">Berat</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 text-right font-semibold">
                        Insentif
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {laporan.map((item) => {
                      const status = statusTampilan(item.status?.namaStatus);
                      const berat = Number(item.beratKg ?? item.jumlah ?? 0);
                      const harga = Number(
                        item.jenisSampah?.hargaPerKg ?? 0
                      );
                      const insentif = status.diterima
                        ? berat * harga
                        : 0;

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-[#eef2ed] last:border-0"
                        >
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[#536758]">
                            {formatTanggal(item.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#2b4432]">
                            {item.jenisSampah?.namaJenis || "Jenis tidak diketahui"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[#536758]">
                            {berat.toLocaleString("id-ID")} kg
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold text-[#2b4432]">
                            {status.diterima
                              ? harga > 0
                                ? formatRupiah(insentif)
                                : "Harga belum diatur"
                              : status.label === "Menunggu"
                                ? "Belum dihitung"
                                : formatRupiah(0)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-[#eef2ed] md:hidden">
                {laporan.map((item) => {
                  const status = statusTampilan(item.status?.namaStatus);
                  const berat = Number(item.beratKg ?? item.jumlah ?? 0);
                  const harga = Number(item.jenisSampah?.hargaPerKg ?? 0);
                  const insentif = status.diterima ? berat * harga : 0;

                  return (
                    <article key={item.id} className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-[#2b4432]">
                            {item.jenisSampah?.namaJenis ||
                              "Jenis tidak diketahui"}
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
                          <p className="text-xs text-[#89978b]">Berat</p>
                          <p className="mt-1 font-bold text-[#2b4432]">
                            {berat.toLocaleString("id-ID")} kg
                          </p>
                        </div>
                        <div className="rounded-xl bg-[#f7faf6] p-3">
                          <p className="text-xs text-[#89978b]">Insentif</p>
                          <p className="mt-1 font-bold text-[#2b4432]">
                            {status.diterima
                              ? harga > 0
                                ? formatRupiah(insentif)
                                : "Harga belum diatur"
                              : status.label === "Menunggu"
                                ? "Belum dihitung"
                                : formatRupiah(0)}
                          </p>
                        </div>
                      </div>

                      {status.diterima && harga > 0 && (
                        <p className="text-xs text-[#89978b]">
                          {berat.toLocaleString("id-ID")} kg ×{" "}
                          {formatRupiah(harga)}/kg
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-[#dcebdd] bg-[#f4f9f3] px-4 py-3">
          <p className="text-xs leading-5 text-[#607663]">
            Insentif dihitung untuk laporan berstatus diterima menggunakan
            berat sampah dikalikan harga per kg. Laporan menunggu belum
            menghasilkan insentif, sedangkan laporan ditolak bernilai Rp0.
          </p>
        </div>
      </section>
    </main>
  );
}