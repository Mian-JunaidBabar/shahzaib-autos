import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy & Terms - AM Motors",
  description: "Read our privacy policy and terms of service.",
};

export default function PoliciesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-3">Privacy Policy & Terms</h1>
          <p className="text-muted-foreground">
            Last updated: January 11, 2026
          </p>
        </div>

        {/* Privacy Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <h3 className="font-semibold text-lg mb-3">
              Information We Collect
            </h3>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly to us when you create
              an order, book a service, or contact us. This may include your
              name, email address, phone number, shipping address, and payment
              information.
            </p>

            <h3 className="font-semibold text-lg mb-3">
              How We Use Your Information
            </h3>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-1">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and services</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our products and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h3 className="font-semibold text-lg mb-3">Information Security</h3>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized or unlawful
              processing, accidental loss, destruction, or damage.
            </p>

            <h3 className="font-semibold text-lg mb-3">Your Rights</h3>
            <p className="text-muted-foreground mb-4">
              You have the right to access, update, or delete your personal
              information at any time. Contact us if you wish to exercise these
              rights.
            </p>
          </CardContent>
        </Card>

        {/* Terms of Service */}
        <Card id="terms">
          <CardHeader>
            <CardTitle className="text-2xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <h3 className="font-semibold text-lg mb-3">Product Information</h3>
            <p className="text-muted-foreground mb-4">
              We strive to provide accurate product information. However, we do
              not warrant that product descriptions, colors, or other content is
              accurate, complete, reliable, current, or error-free.
            </p>

            <h3 className="font-semibold text-lg mb-3">Orders and Payment</h3>
            <p className="text-muted-foreground mb-4">
              All orders are subject to acceptance and availability. We accept
              Cash on Delivery (COD) and bank transfers. Prices are subject to
              change without notice.
            </p>

            <h3 className="font-semibold text-lg mb-3">Delivery</h3>
            <p className="text-muted-foreground mb-4">
              We aim to deliver within the estimated timeframe. However,
              delivery times are not guaranteed and may vary based on your
              location and other factors beyond our control.
            </p>

            <h3 className="font-semibold text-lg mb-3">
              Returns and Exchanges
            </h3>
            <p className="text-muted-foreground mb-4">
              We offer a 7-day return/exchange policy for unused products in
              original packaging. Return shipping costs may apply. Custom-fitted
              products may not be eligible for return unless defective.
            </p>

            <h3 className="font-semibold text-lg mb-3">
              Limitation of Liability
            </h3>
            <p className="text-muted-foreground mb-4">
              AM Motors shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages resulting from your
              use of our products or services.
            </p>

            <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
            <p className="text-muted-foreground">
              If you have any questions about these policies, please contact us
              at info@ammotors.pk or call +92 300 1234567.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
