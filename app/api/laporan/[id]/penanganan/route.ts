
import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { petugasId, namaStatus, catatan } = body;

    if (!petugasId || !namaStatus) {
      return NextResponse.json(
        { message: "ID petugas dan status wajib diisi" },
        { status: 400 }
      );
    }

    const statusDiizinkan = [
      "DITERIMA",
      "DITOLAK",
      "SELESAI",
    ];

    if (!statusDiizinkan.includes(namaStatus)) {
      return NextResponse.json(
        { message: "Status tidak valid" },
        { status: 400 }
      );
    }

    const laporan = await prisma.laporanSampah.findUnique({
      where: { id },
    });

    if (!laporan) {
      return NextResponse.json(
        { message: "Laporan tidak ditemukan" },
        { status: 404 }
      );
    }

    const status = await prisma.statusLaporan.findFirst({
      where: { namaStatus },
    });

    if (!status) {
      return NextResponse.json(
        { message: `Status ${namaStatus} belum tersedia di database` },
        { status: 400 }
      );
    }

    const hasil = await prisma.laporanSampah.update({
      where: { id },
      data: {
        statusId: status.id,
      },
      include: {
        status: true,
        user: true,
        jenisSampah: true,
        wilayah: true,
      },
    });

    return NextResponse.json({
      message: "Status laporan berhasil diperbarui",
      laporan: hasil,
      petugasId,
      catatan: catatan || "",
    });
  } catch (error) {
    console.error("Gagal menangani laporan:", error);

    return NextResponse.json(
      { message: "Gagal memperbarui status laporan" },
      { status: 500 }
    );
  }
}