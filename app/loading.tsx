"use client";

import { motion } from "motion/react";

export default function Loading() {
    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
            {/* 🎵 Ambient Background Glow */}
            <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/10 via-transparent to-purple-500/10 opacity-50 blur-3xl pointer-events-none" />

            {/* 🎚️ Center Visualizer */}
            <div className="relative flex items-center justify-center gap-1.5 h-24">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-3 rounded-full bg-linear-to-t from-indigo-500 to-purple-500"
                        initial={{ height: "20%" }}
                        animate={{
                            height: ["20%", "80%", "20%"],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.15, // Staggered wave effect
                        }}
                    />
                ))}
            </div>

            {/* 📀 Spinning Ring (Vinyl-like) */}
            <motion.div
                className="absolute w-32 h-32 rounded-full border-2 border-dashed border-indigo-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute w-48 h-48 rounded-full border border-purple-500/10"
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* 📝 Loading Text */}
            <motion.p
                className="mt-8 font-mono text-sm tracking-[0.3em] text-muted-foreground uppercase"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                Loading Studio...
            </motion.p>
        </div>
    );
}
