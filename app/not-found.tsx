"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Home, Music } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background pointer-events-none" />

            {/* Decorative Circles */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute w-[500px] h-[500px] rounded-full border border-indigo-500/20 pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.05, 0.1, 0.05],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="absolute w-[800px] h-[800px] rounded-full border border-purple-500/10 pointer-events-none"
            />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-8 p-6">

                {/* Animated Vinyl / 404 Cointainer */}
                <div className="relative flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        {/* Spinning Text Ring */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-12 border border-dashed border-indigo-500/30 rounded-full w-64 h-64 opacity-50"
                        />

                        {/* 404 Glitch Text */}
                        <h1
                            className="text-[150px] font-black leading-none tracking-tighter select-none glitch"
                            data-text="404"
                        >
                            404
                        </h1>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="space-y-4 max-w-md"
                >
                    <div className="flex items-center justify-center gap-2 text-indigo-400">
                        <Music className="w-5 h-5 animate-bounce" />
                        <span className="text-sm font-mono uppercase tracking-widest">Error: Track Missing</span>
                    </div>

                    <p className="text-xl md:text-2xl font-medium text-muted-foreground">
                        The track you're looking for has been skipped or doesn't exist anymore.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Link href="/">
                        <Button size="lg" className="neon-btn group text-lg px-8 py-6 h-auto">
                            <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                            Return to Studio
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Footer Visualizer Effect (Fake) */}
            <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-between px-4 opacity-20 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-full bg-indigo-500 mx-1 rounded-t-sm"
                        animate={{
                            height: ["10%", "50%", "10%"],
                        }}
                        transition={{
                            duration: Math.random() * 1.5 + 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 2,
                        }}
                        style={{
                            height: `${Math.random() * 50 + 10}%`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
