"use client";

import { useState } from "react";

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: "business",
    title: "Business Information",
    description: "Manage company details, contact information, and branding",
    icon: "business",
  },
  {
    id: "services",
    title: "Services & Pricing",
    description:
      "Configure available services, pricing, and service categories",
    icon: "handyman",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Email, SMS, and push notification preferences",
    icon: "notifications",
  },
  {
    id: "payments",
    title: "Payment Settings",
    description: "Payment gateways, currencies, and transaction settings",
    icon: "payment",
  },
  {
    id: "booking",
    title: "Booking Configuration",
    description: "Appointment slots, booking rules, and availability settings",
    icon: "event_available",
  },
  {
    id: "inventory",
    title: "Inventory Settings",
    description: "Stock management, low stock alerts, and supplier settings",
    icon: "inventory",
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("business");

  const renderBusinessSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Business Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Business Name
          </label>
          <input
            type="text"
            defaultValue="Shahzaib Autos"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Business Type
          </label>
          <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Auto Repair Shop</option>
            <option>Car Dealership</option>
            <option>Service Center</option>
            <option>Auto Parts Store</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            defaultValue="+1 (555) 123-4567"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            defaultValue="info@shahzaibautos.com"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Business Address
        </label>
        <textarea
          rows={3}
          defaultValue="123 Auto Service Street, Car City, CC 12345"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Business Hours
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <div key={day} className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {day}
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  defaultValue={day === "Sunday" ? "" : "09:00"}
                  className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
                />
                <input
                  type="time"
                  defaultValue={day === "Sunday" ? "" : "18:00"}
                  className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
                />
              </div>
              <label className="flex items-center text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={day === "Sunday"}
                />
                Closed
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServicesSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Services & Pricing
        </h2>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">
            Available Services
          </h3>
          <button className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm">
            Add Service
          </button>
        </div>

        <div className="space-y-4">
          {[
            { name: "Oil Change", price: 45.99, duration: "30 min" },
            { name: "Brake Service", price: 129.99, duration: "2 hours" },
            { name: "Tire Rotation", price: 29.99, duration: "45 min" },
            { name: "Engine Diagnostics", price: 89.99, duration: "1 hour" },
          ].map((service, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border border-border rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{service.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Duration: {service.duration}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">${service.price}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-muted-foreground hover:text-primary">
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="text-muted-foreground hover:text-red-500">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Pricing Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              defaultValue="8.5"
              step="0.1"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Currency
            </label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>CAD ($)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Notification Settings
        </h2>
      </div>

      <div className="space-y-6">
        {[
          {
            title: "Email Notifications",
            description: "Receive notifications via email",
            options: [
              "New orders",
              "Order status updates",
              "Low stock alerts",
              "Customer inquiries",
            ],
          },
          {
            title: "SMS Notifications",
            description: "Receive notifications via SMS",
            options: [
              "Urgent orders",
              "Booking confirmations",
              "Payment confirmations",
            ],
          },
          {
            title: "Push Notifications",
            description: "Browser push notifications",
            options: [
              "Real-time order updates",
              "Customer messages",
              "System alerts",
            ],
          },
        ].map((section, index) => (
          <div
            key={index}
            className="bg-card rounded-lg border border-border p-6"
          >
            <div className="mb-4">
              <h3 className="text-lg font-medium text-foreground">
                {section.title}
              </h3>
              <p className="text-muted-foreground">{section.description}</p>
            </div>
            <div className="space-y-3">
              {section.options.map((option, optIndex) => (
                <label key={optIndex} className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-foreground">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Payment Settings
        </h2>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Payment Methods
        </h3>
        <div className="space-y-4">
          {[
            { name: "Credit/Debit Cards", provider: "Stripe", enabled: true },
            { name: "PayPal", provider: "PayPal", enabled: true },
            { name: "Cash", provider: "In-person", enabled: true },
            {
              name: "Bank Transfer",
              provider: "Wire Transfer",
              enabled: false,
            },
          ].map((method, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div>
                <h4 className="font-medium text-foreground">{method.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {method.provider}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={method.enabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookingSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Booking Configuration
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Time Slots
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Slot Duration (minutes)
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
                <option value="30">30 minutes</option>
                <option value="60" selected>
                  60 minutes
                </option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Advance Booking (days)
              </label>
              <input
                type="number"
                defaultValue="30"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Booking Rules
          </h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-foreground">Require phone number</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-foreground">Send confirmation email</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-foreground">Require deposit</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-foreground">Allow cancellation</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventorySettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Inventory Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Stock Alerts
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                defaultValue="10"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Alert when stock falls below this number
              </p>
            </div>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" defaultChecked />
                <span className="text-foreground">
                  Email alerts for low stock
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" defaultChecked />
                <span className="text-foreground">Dashboard notifications</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Auto-Reorder
          </h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-foreground">
                Enable automatic reordering
              </span>
            </label>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reorder Point
              </label>
              <input
                type="number"
                defaultValue="5"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reorder Quantity
              </label>
              <input
                type="number"
                defaultValue="50"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "business":
        return renderBusinessSettings();
      case "services":
        return renderServicesSettings();
      case "notifications":
        return renderNotificationSettings();
      case "payments":
        return renderPaymentSettings();
      case "booking":
        return renderBookingSettings();
      case "inventory":
        return renderInventorySettings();
      default:
        return renderBusinessSettings();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Configure your business settings and preferences
          </p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-4">
            <nav className="space-y-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm">
                      {section.icon}
                    </span>
                    <div>
                      <p className="font-medium">{section.title}</p>
                      <p className="text-xs opacity-75">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg border border-border p-6">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
