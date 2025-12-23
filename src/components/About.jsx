import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useEffect(() => {
    // Reveal animations
    gsap.utils.toArray('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      gsap.fromTo(el, 
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        }
      );
    });

    // Stagger cards
    gsap.fromTo('.about-card', { opacity: 0, y: 80 }, {
      opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-grid', start: 'top 80%' }
    });
  }, []);

  return (
    <>
      {/* About Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden bg-black pt-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-teal-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08)_0%,transparent_60%)]" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="reveal-up">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-blue-300 text-sm font-medium mb-8">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-xs">★</span>
              About Panorama Group
            </div>
            <h1 className="font-playfair text-5xl lg:text-7xl font-semibold text-white leading-tight mb-8">
              Building a Legacy of <br />
              <span className="bg-gradient-to-br from-blue-400 to-teal-400 bg-clip-text text-transparent">Innovation & Excellence</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
              For nearly three decades, Panorama Group has been at the forefront of transforming industries and creating sustainable value across the globe.
            </p>
          </div>
          <div className="reveal-right relative">
            <div className="w-full h-96 lg:h-full min-h-96 bg-gradient-to-br from-blue-600/20 to-teal-600/20 rounded-3xl border border-white/10 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent rounded-3xl" />
          </div>
        </div>
      </section>

      {/* Our Values / Mission Cards */}
      <section className="py-32 px-6 lg:px-16 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 reveal-up">
            <div className="inline-flex items-center gap-4 text-blue-400 uppercase tracking-widest text-sm font-semibold mb-6">
              <div className="w-10 h-0.5 bg-gradient-to-r from-blue-500 to-teal-400" />
              Our Foundation
            </div>
            <h2 className="font-playfair text-4xl lg:text-6xl font-semibold text-white">Core Principles That Drive Us</h2>
          </div>

          <div className="about-grid grid md:grid-cols-3 gap-10">
            <div className="about-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
              <span className="text-6xl mb-8 block">🎯</span>
              <h3 className="font-playfair text-2xl font-semibold text-white mb-6">Mission Driven</h3>
              <p className="text-gray-400 leading-relaxed">
                Purpose-led innovation that creates lasting impact and drives meaningful change across industries.
              </p>
            </div>
            <div className="about-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
              <span className="text-6xl mb-8 block">🌱</span>
              <h3 className="font-playfair text-2xl font-semibold text-white mb-6">Sustainable Growth</h3>
              <p className="text-gray-400 leading-relaxed">
                Eco-conscious operations and responsible business practices that ensure a better tomorrow.
              </p>
            </div>
            <div className="about-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
              <span className="text-6xl mb-8 block">🤝</span>
              <h3 className="font-playfair text-2xl font-semibold text-white mb-6">People First</h3>
              <p className="text-gray-400 leading-relaxed">
                A global team of 15,000+ dedicated professionals united by shared values and vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-gradient-to-r from-blue-900/20 to-teal-900/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { num: '45+', label: 'Countries' },
            { num: '7', label: 'Industries' },
            { num: '15K+', label: 'Employees' },
            { num: '$10B+', label: 'Revenue' },
          ].map((stat, i) => (
            <div key={i} className="reveal-up">
              <div className="text-5xl lg:text-6xl font-playfair font-bold text-white mb-4">{stat.num}</div>
              <div className="text-gray-400 uppercase tracking-wider text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;