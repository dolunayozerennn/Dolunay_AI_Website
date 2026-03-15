import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useCallback, useState } from 'react';

// ─── Particle Canvas ──────────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      const count = Math.min(50, Math.floor(window.innerWidth / 25));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.05,
        color: Math.random() > 0.5 ? '0, 212, 255' : '124, 58, 237',
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.03 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />;
}

// ─── Reveal animation ─────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  const photoY = useTransform(scrollYProgress, [0, 0.5], [0, 40]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -30]);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const handleMouse = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouse}
      className="relative min-h-screen overflow-hidden bg-[#050508] flex flex-col"
      id="hero"
    >
      {/* ── Background ── */}
      <ParticleField />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: mouse.x * 20, y: mouse.y * 15 }}
          transition={{ type: 'spring', stiffness: 40, damping: 30 }}
          className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ background: 'rgba(0, 212, 255, 0.06)' }}
        />
        <motion.div
          animate={{ x: mouse.x * -15, y: mouse.y * -10 }}
          transition={{ type: 'spring', stiffness: 40, damping: 30 }}
          className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full blur-[130px]"
          style={{ background: 'rgba(124, 58, 237, 0.07)' }}
        />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          opacity: 0.4,
        }}
      />

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-5 sm:px-8 lg:px-16 pt-20 pb-16">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* LEFT: Text Content */}
          <motion.div style={{ y: contentY }} className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6 border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4ff] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d4ff]" />
                </span>
                <span className="text-[#94a3b8] text-xs font-medium tracking-[0.18em] uppercase">
                  AI Eğitmen & Builder
                </span>
              </div>
            </Reveal>

            {/* Headline */}
            <Reveal delay={0.25}>
              <h1 className="font-display text-[clamp(2.5rem,6vw,6rem)] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-1">
                Yapay zeka?
              </h1>
            </Reveal>

            <Reveal delay={0.4}>
              <h1 className="font-display text-[clamp(2.5rem,6vw,6rem)] font-bold tracking-[-0.03em] leading-[1.05] mb-5">
                <span
                  style={{
                    background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Dolunay.
                </span>
              </h1>
            </Reveal>

            {/* Subheading */}
            <Reveal delay={0.55}>
              <p className="text-[#94a3b8] text-base sm:text-lg md:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8">
                Yapay zekadan{' '}
                <span className="text-white font-medium italic">gerçekten</span>{' '}
                faydalanmayı öğren.
              </p>
            </Reveal>
          </motion.div>

          {/* RIGHT: Photo */}
          <motion.div
            style={{ y: photoY }}
            className="relative flex justify-center order-1 lg:order-2"
          >
            {/* Photo glow */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className="w-[110%] h-[110%] rounded-full blur-[120px]"
                style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, rgba(124,58,237,0.06) 50%, transparent 70%)' }}
              />
            </div>

            {/* Orbit ring */}
            <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
              <div
                className="rounded-full"
                style={{
                  width: '105%',
                  height: '105%',
                  border: '1px solid rgba(0, 212, 255, 0.08)',
                  animation: 'spin 35s linear infinite',
                  position: 'relative',
                }}
              >
                <div
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: '#00d4ff',
                    boxShadow: '0 0 12px rgba(0, 212, 255, 0.5)',
                    top: -4,
                    left: '50%',
                    marginLeft: -4,
                  }}
                />
              </div>
            </div>

            {/* Second orbit */}
            <div className="absolute inset-0 hidden lg:flex items-center justify-center pointer-events-none">
              <div
                className="rounded-full"
                style={{
                  width: '120%',
                  height: '120%',
                  border: '1px solid rgba(124, 58, 237, 0.06)',
                  animation: 'spin 50s linear infinite reverse',
                  position: 'relative',
                }}
              >
                <div
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    background: '#7c3aed',
                    boxShadow: '0 0 10px rgba(124, 58, 237, 0.4)',
                    bottom: -3,
                    left: '50%',
                    marginLeft: -3,
                  }}
                />
              </div>
            </div>

            {/* The photo */}
            <Reveal delay={0.3}>
              <div className="relative z-10 w-[280px] sm:w-[320px] md:w-[380px] lg:w-[420px] xl:w-[460px]">
                <img
                  src={`${import.meta.env.BASE_URL}dolunay-hero.png`}
                  alt="Dolunay Özeren"
                  className="w-full h-auto object-cover rounded-2xl"
                  style={{
                    maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
                  }}
                />
              </div>
            </Reveal>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 flex flex-col items-center gap-2 pb-8"
      >
        <span className="text-[#475569] text-[10px] tracking-[0.25em] uppercase font-medium">Kaydır</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-7 rounded-full border border-white/10 flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-white/20 rounded-full" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient bleed */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none z-20" />
    </section>
  );
}
