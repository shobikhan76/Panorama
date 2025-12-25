import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const heroCanvasRef = useRef(null);
  const storyCanvasRef = useRef(null);
  const valuesCanvasRef = useRef(null);
  const timelineCanvasRef = useRef(null);
  const teamCanvasRef = useRef(null);
  const statsCanvasRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Cursor Effect
  useEffect(() => {
    if (!isMounted) return;

    const cursor = document.createElement("div");
    cursor.className = "cursor";
    document.body.appendChild(cursor);

    const follower = document.createElement("div");
    follower.className = "cursor-follower";
    document.body.appendChild(follower);

    const moveCursor = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
      gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
    };

    document.addEventListener("mousemove", moveCursor);

    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      if (document.body.contains(cursor)) document.body.removeChild(cursor);
      if (document.body.contains(follower)) document.body.removeChild(follower);
    };
  }, [isMounted]);

  // Three.js Background Generator
  const createThreeBackground = (canvasRef) => {
    if (!canvasRef.current) return null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle System
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 80;
      posArray[i + 1] = (Math.random() - 0.5) * 80;
      posArray[i + 2] = (Math.random() - 0.5) * 80;

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
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    // Floating Shapes
    const shapes = [];
    const createShape = (geometry, color, position, scale) => {
      const material = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.scale.set(scale, scale, scale);
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.001,
          y: (Math.random() - 0.5) * 0.001,
          z: (Math.random() - 0.5) * 0.001,
        },
        floatSpeed: Math.random() * 0.3 + 0.2,
        floatOffset: Math.random() * Math.PI * 2,
        originalY: position[1],
      };
      return mesh;
    };

    shapes.push(
      createShape(
        new THREE.IcosahedronGeometry(2.5, 0),
        0x3b82f6,
        [18, 6, -15],
        1.3
      )
    );
    shapes.push(
      createShape(
        new THREE.OctahedronGeometry(2, 0),
        0x14b8a6,
        [-22, -10, -18],
        1.1
      )
    );
    shapes.push(
      createShape(
        new THREE.TorusGeometry(3.5, 0.4, 8, 24),
        0x8b5cf6,
        [28, -6, -25],
        0.7
      )
    );
    shapes.push(
      createShape(
        new THREE.TetrahedronGeometry(2, 0),
        0x3b82f6,
        [-28, 12, -28],
        1.2
      )
    );
    shapes.forEach((shape) => scene.add(shape));

    camera.position.z = 35;

    // Mouse movement effect
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Very smooth mouse following
      currentMouseX += (targetMouseX - currentMouseX) * 0.03;
      currentMouseY += (targetMouseY - currentMouseY) * 0.03;

      // Slow rotation
      particlesMesh.rotation.y += 0.0002;
      particlesMesh.rotation.x += 0.00005;

      // Animate shapes with slow floating
      shapes.forEach((shape) => {
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        shape.rotation.z += shape.userData.rotationSpeed.z;
        shape.position.y =
          shape.userData.originalY +
          Math.sin(
            Date.now() * 0.0005 * shape.userData.floatSpeed +
              shape.userData.floatOffset
          ) *
            3;
      });

      // Subtle camera movement
      camera.position.x += (currentMouseX * 3 - camera.position.x) * 0.015;
      camera.position.y += (-currentMouseY * 3 - camera.position.y) * 0.015;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Return cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      shapes.forEach((shape) => scene.remove(shape));
      scene.remove(particlesMesh);
    };
  };

  // Initialize Three.js backgrounds with proper cleanup
  useEffect(() => {
    setIsMounted(true);

    const cleanupFunctions = [];

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      cleanupFunctions.push(createThreeBackground(heroCanvasRef));
      cleanupFunctions.push(createThreeBackground(storyCanvasRef));
      cleanupFunctions.push(createThreeBackground(valuesCanvasRef));
      cleanupFunctions.push(createThreeBackground(timelineCanvasRef));
      cleanupFunctions.push(createThreeBackground(teamCanvasRef));
      cleanupFunctions.push(createThreeBackground(statsCanvasRef));
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanupFunctions.forEach((cleanup) => cleanup && cleanup());
      setIsMounted(false);
    };
  }, []);

  // GSAP Animations with proper cleanup
  useEffect(() => {
    if (!isMounted) return;

    // Kill any existing animations
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Hero animations with ScrollTrigger
    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
      .from(".page-tag", { y: 30, opacity: 0, duration: 1 })
      .from(".about-hero h1", { y: 50, opacity: 0, duration: 1 }, "-=0.7")
      .from(".about-hero p", { y: 30, opacity: 0, duration: 1 }, "-=0.7")
      .from(".about-hero-image", { x: 100, opacity: 0, duration: 1 }, "-=0.7");

    // Story section animations
    gsap.from(".story-content h2", {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      scrollTrigger: { trigger: ".story-content h2", start: "top 80%" },
    });

    gsap.from(".story-content p", {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      stagger: 0.1,
      scrollTrigger: { trigger: ".story-content", start: "top 80%" },
    });

    gsap.from(".story-image", {
      x: 100,
      opacity: 0,
      duration: 1,
      delay: 0.7,
      scrollTrigger: { trigger: ".story-image", start: "top 80%" },
    });

    // Values cards animations
    gsap.from(".value-card", {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      delay: 0.3,
      scrollTrigger: { trigger: ".values-grid", start: "top 80%" },
    });

    // Timeline animations
    gsap.from(".timeline-item", {
      x: -60,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      delay: 0.3,
      scrollTrigger: { trigger: ".timeline", start: "top 80%" },
    });

    // Team cards animations
    gsap.from(".team-card", {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      delay: 0.3,
      scrollTrigger: { trigger: ".team-grid", start: "top 80%" },
    });

    // Stats animations
    gsap.from(".stat-item", {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      delay: 0.3,
      scrollTrigger: { trigger: ".stats-grid", start: "top 80%" },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      // Kill specific timelines
      heroTl.kill();
    };
  }, [isMounted]);

  // Data
  const timeline = [
    {
      year: "1995",
      title: "Foundation",
      desc: "Panorama Group was founded as a small trading company in Dubai.",
    },
    {
      year: "2002",
      title: "Global Expansion",
      desc: "Expanded operations to Europe with the establishment of Global Resources UK.",
    },
    {
      year: "2008",
      title: "Diversification",
      desc: "Entered the technology sector with the launch of System Technologies.",
    },
    {
      year: "2015",
      title: "Food & Entertainment",
      desc: "Launched Panorama Foods and Panorama Entertainment divisions.",
    },
    {
      year: "2023",
      title: "$10B Revenue",
      desc: "Achieved $10 billion in annual revenue with operations in 45 countries.",
    },
  ];

  const values = [
    {
      icon: "🎯",
      title: "Integrity",
      desc: "We do what's right, even when no one is watching. Honesty and transparency are the foundation of all our relationships.",
    },
    {
      icon: "💡",
      title: "Innovation",
      desc: "We constantly push boundaries and challenge the status quo to find better solutions for tomorrow's challenges.",
    },
    {
      icon: "⭐",
      title: "Excellence",
      desc: "We strive for the highest standards in everything we do, never settling for anything less than our best.",
    },
    {
      icon: "🌍",
      title: "Sustainability",
      desc: "We're committed to creating value that lasts, protecting our planet for future generations.",
    },
    {
      icon: "👥",
      title: "People First",
      desc: "Our people are our greatest asset. We invest in their growth and create an environment where they can thrive.",
    },
    {
      icon: "🤝",
      title: "Collaboration",
      desc: "We believe in the power of working together, both within our organization and with our partners.",
    },
  ];

  const team = [
    { name: "Ahmed Al-Rashid", role: "Chairman & CEO" },
    { name: "Sarah Mitchell", role: "Chief Operating Officer" },
    { name: "Michael Chen", role: "Chief Financial Officer" },
    { name: "Fatima Hassan", role: "Chief Strategy Officer" },
  ];

  return (
    <div
      className="min-h-screen bg-[#030014] text-white font-sans"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Background Elements */}
      <div className="bg-animation fixed inset-0 z-0"></div>
      <div className="particles fixed inset-0 z-0">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      {/* Hero Section - FIXED MARGINS */}
      <section className="about-hero relative min-h-screen flex items-center px-6 md:px-12 lg:px-16 xl:px-24 py-32">
        <canvas
          ref={heroCanvasRef}
          className="absolute inset-0 w-full h-full z-0"
        ></canvas>

        <div className="about-hero-content relative z-10 max-w-3xl">
          <span className="page-tag">About Panorama</span>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight mb-8">
            Building a <span className="text-gradient">Better Tomorrow</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#94A3B8] leading-relaxed">
            For over 25 years, we've been pioneering innovation across
            industries. From humble beginnings to a global conglomerate, our
            journey is defined by excellence, integrity, and an unwavering
            commitment to creating value.
          </p>
        </div>

        <div className="about-hero-image absolute right-6 md:right-12 lg:right-16 xl:right-24 top-1/2 transform -translate-y-1/2 w-[300px] md:w-[400px] lg:w-[500px] h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-[#6366F1] to-[#06B6D4] rounded-[300px_300px_0_0] opacity-80 shadow-[0_0_100px_rgba(99,102,241,0.3)]">
          <div className="absolute inset-0 flex items-center justify-center text-7xl md:text-8xl lg:text-9xl">
            🏢
          </div>
        </div>
      </section>

      {/* Story Section - FIXED MARGINS */}
      <section className="story-section py-20 md:py-24 lg:py-32 px-6 md:px-12 lg:px-16 xl:px-24 bg-[rgba(10,10,10,0.5)] border-y border-[rgba(99,102,241,0.1)]">
        <canvas
          ref={storyCanvasRef}
          className="absolute inset-0 w-full h-full opacity-30"
        ></canvas>

        <div className="story-grid relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="story-content">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-8">
              Our <span className="text-gradient">Story</span>
            </h2>
            <div className="space-y-5">
              <p className="text-lg md:text-xl text-[#94A3B8] leading-relaxed">
                What started as a small trading company in 1995 has grown into a
                diversified conglomerate spanning seven industries across 45
                countries.
              </p>
              <p className="text-lg md:text-xl text-[#94A3B8] leading-relaxed">
                Our founder's vision was simple: create businesses that not only
                generate profit but also contribute positively to society and
                the environment. This vision continues to guide us today.
              </p>
              <p className="text-lg md:text-xl text-[#94A3B8] leading-relaxed">
                Through strategic acquisitions, organic growth, and a relentless
                focus on innovation, we've built a family of companies that are
                leaders in their respective fields.
              </p>
            </div>
          </div>

          <div className="story-image relative mt-12 lg:mt-0">
            <div className="story-image-main w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-[rgba(99,102,241,0.2)] to-[rgba(6,182,212,0.2)] border border-[rgba(99,102,241,0.2)] rounded-[30px] relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-6xl md:text-7xl lg:text-9xl">
                📊
              </div>
            </div>
            <div className="story-year absolute -bottom-6 md:-bottom-8 right-0 md:-right-8 bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white px-8 md:px-12 py-6 md:py-8 rounded-[20px] text-3xl md:text-5xl font-black shadow-[0_20px_50px_rgba(99,102,241,0.4)]">
              1995
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - FIXED VISIBILITY & MARGINS */}
      <section className="values-section py-20 md:py-24 lg:py-32 px-6 md:px-12 lg:px-16 xl:px-24 relative" style={{ zIndex: 10 }}>
        <canvas
          ref={valuesCanvasRef}
          className="absolute inset-0 w-full h-full opacity-20 z-0"
        ></canvas>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="section-header text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-5">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-lg md:text-xl text-[#94A3B8]">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="values-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-7xl mx-auto">
            {values.map((value, i) => (
              <motion.div
                key={i}
                className="value-card bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-[30px] p-8 md:p-12 text-center transition-all duration-500 hover:-translate-y-5 hover:border-blue-500/50 hover:bg-slate-800/90 hover:shadow-[0_30px_60px_rgba(99,102,241,0.2)]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="value-icon w-[80px] md:w-[100px] h-[80px] md:h-[100px] bg-gradient-to-r from-blue-500 to-teal-500 rounded-[30px] flex items-center justify-center text-4xl md:text-5xl mb-6 md:mb-8 transition-all duration-500 shadow-[0_10px_30px_rgba(99,102,241,0.3)]">
                  {value.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section - FIXED MARGINS */}
      <section className="timeline-section py-20 md:py-24 lg:py-32 px-6 md:px-12 lg:px-16 xl:px-24 bg-[rgba(10,10,10,0.5)] border-t border-[rgba(99,102,241,0.1)] relative overflow-hidden">
        <canvas
          ref={timelineCanvasRef}
          className="absolute inset-0 w-full h-full opacity-20"
        ></canvas>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="section-header text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-5">
              Our <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-lg md:text-xl text-[#94A3B8]">
              Key milestones in our growth story
            </p>
          </div>

          <div className="timeline max-w-4xl mx-auto relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[rgba(99,102,241,0.5)] to-[rgba(6,182,212,0.5)]"></div>

            {timeline.map((item, i) => (
              <div
                key={i}
                className={`timeline-item flex ${
                  i % 2 === 0 ? "justify-end pr-8 md:pr-16" : "justify-start pl-8 md:pl-16"
                } relative mb-12 md:mb-16 w-1/2 ${i % 2 === 0 ? "ml-auto" : ""}`}
              >
                <div className="timeline-content bg-slate-900/80 backdrop-blur-lg border border-slate-700/30 p-6 md:p-10 rounded-[20px] max-w-[300px] md:max-w-[400px] transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:bg-slate-800/80">
                  <div className="timeline-year text-2xl md:text-4xl font-black bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent mb-1 md:mb-2">
                    {item.year}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">{item.desc}</p>
                </div>
                <div
                  className={`absolute top-4 md:top-8 w-3 md:w-5 h-3 md:h-5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] ${
                    i % 2 === 0 ? "-left-1.5 md:-left-2.5" : "-right-1.5 md:-right-2.5"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - FIXED MARGINS */}
      <section className="team-section py-20 md:py-24 lg:py-32 px-6 md:px-12 lg:px-16 xl:px-24">
        <canvas
          ref={teamCanvasRef}
          className="absolute inset-0 w-full h-full opacity-20"
        ></canvas>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="section-header text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-5">
              Leadership <span className="text-gradient">Team</span>
            </h2>
            <p className="text-lg md:text-xl text-[#94A3B8]">
              Meet the visionaries guiding our journey
            </p>
          </div>

          <div className="team-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-7xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={i}
                className="team-card text-center cursor-pointer"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="team-image w-full aspect-square bg-slate-900/80 backdrop-blur-lg border border-slate-700/30 rounded-[20px] md:rounded-[30px] mb-4 md:mb-6 relative overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(99,102,241,0.3)] hover:border-blue-500/50 hover:bg-slate-800/80">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl md:text-7xl lg:text-8xl">
                    👤
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-400 font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - FIXED MARGINS */}
      <section className="stats-section py-16 md:py-20 lg:py-24 px-6 md:px-12 lg:px-16 xl:px-24 bg-gradient-to-r from-blue-600 via-purple-500 to-teal-500 relative overflow-hidden">
        <canvas
          ref={statsCanvasRef}
          className="absolute inset-0 w-full h-full opacity-10"
        ></canvas>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2 md:mb-3">45+</h3>
              <p className="text-white/80 text-base md:text-xl">Countries</p>
            </motion.div>
            <motion.div
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2 md:mb-3">15,000+</h3>
              <p className="text-white/80 text-base md:text-xl">Employees</p>
            </motion.div>
            <motion.div
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2 md:mb-3">7</h3>
              <p className="text-white/80 text-base md:text-xl">Industries</p>
            </motion.div>
            <motion.div
              className="stat-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2 md:mb-3">$10B+</h3>
              <p className="text-white/80 text-base md:text-xl">Revenue</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        :root {
          --white: #ffffff;
          --off-white: #0a0a0a;
          --light-gray: #1a1a2e;
          --gray: #94a3b8;
          --dark: #ffffff;
          --darker: #030014;
          --accent: #6366f1;
          --accent-light: #818cf8;
          --cyan: #06b6d4;
          --gradient: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
        }

        .bg-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }

        .bg-animation::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
              circle at 20% 80%,
              rgba(99, 102, 241, 0.15) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(6, 182, 212, 0.15) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 40% 40%,
              rgba(139, 92, 246, 0.1) 0%,
              transparent 40%
            );
          animation: bgMove 20s ease-in-out infinite;
        }

        @keyframes bgMove {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(-5%, 5%) rotate(5deg);
          }
          50% {
            transform: translate(5%, -5%) rotate(-5deg);
          }
          75% {
            transform: translate(-3%, -3%) rotate(3deg);
          }
        }

        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(99, 102, 241, 0.5);
          border-radius: 50%;
          animation: float 15s infinite;
        }

        .particle:nth-child(1) {
          left: 10%;
          animation-delay: 0s;
          animation-duration: 20s;
        }
        .particle:nth-child(2) {
          left: 20%;
          animation-delay: 2s;
          animation-duration: 18s;
        }
        .particle:nth-child(3) {
          left: 30%;
          animation-delay: 4s;
          animation-duration: 22s;
        }
        .particle:nth-child(4) {
          left: 40%;
          animation-delay: 1s;
          animation-duration: 19s;
        }
        .particle:nth-child(5) {
          left: 50%;
          animation-delay: 3s;
          animation-duration: 21s;
        }
        .particle:nth-child(6) {
          left: 60%;
          animation-delay: 5s;
          animation-duration: 17s;
        }
        .particle:nth-child(7) {
          left: 70%;
          animation-delay: 2s;
          animation-duration: 23s;
        }
        .particle:nth-child(8) {
          left: 80%;
          animation-delay: 4s;
          animation-duration: 20s;
        }
        .particle:nth-child(9) {
          left: 90%;
          animation-delay: 1s;
          animation-duration: 18s;
        }
        .particle:nth-child(10) {
          left: 95%;
          animation-delay: 3s;
          animation-duration: 22s;
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(1);
            opacity: 0;
          }
        }

        .cursor {
          width: 20px;
          height: 20px;
          border: 2px solid #6366f1;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 99999;
          transition: transform 0.1s ease, width 0.3s, height 0.3s;
          transform: translate(-50%, -50%);
          mix-blend-mode: difference;
        }

        .cursor-follower {
          width: 8px;
          height: 8px;
          background: #6366f1;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 99998;
          transition: transform 0.3s ease;
          transform: translate(-50%, -50%);
        }

        .cursor.hover {
          width: 60px;
          height: 60px;
          background: rgba(99, 102, 241, 0.2);
        }

        .page-tag {
          display: inline-block;
          padding: 10px 25px;
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #818cf8;
          margin-bottom: 30px;
        }

        .text-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .about-hero-image {
          box-shadow: 0 0 100px rgba(99, 102, 241, 0.3);
        }

        .value-card:hover .value-icon {
          transform: scale(1.1) rotate(10deg);
        }

        .timeline-content:hover {
          transform: scale(1.05);
        }

        .team-card:hover .team-image {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(99, 102, 241, 0.3);
        }

        /* Ensure section canvases stay behind content and don't block visibility */
        section canvas {
          z-index: -2;
          pointer-events: none;
        }

        /* Ensure sections have proper positioning */
        section {
          position: relative;
          z-index: 1;
        }

        /* Responsive adjustments for better mobile experience */
        @media (max-width: 1200px) {
          .about-hero h1 {
            font-size: 4rem;
          }
          
          .about-hero-image {
            width: 350px;
            height: 450px;
          }
        }

        @media (max-width: 992px) {
          .story-grid,
          .values-grid {
            grid-template-columns: 1fr;
          }
          
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .timeline-item,
          .timeline-item:nth-child(even) {
            width: 100%;
            padding-left: 60px;
            padding-right: 0;
          }
          
          .timeline::before {
            left: 0;
          }
        }

        @media (max-width: 768px) {
          .about-hero {
            padding: 120px 30px;
          }
          
          .about-hero h1 {
            font-size: 2.5rem;
          }
          
          .story-section,
          .values-section,
          .timeline-section,
          .team-section {
            padding: 100px 30px;
          }
          
          .cursor,
          .cursor-follower {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .about-hero {
            flex-direction: column;
            text-align: center;
            padding: 80px 20px;
          }
          
          .about-hero-image {
            position: relative !important;
            right: auto !important;
            top: auto !important;
            transform: none !important;
            margin-top: 40px;
            width: 250px;
            height: 300px;
          }
          
          .story-year {
            position: relative !important;
            right: auto !important;
            bottom: auto !important;
            margin-top: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default About;