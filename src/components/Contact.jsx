import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    gsap.utils.toArray('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
      e.target.reset();
      setTimeout(() => setFormStatus(null), 5000);
    }, 2000);
  };

  return (
    <>
      {/* Contact Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden bg-black pt-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-teal-900/10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center">
          <div className="reveal-up">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-blue-300 text-sm font-medium mb-8">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-xs">💬</span>
              Let's Connect
            </div>
            <h1 className="font-playfair text-5xl lg:text-7xl font-semibold text-white leading-tight mb-8">
              Get in <span className="bg-gradient-to-br from-blue-400 to-teal-400 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Have a question or want to explore partnership opportunities? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-32 px-6 lg:px-16 bg-black">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="reveal-left">
            <div className="mb-12">
              <div className="inline-flex items-center gap-4 text-blue-400 uppercase tracking-widest text-sm font-semibold mb-6">
                <div className="w-10 h-0.5 bg-gradient-to-r from-blue-500 to-teal-400" />
                Contact Information
              </div>
              <h2 className="font-playfair text-4xl font-semibold text-white mb-6">We're Here to Help</h2>
              <p className="text-gray-400 text-lg">Reach out through any channel. Our team responds within 24 hours.</p>
            </div>

            <div className="space-y-8">
              {[
                { icon: '📍', title: 'Headquarters', lines: ['Panorama Tower, Business Bay', 'Dubai, United Arab Emirates'] },
                { icon: '📧', title: 'Email', lines: ['info@panoramagroup.com', 'support@panoramagroup.com'] },
                { icon: '📞', title: 'Phone', lines: ['+971 4 234 5678', 'Toll Free: 800-PANORAMA'] },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-blue-500 transition-all">
                  <div className="text-4xl mb-6">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-gray-400">{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="reveal-right">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
              <h2 className="font-playfair text-3xl font-semibold text-white mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <input type="text" placeholder="First Name *" required className="bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all" />
                  <input type="text" placeholder="Last Name *" required className="bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all" />
                </div>
                <input type="email" placeholder="Email Address *" required className="w-full bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all" />
                <textarea rows="6" placeholder="Your Message *" required className="w-full bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all resize-none"></textarea>
                <button type="submit" className="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white py-5 rounded-full font-semibold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 relative overflow-hidden">
                  {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                  <span className="absolute inset-0 bg-white/20 -translate-x-full transition-transform duration-600 hover:translate-x-full" />
                </button>
                {formStatus === 'success' && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-green-400 text-center">
                    Message sent successfully! We'll reply within 24 hours.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
