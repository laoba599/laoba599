import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import './index.css';

const MEMORIES = [
  { 
    id: "01",
    title: "GENESIS", 
    subtitle: "The Beginning",
    desc: "在这一天，宇宙中某颗特定的星星闪烁了一下。你的诞生，是这个世界收到的一份极其珍贵的礼物。\n\n愿你永远保留初生时的纯粹与好奇，像星星一样始终有着自己的光环与偏航的勇气。"
  },
  {
    id: "02",
    title: "ORBIT",
    subtitle: "When We Met",
    desc: "如同两颗轨迹原本不同的行星在浩瀚夜空偶然交汇。还记得初见时的场景吗？\n\n自那以后，我的引力场里，就多了一个不可替代的发光群体。"
  },
  {
    id: "03",
    title: "RESONANCE",
    subtitle: "Frequencies",
    desc: "那些一起捧腹大笑的瞬间，或者是即使沉默也丝毫不觉得尴尬的默契相处。\n\n频率完全相同的灵魂，总能在最嘈杂的人海中瞬间听懂彼此发出的幽微信号。"
  },
  {
    id: "04",
    title: "ECLIPSE",
    subtitle: "Through Shadows",
    desc: "看着你跨过一个又一个挑战，从跌跌撞撞到游刃有余。难免有黯淡的时刻，但请相信那是为了积蓄更亮的光。\n\n岁月在赋予你温柔的同时，也赐予了你无坚不摧的铠甲。"
  },
  {
    id: "05",
    title: "INFINITY",
    subtitle: "To The Future",
    desc: "新的一岁，意味着开启一场未知的迷人冒险。\n\n前方还有数不清的日出、晚霞和极光等你解锁。无论你走到哪里，我的目光和祝福都会陪着你。生日快乐。"
  }
];

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.5 + 0.1
    }));
    
    let animationFrame: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
         p.x += p.vx;
         p.y += p.vy;
         if (p.x < 0) p.x = width;
         if (p.x > width) p.x = 0;
         if (p.y < 0) p.y = height;
         if (p.y > height) p.y = 0;
         
         ctx.beginPath();
         ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
         ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
         ctx.fill();
      });
      animationFrame = requestAnimationFrame(render);
    };
    render();
    
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-50 z-0" />;
};

const AuthGate: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateCode = (currentCode: string) => {
    if (currentCode === '0520') {
      setSuccess(true);
      
      setTimeout(() => {
        onUnlock(); // Trigger blur and fade-out transition
        
        // Let the unmount fade sequence happen, then trigger a smaller, more elegant confetti burst
        setTimeout(() => {
          const duration = 1500;
          const end = Date.now() + duration;

          const frame = () => {
            confetti({
              particleCount: 2,
              angle: 60,
              spread: 40,
              origin: { x: 0 },
              colors: ['#ffffff', '#a855f7', '#3b82f6', '#fbcfe8']
            });
            confetti({
              particleCount: 2,
              angle: 120,
              spread: 40,
              origin: { x: 1 },
              colors: ['#ffffff', '#a855f7', '#3b82f6', '#fbcfe8']
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          };
          
          confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ffffff', '#a855f7', '#3b82f6', '#fbcfe8']
          });
          
          requestAnimationFrame(frame);
        }, 800);
      }, 600); // Wait 600ms for user to see the success glow before fading out page
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);
      setCode('');
    }
  };

  useEffect(() => {
    if (code.length === 4) {
      validateCode(code);
    }
  }, [code]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fallback if they somehow manage to submit before the effect fires
    if (code.length === 4) validateCode(code);
  };

  return (
    <motion.div 
       className="fixed inset-0 z-50 flex items-center justify-center bg-[#030305]"
       exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
       transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-12">
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5, duration: 1 }}
           className={`font-mono text-[10px] tracking-[0.4em] uppercase transition-colors duration-500 ${success ? 'text-white/80' : 'text-white/40'}`}
         >
           {success ? "Access Granted //" : "Access sequence required"}
         </motion.div>
         
         <motion.div
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative"
         >
           <input 
             type="text"
             inputMode="numeric"
             autoFocus
             disabled={success}
             maxLength={4}
             value={code}
             onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
             className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
           />
           <div className="flex justify-center items-center gap-6 border-b border-white/10 pb-6 w-64 transition-colors relative z-0">
             {Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="w-4 h-4 flex items-center justify-center">
                 {code[i] || success ? (
                   <motion.div 
                     initial={{ scale: 0, opacity: 0 }}
                     animate={success ? { 
                       scale: [1, 1.3, 1], 
                       boxShadow: ["0 0 15px rgba(255,255,255,0.8)", "0 0 30px rgba(255,255,255,1)", "0 0 15px rgba(255,255,255,0.8)"] 
                     } : { scale: 1, opacity: 1 }}
                     transition={success ? { duration: 0.5, ease: "easeInOut" } : undefined}
                     className="w-3 h-3 bg-white/90 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                   />
                 ) : (
                   <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                 )}
               </div>
             ))}
           </div>
         </motion.div>

         <button type="submit" className="opacity-0 w-0 h-0 absolute">Submit</button>
      </form>
    </motion.div>
  );
};

const AudioPlayerWidget = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(e => {
            console.error("Audio playback failed:", e);
            setIsPlaying(false);
            alert("请先在项目根目录或 public 文件夹中上传 bgm.mp3 音乐文件哦！");
          });
        }
      }
    }
  };

  const bars = Array.from({ length: 8 });

  return (
    <div className="flex items-center gap-5 bg-glass rounded-[2rem] p-2 pr-8 mt-12 md:mt-0 shadow-lg">
      <button 
        onClick={toggle}
        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {isPlaying ? (
          <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor">
            <rect x="2" y="2" width="3" height="10" />
            <rect x="9" y="2" width="3" height="10" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor" className="ml-1">
            <path d="M3 2L12 7L3 12V2Z" />
          </svg>
        )}
      </button>
      
      <div className="flex flex-col gap-1.5">
         <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/50">
           {isPlaying ? 'BGM_TRACK / PLAYING' : 'BGM_TRACK / PAUSED'}
         </div>
         <div className="flex items-end gap-[2px] h-3">
           {bars.map((_, i) => (
              <motion.div
                key={i}
                animate={isPlaying ? { height: ['20%', '100%', '30%', '80%', '20%'] } : { height: '10%' }}
                transition={isPlaying ? { repeat: Infinity, duration: 0.8 + Math.random(), ease: "easeInOut", repeatType: "mirror" } : { duration: 0.3 }}
                className="w-[3px] bg-white/80 rounded-t-sm"
                style={{ height: '10%' }}
              />
           ))}
         </div>
      </div>
      <audio ref={audioRef} src={src} loop />
    </div>
  );
};

const SparklesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/>
  </svg>
);

const MinimalistFireworks = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    class Rocket {
      x: number; y: number;
      startX: number; startY: number;
      targetX: number; targetY: number;
      distanceToTarget: number;
      distanceTraveled: number;
      angle: number; speed: number; acceleration: number;
      history: {x: number, y: number}[];
      color: string;
      dead: boolean;

      constructor(startX: number, startY: number, targetX: number, targetY: number) {
        this.x = startX; this.y = startY;
        this.startX = startX; this.startY = startY;
        this.targetX = targetX; this.targetY = targetY;
        this.distanceToTarget = Math.hypot(targetX - startX, targetY - startY);
        this.distanceTraveled = 0;
        this.angle = Math.atan2(targetY - startY, targetX - startX);
        this.speed = 2;
        this.acceleration = 1.015;
        this.history = [];
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.3})`;
        this.dead = false;
      }
      
      update() {
        this.history.push({x: this.x, y: this.y});
        if (this.history.length > 20) this.history.shift(); // Longer, more elegant tail
        
        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        this.distanceTraveled = Math.hypot(this.x + vx - this.startX, this.y + vy - this.startY);
        
        if (this.distanceTraveled >= this.distanceToTarget) {
          this.dead = true;
        } else {
          this.x += vx;
          this.y += vy;
        }
      }
      
      draw(c: CanvasRenderingContext2D) {
        if (!this.history.length) return;
        const start = this.history[0];
        if (Math.abs(start.x - this.x) < 0.1 && Math.abs(start.y - this.y) < 0.1) return;
        
        const grad = c.createLinearGradient(start.x, start.y, this.x, this.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, this.color);
        
        c.beginPath();
        c.moveTo(start.x, start.y);
        c.lineTo(this.x, this.y);
        c.strokeStyle = grad;
        c.lineWidth = 1.5;
        c.stroke();
      }
    }

    class Particle {
      x: number; y: number;
      vx: number; vy: number;
      friction: number; gravity: number;
      alpha: number; decay: number;
      history: {x: number, y: number}[];
      color: string; size: number;
      isStar: boolean;

      constructor(x: number, y: number) {
        this.x = x; this.y = y;
        const speed = Math.random() * 4 + 0.5;
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.friction = 0.95;
        this.gravity = 0.025;
        this.alpha = 1;
        this.decay = Math.random() * 0.006 + 0.005;
        this.history = [];
        const colors = ['#ffffff', '#e2e8f0', '#94a3b8', '#d4d4d8'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 1.5 + 0.5;
        this.isStar = Math.random() > 0.5;
      }

      update() {
        this.history.push({x: this.x, y: this.y});
        if (this.history.length > 12) this.history.shift();
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        if (this.history.length) {
          const start = this.history[0];
          if (Math.abs(start.x - this.x) > 0.1 || Math.abs(start.y - this.y) > 0.1) {
            const grad = c.createLinearGradient(start.x, start.y, this.x, this.y);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(1, `rgba(255, 255, 255, ${this.alpha * 0.5})`);
            c.beginPath();
            c.moveTo(start.x, start.y);
            c.lineTo(this.x, this.y);
            c.strokeStyle = grad;
            c.lineWidth = this.size * 0.5;
            c.stroke();
          }
        }
        
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.globalAlpha = this.alpha;
        c.fill();
        c.globalAlpha = 1;
      }
    }

    let rockets: Rocket[] = [];
    let particles: Particle[] = [];

    const createExplosion = (x: number, y: number) => {
      const count = Math.floor(Math.random() * 30 + 40);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y));
      }
    };

    let animationId: number;
    const loop = () => {
      ctx.clearRect(0, 0, width, height); // Fully wipe the frame to prevent 1/255 opacity bug
      ctx.globalCompositeOperation = 'lighter';

      rockets.forEach((rocket, i) => {
        rocket.update();
        rocket.draw(ctx);
        if (rocket.dead) {
          rockets.splice(i, 1);
          createExplosion(rocket.targetX, rocket.targetY);
        }
      });

      particles.forEach((particle, i) => {
        particle.update();
        if (particle.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          particle.draw(ctx);
        }
      });

      animationId = requestAnimationFrame(loop);
    };
    loop();

    const handleClick = (e: MouseEvent) => {
      // Launch from varying bottom positions towards click
      const startX = width / 2 + (Math.random() - 0.5) * (width * 0.8);
      rockets.push(new Rocket(startX, height, e.clientX, e.clientY));
    };

    const duration = 5000;
    const animationEnd = Date.now() + duration;
    
    const autoInterval = setInterval(() => {
        if (Date.now() > animationEnd) {
            clearInterval(autoInterval);
            return;
        }
        const targetX = width * (0.2 + Math.random() * 0.6);
        const targetY = height * (0.1 + Math.random() * 0.4);
        const startX = targetX + (Math.random() - 0.5) * 200;
        rockets.push(new Rocket(startX, height, targetX, targetY));
    }, 400);

    window.addEventListener('pointerdown', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handleClick);
      clearInterval(autoInterval);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeMemory, setActiveMemory] = useState<any | null>(null);
  const [readMemories, setReadMemories] = useState<string[]>([]);
  const [showFinalSurprise, setShowFinalSurprise] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMemory(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030305] overflow-x-hidden font-sans text-white selection:bg-white/20">
      <div className="aurora-bg" />
      <ParticleCanvas />

      <AnimatePresence>
        {!unlocked && <AuthGate key="auth" onUnlock={() => setUnlocked(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {unlocked && (
          <motion.main 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            className="relative z-10 min-h-screen flex flex-col p-6 md:p-16 lg:p-24 max-w-[100rem] mx-auto"
          >
             <header className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-20 md:mb-32">
                <div className="flex flex-col pt-8 md:pt-0">
                   <motion.h1 
                     initial={{ y: 30, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 1.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                     className="font-serif font-light text-[15vw] md:text-[10vw] leading-[0.85] tracking-tighter text-gradient mix-blend-plus-lighter"
                   >
                     HAPPY<br/>BIRTHDAY
                   </motion.h1>
                   <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 1.5, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}                     
                     className="mt-8 font-mono text-xs md:text-sm tracking-[0.2em] text-white/50 uppercase flex items-center gap-4"
                   >
                     <span className="w-8 h-[1px] bg-white/30" />
                     To my universe · 05.20
                   </motion.div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, delay: 2 }}
                >
                  <AudioPlayerWidget src="/bgm.mp3" />
                </motion.div>
             </header>

             <div className="mt-auto">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 2.2 }}
                  className="font-mono text-[10px] tracking-[0.3em] text-white/40 mb-8 border-b border-white/10 pb-4 uppercase"
                >
                  Memory_Fragments // Accessing...
                </motion.div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
                  {MEMORIES.map((m, i) => {
                    const isRead = readMemories.includes(m.id);
                    return (
                      <motion.div
                        key={m.id}
                        layoutId={`card-${m.id}`}
                        onClick={() => {
                          setActiveMemory(m);
                          setReadMemories(prev => prev.includes(m.id) ? prev : [...prev, m.id]);
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 1, delay: 2.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] } }}
                        whileHover={{ y: -8, scale: 1.03, boxShadow: "0 15px 40px rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.1)", transition: { duration: 0.3 } }}
                        transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
                        className={`group cursor-pointer p-6 md:p-8 rounded-[2rem] border relative overflow-hidden ${isRead ? 'bg-white/5 border-white/20' : 'bg-glass border-transparent'}`}
                      >
                        {isRead && <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full blur-xl pointer-events-none" />}
                        <div className="flex justify-between items-start">
                          <div className={`font-serif text-2xl md:text-3xl font-light transition-colors ${isRead ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>{m.title}</div>
                          {isRead && (
                             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                          )}
                        </div>
                        <div className={`font-mono text-[10px] uppercase tracking-[0.2em] mt-4 transition-colors ${isRead ? 'text-white/60' : 'text-white/40 group-hover:text-white/60'}`}>{m.id} . {m.subtitle}</div>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.5, duration: 1 }}
                  className="mt-16 flex flex-col items-center justify-center w-full"
                >
                  <div className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-white/30 mb-4 uppercase">
                    DECODING PROGRESS: {readMemories.length} / {MEMORIES.length}
                  </div>
                  
                  <div className="w-full max-w-sm h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                     <motion.div 
                       className="absolute top-0 left-0 h-full bg-white/50"
                       initial={{ width: "0%" }}
                       animate={{ width: `${(readMemories.length / MEMORIES.length) * 100}%` }}
                       transition={{ duration: 0.8, ease: "easeOut" }}
                     />
                  </div>

                  <AnimatePresence>
                    {readMemories.length === MEMORIES.length && !showFinalSurprise && (
                      <motion.button
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                        onClick={() => {
                          setShowFinalSurprise(true);
                        }}
                        className="mt-8 px-8 py-4 bg-white text-black font-serif font-medium tracking-widest text-sm uppercase rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] flex items-center gap-3"
                      >
                        <SparklesIcon />
                        Open Final Gift
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
             </div>
          </motion.main>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMemory && (
          <motion.div 
            key="modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMemory(null)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xl cursor-pointer"
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 sm:p-6 md:p-12">
        <AnimatePresence>
          {activeMemory && (
            <motion.div 
              key="memory-modal"
              layoutId={`card-${activeMemory.id}`}
              transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
              className="pointer-events-auto relative w-full max-w-4xl h-[fit-content] max-h-[90vh] bg-[#08080a] border border-white/10 p-8 md:p-16 lg:p-20 rounded-[2.5rem] shadow-[0_0_80px_rgba(255,255,255,0.05)] overflow-hidden"
            >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none" />
            
            <div className="flex flex-col h-full relative z-10 overflow-y-auto no-scrollbar">
               <div className="flex justify-between items-start mb-16 md:mb-24">
                 <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.5 } }} 
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    className="font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-[0.9] tracking-tight">{activeMemory.title}</motion.div>
                 <motion.button 
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => setActiveMemory(null)} 
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
                 >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L13 13M1 13L13 1L1 13Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                 </motion.button>
               </div>
               
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                 exit={{ opacity: 0, transition: { duration: 0.2 } }}
                 className="max-w-2xl lg:ml-auto"
               >
                 <div className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase mb-8 flex items-center gap-4">
                   <span className="w-12 h-[1px] bg-white/20"></span>
                   {activeMemory.id} . {activeMemory.subtitle}
                 </div>
                 <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-white/90 whitespace-pre-line text-pretty">
                   {activeMemory.desc}
                 </p>
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      <AnimatePresence>
        {showFinalSurprise && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-3xl flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden"
          >
            <MinimalistFireworks />
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 1.5, type: "spring" }}
              className="max-w-3xl w-full text-center relative pointer-events-none"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-white/5 blur-[100px] rounded-full" />
              
              <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight mb-8">
                Happy<br/><span className="text-gradient mix-blend-plus-lighter italic">Birthday</span>
              </h2>
              
              <p className="font-sans text-lg md:text-xl font-light text-white/80 leading-relaxed mb-6">
                回忆被一块块凑齐，拼成了现在的我们。
              </p>
              <p className="font-sans text-lg md:text-xl font-light text-white/80 leading-relaxed mb-12">
                未来还有无数个坐标，无数个只有我们听得懂的暗号，等着慢慢去解锁。
                <br/>愿你在新的一岁，永远被爱，永远像小兔子一样无忧无虑。
              </p>

              <div className="font-mono text-xs tracking-widest text-white/40 uppercase">
                [ Click anywhere on screen ]
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
