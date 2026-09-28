import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const totalLaporan = await prisma.laporanSampah.count();

    const menunggu = await prisma.laporanSampah.count({
      where: { status: { namaStatus: "PENDING" } },
    });

    const diterima = await prisma.laporanSampah.count({
      where: { status: { namaStatus: "DITERIMA" } },
    });

    const ditolak = await prisma.laporanSampah.count({
      where: { status: { namaStatus: "DITOLAK" } },
    });

    const selesai = await prisma.laporanSampah.count({
      where: { status: { namaStatus: "SELESAI" } },
    });

    // Menggunakan beratKg sesuai schema database kamu
    const totalSampah = await prisma.laporanSampah.aggregate({
      _sum: {
        beratKg: true,
      },
    });

    return NextResponse.json({
      totalLaporan,
      menunggu,
      diterima,
      ditolak,
      selesai,
      totalSampah: totalSampah._sum?.beratKg || 0,
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil data statistik dashboard" },
      { status: 500 }
    );
  }
}