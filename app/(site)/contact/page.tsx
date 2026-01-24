"use client";

import Link from "next/link";
import { generateWhatsAppUrl, getWhatsAppNumber } from "@/lib/whatsapp";
import {
  MessageCircle,
  Calendar,
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  Clock,
  HelpCircle,
  Wrench,
  Package,
  ChevronRight,
} from "lucide-react";

export default function ContactPage() {
  const whatsappNumber = getWhatsAppNumber();
  const formattedNumber = whatsappNumber
    .replace(/^\+/, "")
    .replace(/(\d{2})(\d{3})(\d{7})/, "+$1 $2 $3");

  const generalInquiryUrl = generateWhatsAppUrl(
    "Hi! I have a question about your products/services.",
  );

  return (
    <>
      {/* Header Section */}
      <section className="border-b border-border bg-section-bg pt-8 pb-8 transition-colors duration-300">
        <div className="px-4 md:px-8 lg:px-40">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary mb-2">
            How Can We Help?
          </h1>
          <p className="text-text-muted max-w-2xl">
            Choose an option below to get started. We&apos;re here to help with
            orders, installations, and inquiries.
          </p>
        </div>
      </section>

      {/* Decision Points */}
      <section className="px-4 md:px-8 lg:px-40 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Shop Products */}
          <Link
            href="/products"
            className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Package className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
              Shop Products
              <ChevronRight className="h-4 w-4 text-text-subtle group-hover:text-primary transition-colors" />
            </h3>
            <p className="text-sm text-text-muted">
              Browse our collection of premium car accessories, mats, LED
              lights, and more.
            </p>
          </Link>

          {/* Book Installation */}
          <Link
            href="/booking"
            className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Calendar className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
              Book Installation
              <ChevronRight className="h-4 w-4 text-text-subtle group-hover:text-primary transition-colors" />
            </h3>
            <p className="text-sm text-text-muted">
              Schedule a home visit from our expert technicians for hassle-free
              installation.
            </p>
          </Link>

          {/* View Cart */}
          <Link
            href="/checkout"
            className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <ShoppingCart className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
              View Cart & Checkout
              <ChevronRight className="h-4 w-4 text-text-subtle group-hover:text-primary transition-colors" />
            </h3>
            <p className="text-sm text-text-muted">
              Review your cart and complete your order via WhatsApp.
            </p>
          </Link>
        </div>

        {/* General Inquiry CTA */}
        <div className="bg-linear-to-r from-[#25D366]/10 to-card border border-[#25D366]/20 rounded-xl p-8 mb-12 transition-colors duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#25D366]/20 flex items-center justify-center shrink-0">
                <HelpCircle className="h-7 w-7 text-[#25D366]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-1">
                  Have a Question?
                </h2>
                <p className="text-text-muted">
                  Chat with us directly on WhatsApp for the fastest response. We
                  typically reply within minutes!
                </p>
              </div>
            </div>
            <a
              href={generalInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/30 whitespace-nowrap"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Contact Cards */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp */}
              <a
                href={generalInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 bg-card border border-border rounded-xl hover:border-[#25D366]/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                  <MessageCircle className="h-6 w-6 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">
                    WhatsApp
                  </h3>
                  <p className="text-sm text-text-muted">{formattedNumber}</p>
                  <p className="text-xs text-[#25D366] mt-1">
                    Fastest response
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a
                href={`tel:${whatsappNumber}`}
                className="flex items-start gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">
                    Phone
                  </h3>
                  <p className="text-sm text-text-muted">{formattedNumber}</p>
                  <p className="text-xs text-text-subtle mt-1">
                    Mon-Sat, 9AM-8PM
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:shahzaibautos@gmail.com"
                className="flex items-start gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">
                    Email
                  </h3>
                  <p className="text-sm text-text-muted">
                    shahzaibautos@gmail.com
                  </p>
                  <p className="text-xs text-text-subtle mt-1">
                    24-48hr response
                  </p>
                </div>
              </a>

              {/* Workshop */}
              <a
                href="https://maps.google.com/?q=Lahore,Pakistan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">
                    Workshop
                  </h3>
                  <p className="text-sm text-text-muted">Lahore, Pakistan</p>
                  <p className="text-xs text-text-subtle mt-1">
                    Get directions
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Business Hours & Services */}
          <div className="space-y-6">
            {/* Business Hours */}
            <div className="bg-card border border-border rounded-xl p-6 transition-colors duration-300">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Business Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Monday - Saturday</span>
                  <span className="text-text-primary font-medium">
                    9:00 AM - 8:00 PM
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Sunday</span>
                  <span className="text-text-primary font-medium">
                    10:00 AM - 6:00 PM
                  </span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-card border border-border rounded-xl p-6 transition-colors duration-300">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Our Services
              </h3>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>• 7D Custom Floor Mats</li>
                <li>• LED & Projector Lights</li>
                <li>• Ceramic Coating</li>
                <li>• Body Wraps & PPF</li>
                <li>• Interior Detailing</li>
                <li>• Home Installation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
