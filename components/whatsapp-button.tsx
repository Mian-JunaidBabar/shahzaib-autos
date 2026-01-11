"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "923001234567";
const DEFAULT_MESSAGE = "Hi! I'm interested in your products and services.";

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
}

export function WhatsAppButton({
  message = DEFAULT_MESSAGE,
  className,
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Button onClick={handleClick} className={className} size="lg">
      <MessageCircle className="mr-2 h-5 w-5" />
      Chat on WhatsApp
    </Button>
  );
}

// Floating WhatsApp button
export function FloatingWhatsAppButton() {
  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      DEFAULT_MESSAGE
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
}
