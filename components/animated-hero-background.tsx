import React, { useMemo } from "react";

type AnimatedHeroBackgroundProps = {
  accentColor?: string;
  backgroundColor?: string;
  isDark?: boolean;
};

/**
 * A subtle, shadcn-style animated aurora background suitable for hero sections.
 * - Self-contained CSS (no Tailwind config changes required)
 * - Uses a rotating gradient field + a floating, blurred accent blob
 */
export default function AnimatedHeroBackground({
  accentColor = "rgb(34, 197, 94)", // default emerald-like accent
  backgroundColor = "#000000",
  isDark = true,
}: AnimatedHeroBackgroundProps) {
  // Derive palette variants from the accent to support all themes
  const palette = useMemo(() => {
    function clamp(n: number, min = 0, max = 1) {
      return Math.max(min, Math.min(max, n));
    }
    function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
      const normalized = hex.trim();
      const short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const full = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
      const h = normalized.replace(
        short,
        (_m, r, g, b) => r + r + g + g + b + b
      );
      const result = full.exec(h);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    }
    function parseColor(color: string): { r: number; g: number; b: number } {
      if (color.startsWith("#")) {
        const rgb = hexToRgb(color);
        if (rgb) return rgb;
      }
      // Basic rgb() parser
      const rgbMatch =
        /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+).*\)$/i.exec(color);
      if (rgbMatch) {
        return {
          r: Number(rgbMatch[1]),
          g: Number(rgbMatch[2]),
          b: Number(rgbMatch[3]),
        };
      }
      // Fallback to emerald
      return { r: 16, g: 185, b: 129 };
    }
    function rgbToHsl(
      r: number,
      g: number,
      b: number
    ): {
      h: number;
      s: number;
      l: number;
    } {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h = 0,
        s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
      return { h: h * 360, s, l };
    }
    function hslToRgb(
      h: number,
      s: number,
      l: number
    ): {
      r: number;
      g: number;
      b: number;
    } {
      h /= 360;
      function hue2rgb(p: number, q: number, t: number) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }
      let r: number, g: number, b: number;
      if (s === 0) {
        r = g = b = l;
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
      };
    }
    function rotateHue(color: string, degrees: number) {
      const { r, g, b } = parseColor(color);
      const { h, s, l } = rgbToHsl(r, g, b);
      const nh = (h + degrees + 360) % 360;
      const { r: nr, g: ng, b: nb } = hslToRgb(nh, s, l);
      return `rgb(${nr}, ${ng}, ${nb})`;
    }
    function toRgba(base: string, alpha: number) {
      const { r, g, b } = parseColor(base);
      return `rgba(${r}, ${g}, ${b}, ${clamp(alpha)})`;
    }
    function relativeLuminance(color: string) {
      const { r, g, b } = parseColor(color);
      const srgb = [r, g, b]
        .map((v) => v / 255)
        .map((c) => {
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
      return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    }

    const bgLum = relativeLuminance(backgroundColor);
    const isBgDark = bgLum < 0.5 || isDark;

    // Choose alpha levels that work for both light and dark backgrounds
    const fieldAlpha = isBgDark ? 0.16 : 0.1;
    const fieldAlphaSoft = isBgDark ? 0.12 : 0.08;
    const blobOpacity = isBgDark ? 0.3 : 0.18;
    const blend: React.CSSProperties["mixBlendMode"] = isBgDark
      ? "screen"
      : "multiply";

    const c1 = toRgba(accentColor, fieldAlpha);
    const c2 = toRgba(rotateHue(accentColor, 30), fieldAlpha);
    const c3 = toRgba(rotateHue(accentColor, -35), fieldAlphaSoft);
    const c4 = toRgba(rotateHue(accentColor, 180), fieldAlphaSoft * 0.8);

    return {
      fieldColors: { c1, c2, c3, c4 },
      blob: { blend, blobOpacity },
      maskStrength: isBgDark ? 0.5 : 0.35,
    };
  }, [accentColor, backgroundColor, isDark]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Rotating multi-stop aurora gradient field */}
      <div
        className="aurora-gradient absolute -inset-[15%]"
        style={{
          // Use computed colors for the gradient field
          // The CSS class applies the animation; we override the background with theme-derived values
          background: `
						radial-gradient(60% 60% at 20% 20%, ${palette.fieldColors.c1}, transparent 60%),
						radial-gradient(60% 60% at 80% 10%, ${palette.fieldColors.c2}, transparent 60%),
						radial-gradient(60% 60% at 10% 90%, ${palette.fieldColors.c3}, transparent 60%),
						radial-gradient(80% 80% at 90% 85%, ${palette.fieldColors.c4}, transparent 65%)
					`,
        }}
      />

      {/* Soft vignette to focus center */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: `radial-gradient(ellipse at center, black ${
            palette.maskStrength * 90
          }%, transparent 100%)`,
          maskImage: `radial-gradient(ellipse at center, black ${
            palette.maskStrength * 90
          }%, transparent 100%)`,
        }}
      />

      {/* Accent blob influenced by theme accent color */}
      <div
        className="accent-blob absolute rounded-full blur-3xl opacity-30"
        style={{
          background: accentColor,
          width: "60vmax",
          height: "60vmax",
          filter: "blur(80px)",
          top: "10%",
          left: "-10%",
          mixBlendMode: palette.blob.blend,
          opacity: palette.blob.blobOpacity,
        }}
      />

      <style jsx>{`
        /* Large rotating aurora gradient (slow spin) */
        .aurora-gradient {
          background: radial-gradient(
              60% 60% at 20% 20%,
              rgba(59, 130, 246, 0.18),
              transparent 60%
            ),
            radial-gradient(
              60% 60% at 80% 10%,
              rgba(99, 102, 241, 0.18),
              transparent 60%
            ),
            radial-gradient(
              60% 60% at 10% 90%,
              rgba(16, 185, 129, 0.16),
              transparent 60%
            ),
            radial-gradient(
              80% 80% at 90% 85%,
              rgba(236, 72, 153, 0.12),
              transparent 65%
            );
          animation: aurora-rotate 60s linear infinite;
          transform-origin: 50% 50%;
          will-change: transform;
        }

        @keyframes aurora-rotate {
          from {
            transform: rotate(0deg) scale(1.05);
          }
          to {
            transform: rotate(360deg) scale(1.05);
          }
        }

        /* Floating accent blob movement */
        .accent-blob {
          animation: blob-float 22s ease-in-out infinite;
          will-change: transform, opacity;
        }

        @keyframes blob-float {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.25;
          }
          25% {
            transform: translate3d(10%, -5%, 0) scale(1.05);
            opacity: 0.35;
          }
          50% {
            transform: translate3d(0, -10%, 0) scale(1.1);
            opacity: 0.3;
          }
          75% {
            transform: translate3d(-8%, -3%, 0) scale(1.04);
            opacity: 0.35;
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.25;
          }
        }
      `}</style>
    </div>
  );
}
