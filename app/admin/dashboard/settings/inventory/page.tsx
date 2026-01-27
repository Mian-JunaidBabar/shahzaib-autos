"use client";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Inventory Settings
        </h2>
      </div>
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <h3 className="text-lg font-medium text-foreground">Stock Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Low Stock Threshold
            </label>
            <input
              type="number"
              defaultValue="10"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Alert when quantity falls below this number
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Alert Notifications
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Email notifications</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Dashboard alerts</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
