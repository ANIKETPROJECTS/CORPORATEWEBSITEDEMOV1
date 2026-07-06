import { Link } from "wouter";
import { Phone, ArrowUpRight, Search, Mail, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import logoImage from "@assets/CoreAxis_Global_1769351988747.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar - Hidden on Mobile */}
      <div className="hidden lg:block bg-[hsl(var(--header-top))] text-white/90 py-2.5 text-[18px] font-['Poppins',sans-serif] border-b border-white/5">
        <div className="container-custom flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <a href="tel:4047520600" className="hover:text-secondary transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4 text-secondary" />
              404.752.0600
            </a>
            <a href="mailto:info@btcpa.net" className="hover:text-secondary transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4 text-secondary" />
              info@btcpa.net
            </a>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-secondary transition-colors underline-offset-4 hover:underline">Online Payments & Client Resources</a>
            <a href="#" className="hover:text-secondary transition-colors underline-offset-4 hover:underline">Careers</a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="bg-[hsl(var(--header-main))] text-white">
        <div className="container-custom flex items-center justify-between h-[80px] md:h-[105px]">
          <Link href="/">
            <div className="bg-white rounded-md px-4 py-1">
              <img 
                src={logoImage} 
                alt="CoreAxis Global" 
                className="h-12 md:h-16 w-auto cursor-pointer"
                data-testid="img-logo"
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-12 font-['Poppins',sans-serif] text-[18px] font-medium uppercase tracking-[0.15em] text-white">
            <Link href="/" className="hover:text-secondary transition-colors py-2">Home</Link>
            <Link href="/about" className="hover:text-secondary transition-colors py-2">About Us</Link>
            <Link href="/services" className="hover:text-secondary transition-colors py-2">Services</Link>
            <Link href="/blog" className="hover:text-secondary transition-colors py-2">Blog</Link>
            <Link href="/contact" className="hover:text-secondary transition-colors py-2">Contact</Link>
          </nav>

          <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
            <Link href="/contact">
              <button className="hidden lg:block bg-secondary text-primary px-8 py-3 rounded-full font-bold hover:bg-white transition-all duration-300 shadow-lg shadow-secondary/20 uppercase tracking-widest text-sm">
                Connect Now
              </button>
            </Link>
            <button 
              className="lg:hidden p-2 text-white hover:text-secondary transition-colors z-[60] flex-shrink-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
            />
            {/* Menu Content - Right to Left Slide */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[400px] bg-[hsl(var(--header-main))] z-[56] lg:hidden shadow-2xl p-6 md:p-8 pt-24"
            >
              <div className="flex flex-col h-full overflow-y-auto">
                <nav className="flex flex-col gap-4 md:gap-6 font-['Poppins',sans-serif] text-xl font-medium uppercase tracking-widest">
                  <Link href="/" onClick={() => setIsOpen(false)} className="text-white hover:text-secondary transition-colors py-2 border-b border-white/5">Home</Link>
                  <Link href="/about" onClick={() => setIsOpen(false)} className="text-white hover:text-secondary transition-colors py-2 border-b border-white/5">About Us</Link>
                  <Link href="/services" onClick={() => setIsOpen(false)} className="text-white hover:text-secondary transition-colors py-2 border-b border-white/5">Services</Link>
                  <Link href="/blog" onClick={() => setIsOpen(false)} className="text-white hover:text-secondary transition-colors py-2 border-b border-white/5">Blog</Link>
                  <Link href="/contact" onClick={() => setIsOpen(false)} className="text-white hover:text-secondary transition-colors py-2 border-b border-white/5">Contact</Link>
                </nav>

                <div className="mt-8 md:mt-12 space-y-6 md:space-y-8 pb-8">
                  <div className="flex flex-col gap-4 text-white/80 font-['Poppins',sans-serif]">
                    <a href="tel:4047520600" className="flex items-center gap-3 text-lg hover:text-secondary transition-colors">
                      <Phone className="w-5 h-5 text-secondary" />
                      404.752.0600
                    </a>
                    <a href="mailto:info@btcpa.net" className="flex items-center gap-3 text-lg hover:text-secondary transition-colors">
                      <Mail className="w-5 h-5 text-secondary" />
                      info@btcpa.net
                    </a>
                    <a href="#" className="text-sm underline underline-offset-4 hover:text-secondary transition-colors">
                      Online Payments & Client Resources
                    </a>
                  </div>
                  
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    <button className="w-full bg-secondary text-primary px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg shadow-secondary/20">
                      Connect Now
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
