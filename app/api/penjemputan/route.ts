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

    // Pastikan laporan belum pernah dijadwalkan sebelumnya
    const existingPenjemputan = await prisma.penjemputan.findUnique({
      where: { laporanId },
    });

    if (existingPenjemputan) {
      return NextResponse.json(
        { message: "Laporan ini sudah memiliki jadwal penjemputan" },
        { status: 400 }
      );
    }

    // Jika petugasId dikirim (misal "2" atau string lain), pastikan petugas tersebut ada di database.
    // Jika tidak ditemukan, ambil petugas pertama yang tersedia.
    let targetPetugasId = petugasId;
    if (targetPetugasId) {
      const cekPetugas = await prisma.petugas.findUnique({
        where: { id: targetPetugasId },
      });
      if (!cekPetugas) {
        const petugasPertama = await prisma.petugas.findFirst();
        targetPetugasId = petugasPertama ? petugasPertama.id : null;
      }
    } else {
      const petugasPertama = await prisma.petugas.findFirst();
      targetPetugasId = petugasPertama ? petugasPertama.id : null;
    }

    if (!targetPetugasId) {
      return NextResponse.json(
        { message: "Tidak ada data petugas yang tersedia di database." },
        { status: 400 }
      );
    }

    // Pastikan tanggalJemput valid. Jika kosong atau string "Invalid Date", set otomatis besok.
    let finalTanggalJemput: Date;
    if (
      tanggalJemput &&
      tanggalJemput !== "Invalid Date" &&
      !isNaN(Date.parse(tanggalJemput))
    ) {
      finalTanggalJemput = new Date(tanggalJemput);
    } else {
      finalTanggalJemput = new Date();
      finalTanggalJemput.setDate(finalTanggalJemput.getDate() + 1); // Set keesokan hari
    }

    // Simpan ke database
    const penjemputanBaru = await prisma.penjemputan.create({
      data: {
        laporanId,
        petugasId: targetPetugasId,
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