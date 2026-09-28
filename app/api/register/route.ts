
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { nama, email, noHp, password } = await request.json();

    if (!nama || !email || !noHp || !password) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password minimal 8 karakter." },
        { status: 400 }
      );
    }

    const emailBersih = String(email).trim().toLowerCase();
    const namaBersih = String(nama).trim();
    const noHpBersih = String(noHp).trim();

    const userAda = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailBersih },
          { noHp: noHpBersih },
        ],
      },
    });

    if (userAda) {
      return NextResponse.json(
        { message: "Email atau nomor HP sudah terdaftar." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userBaru = await prisma.user.create({
      data: {
        nama: namaBersih,
        email: emailBersih,
        noHp: noHpBersih,
        password: passwordHash,
        role: "USER",
      },
    });

    return NextResponse.json(
      {
        message: "Akun berhasil dibuat.",
        user: {
          id: userBaru.id,
          nama: userBaru.nama,
          email: userBaru.email,
          role: userBaru.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat akun." },
      { status: 500 }
    );
  }
}