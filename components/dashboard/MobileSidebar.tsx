"use client";

import { useState, useEffect } from "react";
import { MusicSidebar } from "./DashboardSidebar";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar on resize + route change
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        // 🔥 Close on route change
        setIsOpen(false);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [pathname]);

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full text-white border border-white/10"
            >
                <Menu size={24} />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Container */}
            <div className="absolute top-0 left-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-white/10 shadow-2xl animate-in slide-in-from-left duration-300">
                <div className="absolute top-4 right-4 z-50">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <MusicSidebar className="w-full h-full pt-12" />
            </div>
        </div>
    );
}
