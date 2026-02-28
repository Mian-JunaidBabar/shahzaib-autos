export function CheckoutForm({
  customerData,
  setCustomerData,
  availableServices,
  selectedServiceIds,
  onServiceToggle,
  bookingDate,
  setBookingDate,
}: any) {
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setCustomerData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex-1 p-4 lg:p-8 space-y-10 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
      {/* Contact Information */}
      <section className="space-y-6">
        <h3 className="text-slate-900 dark:text-white text-xl font-black">
          Contact Information
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-2 ml-1">
              Full Name *
            </label>
            <input
              name="fullName"
              value={customerData.fullName}
              onChange={handleInputChange}
              className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
              placeholder="Junaid Babar"
              type="text"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-2 ml-1">
                Email Address
              </label>
              <input
                name="email"
                value={customerData.email}
                onChange={handleInputChange}
                className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                placeholder="alex@shahzaib-autos.com"
                type="email"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-2 ml-1">
                Phone Number (For WhatsApp) *
              </label>
              <input
                name="phone"
                value={customerData.phone}
                onChange={handleInputChange}
                className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                placeholder="+92 300 0000000"
                type="tel"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Details & Upsell */}
      <section className="space-y-6">
        <h3 className="text-slate-900 dark:text-white text-xl font-black flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            add_circle
          </span>
          Add Professional Services?
        </h3>

        <div className="space-y-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium">
            Select any installation or tuning services to add to your order.
          </p>
          {availableServices.map((service: any) => (
            <label
              key={service.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer transition-colors group"
            >
              <input
                type="checkbox"
                checked={selectedServiceIds.includes(service.id)}
                onChange={() => onServiceToggle(service.id)}
                className="size-5 rounded border-slate-300 text-primary focus:ring-primary group-hover:border-primary transition-colors cursor-pointer"
              />
              <span className="font-bold flex-1 text-slate-800 dark:text-slate-200">
                {service.title}
              </span>
              <span className="text-sm font-black text-primary">
                + Rs. {service.price.toLocaleString()}
              </span>
            </label>
          ))}
        </div>

        {selectedServiceIds.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="flex flex-col">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-2 ml-1">
                Vehicle Details
              </label>
              <input
                name="vehicleModel"
                value={customerData.vehicleModel}
                onChange={handleInputChange}
                className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm"
                placeholder="e.g. Honda Civic RS 2024"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-2 ml-1">
                Preferred Booking Date
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col">
          <label className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-2 ml-1">
            Delivery / Service Address
          </label>
          <input
            name="address"
            value={customerData.address}
            onChange={handleInputChange}
            className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm"
            placeholder="Shop #1, Shahzaib Autos..."
            type="text"
          />
        </div>
      </section>
    </div>
  );
}
