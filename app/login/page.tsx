"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPesan("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Email atau password salah.");
      }

      // Simpan data akun untuk dashboard
      const user = result.user || result;

      if (!user.id && !user.userId) {
        throw new Error("Data akun tidak lengkap dari server.");
      }

      localStorage.setItem("user", JSON.stringify(user));

      // DIUBAH: Menggunakan .toUpperCase() agar aman dari perbedaan huruf kapital ("ADMIN" vs "admin")
      const userRole = (user.role || "").toUpperCase();

      if (userRole === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (error) {
      setPesan(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f7f2] px-4 py-10 font-sans">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#e0e9df] bg-white shadow-xl md:grid-cols-2">

        {/* Bagian kiri */}
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
                Bersama Jaga Lingkungan
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight">
                Lingkungan bersih dimulai dari laporanmu.
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#e1eee2]">
                Laporkan penumpukan sampah di sekitarmu
                dan bantu petugas mengetahui lokasi
                yang membutuhkan penanganan.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-16 rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="text-sm leading-6 text-[#e1eee2]">
              "Satu laporan dapat membantu menciptakan
              lingkungan yang lebih terawat."
            </p>
          </div>

          <div className="pointer-events-none absolute -bottom-20 -right-24 h-80 w-80 rounded-full border-[45px] border-white/10" />
          <div className="pointer-events-none absolute -right-12 top-24 h-48 w-48 rounded-full border-[30px] border-white/10" />
        </section>

        {/* Bagian kanan: form login */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 md:py-14">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center md:text-left">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5f0e3] text-2xl md:hidden">
                ♻
              </div>

              <p className="text-sm font-semibold text-[#579469]">
                SELAMAT DATANG KEMBALI
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#294333]">
                Masuk Akun
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#849185]">
                Masukkan email dan password untuk
                mengakses akun Setor Sampah.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {pesan && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {pesan}
                </div>
              )}

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
                  className="w-full rounded-xl border border-[#dce5db] bg-white px-4 py-3.5 text-sm text-[#344639] outline-none transition placeholder:text-[#a5b0a6] focus:border-[#579469] focus:ring-4 focus:ring-[#579469]/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#354c3a]"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-[#dce5db] bg-white px-4 py-3.5 pr-20 text-sm text-[#344639] outline-none transition placeholder:text-[#a5b0a6] focus:border-[#579469] focus:ring-4 focus:ring-[#579469]/10"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#397b4b] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#2f693e] focus:outline-none focus:ring-4 focus:ring-[#397b4b]/20 disabled:cursor-not-allowed disabled:bg-[#9aafa0]"
              >
                {loading ? "Memeriksa akun..." : "Masuk"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e8eee7]" />
              <span className="text-xs text-[#9aa59a]">
                BELUM PUNYA AKUN?
              </span>
              <div className="h-px flex-1 bg-[#e8eee7]" />
            </div>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="w-full rounded-xl border border-[#cddfce] bg-white px-5 py-3.5 text-sm font-bold text-[#397b4b] transition hover:bg-[#f3f8f2]"
            >
              Daftar Akun Baru
            </button>

            <p className="mt-8 text-center text-xs text-[#9aa59a]">
              © {new Date().getFullYear()} Setor Sampah
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}