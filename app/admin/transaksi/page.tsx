"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface Laporan {
  id: string;
  alamat?: string | null;
  beratKg?: number | null;
  createdAt: string;
  user?: {
    nama?: string | null;
    noHp?: string | null;
  } | null;
  jenisSampah?: {
    namaJenis?: string | null;
    hargaPerKg?: number | null;
  } | null;
  wilayah?: {
    namaWilayah?: string | null;
  } | null;
  status?: {
    namaStatus?: string | null;
  } | null;
  totalInsentif?: number | null;
}

type FilterStatus = "SEMUA" | "MENUNGGU" | "DITERIMA" | "DITOLAK" | "SELESAI";

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);

const getStatus = (status?: string | null): FilterStatus | "LAINNYA" => {
  const value = (status || "MENUNGGU").toUpperCase();

  if (value.includes("TOLAK")) return "DITOLAK";
  if (value.includes("SELESAI")) return "SELESAI";
  if (value.includes("TERIMA") || value.includes("DISETUJUI")) return "DITERIMA";
  if (value.includes("PENDING") || value.includes("MENUNGGU")) return "MENUNGGU";

  return "LAINNYA";
};

const statusStyle = (status: string) => {
  switch (status) {
    case "DITERIMA":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "SELESAI":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "DITOLAK":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case "MENUNGGU":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
};

export default function AdminTransaksiPage() {
  const router = useRouter();

  const [laporanList, setLaporanList] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("SEMUA");

  const fetchLaporan = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/laporan", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Gagal mengambil data transaksi.");
      }

      setLaporanList(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("Gagal memuat transaksi:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const transaksi = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return laporanList.filter((item) => {
      const status = getStatus(item.status?.namaStatus);
      const cocokStatus = filterStatus === "SEMUA" || status === filterStatus;

      const cocokKeyword =
        !search ||
        (item.user?.nama || "").toLowerCase().includes(search) ||
        (item.jenisSampah?.namaJenis || "").toLowerCase().includes(search) ||
        (item.wilayah?.namaWilayah || "").toLowerCase().includes(search);

      return cocokStatus && cocokKeyword;
    });
  }, [laporanList, keyword, filterStatus]);

  const totalLaporan = laporanList.length;

  const totalBerat = laporanList.reduce(
    (total, item) => total + (Number(item.beratKg) || 0),
    0
  );

  const totalInsentif = laporanList.reduce((total, item) => {
    const status = getStatus(item.status?.namaStatus);
    if (status !== "DITERIMA" && status !== "SELESAI") return total;

    const berat = Number(item.beratKg) || 0;
    const harga = Number(item.jenisSampah?.hargaPerKg) || 0;
    const nominal = Number(item.totalInsentif);

    return total + (Number.isFinite(nominal) && nominal > 0 ? nominal : berat * harga);
  }, 0);

  const jumlahMenunggu = laporanList.filter(
    (item) => getStatus(item.status?.namaStatus) === "MENUNGGU"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div>
            <p className="text-lg font-bold tracking-tight text-emerald-800">
              Setor Sampah
            </p>
            <p className="text-xs text-slate-500">Panel Administrasi</p>
          </div>

          <button
            onClick={() => router.push("/admin/dashboard")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
          >
            ← Dashboard Admin
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold text-emerald-700">
              DATA SETORAN
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Transaksi Insentif
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Pantau laporan setoran warga, berat sampah, status verifikasi,
              dan nominal insentif yang tercatat.
            </p>
          </div>

          <button
            onClick={fetchLaporan}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span aria-hidden="true">↻</span>
            {loading ? "Memuat..." : "Muat Ulang"}
          </button>
        </div>

        <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Laporan</p>
              <span className="rounded-xl bg-emerald-50 p-2 text-lg text-emerald-700">
                ▤
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{totalLaporan}</p>
            <p className="mt-1 text-xs text-slate-500">Semua laporan warga</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Berat</p>
              <span className="rounded-xl bg-sky-50 p-2 text-lg text-sky-700">
                ⚖
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">
              {totalBerat.toLocaleString("id-ID", { maximumFractionDigits: 2 })}
              <span className="ml-1 text-base font-semibold text-slate-500">kg</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">Akumulasi berat laporan</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Menunggu Verifikasi</p>
              <span className="rounded-xl bg-amber-50 p-2 text-lg text-amber-700">
                ◷
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{jumlahMenunggu}</p>
            <p className="mt-1 text-xs text-slate-500">Perlu ditinjau admin</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-700 p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-emerald-50">Total Insentif</p>
              <span className="rounded-xl bg-white/15 p-2 text-lg">Rp</span>
            </div>
            <p className="mt-4 text-2xl font-bold">
              {formatRupiah(totalInsentif)}
            </p>
            <p className="mt-1 text-xs text-emerald-100">
              Laporan diterima atau selesai
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Daftar Transaksi</h2>
              <p className="mt-1 text-sm text-slate-500">
                {transaksi.length} data ditampilkan
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari nama, jenis, wilayah..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-64"
              />

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="SEMUA">Semua Status</option>
                <option value="MENUNGGU">Menunggu</option>
                <option value="DITERIMA">Diterima</option>
                <option value="DITOLAK">Ditolak</option>
                <option value="SELESAI">Selesai</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Memuat data transaksi...
            </div>
          ) : error ? (
            <div className="m-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <p className="font-semibold">Data transaksi belum bisa dimuat.</p>
              <p className="mt-1">{error}</p>
              <button
                onClick={fetchLaporan}
                className="mt-3 rounded-lg bg-rose-700 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-800"
              >
                Coba Lagi
              </button>
            </div>
          ) : transaksi.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500">
                ▤
              </div>
              <p className="font-semibold text-slate-800">Transaksi tidak ditemukan</p>
              <p className="mt-1 text-sm text-slate-500">
                Coba ubah kata kunci atau filter status.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Pelapor</th>
                      <th className="px-5 py-3 font-semibold">Setoran</th>
                      <th className="px-5 py-3 font-semibold">Tanggal</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 text-right font-semibold">Insentif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transaksi.map((item) => {
                      const status = getStatus(item.status?.namaStatus);
                      const berat = Number(item.beratKg) || 0;
                      const harga = Number(item.jenisSampah?.hargaPerKg) || 0;
                      const isAccepted = status === "DITERIMA" || status === "SELESAI";
                      const savedTotal = Number(item.totalInsentif);
                      const nominal =
                        Number.isFinite(savedTotal) && savedTotal > 0
                          ? savedTotal
                          : berat * harga;

                      return (
                        <tr key={item.id} className="transition hover:bg-slate-50/70">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-800">
                              {item.user?.nama || "Nama tidak tersedia"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.user?.noHp || "-"}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-800">
                              {item.jenisSampah?.namaJenis || "Jenis tidak tersedia"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {berat.toLocaleString("id-ID")} kg ·{" "}
                              {item.wilayah?.namaWilayah || "Wilayah -"}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-slate-600">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "-"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyle(
                                status
                              )}`}
                            >
                              {item.status?.namaStatus || "MENUNGGU"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <p className="font-bold text-slate-800">
                              {isAccepted ? formatRupiah(nominal) : "—"}
                            </p>
                            {isAccepted && harga === 0 && !item.totalInsentif && (
                              <p className="mt-1 text-xs text-amber-600">
                                Harga belum diatur
                              </p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden">
                {transaksi.map((item) => {
                  const status = getStatus(item.status?.namaStatus);
                  const berat = Number(item.beratKg) || 0;
                  const harga = Number(item.jenisSampah?.hargaPerKg) || 0;
                  const isAccepted = status === "DITERIMA" || status === "SELESAI";
                  const savedTotal = Number(item.totalInsentif);
                  const nominal =
                    Number.isFinite(savedTotal) && savedTotal > 0
                      ? savedTotal
                      : berat * harga;

                  return (
                    <article key={item.id} className="space-y-3 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900">
                            {item.jenisSampah?.namaJenis || "Jenis tidak tersedia"}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {berat.toLocaleString("id-ID")} kg
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyle(
                            status
                          )}`}
                        >
                          {item.status?.namaStatus || "MENUNGGU"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-slate-400">Pelapor</p>
                          <p className="mt-1 font-medium text-slate-700">
                            {item.user?.nama || "-"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.user?.noHp || ""}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Wilayah</p>
                          <p className="mt-1 font-medium text-slate-700">
                            {item.wilayah?.namaWilayah || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-end justify-between border-t border-slate-100 pt-3">
                        <div>
                          <p className="text-xs text-slate-400">Tanggal laporan</p>
                          <p className="mt-1 text-sm text-slate-600">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString("id-ID")
                              : "-"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Insentif</p>
                          <p className="mt-1 font-bold text-emerald-700">
                            {isAccepted ? formatRupiah(nominal) : "—"}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Catatan: nominal dihitung dari berat × harga per kg untuk laporan berstatus
          diterima atau selesai. Pastikan harga jenis sampah sudah diisi pada data admin.
        </p>
      </section>
    </main>
  );
}