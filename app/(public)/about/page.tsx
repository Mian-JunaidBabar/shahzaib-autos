import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-8 pb-4 px-4 md:px-8 lg:px-40 bg-background transition-colors duration-300">
        <nav aria-label="Breadcrumb" className="flex mb-4">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                className="inline-flex items-center text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
                href="/"
              >
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-text-muted text-sm mx-1">
                  chevron_right
                </span>
                <span className="text-sm font-medium text-text-primary">
                  About Us
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-text-primary mb-2">
          About Shahzaib Autos
        </h1>
        <p className="text-text-muted max-w-2xl">
          Driven by passion, engineered for perfection.
        </p>
      </section>

      {/* Story Section */}
      <section className="relative w-full py-12 lg:py-20 overflow-hidden bg-background transition-colors duration-300">
        <div className="absolute top-0 right-0 -z-10 h-125 w-125 bg-primary/10 blur-[100px] rounded-full" />
        <div className="px-4 md:px-8 lg:px-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit">
                <span className="material-symbols-outlined text-[14px]">
                  history
                </span>
                <span>Since 2014</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-text-primary">
                Premium Car Accessories &{" "}
                <span className="text-primary">Expert Installation</span>
              </h2>
              <div className="space-y-4 text-text-muted text-lg leading-relaxed">
                <p>
                  Founded in 2014, Shahzaib Autos started with a simple mission:
                  to provide car enthusiasts with high-quality upgrades that
                  don't compromise on vehicle integrity.
                </p>
                <p>
                  Today, we are the region's leading automotive workshop,
                  specializing in advanced electronics, premium detailing, and
                  custom modifications. Our team of certified technicians treats
                  every vehicle with the precision and care it deserves.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-border bg-card shadow-2xl">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD00zIN8_8SUI957_XQfS6bdXzkF4h4SSmjbn2D2wb45ibyAeOkX4uTwlfDsLVBtlrOlGIY5b4GthE_pePfduRbgvuxodWHJbA_QWGdadmVd3E-q5Mck8cKfpQMpsXgawOTUI0ITAZIaGyV83r5YU3oo-jIaT8CeVuzed5iBjquC8T6ElhCa25PUA35oq1nnFTyvOZ3l712lAAfel2Bq8mrZMjjjbeYV8dVPdxJdQLgKpOaHllimldqfaIVTX8iQLmEMaHthfqp7JBw"
                  alt="Inside Shahzaib Autos Workshop"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/80 to-transparent p-6">
                  <p className="text-white font-medium">
                    State-of-the-art facility in Downtown
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-section-bg transition-colors duration-300 py-16">
        <div className="px-4 md:px-8 lg:px-40">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-text-primary">
              Why Choose Us?
            </h2>
            <p className="text-text-muted mt-2">
              The numbers speak for our dedication to quality.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">
                  workspace_premium
                </span>
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-1">
                10+ Years
              </h3>
              <p className="text-text-muted font-medium">Experience</p>
              <p className="text-xs text-text-subtle mt-2">
                Serving the community since 2014 with consistent quality.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">
                  handyman
                </span>
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-1">
                5,000+
              </h3>
              <p className="text-text-muted font-medium">Installs</p>
              <p className="text-xs text-text-subtle mt-2">
                Successfully completed modifications and upgrades.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">
                  location_on
                </span>
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-1">
                Premium
              </h3>
              <p className="text-text-muted font-medium">Area Service</p>
              <p className="text-xs text-text-subtle mt-2">
                Conveniently located for luxury vehicle owners.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">
                  storefront
                </span>
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-1">
                Wholesale
              </h3>
              <p className="text-text-muted font-medium">Trusted Partner</p>
              <p className="text-xs text-text-subtle mt-2">
                Direct distributor for top automotive brands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 md:px-8 lg:px-40 bg-background transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <span className="text-primary font-bold text-sm tracking-wider uppercase mb-2 block">
              Our Workshop
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              Masters at Work
            </h2>
            <p className="text-text-muted mt-3 max-w-xl">
              Take a look inside our facility where technology meets
              craftsmanship. Our technicians are trained to handle the most
              sophisticated vehicles.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group relative rounded-xl overflow-hidden aspect-4/3 cursor-pointer">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoAbH75labLjI9IYarI3itXkkAQs2tKh0MhYLu3FpC-wPAUchj2nvP-ET-jZ65bmh8lOd-JlmtUF1QqR_qYshro76zifGO7J7Vl_Ynz4QbsMOpKd5_rfx4RVfCnDXCay2G7JqnygWg6MrIWXgS2FLTSxI612OsefrwVsVYVJRTlNrpXT6jXbDtYUJFWm6l0sE855BarVs3DMHwZjImgSv0k_7w3NRqwVz0rbcFXI4i2mHN2h4gYvCuj5e_dk2oSMFO2pQU98546QdZ"
              alt="Engine Bay Detailing"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <div className="absolute bottom-4 left-4">
              <p className="text-white font-semibold">Engine Bay Detailing</p>
              <p className="text-text-muted text-xs">Precision Cleaning</p>
            </div>
          </div>
          <div className="group relative rounded-xl overflow-hidden aspect-4/3 cursor-pointer">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsNjiTVLWvrLKmOCn_eY4KoH9IEqKh8kLiGPRpnQqKKwK1NdvRZjOBzhLltRyPRVfXY01e7wMweBzddy9TsxhKqV4zx0I5mBaeeXc97cQtLMcPA_iqCJuY8Ezqt3LMwXgim5ijzKjsVKiFW3sBFrAZIWCiewsmoG9ZHD98rxNdieDu2P-NN3XB13EAQ79X2zUt0F8luVDj854-nqMhqqIP4hRZKK5JRSZr1kf5z6sNbMMXTl9RrYnzIqgInkYuoV8OhDAhlp1YYlSx"
              alt="Foam Treatment"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <div className="absolute bottom-4 left-4">
              <p className="text-white font-semibold">Foam Treatment</p>
              <p className="text-text-muted text-xs">Exterior Care</p>
            </div>
          </div>
          <div className="group relative rounded-xl overflow-hidden aspect-4/3 cursor-pointer">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY6_FRjny-7ukrMnaHP7SyHOd52sxr0WOXIqGH4SWrQcB4DUywiWldhuOAAZ7nHE3To6WeCrbrVvaK4P-az-Q9KFRAFv5JzZQLeuufS39qAGzrhLT_IHIOBEG062Ox7-TjUyOuwcNPR7MXwHkdunto0iyihWPkmtLA6v-meesPztESn25FeiF4FQegDCAPSJPEPcYDXBfRyxUG9zEPFMJjJc2JdGCw3jra8edLqVfjX8uP8vB2wEHNuXYdq7GtdGL2q2BtnG0fadTf"
              alt="Ceramic Coating"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <div className="absolute bottom-4 left-4">
              <p className="text-white font-semibold">Ceramic Coating</p>
              <p className="text-text-muted text-xs">Protection Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-40">
        <div className="relative overflow-hidden rounded-2xl bg-primary text-white px-8 py-16 md:px-16 text-center shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-white text-3xl md:text-5xl font-black mb-6 tracking-tight">
              Partner With Us
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-8 font-medium">
              Whether you're looking for premium products or professional
              installation, we're here to help transform your vehicle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-lg font-bold text-base hover:bg-white/90 transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined">
                  calendar_month
                </span>
                Book Service
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white rounded-lg font-bold text-base hover:bg-white/30 transition-colors border border-white/30"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
