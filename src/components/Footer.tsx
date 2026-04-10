const platformLinks = ["Schools", "Jobs", "Cadet Programs", "Scholarships", "Financing", "Forum", "Resources"];
const companyLinks = ["About AviatorPath", "Blog", "Contact", "Advertise with Us", "Affiliate Program"];
const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"];

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#0A1628" }} className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 text-lg font-bold mb-3">
              <span className="text-gold">✈</span>
              <span className="text-primary-foreground">Aviator Path</span>
            </div>
            <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
              Your path to the flight deck
            </p>
            <div className="flex gap-3">
              {["IG", "TT", "X", "YT"].map((s) => (
                <span
                  key={s}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "#1a3a6e", color: "#94a3b8" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-primary-foreground mb-4">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm hover:text-primary-foreground transition-colors" style={{ color: "#94a3b8" }}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-primary-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm hover:text-primary-foreground transition-colors" style={{ color: "#94a3b8" }}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-primary-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm hover:text-primary-foreground transition-colors" style={{ color: "#94a3b8" }}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 mt-8" style={{ borderColor: "#1a3a6e" }}>
          <p className="text-sm text-center" style={{ color: "#9ca3af" }}>
            © 2026 Aviator Path. Built for aspiring pilots, by an aspiring pilot. ✈
          </p>
        </div>
      </div>
    </footer>
  );
}
