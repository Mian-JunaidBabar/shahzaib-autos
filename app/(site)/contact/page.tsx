"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build WhatsApp message
    const message = `Hi! I'd like to book a service.
    
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Service:* ${formData.service}
*Preferred Date:* ${formData.date}
*Preferred Time:* ${formData.time}
${formData.notes ? `*Notes:* ${formData.notes}` : ""}`;

    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Header Section */}
      <section className="border-b border-[#1e293b] bg-[#0f172a]/30 pt-8 pb-8">
        <div className="px-4 md:px-8 lg:px-40">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
            Contact Us
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Book a service, schedule a delivery, or get in touch with our team.
            We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 md:px-8 lg:px-40 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Booking Form */}
          <div>
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3b82f6]">
                  calendar_month
                </span>
                Book a Service
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Fill in the form below and we&apos;ll confirm your appointment
                via WhatsApp.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full h-11 rounded-md border border-[#1e293b] bg-[#020817] px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full h-11 rounded-md border border-[#1e293b] bg-[#020817] px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  />
                </div>

                {/* Service */}
                <div>
                  <label
                    htmlFor="service"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full h-11 rounded-md border border-[#1e293b] bg-[#020817] px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  >
                    <option value="">Select a service</option>
                    <option value="Interior Detailing">
                      Interior Detailing
                    </option>
                    <option value="Exterior Detailing">
                      Exterior Detailing
                    </option>
                    <option value="Ceramic Coating">Ceramic Coating</option>
                    <option value="PPF Installation">PPF Installation</option>
                    <option value="Vinyl Wrap">Vinyl Wrap</option>
                    <option value="Custom Mats">Custom Mats</option>
                    <option value="LED Upgrades">LED Upgrades</option>
                    <option value="Other">Other Service</option>
                  </select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full h-11 rounded-md border border-[#1e293b] bg-[#020817] px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Preferred Time
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full h-11 rounded-md border border-[#1e293b] bg-[#020817] px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                    >
                      <option value="">Select time</option>
                      <option value="Morning (9AM - 12PM)">
                        Morning (9AM - 12PM)
                      </option>
                      <option value="Afternoon (12PM - 4PM)">
                        Afternoon (12PM - 4PM)
                      </option>
                      <option value="Evening (4PM - 7PM)">
                        Evening (4PM - 7PM)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Vehicle make/model, specific requirements, etc."
                    className="w-full rounded-md border border-[#1e293b] bg-[#020817] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full h-12 rounded-md bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/20"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    chat
                  </span>
                  Send via WhatsApp
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp */}
              <a
                href="https://wa.me/15551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 bg-[#0f172a] border border-[#1e293b] rounded-xl hover:border-[#25D366]/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                  <span className="material-symbols-outlined text-[#25D366] text-[24px]">
                    chat
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">WhatsApp</h3>
                  <p className="text-sm text-slate-400">+1 555 123 4567</p>
                  <p className="text-xs text-[#25D366] mt-1">
                    Fastest response
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+15551234567"
                className="flex items-start gap-4 p-5 bg-[#0f172a] border border-[#1e293b] rounded-xl hover:border-[#3b82f6]/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center group-hover:bg-[#3b82f6]/20 transition-colors">
                  <span className="material-symbols-outlined text-[#3b82f6] text-[24px]">
                    call
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Phone</h3>
                  <p className="text-sm text-slate-400">+1 555 123 4567</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Mon-Sat, 9AM-7PM
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@ammotors.com"
                className="flex items-start gap-4 p-5 bg-[#0f172a] border border-[#1e293b] rounded-xl hover:border-[#3b82f6]/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center group-hover:bg-[#3b82f6]/20 transition-colors">
                  <span className="material-symbols-outlined text-[#3b82f6] text-[24px]">
                    mail
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Email</h3>
                  <p className="text-sm text-slate-400">info@ammotors.com</p>
                  <p className="text-xs text-slate-500 mt-1">
                    24-48hr response
                  </p>
                </div>
              </a>

              {/* Location */}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 bg-[#0f172a] border border-[#1e293b] rounded-xl hover:border-[#3b82f6]/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center group-hover:bg-[#3b82f6]/20 transition-colors">
                  <span className="material-symbols-outlined text-[#3b82f6] text-[24px]">
                    location_on
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Workshop</h3>
                  <p className="text-sm text-slate-400">
                    123 Auto Street, City
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Get directions</p>
                </div>
              </a>
            </div>

            {/* Business Hours */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3b82f6]">
                  schedule
                </span>
                Business Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Monday - Friday</span>
                  <span className="text-white font-medium">
                    9:00 AM - 7:00 PM
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Saturday</span>
                  <span className="text-white font-medium">
                    10:00 AM - 5:00 PM
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Sunday</span>
                  <span className="text-red-400 font-medium">Closed</span>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
              <div className="aspect-video bg-[#1e293b] flex items-center justify-center relative">
                <div className="text-center">
                  <span className="material-symbols-outlined text-[48px] text-slate-600 mb-2">
                    map
                  </span>
                  <p className="text-slate-500 text-sm">Interactive map</p>
                </div>
                {/* You can replace this with an actual Google Maps embed */}
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-400">
                  123 Auto Street, Downtown, City, State 12345
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
