-- CreateTable
CREATE TABLE "business_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "business_name" TEXT NOT NULL DEFAULT 'Shahzaib Autos',
    "booking_time_slots" TEXT[] DEFAULT ARRAY['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']::TEXT[],
    "max_bookings_per_slot" INTEGER NOT NULL DEFAULT 3,
    "min_advance_booking_days" INTEGER NOT NULL DEFAULT 1,
    "max_advance_booking_days" INTEGER NOT NULL DEFAULT 30,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_settings_pkey" PRIMARY KEY ("id")
);
