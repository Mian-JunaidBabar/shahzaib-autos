"use client";

import type { ServiceDTO } from "@/lib/types/dto";

interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  vehicleModel: string;
  address: string;
}

interface CheckoutFormProps {
  customerData: CustomerData;
  setCustomerData: (
    data: CustomerData | ((prev: CustomerData) => CustomerData),
  ) => void;
  availableServices: Array<Pick<ServiceDTO, "id" | "title" | "price">>;
  selectedServiceIds: string[];
  onServiceToggle: (id: string) => void;
  bookingDate: string;
  setBookingDate: (date: string) => void;
  fieldErrors?: Record<string, string>;
}

export function CheckoutForm({
  customerData,
  setCustomerData,
  availableServices,
  selectedServiceIds,
  onServiceToggle,
  bookingDate,
  setBookingDate,
  fieldErrors,
}: CheckoutFormProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const inputClasses = (error?: string) =>
    `mt-1 block w-full rounded-xl px-4 h-14 border ${error ? "border-red-400 bg-red-50 focus:ring-red-200" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary"} text-slate-900 dark:text-white outline-none transition-all shadow-sm`;

  return (
    <div className="flex-1 p-0 lg:p-4 space-y-6">
      {/* Section: Contact Information */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary">person</span>
          <h2 className="text-xl font-bold dark:text-white">
            Contact Information
          </h2>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-1">
              Full Name *
            </span>
            <input
              name="fullName"
              value={customerData.fullName}
              onChange={handleInputChange}
              className={inputClasses(fieldErrors?.fullName)}
              placeholder="Junaid Babar"
              type="text"
            />
            {fieldErrors?.fullName && (
              <p className="mt-1 text-xs text-red-600 ml-1">
                {fieldErrors.fullName}
              </p>
            )}
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-1">
                Email Address
              </span>
              <input
                name="email"
                value={customerData.email}
                onChange={handleInputChange}
                className={inputClasses(fieldErrors?.email)}
                placeholder="alex@shahzaib-autos.com"
                type="email"
              />
              {fieldErrors?.email && (
                <p className="mt-1 text-xs text-red-600 ml-1">
                  {fieldErrors.email}
                </p>
              )}
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-1">
                Phone Number *
              </span>
              <input
                name="phone"
                value={customerData.phone}
                onChange={handleInputChange}
                className={inputClasses(fieldErrors?.phone)}
                placeholder="+92 300 0000000"
                type="tel"
              />
              {fieldErrors?.phone && (
                <p className="mt-1 text-xs text-red-600 ml-1">
                  {fieldErrors.phone}
                </p>
              )}
            </label>
          </div>
        </div>
      </section>

      {/* Section: Professional Services (Upsell) */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary">build</span>
          <h2 className="text-xl font-bold dark:text-white">
            Professional Services
          </h2>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium">
            Select any installation or tuning services to expertly add to your
            order.
          </p>
          {availableServices.map((service) => {
            const isSelected = selectedServiceIds.includes(service.id);
            return (
              <label
                key={service.id}
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 group hover:shadow-sm ${isSelected ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onServiceToggle(service.id)}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span
                    className={`font-medium ${isSelected ? "text-primary font-bold" : "text-slate-800 dark:text-slate-200"}`}
                  >
                    {service.title}
                  </span>
                </div>
                <span
                  className={`font-bold ${isSelected ? "text-primary" : "text-slate-600 dark:text-slate-400"}`}
                >
                  + Rs. {service.price.toLocaleString()}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Section: Vehicle & Date (Conditional) */}
      {selectedServiceIds.length > 0 && (
        <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">
              directions_car
            </span>
            <h2 className="text-xl font-bold dark:text-white">
              Vehicle Details
            </h2>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-1">
                Car Make & Model
              </span>
              <input
                name="vehicleModel"
                value={customerData.vehicleModel}
                onChange={handleInputChange}
                className={inputClasses(fieldErrors?.vehicleModel)}
                placeholder="Honda Civic RS 2024"
                type="text"
              />
              {fieldErrors?.vehicleModel && (
                <p className="mt-1 text-xs text-red-600 ml-1">
                  {fieldErrors.vehicleModel}
                </p>
              )}
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-1">
                Preferred Date
              </span>
              <div className="relative">
                <input
                  name="bookingDate"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className={inputClasses(undefined) + " w-full"}
                />
              </div>
            </label>
          </div>
        </section>
      )}

      {/* Section: Delivery Address */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary">
            location_on
          </span>
          <h2 className="text-xl font-bold dark:text-white">
            Service Location
          </h2>
        </div>
        <label className="block">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-1">
            Full Address / Delivery Details
          </span>
          <textarea
            name="address"
            value={customerData.address}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-xl p-4 border ${fieldErrors?.address ? "border-red-400 bg-red-50 focus:ring-red-200" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary"} text-slate-900 dark:text-white outline-none transition-all shadow-sm resize-none`}
            placeholder="Shop #1, Shahzaib Autos Block..."
            rows={3}
          ></textarea>
          {fieldErrors?.address && (
            <p className="mt-1 text-xs text-red-600 ml-1">
              {fieldErrors.address}
            </p>
          )}
        </label>
      </section>
    </div>
  );
}
