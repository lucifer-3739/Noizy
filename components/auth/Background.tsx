"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Background: React.FC = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden transition-colors duration-700 bg-[#fdfcff] dark:bg-[#0a0a0f]">
      <div className="absolute inset-0 blur-[100px]">
        {/* Blue Blob (Light/Dark) */}
        <motion.div
          className="absolute h-[400px] w-[400px] rounded-full 
            bg-[rgba(88,101,242,0.6)] dark:bg-[rgba(120,190,255,0.3)]"
          animate={{
            x: mouse.x * 0.05 - 200,
            y: mouse.y * 0.05 - 200,
          }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 30,
          }}
        />

        {/* Pink Blob (Light/Dark) */}
        <motion.div
          className="absolute h-[400px] w-[400px] rounded-full 
            bg-[rgba(255,182,193,0.6)] dark:bg-[rgba(255,100,180,0.3)]"
          animate={{
            x: -mouse.x * 0.05 + 200,
            y: -mouse.y * 0.05 + 200,
          }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 30,
          }}
        />
      </div>
    </div>
  );
};

export default Background;
