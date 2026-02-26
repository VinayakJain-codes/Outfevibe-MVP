"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Vibrant Holi colors
const colors = ["#ec4899", "#a855f7", "#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#06b6d4"];

interface Particle {
    id: number;
    x: number;
    color: string;
    size: number;
    duration: number;
    delay: number;
    drift: number;
}

export default function FallingColors() {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        // Generate random particles after mount to avoid hydration mismatch
        const newParticles = Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // Start X position (%)
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 15 + 8, // 8px to 23px
            duration: Math.random() * 6 + 6, // 6s to 12s
            delay: Math.random() * 5, // 0s to 5s initial delay
            drift: (Math.random() - 0.5) * 150, // Horizontal drift (-75px to +75px)
        }));

        setParticles(newParticles);
    }, []);

    if (particles.length === 0) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full opacity-60 blur-[1px]"
                    style={{
                        left: `${p.x}%`,
                        top: -30,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${p.size * 1.5}px ${p.color}`,
                    }}
                    animate={{
                        y: ["0vh", "110vh"],
                        x: ["0px", `${p.drift}px`],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}
