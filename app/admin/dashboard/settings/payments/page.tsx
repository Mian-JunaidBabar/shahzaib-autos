"use client";

export default function PaymentsPage() {
  return (
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
}
