import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// POST: Membuat jadwal penjemputan baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { laporanId, petugasId, tanggalJemput } = body;

    if (!laporanId) {
      return NextResponse.json(
        { message: "ID Laporan wajib diisi" },
        { status: 400 }
      );
    }

    // Pastikan laporan belum pernah dijadwalkan
    const existingPenjemputan = await prisma.penjemputan.findUnique({
      where: { laporanId },
    });

    if (existingPenjemputan) {
      return NextResponse.json(
        { message: "Laporan ini sudah memiliki jadwal penjemputan" },
        { status: 400 }
      );
    }

    // Jika petugasId tidak dikirim dari frontend, ambil petugas pertama secara otomatis
    if (!petugasId) {
      const petugasPertama = await prisma.petugas.findFirst();
      petugasId = petugasPertama ? petugasPertama.id : null;
    }

    // Jika tanggalJemput tidak dikirim, otomatis set keesokan harinya
    const finalTanggalJemput = tanggalJemput 
      ? new Date(tanggalJemput) 
      : new Date(Date.now() + 86400000); // Besok

    const penjemputanBaru = await prisma.penjemputan.create({
      data: {
        laporanId,
        petugasId: petugasId || undefined, // Boleh null jika tabel mengizinkan, atau pastikan data petugas ada
        tanggalJemput: finalTanggalJemput,
        status: "MENUNGGU",
      },
    });

    return NextResponse.json(penjemputanBaru, { status: 201 });
  } catch (error: any) {
    console.error("Error POST /api/penjemputan:", error);
    return NextResponse.json(
      { message: error.message || "Gagal membuat jadwal penjemputan" },
      { status: 500 }
    );
  }
}

// GET: Mengambil semua daftar penjemputan
export async function GET() {
  try {
    const data = await prisma.penjemputan.findMany({
      include: {
        laporan: {
          include: {
            user: true,
            wilayah: true,
            jenisSampah: true,
          },
        },
        petugas: true,
      },
      orderBy: { tanggalJemput: "asc" },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error GET /api/penjemputan:", error);
    return NextResponse.json(
      { message: "Gagal memuat data penjemputan" },
      { status: 500 }
    );
  }
}