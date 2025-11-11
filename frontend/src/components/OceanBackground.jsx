import { useEffect, useRef } from "react";

export default function OceanBackground({
  bubbleCount = 120,
  fishCount = 14,
  particleCount = 120,
  maxFPS = 60,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    let W = 0, H = 0;

    function fit() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    fit();
    window.addEventListener("resize", fit);

    const rand = (a, b) => Math.random() * (b - a) + a;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    function caustic(x, y, t) {
      const n =
        Math.sin(x * 0.012 + t * 0.9) * 0.6 +
        Math.sin(y * 0.015 + t * 0.7) * 0.4 +
        Math.sin((x + y) * 0.01 - t * 0.5) * 0.4;
      return (n + 1.4) * 0.35;
    }

    const particles = Array.from({ length: particleCount }, () => ({
      x: rand(0, W), y: rand(0, H), r: rand(0.5, 2.2),
      vy: rand(2, 12) / 60, vx: rand(-4, 4) / 60, a: rand(0.12, 0.35),
    }));

    const bubbles = Array.from({ length: bubbleCount }, () => {
      const z = rand(0.5, 1.1);
      return {
        x: rand(0, W), y: rand(0, H), z,
        r: (1.5 + rand(0, 6)) * z,
        vy: (20 + rand(0, 50)) / 60 * z,
        drift: rand(-0.25, 0.25),
        wobble: rand(0, Math.PI * 2),
        wobbleSpeed: rand(0.01, 0.03),
        alpha: rand(0.25, 0.9),
      };
    });

    const colors = ["#FFB703","#10B981","#60A5FA","#EF4444","#8B5CF6","#06B6D4","#F97316"];
    const fishes = Array.from({ length: fishCount }, () => {
      const right = Math.random() > 0.5;
      const z = rand(0.7, 1.3);
      const speed = (right ? 1 : -1) * rand(40, 110) / 60 * z;
      return {
        x: right ? rand(-250, -30) : rand(W + 30, W + 250),
        y: rand(60, H - 100),
        z, speed, color: colors[(Math.random() * colors.length) | 0],
        fin: rand(0, Math.PI * 2), finSpeed: rand(0.06, 0.12),
        bob: rand(0, Math.PI * 2), bobAmp: rand(3, 14),
        right, blur: clamp((1.6 - z) * 2.2, 0, 6), size: rand(0.8, 1.6),
      };
    });

    const coralLayers = [
      { y: () => H - 90, alpha: 0.22 },
      { y: () => H - 55, alpha: 0.32 },
    ];
    function drawCoral(y, t, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#00232e";
      const offset = Math.sin(t * 0.25) * 35;
      ctx.beginPath();
      ctx.moveTo(-200 + offset, y);
      for (let i = -200; i < W + 200; i += 60) {
        const h = 20 + Math.sin(i * 0.05 + t * 0.6) * 14;
        ctx.quadraticCurveTo(i + 30 + offset, y - h, i + 60 + offset, y);
      }
      ctx.lineTo(W + 300, H + 20);
      ctx.lineTo(-300, H + 20);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawFish(f) {
      ctx.save();
      const y = f.y + Math.sin(f.bob) * f.bobAmp;
      ctx.translate(f.x, y);
      ctx.scale(f.right ? f.size : -f.size, f.size);
      if (f.blur > 0.2) ctx.filter = `blur(${f.blur}px)`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(42 * f.z, -18 * f.z, 86 * f.z, 0);
      ctx.quadraticCurveTo(42 * f.z, 18 * f.z, 0, 0);
      ctx.closePath();
      ctx.fillStyle = f.color; ctx.fill();
      const finWag = Math.sin(f.fin) * 10 * f.z;
      ctx.beginPath();
      ctx.moveTo(14 * f.z, 0);
      ctx.quadraticCurveTo(0, -10 * f.z - finWag, -16 * f.z, 0);
      ctx.quadraticCurveTo(0, 10 * f.z + finWag, 14 * f.z, 0);
      ctx.fillStyle = f.color + "cc"; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(-22 * f.z, -16 * f.z); ctx.lineTo(-22 * f.z, 16 * f.z);
      ctx.closePath(); ctx.fillStyle = f.color + "cc"; ctx.fill();
      ctx.beginPath();
      ctx.arc(62 * f.z, -3 * f.z, 2.6 * f.z, 0, Math.PI * 2);
      ctx.fillStyle = "white"; ctx.fill();
      ctx.beginPath(); ctx.arc(62 * f.z, -3 * f.z, 1.1 * f.z, 0, Math.PI * 2);
      ctx.fillStyle = "black"; ctx.fill();
      ctx.filter = "none"; ctx.restore();
    }

    function drawBubbles() {
      for (const b of bubbles) {
        const gx = b.x + Math.sin(b.wobble) * 1.4 * b.z;
        const gy = b.y;
        const g = ctx.createRadialGradient(gx, gy, 1, gx, gy, b.r);
        g.addColorStop(0, `rgba(255,255,255,${0.35 * b.alpha})`);
        g.addColorStop(0.75, `rgba(255,255,255,${0.12 * b.alpha})`);
        g.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(gx, gy, b.r, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.arc(gx - b.r * 0.45, gy - b.r * 0.45, b.r * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.5 * b.alpha})`; ctx.fill();
      }
    }

    function drawParticles() {
      ctx.save();
      for (const p of particles) {
        ctx.globalAlpha = p.a;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff"; ctx.fill();
      }
      ctx.restore();
    }

    function drawBackground(ts) {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#00161f");
      g.addColorStop(0.55, "#003146");
      g.addColorStop(1, "#00485f");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.12;
      for (let y = 0; y < H; y += 6) {
        const alphaRow = 0.08 + 0.07 * Math.sin((ts * 0.0008 + y) * 0.01);
        ctx.globalAlpha = alphaRow;
        for (let x = 0; x < W; x += 140) {
          const w = 160;
          const c = caustic(x, y, ts * 0.002);
          const grad = ctx.createLinearGradient(x, y, x + w, y + w * 3);
          grad.addColorStop(0, `rgba(255,255,255,${0.3 * c})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = grad; ctx.fillRect(x, y, w, H);
        }
      }
      ctx.restore();
    }

    function loop(ts) {
      const limit = 1000 / maxFPS;
      if (ts - lastRef.current < limit) { rafRef.current = requestAnimationFrame(loop); return; }
      const dt = (ts - lastRef.current || limit) / (1000 / 60);
      lastRef.current = ts;

      drawBackground(ts);
      drawParticles();
      coralLayers.forEach((L, i) => drawCoral(L.y(), ts * 0.001 * (i + 1), L.alpha));

      for (const f of fishes) {
        f.bob += 0.02 * f.z * dt; f.fin += f.finSpeed * dt; f.x += f.speed * dt;
        if (f.right && f.x > W + 260) { f.x = rand(-260, -40); f.y = rand(60, H - 100); }
        else if (!f.right && f.x < -260) { f.x = rand(W + 40, W + 260); f.y = rand(60, H - 100); }
        drawFish(f);
      }

      for (const b of bubbles) {
        b.wobble += b.wobbleSpeed * dt; b.y -= b.vy * dt; b.x += b.drift * dt;
        if (b.y < -10) { b.y = H + 30; b.x = Math.random() * W; }
        if (b.x < -20) b.x = W + 20; if (b.x > W + 20) b.x = -20;
      }
      drawBubbles();

      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", fit); };
  }, [bubbleCount, fishCount, particleCount, maxFPS]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none select-none"
      aria-hidden="true"
    />
  );
}
