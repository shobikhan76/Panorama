import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const Brands = () => {
  useEffect(() => {
    gsap.utils.toArray('.reveal-up').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    gsap.fromTo('.brand-card', { opacity: 0, y: 60, scale: 0.95 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1,
      scrollTrigger: { trigger: '.brands-grid', start: 'top 80%' }
    });
  }, []);

  const brands = [
    { initials: 'GR', name: 'Global Resources', desc: 'International commodity trading & resource management across continents.' },
    { initials: 'ST', name: 'System Technologies', desc: 'IT solutions & digital transformation for the modern enterprise.' },
    { initials: 'PF', name: 'Panorama Foods', desc: 'Premium food processing & distribution serving millions worldwide.' },
    { initials: 'PE', name: 'Panorama Entertainment', desc: 'Media production & entertainment experiences that inspire.' },
    { initials: 'VC', name: 'Vision Chemtech', desc: 'Advanced chemical solutions for industrial applications.' },
    { initials: 'PP', name: 'Panorama Packaging', desc: 'Innovative packaging solutions for sustainable businesses.' },
  ];

  return (
    <>
      {/* Brands Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden bg-black pt-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-teal-900/10" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center relative z-10">
          <div className="reveal-up">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-purple-300 text-sm font-medium mb-8">
              <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-xs">✦</span>
              Our Portfolio
            </div>
            <h1 className="font-playfair text-5xl lg:text-7xl font-semibold text-white leading-tight mb-8">
              Diverse Brands,<br />
              <span className="bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">Unified Excellence</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Each brand operates independently with industry-leading expertise, while sharing our core values of innovation, sustainability, and excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-32 px-6 lg:px-16 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="brands-grid grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {brands.map((brand, i) => (
              <div key={i} className="brand-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-4 transition-all duration-700 group">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  {brand.initials}
                </div>
                <h3 className="text-2xl font-playfair font-semibold text-white mb-6">{brand.name}</h3>
                <p className="text-gray-400 leading-relaxed mb-8">{brand.desc}</p>
                <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 text-2xl group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white group-hover:translate-x-4 transition-all duration-500">
                  →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Brands;