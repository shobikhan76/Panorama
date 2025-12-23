import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/brands', label: 'Our Brands' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav
        className={`navbar fixed top-0 left-0 w-full flex justify-between items-center z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          scrolled
            ? 'py-4 px-8 lg:px-16 bg-[#030712]/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-white/10'
            : 'py-6 px-8 lg:px-16'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="logo font-['Playfair_Display'] text-2xl font-bold text-white flex items-center gap-3 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-102">
          <span className="logo-icon w-11 h-11 bg-gradient-to-br from-[rgb(59,130,246)] to-[rgb(37,99,235)] rounded-xl flex items-center justify-center text-lg font-extrabold text-white shadow-[0_4px_20px_rgba(59,130,246,0.4)] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] animate-[logoFloat_10s_ease-in-out_infinite]">
            P
          </span>
          Panorama
        </Link>

        {/* Desktop Nav Links */}
        <ul className="nav-links hidden lg:flex gap-12 list-none">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`relative text-gray-400 font-medium text-sm pb-2.5 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:rounded after:bg-gradient-to-r after:from-blue-400 after:to-teal-400 after:transition-all after:duration-300 ${
                  location.pathname === link.to
                    ? 'text-blue-400 after:w-full'
                    : 'hover:text-white hover:after:w-full'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link
          to="/contact"
          className="nav-cta hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white px-8 py-3.5 rounded-full font-semibold text-sm shadow-[0_4px_20px_rgba(59,130,246,0.3)] transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] relative overflow-hidden hover:scale-104 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(59,130,246,0.5)] before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full before:transition-transform before:duration-500 hover:before:translate-x-full"
        >
          Get in Touch
        </Link>

        {/* Mobile Menu Toggle */}
        <div
          className="menu-toggle lg:hidden flex flex-col gap-1.5 cursor-pointer z-50 p-2.5"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`w-7 h-0.5 bg-white rounded transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-x-1.5 translate-y-1.5' : ''}`} />
          <span className={`w-7 h-0.5 bg-white rounded transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 translate-x-5' : ''}`} />
          <span className={`w-7 h-0.5 bg-white rounded transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 translate-x-1.5 -translate-y-1.5' : ''}`} />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#030712]/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center gap-12 pt-20">
          <ul className="flex flex-col items-center gap-10 list-none">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-4xl font-medium transition-colors ${
                    location.pathname === link.to ? 'text-blue-400' : 'text-white'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-12 py-6 rounded-full text-2xl font-semibold shadow-2xl hover:scale-105 transition-all"
          >
            Get in Touch
          </Link>
        </div>
      )}

      {/* Logo Float Keyframes */}
      <style jsx>{`
        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(3deg);
          }
        }

        .logo:hover .logo-icon {
          animation-play-state: paused;
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.5);
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
};

export default Navbar;