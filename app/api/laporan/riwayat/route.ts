import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID tidak ditemukan." },
        { status: 400 }
      );
    }

    const laporan = await prisma.laporanSampah.findMany({
      where: { userId },
      include: {
        jenisSampah: true,
        wilayah: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(laporan);
  } catch (error) {
    console.error("Gagal mengambil riwayat laporan:", error);

    return NextResponse.json(
      { message: "Gagal mengambil riwayat laporan." },
      { status: 500 }
    );
  }
}