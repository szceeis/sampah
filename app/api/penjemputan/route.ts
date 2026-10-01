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

    // Jika petugasId tidak valid / kosong, ambil petugas pertama secara otomatis dari database
    if (!petugasId || petugasId === "1") {
      const petugasPertama = await prisma.petugas.findFirst();
      if (petugasPertama) {
        petugasId = petugasPertama.id;
      } else {
        return NextResponse.json(
          { message: "Belum ada data petugas di database. Tambahkan petugas terlebih dahulu." },
          { status: 400 }
        );
      }
    }

    // Validasi dan parsing tanggal jemput dengan aman
    let finalTanggalJemput = new Date();
    if (tanggalJemput && !isNaN(Date.parse(tanggalJemput))) {
      finalTanggalJemput = new Date(tanggalJemput);
    } else {
      // Jika tanggal tidak valid/kosong, otomatis set keesokan harinya
      finalTanggalJemput.setDate(finalTanggalJemput.getDate() + 1);
    }

    const penjemputanBaru = await prisma.penjemputan.create({
      data: {
        laporanId,
        petugasId,
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