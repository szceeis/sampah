import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const data = await prisma.jenisSampah.findMany({
      orderBy: { namaJenis: "asc" },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET jenis sampah error:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data jenis sampah." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const namaJenis = String(body.namaJenis ?? "").trim();
    const hargaPerKg = Number(body.hargaPerKg);

    if (!namaJenis) {
      return NextResponse.json(
        { message: "Nama jenis sampah wajib diisi." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(hargaPerKg) || hargaPerKg < 0) {
      return NextResponse.json(
        { message: "Harga harus berupa angka bulat 0 atau lebih." },
        { status: 400 }
      );
    }

    const existing = await prisma.jenisSampah.findUnique({
      where: { namaJenis },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Nama jenis sampah sudah terdaftar." },
        { status: 409 }
      );
    }

    const data = await prisma.jenisSampah.create({
      data: {
        namaJenis,
        hargaPerKg,
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST jenis sampah error:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan jenis sampah." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = String(body.id ?? "").trim();
    const namaJenis = String(body.namaJenis ?? "").trim();
    const hargaPerKg = Number(body.hargaPerKg);

    if (!id || !namaJenis) {
      return NextResponse.json(
        { message: "ID dan nama jenis sampah wajib diisi." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(hargaPerKg) || hargaPerKg < 0) {
      return NextResponse.json(
        { message: "Harga harus berupa angka bulat 0 atau lebih." },
        { status: 400 }
      );
    }

    const duplicate = await prisma.jenisSampah.findFirst({
      where: {
        namaJenis,
        NOT: { id },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        { message: "Nama jenis sampah sudah digunakan." },
        { status: 409 }
      );
    }

    const data = await prisma.jenisSampah.update({
      where: { id },
      data: {
        namaJenis,
        hargaPerKg,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT jenis sampah error:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui jenis sampah." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID jenis sampah wajib disertakan." },
        { status: 400 }
      );
    }

    await prisma.jenisSampah.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Data berhasil dihapus." });
  } catch (error) {
    console.error("DELETE jenis sampah error:", error);
    return NextResponse.json(
      {
        message:
          "Gagal menghapus data. Jenis sampah mungkin sudah dipakai dalam laporan.",
      },
      { status: 400 }
    );
  }
}