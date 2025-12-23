import React, { useEffect, useState } from "react";
import { gsap } from "gsap";

const PageLoader = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const letters = document.querySelectorAll(".loader-logo span");
    gsap.to(letters, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.08,
      ease: "power3.out",
    });

    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15;
      setProgress(Math.min(100, current));
      if (current >= 100) {
        clearInterval(interval);
        // Fade out using GSAP then set visible to false
        gsap.to(".loader", {
          opacity: 0,
          duration: 0.8,
          onComplete: () => setVisible(false),
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="loader fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="loader-logo font-playfair text-6xl lg:text-8xl font-bold text-white mb-16 flex tracking-widest">
        {"PANORAMA".split("").map((letter, i) => (
          <span key={i} className="inline-block translate-y-full opacity-0">
            {letter}
          </span>
        ))}
      </div>
      <div className="w-80 flex flex-col items-center">
        <div className="w-full h-0.5 bg-blue-500/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-8 text-6xl font-thin text-white font-playfair">
          {Math.round(progress)}%
        </div>
        <div className="mt-5 text-xs text-gray-500 uppercase tracking-widest">
          Loading Experience
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
