import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import * as THREE from 'three';
import 'swiper/css';
import 'swiper/css/free-mode';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
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
      setProgress(prev => {
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
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
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

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        sizeAttenuation: true
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      // Floating Shapes
      const shapes = [];
      const createShape = (geometry, color, position, scale) => {
        const material = new THREE.MeshBasicMaterial({
          color,
          wireframe: true,
          transparent: true,
          opacity: 0.08
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        mesh.scale.set(scale, scale, scale);
        mesh.userData = {
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.001,
            y: (Math.random() - 0.5) * 0.001,
            z: (Math.random() - 0.5) * 0.001
          },
          floatSpeed: Math.random() * 0.3 + 0.2,
          floatOffset: Math.random() * Math.PI * 2,
          originalY: position[1]
        };
        return mesh;
      };

      shapes.push(createShape(new THREE.IcosahedronGeometry(2.5, 0), 0x3B82F6, [18, 6, -15], 1.3));
      shapes.push(createShape(new THREE.OctahedronGeometry(2, 0), 0x14B8A6, [-22, -10, -18], 1.1));
      shapes.push(createShape(new THREE.TorusGeometry(3.5, 0.4, 8, 24), 0x8B5CF6, [28, -6, -25], 0.7));
      shapes.forEach(shape => scene.add(shape));

      camera.position.z = 35;

      // Animation Loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.y += 0.0002;
        particlesMesh.rotation.x += 0.00005;

        shapes.forEach(shape => {
          shape.rotation.x += shape.userData.rotationSpeed.x;
          shape.rotation.y += shape.userData.rotationSpeed.y;
          shape.rotation.z += shape.userData.rotationSpeed.z;
          shape.position.y = shape.userData.originalY + 
            Math.sin(Date.now() * 0.0005 * shape.userData.floatSpeed + shape.userData.floatOffset) * 3;
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
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    }
  }, [loading]);

  // 3D Globe Visual
  useEffect(() => {
    if (!loading && hero3DCanvasRef.current) {
      const canvas = hero3DCanvasRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      
      const containerWidth = canvas.parentElement.offsetWidth;
      const containerHeight = canvas.parentElement.offsetHeight;
      renderer.setSize(containerWidth, containerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Globe
      const globeGeometry = new THREE.SphereGeometry(5, 40, 40);
      const globeMaterial = new THREE.MeshBasicMaterial({
        color: 0x3B82F6,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      });
      const globe = new THREE.Mesh(globeGeometry, globeMaterial);
      scene.add(globe);

      // Inner Glow
      const innerGlobe = new THREE.Mesh(
        new THREE.SphereGeometry(4.7, 32, 32),
        new THREE.MeshBasicMaterial({
          color: 0x14B8A6,
          transparent: true,
          opacity: 0.08
        })
      );
      scene.add(innerGlobe);

      // Rings
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(7.5, 0.06, 16, 120),
        new THREE.MeshBasicMaterial({
          color: 0xF59E0B,
          transparent: true,
          opacity: 0.4
        })
      );
      ring.rotation.x = Math.PI / 2.3;
      scene.add(ring);

      // Orbiting Points
      const orbitPoints = [];
      for (let i = 0; i < 8; i++) {
        const point = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 16, 16),
          new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x3B82F6 : 0x14B8A6,
            transparent: true,
            opacity: 0.8
          })
        );
        point.userData = {
          angle: (i / 8) * Math.PI * 2,
          radius: 5.5 + Math.random() * 0.5,
          speed: 0.003 + Math.random() * 0.002,
          yOffset: (Math.random() - 0.5) * 2
        };
        orbitPoints.push(point);
        scene.add(point);
      }

      camera.position.z = 15;

      const animate = () => {
        requestAnimationFrame(animate);
        
        globe.rotation.y += 0.002;
        innerGlobe.rotation.y -= 0.001;
        ring.rotation.z += 0.001;

        orbitPoints.forEach(point => {
          point.userData.angle += point.userData.speed;
          point.position.x = Math.cos(point.userData.angle) * point.userData.radius;
          point.position.z = Math.sin(point.userData.angle) * point.userData.radius;
          point.position.y = point.userData.yOffset + Math.sin(point.userData.angle * 2) * 0.5;
        });

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        renderer.dispose();
      };
    }
  }, [loading]);

  // Counter Animation
  useEffect(() => {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'));
      if (!target) return;
      
      let current = 0;
      const increment = target / 60;
      const suffix = el.innerHTML.match(/<span>.*<\/span>/)?.[0] || '';
      const prefix = el.innerHTML.includes('$') ? '$' : '';
      
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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
    
    return () => observer.disconnect();
  }, []);

  // Testimonials Data
  const testimonials = [
    {
      text: "Panorama Group represents the gold standard in diversified business excellence. Their commitment to innovation and sustainable growth sets them apart in today's global marketplace.",
      author: "James Davidson",
      role: "CEO, Global Investments Corp",
      initials: "JD"
    },
    {
      text: "Working with Panorama has transformed our supply chain operations. Their expertise and global reach have been instrumental in our expansion across three continents.",
      author: "Sarah Mitchell",
      role: "COO, TechVentures International",
      initials: "SM"
    },
    {
      text: "The level of professionalism and innovation at Panorama Group is unmatched. They don't just meet expectations – they consistently exceed them in every partnership.",
      author: "Michael Chen",
      role: "Director, Asia Pacific Holdings",
      initials: "MC"
    }
  ];

  // Marquee Items
  const marqueeItems = [
    { icon: "🌐", text: "Global Resources" },
    { icon: "💻", text: "System Technologies" },
    { icon: "🍽️", text: "Panorama Foods" },
    { icon: "🎬", text: "Entertainment" },
    { icon: "🧪", text: "Vision Chemtech" },
    { icon: "📦", text: "Packaging Solutions" },
    { icon: "🏗️", text: "Infrastructure" }
  ];

  // Brand Cards
  const brandCards = [
    { logo: "GR", title: "Global Resources", desc: "International commodity trading & resource management across continents." },
    { logo: "ST", title: "System Technologies", desc: "IT solutions & digital transformation for the modern enterprise." },
    { logo: "PF", title: "Panorama Foods", desc: "Premium food processing & distribution serving millions worldwide." },
    { logo: "PE", title: "Panorama Entertainment", desc: "Media production & entertainment experiences that inspire." },
    { logo: "VC", title: "Vision Chemtech", desc: "Advanced chemical solutions for industrial applications." },
    { logo: "PP", title: "Panorama Packaging", desc: "Innovative packaging solutions for sustainable businesses." }
  ];

  // Stats Data
  const statsData = [
    { icon: "🌍", number: "45", suffix: "+", label: "Countries" },
    { icon: "👥", number: "15", suffix: "K+", label: "Employees" },
    { icon: "💼", number: "7", suffix: "", label: "Industries" },
    { icon: "📈", number: "10", suffix: "B+", label: "Revenue" }
  ];

  // About Cards
  const aboutCards = [
    { number: "01", icon: "🎯", title: "Mission Driven", desc: "Purpose-led innovation that creates lasting impact and drives meaningful change across industries." },
    { number: "02", icon: "🌱", title: "Sustainable Growth", desc: "Eco-conscious operations and responsible business practices that ensure a better tomorrow." },
    { number: "03", icon: "🤝", title: "People First", desc: "A global team of 15,000+ dedicated professionals united by shared values and vision." }
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
                {"PANORAMA".split('').map((letter, i) => (
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
                <div className="text-gray-500 text-sm uppercase tracking-widest mt-4">Loading Experience</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="min-h-screen relative overflow-hidden">
        <canvas ref={heroCanvasRef} className="absolute inset-0 w-full h-full z-0" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-teal-500/5 z-10" />
        
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] z-0" />
        
        {/* Floating Shapes */}
        <motion.div 
          animate={{ 
            y: [-150, -120, -150],
            x: [0, -30, 20, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500/25 to-blue-600/10 blur-[80px] opacity-40"
        />
        <motion.div 
          animate={{ 
            y: [-100, -140, -100],
            x: [0, 40, -30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-teal-500/20 to-teal-600/10 blur-[80px] opacity-40"
        />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-16 md:pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-screen">
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <motion.div 
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="inline-flex items-center gap-3 bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-full px-6 py-3 mb-8 shadow-xl"
              >
                <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm shadow-lg shadow-blue-500/40">★</span>
                <span className="text-blue-400 text-sm font-medium">Global Conglomerate Since 1995</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-serif"
              >
                <span className="block">Redefining</span>
                <span className="block bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400 bg-clip-text text-transparent">
                  Innovation
                </span>
                <span className="block">Worldwide</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.8 }}
                className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed"
              >
                Panorama Group transforms possibilities into reality through diverse business ventures spanning technology, trade, food, entertainment, and beyond.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <motion.a 
                  href="/brands"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all"
                >
                  Explore Our Brands
                  <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">→</span>
                </motion.a>
                <motion.a 
                  href="/about"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-4 bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 text-blue-300 px-8 py-4 rounded-full font-medium hover:bg-slate-700/50 hover:text-white transition-all"
                >
                  Learn More
                </motion.a>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.2 }}
                className="flex justify-center md:justify-start gap-12"
              >
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif">45<span className="text-blue-400">+</span></div>
                  <div className="text-gray-500 text-xs uppercase tracking-widest">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif">7</div>
                  <div className="text-gray-500 text-xs uppercase tracking-widest">Industries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif">15K<span className="text-blue-400">+</span></div>
                  <div className="text-gray-500 text-xs uppercase tracking-widest">Employees</div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* 3D Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="relative h-[400px] md:h-[500px]"
            >
              <canvas ref={hero3DCanvasRef} className="w-full h-full" />
              
              {/* Floating Cards */}
              <motion.div 
                animate={{ 
                  y: [-12, 0, -12],
                  rotate: [0, 1, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-0 bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">🌍</div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Global Presence</h4>
                    <p className="text-gray-400 text-xs">45+ Countries</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  x: [0, 5, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: -2 }}
                className="absolute bottom-1/3 left-0 bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl"
              >
                <div className="text-2xl font-bold text-teal-400 mb-1 font-serif">+32%</div>
                <div className="text-gray-400 text-xs uppercase tracking-widest">Annual Growth</div>
              </motion.div>
            </motion.div>
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
          <span className="text-gray-500 text-xs uppercase tracking-widest">Scroll to explore</span>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <section className="py-6 bg-slate-900 border-y border-slate-800/50 overflow-hidden">
        <Swiper
          modules={[Autoplay, FreeMode]}
          spaceBetween={70}
          slidesPerView="auto"
          freeMode
          autoplay={{ delay: 0, disableOnInteraction: false }}
          speed={35000}
          loop
          className="!py-4"
        >
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <SwiperSlide key={index} className="!w-auto">
              <div className="flex items-center gap-4 px-8">
                <div className="w-11 h-11 bg-slate-800/70 border border-slate-700/50 rounded-xl flex items-center justify-center text-lg">
                  {item.icon}
                </div>
                <span className="text-gray-400 font-medium whitespace-nowrap">{item.text}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* About Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[20vw] font-bold text-blue-500/5 whitespace-nowrap pointer-events-none font-serif">
          PANORAMA
        </div>
        
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
                <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">About Panorama</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold text-white max-w-2xl leading-tight font-serif"
              >
                Building A Legacy of Innovation & Excellence
              </motion.h2>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-md pt-6"
            >
              <p className="text-gray-400 leading-relaxed">
                For nearly three decades, Panorama Group has been at the forefront of transforming industries and creating sustainable value across the globe.
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {aboutCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 130, 246, 0.1)"
                }}
                className="relative bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 transition-all duration-500"
              >
                <span className="absolute top-4 right-6 text-5xl font-bold text-blue-500/10 font-serif">
                  {card.number}
                </span>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-7 shadow-lg shadow-blue-500/40"
                >
                  {card.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-4">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Our Portfolio</span>
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
              <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">→</span>
            </motion.a>
          </div>

          <div 
            ref={brandsTrackRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing pb-4"
            onMouseDown={(e) => {
              setIsDragging(true);
              setStartX(e.pageX - brandsTrackRef.current.offsetLeft);
              setScrollLeft(brandsTrackRef.current.scrollLeft);
            }}
            onMouseLeave={() => setIsDragging(false)}
            onMouseUp={() => setIsDragging(false)}
            onMouseMove={(e) => {
              if (!isDragging) return;
              e.preventDefault();
              const x = e.pageX - brandsTrackRef.current.offsetLeft;
              const walk = (x - startX) * 2;
              brandsTrackRef.current.scrollLeft = scrollLeft - walk;
            }}
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
                  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4), 0 0 50px rgba(59, 130, 246, 0.15)"
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
                <h3 className="text-xl font-semibold text-white mb-3">{brand.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{brand.desc}</p>
                <motion.div 
                  whileHover={{ x: 8, scale: 1.1 }}
                  className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 text-xl group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white transition-all duration-300"
                >
                  →
                </motion.div>
              </motion.div>
            ))}
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
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
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
                  <span className="stat-number" data-target={stat.number.replace(/[^0-9]/g, '')}>
                    {stat.prefix}{stat.number}
                  </span>
                  <span className="text-blue-400">{stat.suffix}</span>
                </div>
                <div className="text-gray-500 text-sm uppercase tracking-widest">{stat.label}</div>
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
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Testimonials</span>
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
                  <h4 className="text-lg font-semibold text-white">{testimonials[currentTestimonial].author}</h4>
                  <p className="text-gray-400">{testimonials[currentTestimonial].role}</p>
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
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 scale-125 shadow-lg shadow-blue-500/40' 
                    : 'bg-slate-700 hover:bg-slate-600'
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
            x: [-150, -100, -150]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-60 -right-20 w-[500px] h-[500px] rounded-full border border-white/10 pointer-events-none"
        />
        <motion.div 
          animate={{ 
            y: [-200, -250, -200],
            x: [-150, -200, -150]
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
            <span className="text-white text-sm">✦ Ready to Transform Your Business?</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight font-serif"
          >
            Partner with <span className="bg-gradient-to-r from-blue-200 via-teal-200 to-purple-200 bg-clip-text text-transparent">Excellence</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-blue-100/70 text-lg mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Join the Panorama family and be part of a legacy that's shaping the future of global business.
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
              <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">→</span>
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

      {/* Footer */}
      <footer className="bg-slate-950 py-20 md:py-24 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <motion.a 
                href="/"
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-3 text-2xl font-bold text-white mb-6 font-serif"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/40">
                  P
                </div>
                Panorama
              </motion.a>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
                A global conglomerate connecting innovation across industries. Building tomorrow's world today through sustainable practices and exceptional excellence.
              </p>
              <div className="flex gap-3">
                {['Li', 'X', 'Fb', 'Ig'].map((social, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 bg-slate-800/70 border border-slate-700/50 rounded-xl flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:border-transparent transition-all"
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </div>
            
            {[
              { title: "Quick Links", links: ["Home", "About Us", "Our Brands", "Contact"] },
              { title: "Our Brands", links: ["Global Resources", "System Technologies", "Panorama Foods", "Vision Chemtech"] },
              { title: "Company", links: ["Leadership", "Sustainability", "Careers", "Investors"] },
              { title: "Contact", links: ["Dubai, UAE", "info@panorama.com", "+971 4 234 5678"] }
            ].map((column, index) => (
              <div key={index}>
                <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-7">{column.title}</h4>
                <ul className="space-y-4">
                  {column.links.map((link, i) => (
                    <li key={i}>
                      <motion.a 
                        href="#"
                        whileHover={{ x: 5, color: "#60A5FA" }}
                        className="text-gray-400 hover:text-blue-400 transition-all inline-flex items-center gap-2"
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2024 Panorama Group of Companies. All rights reserved.</p>
            <div className="flex gap-8">
              <motion.a href="#" whileHover={{ color: "#60A5FA" }} className="text-gray-500 text-sm hover:text-blue-400 transition-colors">Privacy Policy</motion.a>
              <motion.a href="#" whileHover={{ color: "#60A5FA" }} className="text-gray-500 text-sm hover:text-blue-400 transition-colors">Terms of Service</motion.a>
              <motion.a href="#" whileHover={{ color: "#60A5FA" }} className="text-gray-500 text-sm hover:text-blue-400 transition-colors">Cookie Policy</motion.a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-10 right-10 w-14 h-14 bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-full flex items-center justify-center text-blue-400 text-xl hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-500/40 transition-all z-50"
      >
        ↑
      </motion.button>
    </div>
  );
};

export default Home;