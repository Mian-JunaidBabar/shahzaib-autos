"use client";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Notifications
        </h2>
      </div>
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            Email Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                New booking notifications
              </span>
              <input type="checkbox" className="toggle" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                Order confirmations
              </span>
              <input type="checkbox" className="toggle" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">Payment updates</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            SMS Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                Appointment reminders
              </span>
              <input type="checkbox" className="toggle" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                Order status updates
              </span>
              <input type="checkbox" className="toggle" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
