"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { faqs } from "@/data";
import { Card } from "@/components/ui/card";
import { CTASection } from "@/components/cta-section";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our products and services
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="h-5 w-5 flex-shrink-0 text-primary" />
                ) : (
                  <Plus className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                )}
              </button>
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 pb-4" : "max-h-0"
                }`}
              >
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <CTASection
        title="Still Have Questions?"
        description="Can't find the answer you're looking for? Reach out to our customer support team."
        primaryCTA={{ text: "Contact Us", href: "/contact" }}
        secondaryCTA={{
          text: "Chat on WhatsApp",
          href: "https://wa.me/923001234567",
        }}
        variant="muted"
      />
    </div>
  );
}
