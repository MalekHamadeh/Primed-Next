import React, { useMemo } from "react";

type AnimatedGridBackgroundProps = {
	accentColor?: string;
	backgroundColor?: string;
	isDark?: boolean;
	density?: number; // grid cell size in px
};

/**
 * Animated grid background with accent glow and sweep highlight.
 * - Theme-aware: adjusts grid line color, blend modes and opacities for light/dark themes
 * - Self-contained CSS, no external deps
 */
export default function AnimatedGridBackground({
	accentColor = "rgb(34, 197, 94)",
	backgroundColor = "#000000",
	isDark = true,
	density = 36,
}: AnimatedGridBackgroundProps) {
	const styles = useMemo(() => {
		function clamp01(n: number) {
			return Math.max(0, Math.min(1, n));
		}
		function parseRgb(color: string): { r: number; g: number; b: number } {
			const hex = color.trim();
			const short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			const full = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
			const h = hex.replace(short, (_m, r, g, b) => r + r + g + g + b + b);
			const m = full.exec(h);
			if (m) {
				return {
					r: parseInt(m[1], 16),
					g: parseInt(m[2], 16),
					b: parseInt(m[3], 16),
				};
			}
			const m2 = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+).*\)$/i.exec(color);
			if (m2) {
				return { r: Number(m2[1]), g: Number(m2[2]), b: Number(m2[3]) };
			}
			return { r: 16, g: 185, b: 129 };
		}
		function rgba(base: string, a: number) {
			const { r, g, b } = parseRgb(base);
			return `rgba(${r}, ${g}, ${b}, ${clamp01(a)})`;
		}
		function luminance(color: string) {
			const { r, g, b } = parseRgb(color);
			const [rs, gs, bs] = [r, g, b].map((v) => v / 255).map((c) =>
				c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
			);
			return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
		}

		const bgLum = luminance(backgroundColor);
		const dark = bgLum < 0.5 || isDark;

		// Grid line color: subtle and adaptive
		const gridLine = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
		const gridDot = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";

		// Accent glow opacity
		const glowOpacity = dark ? 0.22 : 0.15;
		const vignetteStrength = dark ? 0.55 : 0.38;

		// Sweep highlight uses screen on dark, multiply on light
		const sweepBlend: React.CSSProperties["mixBlendMode"] = dark ? "screen" : "multiply";
		const sweepColor = dark ? rgba(accentColor, 0.18) : rgba(accentColor, 0.10);

		// Build CSS backgrounds for grid
		const size = Math.max(16, Math.min(80, density));
		const gridBackground = `
			linear-gradient(to right, ${gridLine} 1px, transparent 1px),
			linear-gradient(to bottom, ${gridLine} 1px, transparent 1px),
			radial-gradient(${gridDot} 1px, transparent 1px)
		`;

		return {
			grid: {
				backgroundImage: gridBackground,
				backgroundSize: `${size}px ${size}px, ${size}px ${size}px, ${size}px ${size}px`,
				backgroundPosition: `0 0, 0 0, ${size / 2}px ${size / 2}px`,
			} as React.CSSProperties,
			glow: {
				background: rgba(accentColor, glowOpacity),
				mixBlendMode: dark ? "screen" : "multiply",
			} as React.CSSProperties,
			vignette: {
				WebkitMaskImage: `radial-gradient(ellipse at center, black ${vignetteStrength *
					90}%, transparent 100%)`,
				maskImage: `radial-gradient(ellipse at center, black ${vignetteStrength * 90}%, transparent 100%)`,
			} as React.CSSProperties,
			sweep: {
				background: `linear-gradient(115deg, transparent 20%, ${sweepColor} 50%, transparent 80%)`,
				mixBlendMode: sweepBlend,
			} as React.CSSProperties,
		};
	}, [accentColor, backgroundColor, isDark, density]);

	return (
		<div className="absolute inset-0 pointer-events-none overflow-hidden">
			{/* Static grid pattern */}
			<div className="absolute inset-0 grid-bg" style={styles.grid} />

			{/* Accent glow blobs */}
			<div
				className="absolute rounded-full blur-3xl"
				style={{
					...styles.glow,
					width: "55vmax",
					height: "55vmax",
					top: "5%",
					left: "-10%",
					filter: "blur(90px)",
				}}
			/>
			<div
				className="absolute rounded-full blur-3xl"
				style={{
					...styles.glow,
					width: "35vmax",
					height: "35vmax",
					bottom: "-10%",
					right: "-5%",
					filter: "blur(80px)",
				}}
			/>

			{/* Vignette */}
			<div className="absolute inset-0" style={styles.vignette} />

			{/* Animated sweep highlight */}
			<div className="sweep absolute inset-0" style={styles.sweep} />

			<style jsx>{`
				.grid-bg {
					animation: subtle-pan 40s linear infinite;
					will-change: background-position;
				}
				@keyframes subtle-pan {
					0% {
						background-position: 0 0, 0 0, 18px 18px;
					}
					50% {
						background-position: -20px -10px, -10px -20px, 14px 22px;
					}
					100% {
						background-position: 0 0, 0 0, 18px 18px;
					}
				}
				.sweep {
					animation: sweep-move 9s ease-in-out infinite;
					background-size: 200% 200%;
					opacity: 0.5;
				}
				@keyframes sweep-move {
					0% {
						transform: translateX(-30%) translateY(-10%);
					}
					50% {
						transform: translateX(20%) translateY(10%);
					}
					100% {
						transform: translateX(-30%) translateY(-10%);
					}
				}
			`}</style>
		</div>
	);
}


