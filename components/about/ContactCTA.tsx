import Link from "next/link";


export function ContactCTA() {
  return (
    <section className="p-4 py-20 max-w-7xl mx-auto w-full">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Call‑to‑action */}
          <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Need Assistance?
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              We're here to help. Head over to our contact page for any
              questions or to schedule a service.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary text-white dark:text-slate-900 py-3 px-6 rounded-xl font-bold hover:bg-primary/90 transition"
            >
              Go to Contact Page
            </Link>
          </div>

          {/* Image */}
          <div className="p-8 md:p-12 flex items-center justify-center">
            <img
              className="w-full max-w-md aspect-square object-cover rounded-xl"
              alt="Garage interior"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-jWpYE6qfni2GdR-RkpG8wCi6XaKENEFfGxZ8uySm1DXyULUu56_vh5tT8uAxV93TL3WM4OrAtc6N-vs0Okdz3X-xErhIo6mudAyzFUHxbbAx0S20upsInp07yTO-YObbq4o7hWTVye3KMoUbehoRMateJfFUDIBRxFBgv4hKxXm93cZjRFhCOGYC64U9XflGpFiDr-jJQnWcXw74Gp2f0l03AW2FXBwVkI129Zx2sS-vx6bwNr1fn3o4G52JuW6AiG7N1n4OwNUF"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
