"use client";

export default function BusinessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-1">
          Business Information
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your company details and contact information.
        </p>
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
            <option>Auto Parts Store</option>
            <option>Auto Repair Shop</option>
            <option>Car Dealership</option>
            <option>Service Center</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            defaultValue="+923374990542"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            defaultValue="owner.shahzaib.autos@gmail.com"
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
          defaultValue=""
          placeholder="Enter your business address"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Operating hours and scheduling are managed in{" "}
        <a
          href="/admin/dashboard/settings/booking"
          className="text-primary hover:underline"
        >
          Booking Configuration
        </a>
        .
      </p>
    </div>
  );
}
