import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Schools", href: "/schools" },
  { label: "Jobs", href: "/jobs" },
  { label: "Cadet Programs", href: "/cadet-programs" },
  { label: "Scholarships", href: "#scholarships" },
  { label: "Financing", href: "#financing" },
  { label: "Community", href: "#community" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 h-16 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-1 text-xl font-bold tracking-tight">
          <span className="text-gold">✈</span>
          <span className="text-navy">Aviator Path</span>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a href="/login" className="text-sm font-medium text-navy hover:text-navy/80 transition-colors">
            Sign In
          </a>
          <a
            href="/signup"
            className="text-sm font-semibold bg-gold text-gold-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 top-16 z-40">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-background shadow-xl p-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-base font-medium text-foreground py-2 border-b border-border"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <a href="/login" className="text-sm font-medium text-navy">Sign In</a>
              <a
                href="/signup"
                className="text-sm font-semibold bg-gold text-gold-foreground px-4 py-2 rounded-lg text-center"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
