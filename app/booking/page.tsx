"use client";

import { useState } from "react";
import { Calendar, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const services = [
  { id: "floor-mat-install", name: "Floor Mat Installation" },
  { id: "seat-cover-install", name: "Seat Cover Installation" },
  { id: "full-interior", name: "Complete Interior Package" },
  { id: "car-repair", name: "Car Repair & Maintenance" },
  { id: "detailing", name: "Car Detailing & Cleaning" },
  { id: "other", name: "Other Service" },
];

export default function BookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    vehicleInfo: "",
    preferredDate: "",
    preferredTime: "",
    address: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate booking processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Booking submitted:", formData);

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for booking with us. We'll contact you shortly to confirm
            your appointment.
          </p>
          <div className="space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm">
              Questions? Contact us on{" "}
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Book a Service</h1>
          <p className="text-muted-foreground text-lg">
            Schedule professional installation or car repair service at our shop
            or your location
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Full Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium mb-1.5 block"
                  >
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0300 1234567"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium mb-1.5 block"
                  >
                    Email (Optional)
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="service"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Select Service *
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  value={formData.service}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Choose a service...</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="vehicleInfo"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Vehicle Information (Make, Model, Year)
                </label>
                <Input
                  id="vehicleInfo"
                  name="vehicleInfo"
                  value={formData.vehicleInfo}
                  onChange={handleInputChange}
                  placeholder="e.g., Honda Civic 2020"
                />
              </div>
            </CardContent>
          </Card>

          {/* Appointment Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Preferred Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="preferredDate"
                    className="text-sm font-medium mb-1.5 block"
                  >
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Preferred Date *
                  </label>
                  <Input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label
                    htmlFor="preferredTime"
                    className="text-sm font-medium mb-1.5 block"
                  >
                    <Clock className="inline h-4 w-4 mr-1" />
                    Preferred Time *
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    required
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select time...</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Service Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="address"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Address (For Home Service)
                </label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Leave blank if you prefer to visit our shop"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1.5">
                  Home service may incur additional charges based on location
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any specific requirements or questions? (Optional)"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Book Appointment"}
            </Button>
            <Button type="button" size="lg" variant="outline" asChild>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book via WhatsApp
              </a>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
