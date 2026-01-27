"use client";

export default function BusinessPage() {
  return (
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
                  defaultChecked={day === "Sunday"}
                />
                Closed
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
