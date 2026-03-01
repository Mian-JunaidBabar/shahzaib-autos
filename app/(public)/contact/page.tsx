import { ContactForm } from "@/components/about/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
      {/* Minimal Hero Header */}
      <div className="bg-slate-900 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Contact Us
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Have an inquiry or ready to book a consultation? Reach out to our
          master technicians.
        </p>
      </div>

      <main className="flex-1 w-full py-12">
        <ContactForm />
      </main>
    </div>
  );
}
