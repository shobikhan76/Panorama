import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [formStatus, setFormStatus] = useState(null);
  const heroCanvasRef = useRef(null);
  const formRef = useRef(null);

  // Initialize GSAP animations
  useEffect(() => {
    // Contact hero animations
    const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

    heroTl
      .to(".contact-hero-badge", {
        opacity: 1,
        y: 0,
        duration: 1.2,
      })
      .to(
        ".contact-hero-title",
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
        },
        "-=0.6"
      )
      .to(
        ".contact-hero-subtitle",
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
        },
        "-=1"
      )
      .to(
        ".contact-shape-1",
        {
          opacity: 1,
          duration: 1,
        },
        "-=0.6"
      )
      .to(
        ".contact-shape-2",
        {
          opacity: 1,
          duration: 1,
        },
        "-=0.4"
      );

    // Scroll animations
    const revealElements = document.querySelectorAll(
      ".reveal-up, .reveal-left, .reveal-right, .reveal-scale"
    );

    revealElements.forEach((el) => {
      let fromVars = { opacity: 0 };

      if (el.classList.contains("reveal-up")) {
        fromVars.y = 40;
      } else if (el.classList.contains("reveal-left")) {
        fromVars.x = -40;
      } else if (el.classList.contains("reveal-right")) {
        fromVars.x = 40;
      } else if (el.classList.contains("reveal-scale")) {
        fromVars.scale = 0.95;
      }

      gsap.fromTo(el, fromVars, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Contact hero background animation
    if (heroCanvasRef.current) {
      const canvas = heroCanvasRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Particle system
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 150;
      const posArray = new Float32Array(particlesCount * 3);
      const colorsArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 60;
        posArray[i + 1] = (Math.random() - 0.5) * 60;
        posArray[i + 2] = (Math.random() - 0.5) * 60;

        colorsArray[i] = 0.23 + Math.random() * 0.1;
        colorsArray[i + 1] = 0.51 + Math.random() * 0.1;
        colorsArray[i + 2] = 0.92 + Math.random() * 0.08;
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(posArray, 3)
      );
      particlesGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colorsArray, 3)
      );

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
      });

      const particlesMesh = new THREE.Points(
        particlesGeometry,
        particlesMaterial
      );
      scene.add(particlesMesh);

      camera.position.z = 30;

      const animate = () => {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.0002;
        particlesMesh.rotation.x += 0.00005;
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
      };
    }
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("sending");

    setTimeout(() => {
      setFormStatus("success");
      e.target.reset();
      setTimeout(() => setFormStatus(null), 5000);
    }, 2000);
  };

  // FAQ toggle functionality
  const toggleFAQ = (e) => {
    const faqItem = e.currentTarget.closest(".faq-item");
    const isActive = faqItem.classList.contains("active");

    // Close all FAQs
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("active");
      item.querySelector(".faq-answer").style.maxHeight = "0";
      item.querySelector(".faq-icon").style.transform = "rotate(0deg)";
    });

    // Open clicked FAQ if it wasn't active
    if (!isActive) {
      faqItem.classList.add("active");
      const answer = faqItem.querySelector(".faq-answer");
      answer.style.maxHeight = answer.scrollHeight + "px";
      faqItem.querySelector(".faq-icon").style.transform = "rotate(45deg)";
    }
  };

  // Contact information data
  const contactInfo = [
    {
      icon: "📍",
      title: "Headquarters",
      lines: ["Panorama Tower, Business Bay", "Dubai, United Arab Emirates"],
    },
    {
      icon: "📧",
      title: "Email Us",
      lines: [
        "General: info@panoramagroup.com",
        "Support: support@panoramagroup.com",
      ],
      isLink: true,
    },
    {
      icon: "📞",
      title: "Call Us",
      lines: ["Main: +971 4 234 5678", "Toll Free: 800-PANORAMA"],
      isLink: true,
    },
    {
      icon: "🕐",
      title: "Business Hours",
      lines: [
        "Sunday - Thursday: 9:00 AM - 6:00 PM",
        "Friday - Saturday: Closed",
      ],
    },
  ];

  const offices = [
    {
      flag: "🇦🇪",
      location: "Dubai (HQ)",
      country: "United Arab Emirates",
      address: "Panorama Tower, Business Bay",
      phone: "+971 4 234 5678",
      email: "dubai@panoramagroup.com",
    },
    {
      flag: "🇬🇧",
      location: "London",
      country: "United Kingdom",
      address: "30 St Mary Axe, London EC3A 8BF",
      phone: "+44 20 7123 4567",
      email: "london@panoramagroup.com",
    },
    {
      flag: "🇸🇬",
      location: "Singapore",
      country: "Singapore",
      address: "Marina Bay Financial Centre",
      phone: "+65 6123 4567",
      email: "singapore@panoramagroup.com",
    },
  ];

  const faqs = [
    {
      question: "What industries does Panorama Group operate in?",
      answer:
        "Panorama Group operates across seven major industries including Technology, Global Trade, Food & Beverage, Entertainment, Chemical Manufacturing, Packaging Solutions, and Infrastructure Development. Our diversified portfolio allows us to leverage synergies across sectors.",
    },
    {
      question: "How can I explore partnership opportunities?",
      answer:
        'We welcome partnership inquiries from businesses worldwide. Please fill out the contact form above selecting "Partnership Opportunity" as the subject, or email us directly at partnerships@panoramagroup.com. Our business development team reviews all inquiries within 48 hours.',
    },
    {
      question: "Does Panorama Group offer investment opportunities?",
      answer:
        "Yes, we offer various investment opportunities for qualified investors. Please contact our Investor Relations team at investors@panoramagroup.com for more information about current opportunities, minimum investment requirements, and our investment philosophy.",
    },
    {
      question: "How can I apply for a job at Panorama Group?",
      answer:
        "We're always looking for talented individuals to join our team. Visit our Careers page to view current openings across all our brands and locations. You can also send your CV to careers@panoramagroup.com for future opportunities.",
    },
    {
      question: "What is Panorama Group's approach to sustainability?",
      answer:
        "Sustainability is core to our operations. We've committed to achieving carbon neutrality by 2030 and have implemented sustainable practices across all our businesses. Our annual sustainability report details our environmental initiatives, social responsibility programs, and governance standards.",
    },
  ];

  return (
    <div className="bg-black text-gray-300 font-sans">
      {/* Contact Hero Section - Fixed padding/margin */}
      <section className="contact-hero min-h-[60vh] flex items-center relative overflow-hidden bg-black">
        <canvas
          ref={heroCanvasRef}
          className="contact-hero-bg absolute top-0 left-0 w-full h-full z-1"
        />

        {/* Hero Gradient */}
        <div
          className="contact-hero-gradient absolute top-0 left-0 w-full h-full z-2 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                         radial-gradient(ellipse at 70% 60%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)`,
          }}
        />

        {/* Hero Grid */}
        <div
          className="contact-hero-grid absolute top-0 left-0 w-full h-full z-1"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          }}
        />

        {/* Floating Shapes */}
        <motion.div
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 30, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="contact-shape contact-shape-1 absolute -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.1))",
            filter: "blur(80px)",
            opacity: 0.3,
          }}
        />
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="contact-shape contact-shape-2 absolute -bottom-[50px] -left-[50px] w-[300px] h-[300px] rounded-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(20, 184, 166, 0.25), rgba(13, 148, 136, 0.1))",
            filter: "blur(80px)",
            opacity: 0.3,
          }}
        />

        <div className="contact-hero-container max-w-[1400px] mx-auto px-[60px] relative z-10 text-center">
          <div className="contact-hero-badge reveal-up inline-flex items-center gap-[12px] px-[10px_24px_10px_10px] bg-slate-800/70 backdrop-blur-[20px] border border-slate-700/50 rounded-[50px] text-[0.85rem] font-medium text-blue-300 mb-[30px]">
            <span className="contact-hero-badge-icon w-[32px] h-[32px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-[0.9rem]">
              💬
            </span>
            Let's Connect
          </div>
          <h1 className="contact-hero-title reveal-up font-serif text-[4.5rem] font-semibold text-white mb-[25px] leading-[1.1] tracking-[-2px]">
            Get in{" "}
            <span className="contact-hero-title-gradient bg-gradient-to-br from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="contact-hero-subtitle reveal-up text-[1.2rem] text-gray-400 max-w-[600px] mx-auto leading-[1.8]">
            Have a question or want to explore partnership opportunities? We'd
            love to hear from you. Our team is ready to help.
          </p>
        </div>
      </section>

      {/* Contact Main Section - Fixed spacing */}
      <section className="contact-section py-[100px_60px] bg-black relative">
        <div className="contact-container max-w-[1400px] mx-auto grid grid-cols-[1fr_1.2fr] gap-[80px] items-start px-[60px]">
          {/* Contact Info Side */}
          <div className="contact-info">
            <div className="contact-info-header reveal-left mb-[50px]">
              <div className="contact-info-label inline-flex items-center gap-[15px] text-[0.8rem] font-semibold text-blue-400 uppercase tracking-[3px] mb-[20px]">
                <span className="contact-info-label-line w-[40px] h-0.5 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full"></span>
                Contact Information
              </div>
              <h2 className="contact-info-title font-serif text-[2.5rem] font-semibold text-white leading-[1.2] mb-[20px]">
                We're Here to Help Your Business Grow
              </h2>
              <p className="contact-info-desc text-gray-400 text-base leading-[1.8]">
                Reach out to us through any of the channels below. Our dedicated
                team responds within 24 hours.
              </p>
            </div>

            <div className="contact-cards flex flex-col gap-[25px]">
              {contactInfo.map((card, i) => (
                <div
                  key={i}
                  className={`contact-card reveal-left bg-slate-800/70 backdrop-blur-[20px] border border-slate-700/50 rounded-[20px] p-[30px] flex items-start gap-[20px] transition-all duration-500 hover:border-blue-500 hover:shadow-xl cursor-pointer`}
                >
                  <div className="contact-card-icon w-[60px] h-[60px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-[16px] flex items-center justify-center text-[1.5rem] flex-shrink-0 shadow-lg">
                    {card.icon}
                  </div>
                  <div className="contact-card-content">
                    <h3 className="text-[1.2rem] font-semibold text-white mb-2">
                      {card.title}
                    </h3>
                    <div className="space-y-1">
                      {card.lines.map((line, j) => (
                        <p
                          key={j}
                          className="text-gray-400 text-[0.95rem] leading-[1.6]"
                        >
                          {card.isLink ? (
                            <a
                              href="#"
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              {line}
                            </a>
                          ) : (
                            line
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-social reveal-left mt-[50px]">
              <h4 className="text-[1rem] font-semibold text-white mb-[20px]">
                Follow Us
              </h4>
              <div className="contact-social-links flex gap-[15px]">
                {["Li", "X", "Fb", "Ig", "Yt"].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className="social-link w-[50px] h-[50px] bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-[14px] flex items-center justify-center text-white text-base font-semibold hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:border-transparent hover:-translate-y-1 hover:shadow-xl transition-all"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container reveal-right bg-slate-800/70 backdrop-blur-[20px] border border-slate-700/50 rounded-[30px] p-[50px] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-blue-400"></div>

            <div className="contact-form-header mb-[40px]">
              <h2 className="contact-form-title font-serif text-[2rem] font-semibold text-white mb-[10px]">
                Send Us a Message
              </h2>
              <p className="contact-form-subtitle text-gray-400 text-[0.95rem]">
                Fill out the form below and we'll get back to you shortly.
              </p>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="contact-form flex flex-col gap-[25px]"
            >
              <div className="form-row grid grid-cols-2 gap-[25px]">
                <div className="form-group flex flex-col gap-[10px]">
                  <label className="form-label text-[0.9rem] font-medium text-gray-300 flex items-center gap-2">
                    First Name{" "}
                    <span className="form-label-required text-blue-400 text-[0.8rem]">
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    required
                    className="form-input bg-white/10 border border-white/10 rounded-[12px] px-5 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="form-group flex flex-col gap-[10px]">
                  <label className="form-label text-[0.9rem] font-medium text-gray-300 flex items-center gap-2">
                    Last Name{" "}
                    <span className="form-label-required text-blue-400 text-[0.8rem]">
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    required
                    className="form-input bg-white/10 border border-white/10 rounded-[12px] px-5 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="form-row grid grid-cols-2 gap-[25px]">
                <div className="form-group flex flex-col gap-[10px]">
                  <label className="form-label text-[0.9rem] font-medium text-gray-300 flex items-center gap-2">
                    Email Address{" "}
                    <span className="form-label-required text-blue-400 text-[0.8rem]">
                      *
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@company.com"
                    required
                    className="form-input bg-white/10 border border-white/10 rounded-[12px] px-5 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="form-group flex flex-col gap-[10px]">
                  <label className="form-label text-[0.9rem] font-medium text-gray-300 flex items-center gap-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+971 50 123 4567"
                    className="form-input bg-white/10 border border-white/10 rounded-[12px] px-5 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="form-row grid grid-cols-2 gap-[25px]">
                <div className="form-group flex flex-col gap-[10px]">
                  <label className="form-label text-[0.9rem] font-medium text-gray-300 flex items-center gap-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Your Company"
                    className="form-input bg-white/10 border border-white/10 rounded-[12px] px-5 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="form-group flex flex-col gap-[10px]">
                  <label className="form-label text-[0.9rem] font-medium text-gray-300 flex items-center gap-2">
                    Subject{" "}
                    <span className="form-label-required text-blue-400 text-[0.8rem]">
                      *
                    </span>
                  </label>
                  <select
                    name="subject"
                    required
                    className="form-select bg-white/10 border border-white/10 rounded-[12px] px-5 py-4 text-white focus:border-blue-500 focus:outline-none transition-all"
                  >
                    <option value="" disabled selected>
                      Select a subject
                    </option>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="investment">Investment Relations</option>
                    <option value="careers">Careers</option>
                    <option value="media">Media & Press</option>
                    <option value="support">Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width flex flex-col gap-[10px]">
                <label className="form-label text-[0.9rem] font-medium text-gray-300 flex items-center gap-2">
                  Message{" "}
                  <span className="form-label-required text-blue-400 text-[0.8rem]">
                    *
                  </span>
                </label>
                <textarea
                  name="message"
                  placeholder="Tell us about your inquiry..."
                  required
                  rows="6"
                  className="form-textarea bg-white/10 border border-white/10 rounded-[12px] px-5 py-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all min-h-[150px] resize-vertical"
                ></textarea>
              </div>

              <div className="form-group full-width flex flex-col gap-[10px]">
                <div className="form-checkbox-group flex items-start gap-[15px]">
                  <input
                    type="checkbox"
                    id="privacyConsent"
                    required
                    className="form-checkbox w-[22px] h-[22px] border-2 border-white/20 rounded-[6px] appearance-none cursor-pointer relative flex-shrink-0 mt-1 checked:bg-gradient-to-br checked:from-blue-500 checked:to-blue-600"
                  />
                  <label
                    htmlFor="privacyConsent"
                    className="form-checkbox-label text-gray-400 text-[0.9rem] leading-[1.5]"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-blue-400 hover:underline">
                      Privacy Policy
                    </a>{" "}
                    and consent to Panorama Group processing my data for the
                    purpose of responding to my inquiry.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={formStatus === "sending"}
                className={`form-submit inline-flex items-center justify-center gap-[15px] px-[50px] py-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-[60px] text-[1rem] font-semibold cursor-pointer transition-all relative overflow-hidden hover:-translate-y-1 hover:shadow-xl ${
                  formStatus === "sending"
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                {formStatus === "sending" ? "Sending..." : "Send Message"}
                <span className="form-submit-icon w-6 h-6 bg-white/20 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1">
                  →
                </span>
              </button>

              {formStatus && (
                <div
                  className={`form-status flex items-center gap-[15px] p-5 rounded-[12px] mt-5 ${
                    formStatus === "success"
                      ? "bg-green-500/10 border border-green-500/30 text-green-400"
                      : "bg-red-500/10 border border-red-500/30 text-red-400"
                  }`}
                >
                  <span className="form-status-icon w-10 h-10 rounded-full flex items-center justify-center text-xl">
                    {formStatus === "success" ? "✓" : "✗"}
                  </span>
                  <span className="form-status-text">
                    {formStatus === "success"
                      ? "Message sent successfully! We'll get back to you within 24 hours."
                      : "Failed to send message. Please try again or contact us directly."}
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Map Section - Fixed spacing */}
      <section className="map-section py-0 px-[60px] pb-[150px] bg-black">
        <div className="map-container max-w-[1400px] mx-auto px-[60px]">
          <div className="map-header text-center mb-[60px]">
            <div className="map-label reveal-up inline-flex items-center gap-[15px] text-[0.8rem] font-semibold text-blue-400 uppercase tracking-[3px] mb-[20px]">
              <span className="map-label-line w-[40px] h-0.5 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full"></span>
              Our Locations
            </div>
            <h2 className="map-title reveal-up font-serif text-[3rem] font-semibold text-white mb-[15px]">
              Global Presence
            </h2>
            <p className="map-subtitle reveal-up text-gray-400 text-[1.1rem]">
              Visit us at any of our offices around the world
            </p>
          </div>

          <div className="map-wrapper reveal-scale relative rounded-[30px] overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-blue-400 z-10"></div>
            <iframe
              className="map-iframe w-full h-[500px] border-none grayscale-[100%] invert-[92%] contrast-[85%] hover:grayscale-[50%] hover:contrast-[90%] transition-all"
              src="https://www.google.com/maps/embed?pb= !1m18!1m12!1m3!1d3610.178510693867!2d55.26390731544387!3d25.197197983896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBurj%20Khalifa!5e0!3m2!1sen!2sae!4v1629789012345!5m2!1sen!2sae"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="offices-grid grid grid-cols-3 gap-[30px] mt-[60px]">
            {offices.map((office, i) => (
              <div
                key={i}
                className="office-card reveal-up bg-slate-800/70 backdrop-blur-[20px] border border-white/10 rounded-[24px] p-[35px] transition-all duration-500 hover:border-blue-500 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden"
              >
                <div className="office-card-flag text-[2.5rem] mb-5">
                  {office.flag}
                </div>
                <h3 className="text-[1.3rem] font-semibold text-white mb-1">
                  {office.location}
                </h3>
                <div className="office-card-location text-blue-400 text-[0.9rem] font-medium mb-5">
                  {office.country}
                </div>
                <p className="text-gray-400 text-[0.95rem] leading-[1.7] mb-2">
                  {office.address}
                </p>
                <p className="text-gray-400 text-[0.95rem] leading-[1.7] mb-2">
                  <a
                    href={`tel:${office.phone}`}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {office.phone}
                  </a>
                </p>
                <p className="text-gray-400 text-[0.95rem] leading-[1.7]">
                  <a
                    href={`mailto:${office.email}`}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {office.email}
                  </a>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Fixed spacing */}
      <section className="faq-section py-[150px] px-[60px] bg-gradient-to-b from-slate-900 to-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(59,130,246,0.05)_0%,transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(20,184,166,0.03)_0%,transparent_50%)] pointer-events-none"></div>

        <div className="faq-container max-w-[900px] mx-auto relative z-10 px-[60px]">
          <div className="faq-header text-center mb-[70px]">
            <div className="faq-label reveal-up inline-flex items-center gap-[15px] text-[0.8rem] font-semibold text-blue-400 uppercase tracking-[3px] mb-[20px]">
              <span className="faq-label-line w-[40px] h-0.5 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full"></span>
              FAQ
            </div>
            <h2 className="faq-title reveal-up font-serif text-[3rem] font-semibold text-white mb-[15px]">
              Frequently Asked Questions
            </h2>
            <p className="faq-subtitle reveal-up text-gray-400 text-[1.1rem]">
              Find answers to common questions about Panorama Group
            </p>
          </div>

          <div className="faq-list flex flex-col gap-[20px]">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="faq-item bg-slate-800/70 backdrop-blur-[20px] border border-white/10 rounded-[20px] overflow-hidden transition-all duration-400 hover:border-blue-500/50"
                data-faq
              >
                <div
                  className="faq-question px-[30px] py-[25px] flex justify-between items-center cursor-pointer transition-all hover:bg-blue-500/5"
                  onClick={toggleFAQ}
                >
                  <h3 className="text-[1.1rem] font-medium text-white pr-5">
                    {faq.question}
                  </h3>
                  <span className="faq-icon w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 text-xl flex-shrink-0 transition-all">
                    +
                  </span>
                </div>
                <div className="faq-answer max-h-0 overflow-hidden transition-all duration-500">
                  <div className="faq-answer-content px-[30px] pb-[25px] text-gray-400 text-base leading-[1.8]">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
