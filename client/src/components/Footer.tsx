import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import logoImage from "@assets/CoreAxis_Global_1769351988747.png";

export function Footer() {
  return (
    <footer className="bg-[#002140] py-16 md:py-24 text-white border-t border-white/10 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 md:mb-20">
          {/* Brand Column */}
          <div className="space-y-6 md:space-y-8">
            <Link href="/">
              <div className="bg-white rounded-md px-4 py-1.5 inline-block">
                <img 
                  src={logoImage} 
                  alt="CoreAxis Global" 
                  className="h-10 md:h-12 w-auto cursor-pointer"
                  data-testid="img-footer-logo"
                />
              </div>
            </Link>
            <p className="text-white/70 max-w-sm leading-relaxed text-sm md:text-base">
              We believe that the best results come from true partnership. Delivering financial confidence since 1980 through expert advisory and solutions.
            </p>
            <div className="flex gap-5 items-center">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-secondary hover:text-primary transition-all duration-300" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-secondary hover:text-primary transition-all duration-300" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-secondary hover:text-primary transition-all duration-300" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-secondary hover:text-primary transition-all duration-300" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="text-secondary font-bold tracking-[0.2em] uppercase text-xs md:text-sm">Quick Links</h3>
            <ul className="space-y-4 text-white/70 text-sm md:text-base">
              <li><Link href="/" className="hover:text-secondary transition-colors flex items-center gap-2">Home</Link></li>
              <li><Link href="/about" className="hover:text-secondary transition-colors flex items-center gap-2">About Us</Link></li>
              <li><Link href="/services" className="hover:text-secondary transition-colors flex items-center gap-2">Our Services</Link></li>
              <li><Link href="/blog" className="hover:text-secondary transition-colors flex items-center gap-2">Blog</Link></li>
              <li><Link href="/about" className="hover:text-secondary transition-colors flex items-center gap-2">Meet Our Team</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition-colors flex items-center gap-2">Contact Us</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="text-secondary font-bold tracking-[0.2em] uppercase text-xs md:text-sm">Expertise</h3>
            <ul className="space-y-4 text-white/70 text-sm md:text-base">
              <li><Link href="/services" className="hover:text-secondary transition-colors">Tax & Compliance</Link></li>
              <li><Link href="/services" className="hover:text-secondary transition-colors">Audit & Assurance</Link></li>
              <li><Link href="/services" className="hover:text-secondary transition-colors">Business Advisory</Link></li>
              <li><Link href="/services" className="hover:text-secondary transition-colors">Wealth Management</Link></li>
              <li><Link href="/services" className="hover:text-secondary transition-colors">Client Accounting</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 md:space-y-8">
            <h3 className="text-secondary font-bold tracking-[0.2em] uppercase text-xs md:text-sm">Get In Touch</h3>
            <div className="space-y-5 text-white/70 text-sm md:text-base">
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-1" />
                <address className="not-italic leading-relaxed">
                  3310 Northside Parkway <br />
                  Suite 600 <br />
                  Atlanta, GA 30327
                </address>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <a href="tel:770.396.2200" className="hover:text-secondary transition-colors">770.396.2200</a>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <a href="mailto:info@btcpa.net" className="hover:text-secondary transition-colors">info@btcpa.net</a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 md:pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs md:text-sm text-white/40">
          <p>© 2026 CoreAxis Global. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-secondary transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-secondary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
