import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const laporan = await prisma.laporanSampah.findMany({
      include: {
        user: true,
        jenisSampah: true,
        wilayah: true,
        fotoSampah: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(laporan);
  } catch (error) {
    console.error("GET /api/laporan error:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data laporan." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const userId =
      typeof body.userId === "string" ? body.userId.trim() : "";

    const jenisSampahId =
      typeof body.jenisSampahId === "string"
        ? body.jenisSampahId.trim()
        : "";

    const wilayahId =
      typeof body.wilayahId === "string" ? body.wilayahId.trim() : "";

    // Terima nama field beratKg maupun jumlah.
    const nilaiBerat = body.beratKg ?? body.jumlah;
    const beratKg = Number(
      String(nilaiBerat ?? "").trim().replace(",", ".")
    );

    const alamat =
      typeof body.alamat === "string" ? body.alamat.trim() : null;

    const deskripsi =
      typeof body.deskripsi === "string" ? body.deskripsi.trim() : null;

    if (!userId || !jenisSampahId || !wilayahId) {
      return NextResponse.json(
        {
          message: "User, jenis sampah, dan wilayah wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(beratKg) || beratKg <= 0) {
      return NextResponse.json(
        {
          message: "Berat sampah harus berupa angka lebih dari 0 kg.",
        },
        { status: 400 }
      );
    }

    // Pastikan user, jenis sampah, dan wilayah memang ada.
    const [user, jenisSampah, wilayah] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      }),
      prisma.jenisSampah.findUnique({
        where: { id: jenisSampahId },
        select: { id: true },
      }),
      prisma.wilayah.findUnique({
        where: { id: wilayahId },
        select: { id: true },
      }),
    ]);

    if (!user) {
      return NextResponse.json(
        { message: "Data pengguna tidak ditemukan. Silakan login kembali." },
        { status: 400 }
      );
    }

    if (!jenisSampah) {
      return NextResponse.json(
        { message: "Jenis sampah yang dipilih tidak ditemukan." },
        { status: 400 }
      );
    }

    if (!wilayah) {
      return NextResponse.json(
        { message: "Wilayah yang dipilih tidak ditemukan." },
        { status: 400 }
      );
    }

    const statusPending = await prisma.statusLaporan.findUnique({
      where: {
        namaStatus: "PENDING",
      },
    });

    if (!statusPending) {
      return NextResponse.json(
        {
          message:
            'Status "PENDING" belum tersedia di tabel StatusLaporan.',
        },
        { status: 400 }
      );
    }

    const laporanBaru = await prisma.laporanSampah.create({
      data: {
        userId,
        jenisSampahId,
        wilayahId,
        beratKg,
        alamat: alamat || null,
        deskripsi: deskripsi || null,
        statusId: statusPending.id,
      },
      include: {
        jenisSampah: true,
        wilayah: true,
        status: true,
      },
    });

    return NextResponse.json(
      {
        message: "Laporan berhasil disimpan.",
        laporan: laporanBaru,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/laporan error:", error);

    const detail =
      error instanceof Error
        ? error.message
        : "Kesalahan tidak diketahui.";

    return NextResponse.json(
      {
        message: "Gagal membuat laporan.",
        detail,
      },
      { status: 500 }
    );
  }
}