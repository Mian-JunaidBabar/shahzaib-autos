import Link from "next/link";


const footerLinks = [
  { href: "/products", label: "Products" },
  { href: "/work", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#020817] border-t border-[#1e293b] pt-16 pb-8">
      <div className="px-4 md:px-8 lg:px-40">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="flex items-center justify-center md:justify-start gap-2 text-white mb-4"
            >
              <span className="material-symbols-outlined text-[32px]! text-[#3b82f6]">
                directions_car
              </span>
              <h2 className="text-xl font-bold tracking-tight">AM Motors</h2>
            </Link>
            <p className="text-slate-500 text-sm max-w-xs">
              Premium automotive solutions for the modern driver. Excellence in
              every detail.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-8 text-sm font-medium text-slate-400">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">public</span>
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">thumb_up</span>
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#1e293b] pt-8 text-center text-xs text-slate-600">
          <p>© {new Date().getFullYear()} AM Motors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
