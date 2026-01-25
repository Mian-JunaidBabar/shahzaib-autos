"use client";

import Link from "next/link";

const themeColors = [
  { name: "Blue", color: "bg-blue-500", active: true },
  { name: "Green", color: "bg-emerald-500", active: false },
  { name: "Violet", color: "bg-violet-500", active: false },
  { name: "Amber", color: "bg-amber-500", active: false },
];

export default function SettingsPage() {
  return (
    <div className="max-w-[1400px] mx-auto w-full pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link
              className="hover:text-primary transition-colors"
              href="/admin"
            >
              Admin
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span>Configuration</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            System Settings
            <span className="inline-flex items-center rounded-full bg-muted border border-border px-2.5 py-0.5 text-xs font-semibold text-slate-400">
              v1.0.0
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Last Sync:{" "}
            <span className="text-slate-300 font-medium">10 mins ago</span>
          </span>
          <div className="h-4 w-px bg-border"></div>
          <button className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              history
            </span>{" "}
            View Logs
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main Settings */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Workshop Information */}
          <section className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  storefront
                </span>
                Workshop Information
              </h3>
              <p className="text-xs text-muted-foreground mt-1 ml-8">
                General details used in invoices and customer communications.
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Workshop Name
                  </label>
                  <input
                    className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                    type="text"
                    defaultValue="Shahzaib Autos"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Legal Entity Name
                  </label>
                  <input
                    className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                    type="text"
                    defaultValue="Shahzaib Autos Pvt Ltd"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Address
                </label>
                <textarea
                  className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                  rows={3}
                  defaultValue="Shop 12, Auto Complex, Industrial Area, Karachi - 75000"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Support Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 material-symbols-outlined text-[20px]">
                      mail
                    </span>
                    <input
                      className="pl-10 w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                      type="email"
                      defaultValue="support@shahzaibautos.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Support Phone
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 material-symbols-outlined text-[20px]">
                      call
                    </span>
                    <input
                      className="pl-10 w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                      type="tel"
                      defaultValue="+92 21 1234 5678"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* WhatsApp Configuration */}
          <section className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#25D366]">
                    chat
                  </span>
                  WhatsApp API Configuration
                </h3>
                <p className="text-xs text-muted-foreground mt-1 ml-8">
                  Manage connection to Meta Cloud API for automated messaging.
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse"></span>
                <span className="text-xs font-medium text-success">
                  Connected
                </span>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 flex gap-3 items-start">
                <span className="material-symbols-outlined text-blue-400 text-[20px] mt-0.5">
                  info
                </span>
                <div>
                  <p className="text-sm text-blue-200">Webhook URL</p>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="text-xs bg-black/30 px-2 py-1 rounded text-blue-300 font-mono">
                      https://api.shahzaibautos.com/webhooks/whatsapp
                    </code>
                    <button
                      className="text-blue-400 hover:text-white transition-colors"
                      title="Copy"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        content_copy
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Phone Number ID
                </label>
                <input
                  className="font-mono w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                  type="text"
                  defaultValue="1092837465564738"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  WhatsApp Business Account ID
                </label>
                <input
                  className="font-mono w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                  type="text"
                  defaultValue="1002938475665748"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Permanent Access Token
                </label>
                <div className="relative">
                  <input
                    className="pr-10 font-mono w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                    type="password"
                    defaultValue="EAAHg................................"
                  />
                  <button className="absolute right-3 top-2.5 text-slate-500 hover:text-white">
                    <span className="material-symbols-outlined text-[20px]">
                      visibility_off
                    </span>
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Token must have `whatsapp_business_management` and
                  `whatsapp_business_messaging` permissions.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Branding */}
          <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="bg-muted/50 p-4 border-b border-border">
              <h3 className="font-semibold text-slate-200 text-sm uppercase tracking-wide">
                Branding
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-3">
                  Company Logo
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer group">
                  <div className="h-16 w-16 mb-3 rounded-full bg-slate-800 flex items-center justify-center border border-border shadow-lg">
                    <span className="material-symbols-outlined text-3xl text-primary">
                      directions_car
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-300 group-hover:text-white">
                    Click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    SVG, PNG, JPG (Max. 2MB)
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-3">
                  Theme Accent
                </label>
                <div className="flex gap-3">
                  {themeColors.map((color) => (
                    <button
                      key={color.name}
                      className={`h-8 w-8 rounded-full ${color.color} ${
                        color.active
                          ? "ring-2 ring-white ring-offset-2 ring-offset-card"
                          : "hover:ring-2 hover:ring-slate-500 ring-offset-2 ring-offset-card transition-all"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Server Status */}
          <section className="rounded-xl border border-border bg-gradient-to-br from-card to-muted p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded bg-background border border-border">
                <span className="material-symbols-outlined text-slate-400">
                  dns
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Server Status</p>
                <p className="font-bold text-white">Operational</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Database Load</span>
                  <span className="text-success font-mono">12%</span>
                </div>
                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[12%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">API Latency</span>
                  <span className="text-primary font-mono">45ms</span>
                </div>
                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[35%] rounded-full"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Fixed Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 hidden sm:flex">
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span>
              Changes may take a few minutes to propagate across the system.
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-border bg-muted/50 hover:bg-muted text-slate-300 font-medium transition-all">
              Discard
            </button>
            <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                save
              </span>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
