"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * ElegantParticles — A highly refined, interactive "Neural Network" constellation effect.
 * Optimized for Dark Mode with brand-aware colors and organic interactive drift.
 */
export default function ElegantParticles({ count }: { count?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        const check = () => {
            const theme = document.documentElement.getAttribute("data-theme");
            setIsDark(theme === "dark");
            setIsMobile(window.innerWidth < 768);
        };
        check();

        const observer = new MutationObserver(check);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        window.addEventListener("resize", check);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", check);
        };
    }, []);

    useEffect(() => {
        if (!isDark || !mounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        // --- Particle Logic ---

        class Particle {
            x: number;
            y: number;
            size: number;
            baseX: number;
            baseY: number;
            density: number;
            color: string;
            vx: number;
            vy: number;

            constructor(x: number, y: number, index: number) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 1.2 + 0.3;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = Math.random() * 1.5 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.25;
                this.vy = (Math.random() - 0.5) * 0.25;
                this.color = index % 3 === 0 ? "rgba(110, 80, 255, 0.25)" : "rgba(255, 255, 255, 0.2)";
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            update(canvasWidth: number, canvasHeight: number, mouse: { x: number, y: number, radius: number }) {
                this.baseX += this.vx;
                this.baseY += this.vy;

                if (this.baseX < 0) { this.baseX = canvasWidth; this.x += canvasWidth; }
                if (this.baseX > canvasWidth) { this.baseX = 0; this.x -= canvasWidth; }
                if (this.baseY < 0) { this.baseY = canvasHeight; this.y += canvasHeight; }
                if (this.baseY > canvasHeight) { this.baseY = 0; this.y -= canvasHeight; }

                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let directionX = (dx / distance) * force * this.density;
                    let directionY = (dy / distance) * force * this.density;
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    this.x -= (this.x - this.baseX) / 35;
                    this.y -= (this.y - this.baseY) / 35;
                }
            }
        }

        let animationFrameId: number;
        let particles: Particle[] = [];
        const mouse = { x: -100, y: -100, radius: 100 };

        const init = () => {
            particles = [];
            // Optimization: significantly fewer particles on mobile
            const density = isMobile ? 60000 : 25000;
            const numberOfParticles = Math.min((canvas.width * canvas.height) / density, isMobile ? 30 : 100); 
            for (let i = 0; i < numberOfParticles; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particles.push(new Particle(x, y, i));
            }
        };

        const connect = () => {
            if (isMobile) return; // Skip O(N^2) connect logic on mobile
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    if (Math.abs(dx) > 100 || Math.abs(dy) > 100) continue;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        const opacity = (1 - distance / 100) * 0.05;
                        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].draw();
                particles[i].update(canvas.width, canvas.height, mouse);
            }
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener("resize", resize);
        if (!isMobile) window.addEventListener("mousemove", handleMouseMove);

        resize();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isDark, mounted, isMobile]);

    if (!mounted || !isDark) return null;

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 0,
                // Removed blur filter for better performance
            }}
        />
    );
}
