"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");
  const [berhasil, setBerhasil] = useState(false);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPesan("");
    setBerhasil(false);

    if (password.length < 8) {
      setPesan("Password minimal 8 karakter.");
      return;
    }

    if (password !== konfirmasiPassword) {
      setPesan("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: nama.trim(),
          email: email.trim().toLowerCase(),
          noHp: noHp.trim(),
          password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || "Pendaftaran gagal. Coba lagi."
        );
      }

      setBerhasil(true);
      setPesan("Akun berhasil dibuat! Mengarahkan ke halaman login...");

      setNama("");
      setEmail("");
      setNoHp("");
      setPassword("");
      setKonfirmasiPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      setPesan(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan sistem."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f7f2] px-4 py-8 font-sans text-[#263b30] sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#e0e9df] bg-white shadow-xl md:grid-cols-2">

        {/* PANEL KIRI */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#397b4b] p-10 text-white md:flex">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-3xl">
                ♻
              </div>
              <span className="text-xl font-extrabold">
                Setor Sampah
              </span>
            </div>

            <div className="mt-24">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d8e9d9]">
                Bergabung Bersama Kami
              </p>

              <h1 className="mt-4 text-4xl font-extrabold leading-tight">
                Mulai peduli dari lingkunganmu.
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-[#e1eee2]">
                Buat akun untuk melaporkan penumpukan
                sampah dan membantu menjaga kebersihan
                lingkungan sekitar.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-16 rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="text-sm leading-6 text-[#e1eee2]">
              Daftar sebagai warga dan gunakan layanan
              pelaporan sampah dengan mudah.
            </p>
          </div>

          <div className="pointer-events-none absolute -bottom-20 -right-24 h-80 w-80 rounded-full border-[45px] border-white/10" />
          <div className="pointer-events-none absolute -right-12 top-24 h-48 w-48 rounded-full border-[30px] border-white/10" />
        </section>

        {/* FORM REGISTER */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 md:py-12">
          <div className="w-full max-w-md">
            <div className="mb-7 text-center md:text-left">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5f0e3] text-2xl md:hidden">
                ♻
              </div>

              <p className="text-sm font-semibold text-[#579469]">
                BUAT AKUN BARU
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#294333]">
                Daftar Akun
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#849185]">
                Lengkapi data berikut untuk membuat akun
                warga Setor Sampah.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {pesan && (
                <div
                  role="status"
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    berhasil
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {pesan}
                </div>
              )}

              {/* NAMA */}
              <div>
                <label
                  htmlFor="nama"
                  className="mb-2 block text-sm font-semibold text-[#354c3a]"
                >
                  Nama Lengkap
                </label>

                <input
                  id="nama"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  autoComplete="name"
                  required
                  className="w-full rounded-xl border border-[#dce5db] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#a5b0a6] focus:border-[#579469] focus:ring-4 focus:ring-[#579469]/10"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#354c3a]"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-[#dce5db] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#a5b0a6] focus:border-[#579469] focus:ring-4 focus:ring-[#579469]/10"
                />
              </div>

              {/* NOMOR HP */}
              <div>
                <label
                  htmlFor="noHp"
                  className="mb-2 block text-sm font-semibold text-[#354c3a]"
                >
                  Nomor HP
                </label>

                <input
                  id="noHp"
                  type="tel"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  autoComplete="tel"
                  required
                  className="w-full rounded-xl border border-[#dce5db] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#a5b0a6] focus:border-[#579469] focus:ring-4 focus:ring-[#579469]/10"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#354c3a]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-[#dce5db] bg-white px-4 py-3 pr-20 text-sm outline-none transition placeholder:text-[#a5b0a6] focus:border-[#579469] focus:ring-4 focus:ring-[#579469]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#579469] hover:text-[#2f693e]"
                  >
                    {showPassword ? "Sembunyikan" : "Lihat"}
                  </button>
                </div>
              </div>

              {/* KONFIRMASI PASSWORD */}
              <div>
                <label
                  htmlFor="konfirmasiPassword"
                  className="mb-2 block text-sm font-semibold text-[#354c3a]"
                >
                  Konfirmasi Password
                </label>

                <div className="relative">
                  <input
                    id="konfirmasiPassword"
                    type={showKonfirmasi ? "text" : "password"}
                    value={konfirmasiPassword}
                    onChange={(e) =>
                      setKonfirmasiPassword(e.target.value)
                    }
                    placeholder="Ulangi password"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-[#dce5db] bg-white px-4 py-3 pr-20 text-sm outline-none transition placeholder:text-[#a5b0a6] focus:border-[#579469] focus:ring-4 focus:ring-[#579469]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowKonfirmasi(!showKonfirmasi)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#579469] hover:text-[#2f693e]"
                  >
                    {showKonfirmasi ? "Sembunyikan" : "Lihat"}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-[#397b4b] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#2f693e] focus:outline-none focus:ring-4 focus:ring-[#397b4b]/20 disabled:cursor-not-allowed disabled:bg-[#9aafa0]"
              >
                {loading ? "Membuat Akun..." : "Daftar Sekarang"}
              </button>
            </form>

            {/* LINK LOGIN */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e8eee7]" />
              <span className="text-xs text-[#9aa59a]">
                SUDAH PUNYA AKUN?
              </span>
              <div className="h-px flex-1 bg-[#e8eee7]" />
            </div>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full rounded-xl border border-[#cddfce] bg-white px-5 py-3.5 text-sm font-bold text-[#397b4b] transition hover:bg-[#f3f8f2]"
            >
              Masuk ke Akun
            </button>

            <p className="mt-7 text-center text-xs text-[#9aa59a]">
              © {new Date().getFullYear()} Setor Sampah
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}