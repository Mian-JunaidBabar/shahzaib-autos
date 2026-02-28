export function ContactForm() {
  return (
    <section className="p-4 py-20 max-w-7xl mx-auto w-full">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="p-8 md:p-12 space-y-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Get In Touch
            </h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-3 bg-slate-50"
                    placeholder="John Doe"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-3 bg-slate-50"
                    placeholder="john@example.com"
                    type="email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Vehicle Model
                  </label>
                  <input
                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-3 bg-slate-50"
                    placeholder="e.g. BMW M4"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Service Needed
                  </label>
                  <select className="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-3 bg-slate-50 cursor-pointer">
                    <option>Maintenance</option>
                    <option>Repair</option>
                    <option>Performance Tuning</option>
                    <option>Audio Upgrade</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-3 bg-slate-50"
                  placeholder="Tell us about your requirements..."
                  rows={4}
                ></textarea>
              </div>

              <button
                type="button"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
              >
                <span className="material-symbols-outlined">send</span> Send
                Message
              </button>
            </form>
          </div>

          {/* Garage Details & Map */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-8 md:p-12 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 flex flex-col justify-between h-full">
            <div className="space-y-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Our Garage
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-full shadow-sm text-primary">
                    <span className="material-symbols-outlined text-xl">
                      location_on
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                      Main Facility
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      1221 Performance Way
                      <br />
                      Silicon Valley, CA 94025
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-full shadow-sm text-primary">
                    <span className="material-symbols-outlined text-xl">
                      call
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                      Phone & Support
                    </p>
                    <p className="text-sm text-slate-500">+1 (555) 890-4422</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-full shadow-sm text-primary">
                    <span className="material-symbols-outlined text-xl">
                      schedule
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                      Business Hours
                    </p>
                    <p className="text-sm text-slate-500">
                      Mon - Sat: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-sm text-slate-500">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stylized Map Placeholder */}
            <div className="mt-10 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-200 relative group">
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-10 pointer-events-none group-hover:bg-transparent transition-colors duration-500">
                <div className="text-primary bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">
                    pin_drop
                  </span>
                </div>
              </div>
              <img
                className="w-full h-full object-cover opacity-60 dark:opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"
                alt="Stylized map showing business location"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-jWpYE6qfni2GdR-RkpG8wCi6XaKENEFfGxZ8uySm1DXyULUu56_vh5tT8uAxV93TL3WM4OrAtc6N-vs0Okdz3X-xErhIo6mudAyzFUHxbbAx0S20upsInp07yTO-YObbq4o7hWTVye3KMoUbehoRMateJfFUDIBRxFBgv4hKxXm93cZjRFhCOGYC64U9XflGpFiDr-jJQnWcXw74Gp2f0l03AW2FXBwVkI129Zx2sS-vx6bwNr1fn3o4G52JuW6AiG7N1n4OwNUF"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
