-- AlterTable
ALTER TABLE "FotoSampah" ADD COLUMN     "fotoUrl" TEXT;

-- AlterTable
ALTER TABLE "JenisSampah" ADD COLUMN     "kategoriId" TEXT;

-- AlterTable
ALTER TABLE "LaporanSampah" ADD COLUMN     "alamat" TEXT,
ADD COLUMN     "beratKg" DOUBLE PRECISION,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deskripsi" TEXT,
ADD COLUMN     "statusId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "StatusLaporan" (
    "id" TEXT NOT NULL,
    "namaStatus" TEXT NOT NULL,

    CONSTRAINT "StatusLaporan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KategoriSampah" (
    "id" TEXT NOT NULL,
    "namaKategori" TEXT NOT NULL,

    CONSTRAINT "KategoriSampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Petugas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,

    CONSTRAINT "Petugas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenangananLaporan" (
    "id" TEXT NOT NULL,
    "laporanId" TEXT NOT NULL,
    "petugasId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "catatan" TEXT,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PenangananLaporan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penjemputan" (
    "id" TEXT NOT NULL,
    "laporanId" TEXT NOT NULL,
    "petugasId" TEXT NOT NULL,
    "tanggalJemput" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'MENUNGGU',

    CONSTRAINT "Penjemputan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StatusLaporan_namaStatus_key" ON "StatusLaporan"("namaStatus");

-- CreateIndex
CREATE UNIQUE INDEX "KategoriSampah_namaKategori_key" ON "KategoriSampah"("namaKategori");

-- CreateIndex
CREATE UNIQUE INDEX "Petugas_userId_key" ON "Petugas"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Petugas_email_key" ON "Petugas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Petugas_noHp_key" ON "Petugas"("noHp");

-- CreateIndex
CREATE UNIQUE INDEX "Penjemputan_laporanId_key" ON "Penjemputan"("laporanId");

-- AddForeignKey
ALTER TABLE "JenisSampah" ADD CONSTRAINT "JenisSampah_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "KategoriSampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanSampah" ADD CONSTRAINT "LaporanSampah_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusLaporan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Petugas" ADD CONSTRAINT "Petugas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenangananLaporan" ADD CONSTRAINT "PenangananLaporan_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "LaporanSampah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenangananLaporan" ADD CONSTRAINT "PenangananLaporan_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "Petugas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenangananLaporan" ADD CONSTRAINT "PenangananLaporan_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusLaporan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penjemputan" ADD CONSTRAINT "Penjemputan_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "LaporanSampah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penjemputan" ADD CONSTRAINT "Penjemputan_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "Petugas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
