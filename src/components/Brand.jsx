import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Brands = () => {
  const brands = [
    {
      initials: "GR",
      name: "Global Resources",
      desc: "Our flagship trading company, Global Resources is a leader in international commodity trading and resource management, operating across 40+ countries with a focus on sustainable sourcing.",
      stats: [
        { value: "40+", label: "Countries" },
        { value: "$2.5B", label: "Revenue" },
        { value: "5000+", label: "Employees" },
      ],
      tags: ["Commodities", "Trading", "Logistics"],
      visual: "🌍",
      isFullWidth: true,
    },
    {
      initials: "UK",
      name: "Global Resources UK",
      desc: "European headquarters managing operations across the UK and EU markets, specializing in refined products and sustainable energy solutions.",
      stats: [
        { value: "8", label: "EU Countries" },
        { value: "$500M", label: "Revenue" },
      ],
      visual: null,
    },
    {
      initials: "ST",
      name: "System Technologies",
      desc: "Cutting-edge IT solutions provider delivering digital transformation, cloud services, and enterprise software to global clients.",
      stats: [
        { value: "500+", label: "Projects" },
        { value: "200+", label: "Clients" },
      ],
      visual: null,
    },
    {
      initials: "PF",
      name: "Panorama Foods",
      desc: "Premium food processing and distribution company serving millions of customers daily with quality products across 15 countries.",
      stats: [
        { value: "50+", label: "Products" },
        { value: "10M", label: "Customers" },
      ],
      visual: null,
    },
    {
      initials: "PE",
      name: "Panorama Entertainment",
      desc: "Leading entertainment company producing world-class content for cinema, streaming platforms, and live events globally.",
      stats: [
        { value: "100+", label: "Productions" },
        { value: "50M", label: "Viewers" },
      ],
      visual: null,
    },
    {
      initials: "PR",
      name: "Panorama Real Estate",
      desc: "Premium property development and management creating iconic residential and commercial spaces in prime locations.",
      stats: [
        { value: "25+", label: "Projects" },
        { value: "$1.2B", label: "Portfolio" },
      ],
      visual: null,
    },
    {
      initials: "PH",
      name: "Panorama Healthcare",
      desc: "Comprehensive healthcare solutions provider operating hospitals, clinics, and pharmaceutical distribution networks. Committed to improving lives through accessible and quality healthcare services.",
      stats: [
        { value: "15", label: "Hospitals" },
        { value: "100+", label: "Clinics" },
        { value: "2M+", label: "Patients/Year" },
      ],
      tags: ["Healthcare", "Pharmaceuticals", "Medical"],
      visual: "🏥",
      isFullWidth: true,
      gradient: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
    },
  ];

  // Floating particles animation
  const particleVariants = {
    animate: (i) => ({
      y: ["100vh", "-100vh"],
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1, 1, 0.5],
      transition: {
        duration: 15 + i * 2,
        repeat: Infinity,
        delay: i * 1.2,
        ease: "linear",
      },
    }),
  };

  // Brand card animations
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      rotateY: -10,
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: i * 0.15,
        duration: 0.8,
      },
    }),
    hover: {
      y: -15,
      scale: 1.02,
      rotateX: 3,
      rotateY: -2,
      boxShadow: "0 40px 80px rgba(99, 102, 241, 0.25)",
      borderColor: "#6366F1",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  // Hero text animation
  const heroVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 1.2,
      },
    },
  };

  // Floating animation for hero elements
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Background gradient animation
  const bgGradientVariants = {
    animate: {
      background: [
        "radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
        "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
        "radial-gradient(circle at 40% 40%, rgba(20, 184, 166, 0.1) 0%, transparent 40%)",
      ],
    },
    transition: { duration: 8, repeat: Infinity, repeatType: "reverse" },
  };

  return (
    <div className="bg-[#030014] text-white font-['Outfit'] min-h-screen overflow-x-hidden">
      {/* Background Animation */}
      <motion.div
        className="bg-animation fixed inset-0 z-0 pointer-events-none"
        variants={bgGradientVariants}
        animate="animate"
      />

      {/* Floating Particles */}
      <div className="particles fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="particle absolute w-2 h-2 bg-[#6366F1] rounded-full shadow-[0_0_20px_#6366F1,0_0_40px_#6366F1]"
            style={{
              left: `${10 + i * 15}%`,
              top: "100%",
            }}
            custom={i}
            variants={particleVariants}
            animate="animate"
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content relative z-10">
        {/* Hero Section - Fixed padding/margin */}
        <section className="brands-hero min-h-[70vh] flex items-center justify-center text-center pt-[120px] pb-[80px] px-[50px] relative">
          <div className="brands-hero-content">
            <motion.h1
              className="text-[5rem] font-black leading-tight mb-[25px] tracking-[-3px]"
              variants={heroVariants}
              initial="hidden"
              animate="visible"
            >
              Our{" "}
              <span className="text-gradient bg-gradient-to-br from-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
                Brands
              </span>
            </motion.h1>
            <motion.p
              className="text-[1.4rem] text-[#94A3B8] max-w-[600px] mx-auto leading-[1.8]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1.2 }}
            >
              A diverse portfolio of excellence spanning seven industries and 45
              countries worldwide.
            </motion.p>
          </div>
        </section>

        {/* Brands Grid - Fixed padding/margin */}
        <section className="brands-section py-[50px_60px_100px] relative overflow-hidden">
          <div className="brands-grid grid grid-cols-2 gap-[40px] max-w-[1400px] mx-auto px-[60px]">
            {brands.map((brand, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className={`brand-card bg-[rgba(99,102,241,0.08)] border border-[rgba(99,102,241,0.25)] rounded-[30px] p-[40px] transition-all duration-[0.4s] hover:border-[#6366F1] hover:shadow-[0_40px_80px_rgba(99,102,241,0.25)] hover:bg-[rgba(99,102,241,0.12)] ${
                  brand.isFullWidth
                    ? "col-span-2 flex gap-[50px] items-center"
                    : ""
                }`}
              >
                <div
                  className={`${
                    brand.isFullWidth ? "brand-content flex-1" : "brand-content"
                  }`}
                >
                  <div className="brand-header flex justify-between items-start mb-[25px]">
                    <motion.div
                      className="brand-logo w-[90px] h-[90px] bg-gradient-to-br from-[#6366F1] to-[#06B6D4] rounded-[22px] flex items-center justify-center text-[2rem] font-black text-white shadow-[0_15px_40px_rgba(99,102,241,0.35)] transition-all duration-[0.4s]"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      style={
                        brand.gradient ? { background: brand.gradient } : {}
                      }
                    >
                      {brand.initials}
                    </motion.div>
                    <motion.div className="brand-arrow w-[55px] h-[55px] border-2 border-[rgba(99,102,241,0.4)] rounded-full flex items-center justify-center text-[1.4rem] text-[#94A3B8] transition-all duration-[0.3s] group-hover:bg-[#6366F1] group-hover:border-[#6366F1] group-hover:text-white group-hover:rotate-[45deg]">
                      →
                    </motion.div>
                  </div>
                  <div className="brand-info">
                    <motion.h2
                      className="text-[1.8rem] font-bold mb-[15px] text-white transition-colors group-hover:text-[#60A5FA]"
                      whileHover={{ color: "#60A5FA" }}
                    >
                      {brand.name}
                    </motion.h2>
                    <motion.p
                      className="text-[#94A3B8] text-[1.05rem] leading-[1.8] mb-[25px] transition-colors group-hover:text-[#D1D5DB]"
                      whileHover={{ color: "#D1D5DB" }}
                    >
                      {brand.desc}
                    </motion.p>
                    <div className="brand-stats flex gap-[35px] pt-[25px] border-t border-[rgba(99,102,241,0.2)]">
                      {brand.stats.map((stat, j) => (
                        <div key={j} className="brand-stat">
                          <motion.h4
                            className="text-[1.8rem] font-black bg-gradient-to-br from-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent mb-[5px]"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.8 + j * 0.1,
                              type: "spring",
                            }}
                          >
                            {stat.value}
                          </motion.h4>
                          <p className="text-[0.9rem] text-[#94A3B8] m-0">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                    {brand.tags && (
                      <div className="brand-tags flex gap-[10px] flex-wrap mt-[20px]">
                        {brand.tags.map((tag, k) => (
                          <span
                            key={k}
                            className="brand-tag px-[18px] py-[8px] bg-[rgba(99,102,241,0.2)] border border-[rgba(99,102,241,0.3)] rounded-[50px] text-[0.85rem] text-[#818CF8] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {brand.visual && (
                  <motion.div
                    className="brand-visual w-[350px] h-[280px] rounded-[25px] flex items-center justify-center text-[100px] shadow-[0_30px_60px_rgba(99,102,241,0.35)] flex-shrink-0"
                    style={{
                      background:
                        brand.gradient ||
                        "linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)",
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {brand.visual}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Hide scrollbar for brand containers (cross-browser) */}
        <style>{`
          .brands-section::-webkit-scrollbar, .brands-grid::-webkit-scrollbar { display: none; }
          .brands-section { -ms-overflow-style: none; scrollbar-width: none; }
          .brands-grid { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* CTA Section - Fixed spacing */}
        <section className="brands-cta py-[100px_60px] text-center border-t border-[rgba(99,102,241,0.15)] relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.2)_0%,transparent_70%)] pointer-events-none"></div>
          <motion.h2
            className="text-[3.5rem] font-black mb-[20px] relative z-10"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            Ready to{" "}
            <span className="text-gradient bg-gradient-to-br from-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
              Partner
            </span>{" "}
            With Us?
          </motion.h2>
          <motion.p
            className="text-[1.3rem] text-[#94A3B8] mb-[45px] relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Join our growing family of world-class brands and unlock new
            possibilities.
          </motion.p>
          <motion.div
            className="relative z-10"
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link
              to="/contact"
              className="cta-btn inline-flex items-center gap-[15px] px-[55px] py-[22px] bg-gradient-to-br from-[#6366F1] to-[#06B6D4] text-white rounded-[50px] text-[1.15rem] font-semibold shadow-[0_20px_50px_rgba(99,102,241,0.4)] hover:shadow-[0_30px_70px_rgba(99,102,241,0.5)] transition-all"
            >
              Start a Conversation
              <span className="text-[1.4rem]">→</span>
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Brands;
