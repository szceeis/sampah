import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// POST: Membuat jadwal penjemputan baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { laporanId, petugasId, tanggalJemput } = body;

    if (!laporanId || !petugasId || !tanggalJemput) {
      return NextResponse.json(
        { message: "Laporan, Petugas, dan Tanggal Jemput wajib diisi" },
        { status: 400 }
      );
    }

    // Pastikan laporan belum pernah dijadwalkan (karena relasinya @unique)
    const existingPenjemputan = await prisma.penjemputan.findUnique({
      where: { laporanId },
    });

    if (existingPenjemputan) {
      return NextResponse.json(
        { message: "Laporan ini sudah memiliki jadwal penjemputan" },
        { status: 400 }
      );
    }

    const penjemputanBaru = await prisma.penjemputan.create({
      data: {
        laporanId,
        petugasId,
        tanggalJemput: new Date(tanggalJemput), // Mengubah string tanggal ke format DateTime
        status: "MENUNGGU",
      },
    });

    return NextResponse.json(penjemputanBaru, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal membuat jadwal penjemputan" },
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
    return NextResponse.json(
      { message: "Gagal memuat data penjemputan" },
      { status: 500 }
    );
  }
}