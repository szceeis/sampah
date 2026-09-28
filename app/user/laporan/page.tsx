"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Option = {
  id: string;
  namaJenis?: string;
  namaWilayah?: string;
};

export default function FormLaporanPage() {
  const router = useRouter();

  const [jenisSampahList, setJenisSampahList] = useState<Option[]>([]);
  const [wilayahList, setWilayahList] = useState<Option[]>([]);

  const [userId, setUserId] = useState("");
  const [jenisSampahId, setJenisSampahId] = useState("");
  const [wilayahId, setWilayahId] = useState("");
  const [beratKg, setBeratKg] = useState("");
  const [alamat, setAlamat] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [pesan, setPesan] = useState("");
  const [error, setError] = useState(false);

  // Ambil ID pengguna dari localStorage saat halaman dibuka.
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      const id = user.id || user.userId;

      if (!id || typeof id !== "string") {
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      setUserId(id);
    } catch {
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  // Ambil pilihan jenis sampah dan wilayah.
  useEffect(() => {
    let masihAktif = true;

    async function ambilDataPilihan() {
      try {
        const [jenisRes, wilayahRes] = await Promise.all([
          fetch("/api/jenis-sampah"),
          fetch("/api/wilayah"),
        ]);

        if (!jenisRes.ok || !wilayahRes.ok) {
          throw new Error("Gagal mengambil data jenis sampah atau wilayah.");
        }

        const jenisData: unknown = await jenisRes.json();
        const wilayahData: unknown = await wilayahRes.json();

        if (!Array.isArray(jenisData) || !Array.isArray(wilayahData)) {
          throw new Error("Format data pilihan dari server tidak sesuai.");
        }

        if (!masihAktif) return;

        setJenisSampahList(jenisData);
        setWilayahList(wilayahData);
      } catch (err) {
        if (!masihAktif) return;

        setPesan(
          err instanceof Error
            ? err.message
            : "Data pilihan gagal dimuat. Coba refresh halaman."
        );
        setError(true);
      } finally {
        if (masihAktif) {
          setLoadingData(false);
        }
      }
    }

    ambilDataPilihan();

    return () => {
      masihAktif = false;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPesan("");
    setError(false);

    if (!userId) {
      setPesan("Sesi pengguna tidak ditemukan. Silakan login kembali.");
      setError(true);
      return;
    }

    if (!jenisSampahId || !wilayahId) {
      setPesan("Pilih jenis sampah dan wilayah terlebih dahulu.");
      setError(true);
      return;
    }

    const jumlah = Number(beratKg.trim().replace(",", "."));
    
    if (!Number.isFinite(jumlah) || jumlah <= 0) {
      setPesan("Berat sampah harus lebih dari 0 kg.");
      setError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/laporan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          jenisSampahId,
          wilayahId,
          jumlah,
          alamat: alamat.trim(),
          deskripsi: deskripsi.trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Laporan gagal dikirim (HTTP ${response.status}).`
        );
      }

      setPesan("Laporan berhasil disimpan. Mengalihkan ke riwayat...");
      setError(false);
      router.push("/user/riwayat");
    } catch (err) {
      setPesan(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengirim laporan."
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f7f2] px-4 py-8 font-sans text-[#263b30] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.push("/user/dashboard")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[#526b59] transition hover:bg-[#e5eee4] hover:text-[#28583c]"
        >
          <span className="text-lg">←</span>
          Kembali ke Dashboard
        </button>

        <div className="mb-7">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#dcebdd] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#39744b]">
            <span className="h-2 w-2 rounded-full bg-[#4d9561]" />
            Layanan Warga
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#243c2c] sm:text-4xl">
            Form Laporan Sampah
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#718074] sm:text-base">
            Isi informasi sampah yang ingin dilaporkan. Pastikan data dan
            alamat sudah benar sebelum mengirim laporan.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e0e9df] bg-white shadow-[0_8px_30px_rgba(44,76,50,0.07)]">
          <div className="border-b border-[#e8eee7] bg-[#fbfdfb] px-6 py-5 sm:px-8">
            <h2 className="text-lg font-bold text-[#2b4432]">
              Informasi Laporan
            </h2>
            <p className="mt-1 text-sm text-[#879387]">
              Lengkapi kolom di bawah ini
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 px-6 py-7 sm:px-8 sm:py-8"
          >
            {pesan && (
              <div
                role="alert"
                className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                  error
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-green-200 bg-green-50 text-green-800"
                }`}
              >
                {pesan}
              </div>
            )}

            <div>
              <label
                htmlFor="jenisSampah"
                className="mb-2 block text-sm font-semibold text-[#354c3a]"
              >
                Jenis Sampah <span className="text-red-500">*</span>
              </label>

              <select
                id="jenisSampah"
                value={jenisSampahId}
                onChange={(e) => setJenisSampahId(e.target.value)}
                required
                disabled={loadingData || loading}
                className="w-full rounded-xl border border-[#dce5db] bg-white px-4 py-3 text-sm text-[#344639] outline-none transition focus:border-[#579469] focus:ring-4 focus:ring-[#579469]/10 disabled:bg-gray-100"
              >
                <option value="">
                  {loadingData
                    ? "Memuat jenis sampah..."
                    : "-- Pilih Jenis Sampah --"}
                </option>

                {jenisSampahList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.namaJenis ?? "Jenis sampah"}
                  </option>
                ))}
              </select>

              {!loadingData && jenisSampahList.length === 0 && (
                <p className="mt-2 text-xs text-red-600">
                  Data jenis sampah kosong atau belum tersedia.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="wilayah"
                className="mb-2 block text-sm font-semibold text-[#354c3a]"
              >
                Wilayah <span className="text-red-500">*</span>
              </label>

              <select
                id="wilayah"
                value={wilayahId}
                onChange={(e) => setWilayahId(e.target.value)}
                required
                disabled={loadingData || loading}
                className="w-full rounded-xl border border-[#dce5db] bg-white px-4 py-3 text-sm text-[#344639] outline-none transition focus:border-[#579469] focus:ring-4 focus:ring-[#579469]/10 disabled:bg-gray-100"
              >
                <option value="">
                  {loadingData
                    ? "Memuat wilayah..."
                    : "-- Pilih Wilayah --"}
                </option>

                {wilayahList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.namaWilayah ?? "Wilayah"}
                  </option>
                ))}
              </select>

              {!loadingData && wilayahList.length === 0 && (
                <p className="mt-2 text-xs text-red-600">
                  Data wilayah kosong atau belum tersedia.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="berat"
                className="mb-2 block text-sm font-semibold text-[#354c3a]"
              >
                Perkiraan Berat Sampah{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  id="berat"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={beratKg}
                  onChange={(e) => setBeratKg(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Contoh: 2.5"
                  className="w-full rounded-xl border border-[#dce5db] bg-white px-4 py-3 pr-14 text-sm text-[#344639] outline-none transition placeholder:text-[#a5b0a6] focus:border-[#579469] focus:ring-4 focus:ring-[#579469]/10 disabled:bg-gray-100"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#89978b]">
                  KG
                </span>
              </div>

              <p className="mt-2 text-xs text-[#89978b]">
                Masukkan perkiraan berat sampah dalam kilogram.
              </p>
            </div>

            <div>
              <label
                htmlFor="alamat"
                className="mb-2 block text-sm font-semibold text-[#354c3a]"
              >
                Alamat Lengkap
              </label>

              <input
                id="alamat"
                type="text"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                disabled={loading}
                placeholder="Nama jalan, nomor rumah, RT/RW, patokan..."
                className="w-full rounded-xl border border-[#dce5db] bg-white px-4 py-3 text-sm text-[#344639] outline-none transition placeholder:text-[#a5b0a6] focus:border-[#579469] focus:ring-4 focus:ring-[#579469]/10 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="deskripsi"
                className="mb-2 block text-sm font-semibold text-[#354c3a]"
              >
                Deskripsi Tambahan
              </label>

              <textarea
                id="deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                disabled={loading}
                rows={4}
                placeholder="Jelaskan kondisi atau keterangan tambahan mengenai sampah..."
                className="w-full resize-y rounded-xl border border-[#dce5db] bg-white px-4 py-3 text-sm leading-6 text-[#344639] outline-none transition placeholder:text-[#a5b0a6] focus:border-[#579469] focus:ring-4 focus:ring-[#579469]/10 disabled:bg-gray-100"
              />
            </div>

            <div className="rounded-xl border border-[#dcebdd] bg-[#f4f9f3] px-4 py-3">
              <p className="text-xs leading-5 text-[#607663]">
                Setelah laporan berhasil disimpan, halaman akan berpindah ke
                Riwayat Laporan agar kamu bisa melihat statusnya.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/user/dashboard")}
                disabled={loading}
                className="w-full rounded-xl border border-[#dce5db] bg-white px-5 py-3 text-sm font-semibold text-[#536758] transition hover:bg-[#f5f8f4] disabled:opacity-60 sm:w-auto"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading || loadingData}
                className="w-full rounded-xl bg-[#397b4b] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#2f693e] focus:outline-none focus:ring-4 focus:ring-[#397b4b]/20 disabled:cursor-not-allowed disabled:bg-[#9aafa0] sm:flex-1"
              >
                {loading ? "Mengirim Laporan..." : "Kirim Laporan"}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-[#849285]">
          Setor Sampah · Layanan Pelaporan Warga
        </p>
      </div>
    </main>
  );
}