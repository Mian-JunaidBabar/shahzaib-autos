"use client";

import { useState } from "react";
import Link from "next/link";
import { generateBookingMessage, openWhatsApp } from "@/lib/whatsapp";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  MessageCircle,
  ChevronLeft,
  Wrench,
  Car,
  CheckCircle,
} from "lucide-react";

interface FormData {
  name: string;
  phone: string;
  address: string;
  date: string;
  time: string;
  carModel: string;
  serviceType: string;
  notes: string;
}

const serviceTypes = [
  "7D Mat Installation",
  "LED Light Installation",
  "Ceramic Coating",
  "Body Wrap",
  "Interior Detailing",
  "Caliper Painting",
  "Leather Upholstery",
  "Engine Detailing",
  "Multiple Services",
  "Other",
];

const timeSlots = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
];

export default function BookingPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    date: "",
    time: "",
    carModel: "",
    serviceType: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.date) newErrors.date = "Please select a date";
    if (!formData.time) newErrors.time = "Please select a time slot";
    if (!formData.serviceType)
      newErrors.serviceType = "Please select a service";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const message = generateBookingMessage({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      date: formData.date,
      time: formData.time,
      carModel: formData.carModel,
      serviceType: formData.serviceType,
      notes: formData.notes,
    });

    openWhatsApp(message);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* Header */}
      <section className="border-b border-[var(--border)] bg-[var(--section-bg)] pt-6 pb-6 transition-colors duration-300">
        <div className="px-4 md:px-8 lg:px-40">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)]">
            Book Installation
          </h1>
          <p className="text-[var(--text-muted)] mt-2">
            Schedule a home visit from our expert technicians
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-4 md:px-8 lg:px-40 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 transition-colors duration-300">
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-[var(--primary)]" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`w-full h-12 px-4 rounded-lg bg-[var(--background)] border ${
                        errors.name
                          ? "border-red-500"
                          : "border-[var(--border)]"
                      } text-[var(--text-primary)] placeholder-[var(--text-subtle)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                    >
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-subtle)]" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0300 1234567"
                        className={`w-full h-12 pl-12 pr-4 rounded-lg bg-[var(--background)] border ${
                          errors.phone
                            ? "border-red-500"
                            : "border-[var(--border)]"
                        } text-[var(--text-primary)] placeholder-[var(--text-subtle)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 transition-colors duration-300">
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[var(--primary)]" />
                  Location
                </h2>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                  >
                    Full Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="House/Flat number, Street, Area, City"
                    className={`w-full px-4 py-3 rounded-lg bg-[var(--background)] border ${
                      errors.address
                        ? "border-red-500"
                        : "border-[var(--border)]"
                    } text-[var(--text-primary)] placeholder-[var(--text-subtle)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors resize-none`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 transition-colors duration-300">
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[var(--primary)]" />
                  Schedule
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                    >
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                      className={`w-full h-12 px-4 rounded-lg bg-[var(--background)] border ${
                        errors.date
                          ? "border-red-500"
                          : "border-[var(--border)]"
                      } text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors`}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                    >
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-subtle)]" />
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className={`w-full h-12 pl-12 pr-4 rounded-lg bg-[var(--background)] border ${
                          errors.time
                            ? "border-red-500"
                            : "border-[var(--border)]"
                        } text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors appearance-none`}
                      >
                        <option value="">Select time slot</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.time && (
                      <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 transition-colors duration-300">
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-[var(--primary)]" />
                  Service Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="serviceType"
                      className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                    >
                      Service Type *
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className={`w-full h-12 px-4 rounded-lg bg-[var(--background)] border ${
                        errors.serviceType
                          ? "border-red-500"
                          : "border-[var(--border)]"
                      } text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors appearance-none`}
                    >
                      <option value="">Select service</option>
                      {serviceTypes.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    {errors.serviceType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.serviceType}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="carModel"
                      className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                    >
                      Car Make & Model
                    </label>
                    <div className="relative">
                      <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-subtle)]" />
                      <input
                        type="text"
                        id="carModel"
                        name="carModel"
                        value={formData.carModel}
                        onChange={handleChange}
                        placeholder="e.g., Honda Civic 2022"
                        className="w-full h-12 pl-12 pr-4 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-subtle)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                  >
                    Additional Notes
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-3 h-4 w-4 text-[var(--text-subtle)]" />
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Any specific requirements or questions..."
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-subtle)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-14 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/30"
              >
                <MessageCircle className="h-5 w-5" />
                Book via WhatsApp
              </button>
            </form>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 sticky top-24 transition-colors duration-300">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
                Why Book With Us?
              </h2>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                      Home Service
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      Our technicians come to your location for hassle-free
                      installation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                    <Wrench className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                      Expert Technicians
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      Certified professionals with years of experience.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                      Quality Guaranteed
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      All installations come with warranty and after-service
                      support.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--border)]">
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  Have questions before booking?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[var(--primary)] hover:opacity-80 font-medium transition-colors"
                >
                  Contact Us
                  <ChevronLeft className="h-4 w-4 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
