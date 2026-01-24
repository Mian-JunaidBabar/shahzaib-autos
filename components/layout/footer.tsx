import Link from "next/link";


const footerLinks = [
  { href: "/products", label: "Products" },
  { href: "/work", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 transition-colors duration-300">
      <div className="px-4 md:px-8 lg:px-40">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="flex items-center justify-center md:justify-start gap-2 text-text-primary mb-4"
            >
              <span className="material-symbols-outlined text-[32px]! text-text-primary">
                directions_car
              </span>
              <h2 className="text-xl font-bold tracking-tight">
                Shahzaib Autos
              </h2>
            </Link>
            <p className="text-text-muted text-sm max-w-xs">
              Premium automotive solutions for the modern driver. Excellence in
              every detail.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-8 text-sm font-medium text-text-muted">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="#"
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <span className="material-symbols-outlined">public</span>
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <span className="material-symbols-outlined">thumb_up</span>
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center text-xs text-text-subtle">
          <p>
            © {new Date().getFullYear()} Shahzaib Autos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
