"use client";
import React from "react";
import { motion } from "framer-motion";
import Background from "@/components/auth/Background";
import { ModeSwitcher } from "@/components/theme/modeSwitch";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <Background />

      {/* Soft overlay for contrast */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/40 backdrop-blur-[2px] transition-all duration-500" />

      {/* Floating glass orbs for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Orb 1 */}
        <motion.div
          className="absolute top-[20%] left-[15%] w-40 h-40 rounded-full backdrop-blur-3xl border border-white/20 shadow-2xl"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
          }}
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orb 2 */}
        <motion.div
          className="absolute bottom-[15%] right-[20%] w-28 h-28 rounded-full backdrop-blur-2xl border border-white/20 shadow-xl"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))",
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orb 3 (tiny floating spark) */}
        <motion.div
          className="absolute top-[60%] left-[50%] w-16 h-16 rounded-full backdrop-blur-xl border border-white/10 shadow-md"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
          }}
          animate={{
            y: [0, 15, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="absolute top-4 right-4 z-20">
        <ModeSwitcher />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
