import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contact Us - AM Motors",
  description:
    "Get in touch with AM Motors for inquiries, support, or to place your order. We're here to help!",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Have questions? We'd love to hear from you. Reach out to us anytime!
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Call us for quick assistance
              </p>
              <a
                href="tel:+923001234567"
                className="text-primary font-medium hover:underline"
              >
                +92 300 1234567
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Chat with us instantly
              </p>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                Open WhatsApp
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Send us an email anytime
              </p>
              <a
                href="mailto:info@ammotors.pk"
                className="text-primary font-medium hover:underline"
              >
                info@ammotors.pk
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Location & Hours */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle>Visit Our Store</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                123 Main Street, Gulshan-e-Iqbal
                <br />
                Karachi, Sindh
                <br />
                Pakistan
              </p>
              <Button variant="outline" asChild className="w-full">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Business Hours</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span className="font-medium">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">10:00 AM - 6:00 PM</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Hours may vary on public holidays
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">
              Prefer to Chat on WhatsApp?
            </h2>
            <p className="mb-6 opacity-90">
              Get instant responses to your queries through WhatsApp
            </p>
            <WhatsAppButton className="bg-white text-primary hover:bg-white/90" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
