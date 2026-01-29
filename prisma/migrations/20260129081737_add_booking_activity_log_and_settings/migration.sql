-- CreateTable
CREATE TABLE "booking_activity_logs" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "slotDuration" INTEGER NOT NULL DEFAULT 60,
    "bufferTime" INTEGER NOT NULL DEFAULT 15,
    "advanceBookingDays" INTEGER NOT NULL DEFAULT 30,
    "allowSameDayBooking" BOOLEAN NOT NULL DEFAULT true,
    "operatingHours" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_settings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booking_activity_logs" ADD CONSTRAINT "booking_activity_logs_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
