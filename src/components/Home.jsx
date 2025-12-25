import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import * as THREE from "three";
import "swiper/css";
import "swiper/css/free-mode";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const heroCanvasRef = useRef(null);
  const hero3DCanvasRef = useRef(null);
  const brandsTrackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Loader Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 - prev) * 0.03;
        if (newProgress > 99.5) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        return newProgress;
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Three.js Hero Background
  useEffect(() => {
    if (!loading && heroCanvasRef.current) {
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
      shapes.forEach((shape) => scene.add(shape));

      camera.position.z = 35;

      // Animation Loop
      const animate = () => {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.0002;
        particlesMesh.rotation.x += 0.00005;

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

      return () => {
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
      };
    }
  }, [loading]);

  // 3D Globe Visual
  // Earth/Globe Visualization
  useEffect(() => {
    if (!loading && hero3DCanvasRef.current) {
      const canvas = hero3DCanvasRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });

      const containerWidth = canvas.parentElement.offsetWidth;
      const containerHeight = canvas.parentElement.offsetHeight;
      renderer.setSize(containerWidth, containerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Create Earth
      const earthGeometry = new THREE.SphereGeometry(5, 64, 64);

      // Create a simple earth-like material
      const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2563eb,
        emissive: 0x0c4a6e,
        shininess: 30,
        transparent: true,
        opacity: 0.9,
      });

      // Add some wireframe for tech effect
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });

      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      const earthWireframe = new THREE.Mesh(earthGeometry, wireframeMaterial);

      // Add atmosphere glow
      const atmosphereGeometry = new THREE.SphereGeometry(5.3, 64, 64);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x14b8a6,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

      // Add rings
      const ringGeometry = new THREE.TorusGeometry(7.5, 0.06, 16, 120);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.4,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2.3;

      // Add second ring
      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(8.5, 0.04, 16, 120),
        new THREE.MeshBasicMaterial({
          color: 0x8b5cf6,
          transparent: true,
          opacity: 0.25,
        })
      );
      ring2.rotation.x = Math.PI / 1.8;
      ring2.rotation.y = Math.PI / 4;

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);

      scene.add(ambientLight);
      scene.add(directionalLight);
      scene.add(earth);
      scene.add(earthWireframe);
      scene.add(atmosphere);
      scene.add(ring);
      scene.add(ring2);

      camera.position.z = 15;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        // Rotate earth
        earth.rotation.y += 0.003;
        earthWireframe.rotation.y += 0.003;
        atmosphere.rotation.y -= 0.001;
        ring.rotation.z += 0.001;
        ring2.rotation.z -= 0.0008;

        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (hero3DCanvasRef.current.parentElement) {
          const newWidth = hero3DCanvasRef.current.parentElement.offsetWidth;
          const newHeight = hero3DCanvasRef.current.parentElement.offsetHeight;
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
      };
    }
  }, [loading]);

  // Counter Animation
  useEffect(() => {
    const counters = document.querySelectorAll(".stat-number");

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute("data-target"));
      if (!target) return;

      let current = 0;
      const increment = target / 60;
      const suffix = el.innerHTML.match(/<span>.*<\/span>/)?.[0] || "";
      const prefix = el.innerHTML.includes("$") ? "$" : "";

      const update = () => {
        current += increment;
        if (current < target) {
          el.innerHTML = prefix + Math.ceil(current) + suffix;
          requestAnimationFrame(update);
        } else {
          el.innerHTML = prefix + target + suffix;
        }
      };
      update();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));

    return () => observer.disconnect();
  }, []);

  // Testimonials Data
  const testimonials = [
    {
      text: "Panorama Group represents the gold standard in diversified business excellence. Their commitment to innovation and sustainable growth sets them apart in today's global marketplace.",
      author: "James Davidson",
      role: "CEO, Global Investments Corp",
      initials: "JD",
    },
    {
      text: "Working with Panorama has transformed our supply chain operations. Their expertise and global reach have been instrumental in our expansion across three continents.",
      author: "Sarah Mitchell",
      role: "COO, TechVentures International",
      initials: "SM",
    },
    {
      text: "The level of professionalism and innovation at Panorama Group is unmatched. They don't just meet expectations – they consistently exceed them in every partnership.",
      author: "Michael Chen",
      role: "Director, Asia Pacific Holdings",
      initials: "MC",
    },
  ];

  // Marquee Items
  const marqueeItems = [
    { icon: "🌐", text: "Global Resources" },
    { icon: "💻", text: "System Technologies" },
    { icon: "🍽️", text: "Panorama Foods" },
    { icon: "🎬", text: "Entertainment" },
    { icon: "🧪", text: "Vision Chemtech" },
    { icon: "📦", text: "Packaging Solutions" },
    { icon: "🏗️", text: "Infrastructure" },
  ];

  // Brand Cards
  const brandCards = [
    {
      logo: "GR",
      title: "Global Resources",
      desc: "International commodity trading & resource management across continents.",
    },
    {
      logo: "ST",
      title: "System Technologies",
      desc: "IT solutions & digital transformation for the modern enterprise.",
    },
    {
      logo: "PF",
      title: "Panorama Foods",
      desc: "Premium food processing & distribution serving millions worldwide.",
    },
    {
      logo: "PE",
      title: "Panorama Entertainment",
      desc: "Media production & entertainment experiences that inspire.",
    },
    {
      logo: "VC",
      title: "Vision Chemtech",
      desc: "Advanced chemical solutions for industrial applications.",
    },
    {
      logo: "PP",
      title: "Panorama Packaging",
      desc: "Innovative packaging solutions for sustainable businesses.",
    },
  ];

  // Stats Data
  const statsData = [
    { icon: "🌍", number: "45", suffix: "+", label: "Countries" },
    { icon: "👥", number: "15", suffix: "K+", label: "Employees" },
    { icon: "💼", number: "7", suffix: "", label: "Industries" },
    { icon: "📈", number: "10", suffix: "B+", label: "Revenue" },
  ];

  // About Cards
  const aboutCards = [
    {
      number: "01",
      icon: "🎯",
      title: "Mission Driven",
      desc: "Purpose-led innovation that creates lasting impact and drives meaningful change across industries.",
    },
    {
      number: "02",
      icon: "🌱",
      title: "Sustainable Growth",
      desc: "Eco-conscious operations and responsible business practices that ensure a better tomorrow.",
    },
    {
      number: "03",
      icon: "🤝",
      title: "People First",
      desc: "A global team of 15,000+ dedicated professionals united by shared values and vision.",
    },
  ];

  return (
    <div className="bg-black text-gray-300 font-sans min-h-screen">
      {/* Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, staggerChildren: 0.08 }}
                className="text-4xl md:text-6xl font-bold text-white mb-12 font-serif tracking-widest"
              >
                {"PANORAMA".split("").map((letter, i) => (
                  <motion.span key={i} className="inline-block" custom={i}>
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
              <div className="w-80 mx-auto">
                <div className="h-1 bg-blue-500/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full shadow-lg shadow-blue-500/50"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <motion.div
                  className="text-5xl font-light text-white mt-8 font-serif"
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                >
                  {Math.round(progress)}%
                </motion.div>
                <div className="text-gray-500 text-sm uppercase tracking-widest mt-4">
                  Loading Experience
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero Section */}
      {/* Hero Section with Earth Visualization */}
      {/* Hero Section with Real Earth */}
      <section className="min-h-screen flex items-center relative overflow-hidden bg-black">
        {/* Three.js Canvas for particles */}
        <canvas
          ref={heroCanvasRef}
          id="hero-canvas"
          className="absolute top-0 left-0 w-full h-full z-1"
        />

        {/* Gradient Overlay */}
        <div
          className="absolute top-0 left-0 w-full h-full z-2 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
                   radial-gradient(ellipse at 80% 70%, rgba(20, 184, 166, 0.08) 0%, transparent 50%),
                   radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 60%)`,
          }}
        />

        {/* Grid Background */}
        <div
          className="absolute top-0 left-0 w-full h-full z-1"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />

        {/* Floating Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full z-1 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, -30, 20, 0],
              y: [0, 30, -20, 0],
              scale: [1, 1.05, 0.95, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[150px] -right-[150px] w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.1))",
              filter: "blur(80px)",
              opacity: 0.4,
            }}
          />
          <motion.div
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -20, 30, 0],
              scale: [1, 1.08, 0.92, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(13, 148, 136, 0.1))",
              filter: "blur(80px)",
              opacity: 0.4,
            }}
          />
        </div>

        {/* Hero Container */}
        <div className="max-w-[1600px] mx-auto px-[60px] grid grid-cols-2 gap-[80px] items-center relative z-10 min-h-screen">
          {/* Hero Content */}
          <div className="relative pt-[80px]">
            {/* Hero Badge */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center gap-[12px] px-[10px_24px_10px_10px] bg-slate-800/70 backdrop-blur-[20px] border border-slate-700/50 rounded-[50px] text-[0.85rem] font-medium text-blue-300 mb-[35px]"
              style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(51, 65, 85, 0.5)",
                boxShadow: "0 8px 32px rgba(59, 130, 246, 0.2)",
              }}
            >
              <span className="w-[32px] h-[32px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-[0.8rem] text-white shadow-lg">
                ★
              </span>
              Global Conglomerate Since 1995
            </motion.div>

            {/* Hero Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="font-serif text-[4.5rem] font-semibold text-white mb-[30px] leading-[1.1] tracking-[-2px]"
            >
              <motion.span
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="block overflow-hidden"
              >
                <span className="block">Redefining</span>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="block overflow-hidden"
              >
                <span
                  className="block bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400 bg-clip-text text-transparent"
                  style={{
                    textShadow: "0 0 80px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  Innovation
                </span>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="block overflow-hidden"
              >
                <span className="block">Worldwide</span>
              </motion.span>
            </motion.h1>

            {/* Hero Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-gray-400 text-[1.15rem] leading-[1.8] mb-[45px] max-w-[520px] font-normal"
            >
              Panorama Group transforms possibilities into reality through
              diverse business ventures spanning technology, trade, food,
              entertainment, and beyond.
            </motion.p>

            {/* Hero Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex gap-[20px] mb-[70px]"
            >
              <motion.a
                href="/brands"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Explore Our Brands
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  →
                </span>
              </motion.a>
              <motion.a
                href="/about"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 text-blue-300 px-8 py-4 rounded-full font-medium hover:bg-slate-700/50 hover:text-white transition-all"
              >
                Learn More
              </motion.a>
            </motion.div>

            {/* Hero Stats */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex gap-12"
            >
              <div className="text-center">
                <div className="text-[3rem] font-bold text-white mb-2 font-serif">
                  45<span className="text-blue-400">+</span>
                </div>
                <div className="text-gray-500 text-xs uppercase tracking-widest">
                  Countries
                </div>
              </div>
              <div className="text-center">
                <div className="text-[3rem] font-bold text-white mb-2 font-serif">
                  7
                </div>
                <div className="text-gray-500 text-xs uppercase tracking-widest">
                  Industries
                </div>
              </div>
              <div className="text-center">
                <div className="text-[3rem] font-bold text-white mb-2 font-serif">
                  15K<span className="text-blue-400">+</span>
                </div>
                <div className="text-gray-500 text-xs uppercase tracking-widest">
                  Employees
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Visual with Real Earth */}
          <div className="relative">
            <div className="relative h-[500px]">
              <canvas
                ref={hero3DCanvasRef}
                id="hero-3d-canvas"
                className="w-full h-full"
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0">
              <motion.div
                animate={{
                  y: [-12, 0, -12],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-[25%] right-0 bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    🌍
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      Global Presence
                    </h4>
                    <p className="text-gray-400 text-xs">45+ Countries</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-[33%] left-0 bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl"
              >
                <div className="text-2xl font-bold text-teal-400 mb-1 font-serif">
                  +32%
                </div>
                <div className="text-gray-400 text-xs uppercase tracking-widest">
                  Annual Growth
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-5"
        >
          <div className="w-6 h-10 border-2 border-blue-400 rounded-full relative">
            <motion.div
              animate={{ y: [8, 18, 8], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-blue-400 rounded-full absolute left-1/2 transform -translate-x-1/2 top-2"
            />
          </div>
          <span className="text-gray-500 text-xs uppercase tracking-widest">
            Scroll to explore
          </span>
        </motion.div>
      </section>
      {/* About Section */}
      <section className="py-[150px] px-[60px] bg-black relative overflow-hidden">
        {/* Background Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-serif text-[20vw] font-extrabold text-blue-500/5 whitespace-nowrap pointer-events-none"
          style={{
            textShadow: "0 0 100px rgba(59, 130, 246, 0.05)",
          }}
        >
          PANORAMA
        </motion.div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-16">
            <div className="mb-8 md:mb-0">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex items-center gap-4 mb-6"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-10 h-1 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full origin-left"
                />
                <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
                  About Panorama
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="text-3xl md:text-5xl font-bold text-white max-w-2xl leading-tight font-serif"
              >
                Building A Legacy of Innovation & Excellence
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="max-w-md pt-6"
            >
              <p className="text-gray-400 leading-relaxed">
                For nearly three decades, Panorama Group has been at the
                forefront of transforming industries and creating sustainable
                value across the globe.
              </p>
            </motion.div>
          </div>

          {/* About Grid */}
          <div className="grid grid-cols-3 gap-[35px]">
            {aboutCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow:
                    "0 25px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 130, 246, 0.1)",
                  borderColor: "#3B82F6",
                }}
                className="relative bg-slate-800/70 backdrop-blur-[20px] border border-slate-700/50 rounded-[24px] p-[45px_35px] overflow-hidden transition-all duration-500 hover:border-blue-500"
                style={{
                  background: "rgba(15, 23, 42, 0.7)",
                  border: "1px solid rgba(51, 65, 85, 0.5)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                {/* Gradient Background Effects */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(20, 184, 166, 0.03))",
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                  }}
                />

                {/* Card Number */}
                <motion.span
                  initial={{ opacity: 0.06 }}
                  whileInView={{ opacity: 0.15 }}
                  whileHover={{
                    opacity: 0.15,
                    textShadow: "0 0 30px rgba(59, 130, 246, 0.2)",
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-[25px] right-[35px] font-serif text-[4rem] font-semibold text-blue-500/10"
                >
                  {card.number}
                </motion.span>

                {/* Card Icon */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.3 }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    boxShadow: "0 15px 40px rgba(59, 130, 246, 0.5)",
                  }}
                  className="w-[65px] h-[65px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-[18px] flex items-center justify-center text-[1.6rem] mb-[28px] relative z-1 shadow-lg"
                  style={{
                    boxShadow: "0 8px 30px rgba(59, 130, 246, 0.35)",
                  }}
                >
                  {card.icon}
                </motion.div>

                {/* Card Content */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.4 }}
                  className="text-[1.35rem] font-semibold text-white mb-[15px] relative z-1"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.5 }}
                  className="text-gray-400 text-[0.95rem] leading-[1.8] relative z-1"
                >
                  {card.desc}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      // Brands Section - Replace the existing brands section with this:
      {/* Brands Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(59,130,246,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(20,184,166,0.05)_0%,transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16">
            <div className="mb-8 md:mb-0">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="w-10 h-1 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full" />
                <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
                  Our Portfolio
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold text-white max-w-2xl leading-tight font-serif"
              >
                Diverse Brands, Unified Excellence
              </motion.h2>
            </div>
            <motion.a
              href="/brands"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all"
            >
              View All Brands
              <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                →
              </span>
            </motion.a>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setCurrentBrandIndex(Math.max(0, currentBrandIndex - 1))
              }
              disabled={currentBrandIndex === 0}
              className="w-12 h-12 bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-full flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setCurrentBrandIndex(
                  Math.min(brandCards.length - 3, currentBrandIndex + 1)
                )
              }
              disabled={currentBrandIndex >= brandCards.length - 3}
              className="w-12 h-12 bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-full flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </motion.button>
          </div>

          {/* Brands Display */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{ x: `-${currentBrandIndex * (320 + 32)}px` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {brandCards.map((brand, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    rotateX: 6,
                    rotateY: -6,
                    boxShadow:
                      "0 30px 60px rgba(0, 0, 0, 0.4), 0 0 50px rgba(59, 130, 246, 0.15)",
                  }}
                  className="flex-shrink-0 w-80 bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 relative overflow-hidden cursor-pointer group"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 3, y: -5 }}
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg shadow-blue-500/40"
                  >
                    {brand.logo}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {brand.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {brand.desc}
                  </p>
                  <motion.div
                    whileHover={{ x: 8, scale: 1.1 }}
                    className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 text-xl group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white transition-all duration-300"
                  >
                    →
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: Math.max(1, brandCards.length - 2) }).map(
              (_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentBrandIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentBrandIndex
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 scale-125 shadow-lg shadow-blue-500/40"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                />
              )
            )}
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(59,130,246,0.05)_0%,transparent_50%),radial-gradient(ellipse_at_80%_50%,rgba(20,184,166,0.04)_0%,transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.12 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                }}
                className="text-center bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 transition-all duration-500 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-blue-500/10 border border-slate-700/50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 transition-all group-hover:bg-blue-500/20 group-hover:border-blue-500/50"
                >
                  {stat.icon}
                </motion.div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-3 font-serif">
                  <span
                    className="stat-number"
                    data-target={stat.number.replace(/[^0-9]/g, "")}
                  >
                    {stat.prefix}
                    {stat.number}
                  </span>
                  <span className="text-blue-400">{stat.suffix}</span>
                </div>
                <div className="text-gray-500 text-sm uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_60%) pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="w-10 h-1 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full" />
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">
              Testimonials
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-16 font-serif"
          >
            What Leaders Say
          </motion.h2>

          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-[10rem] font-bold text-blue-500/10 font-serif leading-none">
              "
            </div>
            <div className="relative z-10">
              <p className="text-xl md:text-2xl text-white leading-relaxed mb-12 font-serif">
                {testimonials[currentTestimonial].text}
              </p>
              <div className="flex items-center justify-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-lg shadow-blue-500/40">
                  {testimonials[currentTestimonial].initials}
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-white">
                    {testimonials[currentTestimonial].author}
                  </h4>
                  <p className="text-gray-400">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 scale-125 shadow-lg shadow-blue-500/40"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08)_0%,transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.05)_0%,transparent_40%)] pointer-events-none" />

        <motion.div
          animate={{
            y: [-250, -200, -250],
            x: [-150, -100, -150],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-60 -right-20 w-[500px] h-[500px] rounded-full border border-white/10 pointer-events-none"
        />
        <motion.div
          animate={{
            y: [-200, -250, -200],
            x: [-150, -200, -150],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-60 -left-20 w-[400px] h-[400px] rounded-full border border-white/10 pointer-events-none"
        />

        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
          >
            <span className="text-white text-sm">
              ✦ Ready to Transform Your Business?
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight font-serif"
          >
            Partner with{" "}
            <span className="bg-gradient-to-r from-blue-200 via-teal-200 to-purple-200 bg-clip-text text-transparent">
              Excellence
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-blue-100/70 text-lg mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Join the Panorama family and be part of a legacy that's shaping the
            future of global business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.04, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-4 bg-white text-blue-700 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:shadow-white/20 transition-all"
            >
              Get in Touch
              <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                →
              </span>
            </motion.a>
            <motion.a
              href="/brands"
              whileHover={{ scale: 1.04, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-4 bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 hover:border-white/50 transition-all"
            >
              Explore Opportunities
            </motion.a>
          </motion.div>
        </div>
      </section>
      {/* Footer removed — use central `Footer` component instead to avoid duplication */}
      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-10 right-10 w-14 h-14 bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-full flex items-center justify-center text-blue-400 text-xl hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-500/40 transition-all z-50"
      >
        ↑
      </motion.button>
    </div>
  );
};

export default Home;
