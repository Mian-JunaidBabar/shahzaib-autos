import Link from "next/link";

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link
              className="hover:text-primary transition-colors"
              href="/admin/bookings"
            >
              Bookings
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span>#BKG-{id}</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Booking Details
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/20">
              Confirmed
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            Created:{" "}
            <span className="text-slate-300 font-medium">Oct 22, 2024</span>
          </span>
          <div className="h-4 w-px bg-border"></div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            Channel:{" "}
            <span className="text-slate-300 font-medium">Web Portal</span>
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Customer Information */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  person
                </span>
                Customer Information
              </h3>
              <button className="text-xs text-primary hover:underline">
                Edit Details
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-border flex items-center justify-center text-2xl font-bold text-slate-300 shadow-inner">
                  RS
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Full Name
                    </p>
                    <p className="text-slate-100 font-medium text-lg">
                      Rahul Sharma
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Phone Number
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-100 font-medium text-lg">
                        +91 98765 43210
                      </p>
                      <a
                        className="text-[#25D366] hover:bg-[#25D366]/10 p-1 rounded transition-colors"
                        href="#"
                        title="Chat on WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          chat
                        </span>
                      </a>
                      <a
                        className="text-primary hover:bg-primary/10 p-1 rounded transition-colors"
                        href="#"
                        title="Call"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          call
                        </span>
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Customer Location
                    </p>
                    <p className="text-slate-100">Mumbai, Maharashtra</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Vehicle Model
                    </p>
                    <div className="inline-flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded text-sm text-slate-300 mt-1">
                      <span className="material-symbols-outlined text-[14px]">
                        directions_car
                      </span>
                      BMW 5 Series (2022)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Information */}
          <div className="rounded-xl border border-border bg-card shadow-sm flex-1">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  event_available
                </span>
                Appointment Information
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date & Time Banner */}
              <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-900/20 to-card border border-primary/20 rounded-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                    <span className="material-symbols-outlined text-[24px]">
                      calendar_month
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Scheduled Date & Time
                    </p>
                    <h4 className="text-xl font-bold text-white">
                      Oct 24, 2024{" "}
                      <span className="text-slate-400 font-normal mx-1">
                        at
                      </span>{" "}
                      10:00 AM
                    </h4>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                    Upcoming in 2 days
                  </span>
                </div>
              </div>

              {/* Assigned Technician */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-muted-foreground">
                    engineering
                  </span>
                  Assigned Technician
                </h4>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-600">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">John Doe</p>
                    <p className="text-xs text-muted-foreground">
                      Senior Installer
                    </p>
                  </div>
                  <button className="ml-auto text-xs text-primary hover:text-primary/80">
                    Change
                  </button>
                </div>
              </div>

              {/* Location / Bay */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-muted-foreground">
                    garage
                  </span>
                  Location / Bay
                </h4>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                    <span className="material-symbols-outlined">warehouse</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Bay #4</p>
                    <p className="text-xs text-muted-foreground">
                      Main Workshop, Mumbai
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-slate-300 mb-2 block flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-warning">
                    warning
                  </span>
                  Special Instructions
                </label>
                <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    <span className="font-semibold text-warning/80 block mb-1">
                      Customer Note:
                    </span>
                    &quot;Please check the trunk fitment specifically, I have a
                    custom subwoofer installed on the left side. Needs careful
                    handling.&quot;
                  </p>
                  <div className="mt-3 pt-3 border-t border-warning/10 flex gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] bg-background/50 border border-warning/20 px-2 py-1 rounded text-warning/80">
                      <span className="material-symbols-outlined text-[12px]">
                        check_circle
                      </span>{" "}
                      Noted by Technician
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Service Requested */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="bg-muted/50 p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-slate-200 text-sm uppercase tracking-wide">
                Service Requested
              </h3>
              <span className="text-xs text-muted-foreground">
                Job ID: #{id}
              </span>
            </div>
            <div className="p-0">
              <div className="relative aspect-video w-full bg-muted">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-600 text-[48px]">
                    directions_car
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h4 className="font-bold text-white text-lg">
                    7D Custom Mats Installation
                  </h4>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-muted-foreground mb-4">
                  Full vehicle floor coverage. Black with Red Stitching.
                </p>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">
                      Total Service Cost
                    </p>
                    <p className="text-xl font-bold text-white">$145.00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-0.5">
                      Inventory Status
                    </p>
                    <div className="flex items-center justify-end gap-1.5 text-success font-medium text-sm">
                      <span className="h-2 w-2 rounded-full bg-success"></span>
                      Reserved (1)
                    </div>
                  </div>
                </div>
                <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-blue-400 text-[18px] mt-0.5">
                    info
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-blue-200">
                      Preparation
                    </p>
                    <p className="text-xs text-blue-300/80 mt-0.5">
                      Ensure vehicle interior is vacuumed before starting
                      installation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-5">
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full group relative flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-4 transition-all shadow-lg shadow-blue-900/20">
                <span className="material-symbols-outlined text-[20px]">
                  notifications_active
                </span>
                Notify Customer
              </button>
              <button className="w-full group relative flex items-center justify-center gap-2 rounded-lg bg-muted border border-border hover:bg-muted/80 text-white font-medium py-2.5 px-4 transition-all">
                <span className="material-symbols-outlined text-[20px]">
                  play_circle
                </span>
                Start Service
              </button>
              <div className="h-px bg-border my-2"></div>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 hover:bg-muted text-slate-300 hover:text-white text-sm font-medium py-2 px-3 transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    edit_calendar
                  </span>
                  Reschedule
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 hover:bg-destructive/10 hover:border-destructive/50 text-slate-300 hover:text-destructive text-sm font-medium py-2 px-3 transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    cancel
                  </span>
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="rounded-xl border border-border bg-gradient-to-br from-card to-muted p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded bg-background border border-border">
                <span className="material-symbols-outlined text-blue-400">
                  verified
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Booking Status</p>
                <p className="font-bold text-white">Ready for Check-in</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              All inventory items are allocated and bay is reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
