import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white/90 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl text-white mb-3">Cobblestone Creamery</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Handcrafted ice cream and classic cobblers made fresh daily.
              Family owned and operated since 2010.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-gold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/menu" className="block text-sm text-white/60 hover:text-white transition-colors">Menu</Link>
              <a href="https://order.cobblestonecreamery.com/auth" className="block text-sm text-white/60 hover:text-white transition-colors">Order Online</a>
              <Link href="/about" className="block text-sm text-white/60 hover:text-white transition-colors">Our Story</Link>
              <Link href="/location" className="block text-sm text-white/60 hover:text-white transition-colors">Visit Us</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-gold mb-4">Get in Touch</h4>
            <div className="space-y-2 text-sm text-white/60">
              <p>900 Main Street, Evansville, Indiana 47708</p>
              <p>
                <a href="tel:8122053322" className="hover:text-white transition-colors">(812) 205-3322</a>
              </p>
              <p>
                <a href="mailto:hello@cobblestonecreamery.com" className="hover:text-white transition-colors">hello@cobblestonecreamery.com</a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Cobblestone Creamery. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/employee/login" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Employee Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
