import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer bg-[#080D19] py-24 px-6 lg:px-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          <div className="lg:col-span-2">
            <Link to="/" className="logo font-playfair text-2xl font-bold text-white flex items-center gap-3 mb-8 inline-flex">
              <span className="logo-icon w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-lg font-bold">P</span>
              Panorama
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              A global conglomerate connecting innovation across industries. Building tomorrow's world today through sustainable practices and exceptional excellence.
            </p>
            <div className="flex gap-4 mt-8">
              {['Li', 'X', 'Fb', 'Ig'].map((social) => (
                <a key={social} href="#" className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white text-sm hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:border-transparent hover:-translate-y-1 transition-all">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {['Quick Links', 'Our Brands', 'Company', 'Contact'].map((title, i) => (
            <div key={title}>
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-7">{title}</h4>
              <ul className="space-y-4">
                {title === 'Quick Links' && ['Home', 'About Us', 'Our Brands', 'Contact'].map((item) => (
                  <li key={item}><Link to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <span className="w-4 opacity-0">→</span>{item}
                  </Link></li>
                ))}
                {title === 'Our Brands' && ['Global Resources', 'System Technologies', 'Panorama Foods', 'Vision Chemtech'].map((brand) => (
                  <li key={brand}><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">{brand}</a></li>
                ))}
                {title === 'Company' && ['Leadership', 'Sustainability', 'Careers', 'Investors'].map((item) => (
                  <li key={item}><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">{item}</a></li>
                ))}
                {title === 'Contact' && (
                  <>
                    <li><a href="#" className="text-gray-400">Dubai, UAE</a></li>
                    <li><a href="mailto:info@panorama.com" className="text-gray-400 hover:text-blue-400">info@panorama.com</a></li>
                    <li><a href="tel:+97142345678" className="text-gray-400 hover:text-blue-400">+971 4 234 5678</a></li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">© 2025 Panorama Group of Companies. All rights reserved.</p>
          <div className="flex gap-8 text-sm">
            <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;