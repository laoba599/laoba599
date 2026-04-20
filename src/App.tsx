import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from "motion/react";
import confetti from 'canvas-confetti';
import { FileText, FolderHeart, Music, PlaySquare, Save, Disc, Camera, Sparkles, Heart } from 'lucide-react';
import { cn } from './lib/utils';
import { fileSystem, chatMessages, popupsData, FileSystemItem, memoriesData } from './data';
import './index.css';

const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: {x:number, y:number, size:number, speed:number, color:string}[] = [];
    const colors = ['#ffb6c1', '#f0f8ff', '#e0ffff'];
    for(let i=0; i<150; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.4 + 0.1,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    let animationFrameId: number;
    const render = () => {
        ctx.clearRect(0, 0, width, height);
        stars.forEach(star => {
            star.x -= star.speed;
            star.y += star.speed;
            if (star.x < 0 || star.y > height) {
                if (Math.random() > 0.5) {
                    star.x = width;
                    star.y = Math.random() * height;
                } else {
                    star.x = Math.random() * width;
                    star.y = 0;
                }
            }
            ctx.beginPath();
            ctx.fillStyle = star.color;
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.shadowBlur = 4;
            ctx.shadowColor = star.color;
            ctx.fill();
        });
        animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
    }
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60 block" />;
}

const RetroPointer = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] flex-none">
    <path d="M1,1 L1,14 L5,10 L9,18 L11,17 L7,9 L14,9 Z" fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinejoin="miter"/>
    <g transform="translate(7, 8)">
      <rect x="2" y="0" width="2" height="3" fill="#000" />
      <rect x="12" y="0" width="2" height="3" fill="#000" />
      <rect x="2" y="3" width="12" height="9" fill="#000" />
      <rect x="3" y="1" width="1" height="2" fill="#fff" />
      <rect x="12" y="1" width="1" height="2" fill="#fff" />
      <rect x="3" y="4" width="10" height="7" fill="#fff" />
      <rect x="4" y="6" width="2" height="2" fill="#000" />
      <rect x="10" y="6" width="2" height="2" fill="#000" />
      <rect x="7" y="8" width="2" height="1" fill="#000" />
      <rect x="3" y="8" width="1" height="2" fill="#ff69b4" />
      <rect x="12" y="8" width="1" height="2" fill="#ff69b4" />
    </g>
  </svg>
);

const ParticleBurst: React.FC<{ x: number, y: number }> = ({ x, y }) => {
    const items = Array.from({length: 8});
    return (
        <div className="fixed top-0 left-0 pointer-events-none z-[9999]" style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}>
            {items.map((_, i) => {
                const angle = (i * Math.PI * 2) / items.length;
                const dist = 30 + Math.random() * 30;
                const tx = Math.cos(angle) * dist;
                const ty = Math.sin(angle) * dist;
                const scale = 0.5 + Math.random() * 0.8;
                const isStar = Math.random() > 0.5;
                return (
                    <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                        animate={{ x: tx, y: ty, scale: scale, opacity: 0, rotate: 180 * (Math.random() > 0.5 ? 1 : -1) }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute -left-2 -top-2"
                    >
                        {isStar ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#00ffff" stroke="#000" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff69b4" stroke="#000" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        )}
                    </motion.div>
                )
            })}
        </div>
    );
}

const GlobalInteractions = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [bursts, setBursts] = useState<{id: string, x: number, y: number}[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 150);

      const newId = Date.now().toString() + Math.random();
      setBursts(prev => [...prev, { id: newId, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
         setBursts(prev => prev.filter(b => b.id !== newId));
      }, 1000);
    };
    window.addEventListener('pointermove', handleMouseMove, { passive: true });
    window.addEventListener('pointerdown', handleMouseDown, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('pointerdown', handleMouseDown);
    }
  }, []);

  return (
    <>
      <div 
        ref={cursorRef}
        className="custom-cursor-container fixed top-0 left-0 pointer-events-none z-[10000] will-change-transform origin-top-left"
        style={{ transform: `translate3d(-100px, -100px, 0)` }}
      >
         <motion.div
            animate={{ 
              scale: isJumping ? 0.8 : 1
            }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="origin-top-left"
         >
            <RetroPointer />
         </motion.div>
      </div>
      {bursts.map(b => (
        <ParticleBurst key={b.id} x={b.x} y={b.y} />
      ))}
    </>
  );
}

const FloatingNotes = () => {
    const [notes, setNotes] = useState<{id:number, char:string, left:number, size:number, dur:number, delay:number}[]>([]);
    useEffect(() => {
        setNotes(Array.from({length: 15}).map((_, i) => ({
            id: i,
            char: ['♪', '♫', '♩'][Math.floor(Math.random()*3)],
            left: Math.random() * 100,
            size: Math.random() * 20 + 20,
            dur: Math.random() * 5 + 5,
            delay: Math.random() * 5
        })));
    }, []);
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {notes.map(note => (
                <div 
                  key={note.id} 
                  className="absolute text-[#ff69b4] opacity-30 font-serif animate-float-note drop-shadow"
                  style={{
                      left: `${note.left}%`,
                      top: `100%`,
                      fontSize: `${note.size}px`,
                      animationDuration: `${note.dur}s`,
                      animationDelay: `${note.delay}s`
                  }}
                >
                    {note.char}
                </div>
            ))}
        </div>
    )
}

const TypewriterText = ({ text, delay = 0, onComplete }: {text: string, delay?: number, onComplete?: () => void}) => {
    const [length, setLength] = useState(0);
    const [isDone, setIsDone] = useState(false);
    useEffect(() => {
        let i = 0;
        const t = setTimeout(() => {
            const interval = setInterval(() => {
                i++;
                setLength(i);
                if (i >= text.length) {
                    clearInterval(interval);
                    setIsDone(true);
                    if(onComplete) onComplete();
                }
            }, 80);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(t);
    }, [text, delay, onComplete]);

    const typed = text.substring(0, length);
    const untyped = text.substring(length);

    return (
        <span className="w-full inline-block text-center whitespace-pre-wrap leading-relaxed">
            <span>{typed}</span>
            {!isDone && <span className="relative pointer-events-none select-none"><span className="absolute left-[1px] animate-pulse">_</span></span>}
            <span className="opacity-0">{untyped}</span>
        </span>
    );
}

const Envelope = ({ onOpen }: { onOpen: () => void }) => {
    const [isFlipping, setIsFlipping] = useState(false);
    const handleClick = () => {
        setIsFlipping(true);
        setTimeout(onOpen, 1000);
    }
    return (
        <div className="w-[260px] sm:w-[320px] h-[156px] sm:h-[192px] relative cursor-none hover:scale-105 transition-transform drop-shadow-[8px_8px_0_rgba(0,0,0,0.8)]" onClick={handleClick} style={{ perspective: '1000px' }}>
           <div className="absolute inset-0 bg-[#bf9b6b] border-4 border-black" />
           <div 
               className={cn("absolute top-0 left-0 w-full h-[55%] bg-[#d7ae7a] border-4 border-black origin-top transition-all duration-700 ease-in-out")} 
               style={{ 
                   clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                   transform: isFlipping ? 'rotateX(180deg)' : 'rotateX(0deg)',
                   zIndex: isFlipping ? 0 : 40
               }}>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-600 rounded-full border-2 border-black flex items-center justify-center font-pixel text-white text-[10px] shadow-sm">♡</div>
           </div>
           <div className={cn("absolute bottom-2 left-4 right-4 h-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] bg-white border-2 border-black z-10 transition-all duration-700 ease-out flex flex-col items-center justify-center py-2 px-4 text-center", isFlipping ? "-translate-y-32 opacity-0" : "delay-300 opacity-100 translate-y-0")}>
               <div className="font-pixel text-2xl font-bold mt-2 tracking-widest">FOR YOU</div>
               <div className="font-sans text-xs mt-2 border-t border-black/20 pt-2">BUNNIES CLUB</div>
           </div>
           <div className="absolute bottom-0 left-0 w-[55%] h-full bg-[#dfb988] border-4 border-black z-30" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
           <div className="absolute bottom-0 right-0 w-[55%] h-full bg-[#ebc696] border-4 border-black z-30" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }} />
           <div className="absolute bottom-0 left-0 w-full h-[60%] bg-[#f0d0a0] border-4 border-black z-30" style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }} />
           
           {!isFlipping && <div className="absolute -bottom-10 w-full text-center font-pixel text-[#00ffff] font-bold animate-pulse z-50 text-xl filter drop-shadow-[2px_2px_0_#000]">[ OPEN ]</div>}
        </div>
    )
}

const Login: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === '0520') {
      onNext();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setPwd('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-4 z-10"
    >
      <div className="absolute top-[10%] left-[10%] text-pink-500 y2k-sticker shake-hover" style={{ rotate: '-15deg' }}>☆。*。☆。</div>
      <div className="absolute bottom-[20%] right-[15%] text-blue-500 y2k-sticker shake-hover" style={{ rotate: '10deg' }}>(*ᴗ͈ˬᴗ͈)ꕤ*.ﾟ</div>

      <div className="win98-window w-full max-w-sm">
        <div className="win98-titlebar cursor-default">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐰</span>
            <span>BUNNIES_OS.EXE</span>
          </div>
          <div className="flex gap-[2px]">
            <button className="win98-button !p-0 w-5 h-5 flex items-center justify-center font-bold text-xs">_</button>
            <button className="win98-button !p-0 w-5 h-5 flex items-center justify-center font-bold text-xs">☐</button>
            <button className="win98-button !p-0 w-5 h-5 flex items-center justify-center font-bold text-xs">X</button>
          </div>
        </div>
        <div className="p-8 flex flex-col items-center gap-6 bg-[#c0c0c0]">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-white border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center text-4xl mb-2">
              🐰
            </div>
            <div className="font-pixel text-center text-black bg-white px-2 border border-black shadow-[inset_1px_1px_#808080]">访客_GUEST</div>
          </div>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-pixel text-sm text-black">访问密钥 [PASSKEY]:</label>
              <input 
                type="password" 
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                autoFocus
                className={cn("win98-input w-full", error && "bg-red-200")}
                placeholder="[ * * * * ]"
                maxLength={4}
              />
              {error && <span className="text-red-600 font-pixel text-xs mt-1 bg-black p-1">[错误] 提示：生日日期_ERR</span>}
            </div>
            <div className="flex justify-end gap-3 mt-4 flex-wrap">
              <button type="submit" className="win98-button">登录 / OK</button>
              <button type="button" className="win98-button" onClick={() => setPwd('')}>清除 / CLR</button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

const LoginLoading: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 20 + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          onNext();
        }, 800);
      }
      setProgress(current);
    }, 300);
    return () => clearInterval(interval);
  }, [onNext]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="absolute inset-0 flex items-center justify-center p-4 z-20"
    >
      <div className="win98-window w-full max-w-sm flex flex-col items-center p-8 bg-[#c0c0c0] shadow-[8px_8px_0_0_#000]">
         <div className="w-16 h-16 bg-white border-2 border-white border-t-[#808080] border-l-[#808080] mb-6 flex items-center justify-center text-4xl shadow-inner">
           ⏳
         </div>
         <p className="font-sans text-black mb-6 text-center text-sm font-bold">
            正在登录...<br/>
            <span className="font-normal text-xs mt-2 inline-block">[ 加载个人回忆模块... ]</span>
         </p>
         
         <div className="w-full h-6 bg-white border-2 border-white border-t-[#808080] border-l-[#808080] p-[2px]">
           <div 
             className="h-full bg-[#000080]" 
             style={{ width: `${progress}%`, transition: 'width 0.2s ease-out' }}
           />
         </div>
      </div>
    </motion.div>
  );
}

const BiosBoot: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const bootSequence = [
      "BUNNIES OS BIOS Version 0.5.20",
      "Copyright (C) 1998 TOKKI Corp. All Rights Reserved.",
      "",
      "CPU: TOKKI-9000 at 2.4 GHz",
      "Memory Test : 32768M OK",
      "",
      "Detecting Primary Master   ... [ TOKKI_DRIVE_01 ]",
      "Detecting Primary Slave    ... [ NONE ]",
      "Detecting Secondary Master ... [ CD-ROM_MEMORIES ]",
      "",
      "Loading MS-DOS (Magic System - Digital OS) ...",
      "Mounting Virtual Subsystem [C:\\] ... OK",
      "Checking file system ... OK",
      "",
      "Bypassing external security protocols...",
      "> ACCESS GRANTED",
      "",
      "Starting BUNNIES OS GUI Environment..."
    ];

    let delay = 0;
    let isMounted = true;

    bootSequence.forEach((line, i) => {
      delay += Math.random() * 150 + 100;
      if (line === "") delay += 50;
      
      setTimeout(() => {
        if (!isMounted) return;
        setLines(prev => [...prev, line]);
        
        if (i === bootSequence.length - 1) {
          setIsDone(true);
          setTimeout(() => {
            if (isMounted) onNext();
          }, 1500); 
        }
      }, delay);
    });

    return () => { isMounted = false; };
  }, [onNext]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="absolute inset-0 bg-black text-[#00ff00] font-pixel p-4 sm:p-8 z-30 flex flex-col justify-start overflow-hidden"
    >
      <div className="flex flex-col gap-1 text-sm md:text-base leading-none">
        {lines.map((line, idx) => (
          <span key={idx} className="whitespace-pre-wrap">{line === "" ? "\n" : line}</span>
        ))}
        {!isDone && <span className="w-2 h-4 bg-[#00ff00] animate-pulse mt-1 inline-block"></span>}
      </div>
    </motion.div>
  );
}

const AudioPlayerPopup: React.FC<{src: string, name: string, onClose: () => void}> = ({src, name, onClose}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setError(true));
    }
  };

  return (
    <div className="p-4 bg-[#c0c0c0] border-x-2 border-b-2 border-white flex flex-col gap-4 font-sans text-sm text-black">
      <div className="bg-black border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-2 h-14 flex flex-col justify-center overflow-hidden relative">
        {error ? (
          <span className="text-red-500 font-pixel text-xs">⚠️ 读取失败_ERR<br/>(未能加载 {src.replace('./', '')})</span>
        ) : (
          <span className="text-[#00ff00] font-pixel text-sm whitespace-nowrap">
            {isPlaying ? `▶ 正在播放：${name}` : `⏹ 准备就绪：${name}`}
          </span>
        )}
      </div>
      
      <audio 
        ref={audioRef} 
        src={src} 
        onEnded={() => setIsPlaying(false)} 
        onError={() => setError(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex justify-center gap-3">
        <button className="win98-button font-black px-4" onClick={togglePlay}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="win98-button font-black px-4" onClick={() => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
          }
        }}>
          ⏹
        </button>
      </div>
      
      <div className="flex justify-center mt-2 pt-2 border-t-2 border-[#808080]">
        <button className="win98-button font-pixel px-6 py-1" onClick={onClose}>关闭 / CLOSE</button>
      </div>
    </div>
  );
}

const DesktopExplorer: React.FC<{ onNext: () => void, playlist: {name: string, src: string}[], onPlayTrack: (idx: number) => void }> = ({ onNext, playlist, onPlayTrack }) => {
  const [path, setPath] = useState('C:\\');
  const [selected, setSelected] = useState<string | null>(null);
  const [lastTap, setLastTap] = useState<{name: string, time: number} | null>(null);
  const [popupContent, setPopupContent] = useState<{name: string, content?: string, type: string, src?: string} | null>(null);

  const items = fileSystem[path] || [];

  const handleItemClick = (item: FileSystemItem) => {
    const now = Date.now();
    if (selected === item.name && lastTap && lastTap.name === item.name && (now - lastTap.time < 500)) {
      if (item.type === 'folder') {
        setPath(item.target!);
        setSelected(null);
      } else if (item.type === 'file') {
        setPopupContent({ name: item.name, content: item.content!, type: 'file' });
      } else if (item.type === 'audio') {
        const idx = playlist.findIndex(p => p.src === item.src);
        if (idx !== -1) onPlayTrack(idx);
      } else if (item.type === 'exe') {
        onNext();
      }
      setLastTap(null);
    } else {
      setSelected(item.name);
      setLastTap({ name: item.name, time: now });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="absolute inset-0 flex items-center justify-center p-4 z-10"
    >
      <div className="win98-window w-full max-w-lg h-[80vh] max-h-[500px] flex flex-col relative bg-[#c0c0c0] shadow-[8px_8px_0_0_#000]">
        <div className="win98-titlebar !bg-[#000080] !text-white flex justify-between items-center px-2 py-1">
          <span className="font-pixel ml-1 font-bold">资源管理器 _ [ {path} ]</span>
          <button className="win98-button !p-0 w-6 h-6 flex items-center justify-center font-bold text-black border-2 bg-[#c0c0c0]">X</button>
        </div>
        
        <div className="flex gap-4 px-2 py-1 border-b-2 border-[#808080] font-sans text-sm">
          <span>文件(F)</span>
          <span>编辑(E)</span>
          <span>查看(V)</span>
          <span>帮助(H)</span>
        </div>

        <div className="flex px-2 py-2 gap-2 border-b-2 border-white items-center bg-[#c0c0c0]">
          <span className="font-sans text-sm">地址(D):</span>
          <div className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white px-2 py-1 font-sans text-sm text-black">
            {path}
          </div>
        </div>

        <div className="flex-1 bg-white ml-1 mr-1 mb-1 border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-4 flex flex-wrap content-start gap-4 md:gap-6 overflow-y-auto">
          {items.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => handleItemClick(item)}
              className={cn(
                "flex flex-col items-center p-2 w-20 md:w-24 gap-1 cursor-none transition-colors border-2 border-transparent",
                selected === item.name && "bg-[#000080] text-white border-dotted border-black/50 outline outline-1 outline-white"
              )}
            >
              <div className={cn("text-4xl filter drop-shadow-md flex items-center justify-center p-2", selected === item.name ? "text-white mix-blend-difference" : "text-black")}>
                {item.type === 'folder' && <FolderHeart size={44} />}
                {item.type === 'file' && <FileText size={44} />}
                {item.type === 'audio' && <Music size={44} />}
                {item.type === 'exe' && <PlaySquare size={44} />}
              </div>
              <span className={cn(
                "text-xs font-sans text-center leading-tight break-all",
                selected === item.name ? "text-white line-clamp-none max-h-none" : "text-black line-clamp-2"
              )}>
                {item.name}
              </span>
            </div>
          ))}
        </div>

        <div className="h-6 flex items-center px-2 border-t-2 border-[#808080] font-sans text-xs gap-4 mx-1 mb-1 text-black">
          <span className="flex-1 border-r border-[#808080] pr-2">{items.length} 个对象 [双击/连按打开]</span>
          <span className="hidden sm:inline">可用空间: [回忆满载]</span>
        </div>
      </div>

      <AnimatePresence>
        {popupContent && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* 遮罩层，点击也可以关闭，并且保持 pointer-events-auto 以拦截下层点击 */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm pointer-events-auto" onClick={() => setPopupContent(null)} />
            
            <motion.div
              drag
              dragMomentum={false}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="win98-window shadow-[4px_4px_0_0_#000] w-[90vw] max-w-[18rem] pointer-events-auto relative"
            >
              <div className="win98-titlebar !bg-[#000080] !text-white flex justify-between items-center px-1 py-1 cursor-move">
                <span className="font-pixel ml-1 font-bold whitespace-nowrap overflow-hidden text-ellipsis pointer-events-none">{popupContent.name}</span>
                <button onPointerUp={() => setPopupContent(null)} className="win98-button !p-0 w-6 h-6 flex items-center justify-center font-bold text-black border-2 bg-[#c0c0c0] cursor-pointer" onPointerDown={(e) => e.stopPropagation()}>X</button>
              </div>
              <div onPointerDown={(e) => e.stopPropagation()} className="p-4 bg-white border-x-2 border-b-2 border-white flex flex-col gap-4 font-sans text-sm text-black cursor-default">
                 <p className="whitespace-pre-wrap font-bold leading-relaxed max-h-[40vh] overflow-y-auto">{popupContent.content}</p>
                 <div className="flex justify-center mt-2">
                   <button className="win98-button font-pixel px-6 py-1" onPointerUp={() => setPopupContent(null)}>确认 / OK</button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const Messenger: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = chatMessages.map((m, i) => 
      setTimeout(() => setVisibleMessages(i + 1), m.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="absolute inset-0 flex items-center justify-center p-4 z-10"
    >
      <div className="win98-window w-[95%] max-w-sm h-[90%] max-h-[550px] flex flex-col relative bg-[#c0c0c0] shadow-[8px_8px_0_0_#000]">
        <div className="win98-titlebar !bg-black !text-white flex justify-between items-center px-2 py-1">
          <span className="font-pixel font-bold tracking-widest text-[#00ffff]">BUNNIES_CHAT.exe</span>
          <div className="flex gap-1">
            <span className="bg-[#c0c0c0] text-black px-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080]">_</span>
            <span className="bg-[#c0c0c0] text-black px-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080]">X</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-4 scroll-smooth bg-white border-x-4 border-b-4 border-[#c0c0c0]">
          <div className="text-center w-full border-b-2 border-dashed border-black pb-2 mb-2">
            <span className="text-black px-2 py-1 text-xs font-pixel uppercase font-bold">* 秘密通讯链路已连接 [SYS_LINK_READY] *</span>
          </div>
          
          <AnimatePresence>
            {chatMessages.slice(0, visibleMessages).map((m, i) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 max-w-[95%]"
              >
                <div 
                  className="w-10 h-10 border-2 border-black flex items-center justify-center text-xl shrink-0 shadow-[2px_2px_0_0_#000] font-pixel font-bold object-cover"
                  style={{ backgroundColor: m.color || '#ccc' }}
                >
                  <span className="drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)] text-white">{m.sender.charAt(0)}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="font-bold text-xs uppercase font-pixel tracking-wider">{m.sender}</span>
                  {m.type === 'file' ? (
                    <button 
                      onClick={onNext}
                      className="mt-1 bg-[#ff00ff] text-white border-2 border-black p-3 text-left shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all group"
                    >
                      <div className="font-pixel flex items-center gap-3">
                         <div className="text-white group-hover:animate-bounce">
                             <Save size={24} strokeWidth={2.5} />
                         </div>
                         <div>
                           <p className="font-bold underline">点击下载 [DOWNLOAD]</p>
                           <p className="text-xs">{m.filename}</p>
                         </div>
                      </div>
                    </button>
                  ) : (
                    <div className="mt-1 border-2 border-black px-3 py-2 text-black text-[15px] bg-[#f0f0f0] font-sans font-bold leading-tight relative">
                      {m.text}
                      <div className="absolute top-2 -left-[5px] w-2 h-2 bg-[#f0f0f0] border-l-2 border-b-2 border-black transform rotate-45"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {visibleMessages < chatMessages.length && (
              <motion.div 
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mt-2"
              >
                <div className="w-10 h-10 border-2 border-dashed border-black flex items-center justify-center bg-gray-200">
                   <div className="w-4 h-4 bg-black animate-ping"></div>
                </div>
                <span className="font-pixel text-xs text-gray-500 animate-pulse">信号接入中 [incoming_signal] ...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

const PopupHell: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [activePopups, setActivePopups] = useState(popupsData);
  const [readyOpen, setReadyOpen] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [glitchText, setGlitchText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const closePopup = (id: number) => {
    setActivePopups(prev => prev.filter(p => p.id !== id));
  };

  useEffect(() => {
    if (activePopups.length === 0) {
      setTimeout(() => setReadyOpen(true), 500);
    }
  }, [activePopups]);

  // Handle the "Hold to Decrypt" mechanic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isHolding && readyOpen) {
      interval = setInterval(() => {
        setDecryptProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 3; // Fills up in about 1.5 - 2 seconds
        });
      }, 50);
    } else {
      interval = setInterval(() => {
        setDecryptProgress(prev => {
          if (prev <= 0) return 0;
          return prev - 8; // Drops quickly if let go
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isHolding, readyOpen]);

  useEffect(() => {
    if (decryptProgress >= 100) {
      setIsHolding(false);
      setTimeout(() => onNext(), 300);
    }
  }, [decryptProgress, onNext]);

  useEffect(() => {
    if (isHolding) {
      const id = setInterval(() => {
        setGlitchText(Array.from({length: 200}).map(() => String.fromCharCode(33 + Math.random() * 90)).join(''));
      }, 50);
      return () => clearInterval(id);
    }
  }, [isHolding]);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "absolute inset-0 z-10 overflow-hidden bg-[#008080] transition-all", 
        decryptProgress > 80 && "animate-[shake_0.15s_infinite] saturate-200 contrast-125 hue-rotate-15"
      )}
    >
      {/* Repetitive background effect */}
      <div className="absolute inset-0 bg-checkered-dark opacity-30"></div>

      {activePopups.map((popup) => (
        <motion.div
           key={popup.id}
           drag
           dragConstraints={containerRef}
           dragMomentum={false}
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           whileDrag={{ scale: 1.02 }}
           className="absolute win98-window z-20 shadow-[6px_6px_0_0_#000] cursor-move touch-none"
           style={{ 
             left: `clamp(10px, ${popup.x}%, max(10px, calc(100% - min(85vw, ${popup.w}px) - 10px)))`,
             top: `clamp(10px, ${popup.y}%, calc(100% - 150px))`,
             width: `min(85vw, ${popup.w}px)`
           }}
        >
          <div className="win98-titlebar !bg-[#000080] !text-white flex justify-between items-center px-1 py-1">
            <span className="font-pixel ml-1 font-bold">{popup.title}</span>
            <button 
              onPointerUp={(e) => { e.stopPropagation(); closePopup(popup.id); }}
              className="win98-button !p-0 w-6 h-6 flex items-center justify-center font-bold text-black border-2 bg-[#c0c0c0]"
            >X</button>
          </div>
          <div className="p-4 bg-[#c0c0c0] flex flex-col items-center text-center border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080]">
            <div className="flex gap-4 items-center w-full mb-4 pointer-events-none">
              <div className="text-3xl text-red-600 font-bold font-pixel">!</div>
              <p className="font-sans font-bold text-black whitespace-pre-wrap text-[15px] leading-tight text-left flex-1">{popup.text}</p>
            </div>
            <div className="flex gap-2 justify-center w-full mt-2">
              <button 
                onPointerUp={(e) => { e.stopPropagation(); closePopup(popup.id); }}
                className="win98-button font-pixel px-6 py-1"
              >确认 / OK</button>
            </div>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {readyOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/90 p-4"
          >
            <h1 className="text-white font-pixel text-2xl mb-8 animate-pulse text-center">系统威胁已清除 [ALL_THREATS_CLEARED]</h1>
            
             <div className="w-[90%] max-w-sm flex flex-col items-center">
              <button 
                 onMouseDown={() => setIsHolding(true)}
                 onMouseUp={() => setIsHolding(false)}
                 onMouseLeave={() => setIsHolding(false)}
                 onTouchStart={() => setIsHolding(true)}
                 onTouchEnd={() => setIsHolding(false)}
                 onContextMenu={(e) => e.preventDefault()}
                 style={{ 
                   userSelect: 'none', 
                   WebkitUserSelect: 'none', 
                   touchAction: 'none',
                   transform: isHolding ? `scale(${1 + decryptProgress * 0.0005}) rotate(${Math.random() > 0.5 && isHolding ? 1 : -1}deg)` : 'scale(1)'
                 }}
                 className={cn(
                   "brutalist-button relative w-full text-[15px] sm:text-xl font-bold px-2 sm:px-6 py-6 sm:py-8 border-4 border-black font-pixel transition-shadow overflow-hidden",
                   isHolding ? "bg-[#222] shadow-[4px_4px_0_0_#ff00ff]" : "bg-white shadow-[8px_8px_0_0_#ff00ff]"
                 )}
              >
                 {/* Progress fill background */}
                 <div 
                   className="absolute inset-0 bg-[#00ffff] origin-left transition-all duration-[50ms]"
                   style={{ transform: `scaleX(${decryptProgress / 100})` }}
                 ></div>
                 
                 {/* ASCII Glitch overlay when holding */}
                 {isHolding && (
                    <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-wrap overflow-hidden text-[#ff00ff] font-mono break-all text-xs leading-none">
                      {glitchText}
                    </div>
                 )}
                 
                 <span className={cn("relative z-10 flex items-center justify-center gap-3", isHolding ? "text-black" : "text-black")}>
                   {decryptProgress >= 100 ? "解密成功 [UNLOCKED!]" : (isHolding ? `核心解密中 [DECRYPTING]... ${Math.floor(decryptProgress)}%` : "长按解密礼物 [HOLD_TO_DECRYPT]")}
                 </span>
              </button>
              
              <p className="text-[#00ffff] font-pixel text-sm mt-4">
                {isHolding ? '警告：请勿断开连接 [DO_NOT_RELEASE]' : '等待系统手动覆写 [AWAITING_OVERRIDE]'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const MemoryStack = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [exitX, setExitX] = useState(0);

    const getIcon = (i: number) => {
       switch(i) {
         case 0: return <Disc size={48} strokeWidth={2} color="#000" />;
         case 1: return <Camera size={48} strokeWidth={2} color="#000" />;
         case 2: return <Sparkles size={48} strokeWidth={2} color="#000" />;
         default: return <Heart size={48} strokeWidth={2} color="#ff69b4" fill="#ff69b4" />;
       }
    }

    return (
      <div className="w-[95%] sm:w-[95%] max-w-[380px] h-[90%] max-h-[550px] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#555] shadow-[8px_8px_0_0_#000] flex flex-col pointer-events-auto filter drop-shadow-xl relative z-30">
        <div className="bg-[#000080] p-1.5 flex justify-between items-center select-none flex-shrink-0">
          <span className="font-pixel text-white text-xs ml-1 tracking-widest drop-shadow-[1px_1px_0_#000]">♥ SURPRISE.EXE</span>
          <div className="w-5 h-5 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#555] flex items-center justify-center font-bold text-xs text-black">X</div>
        </div>

        <div className="relative flex-1 w-full min-h-[300px] bg-checkered p-2 sm:p-4 flex items-center justify-center overflow-hidden">
          <AnimatePresence>
              {memoriesData.map((mem, i) => {
                  if (i < currentIndex) return null;
                  const isTop = i === currentIndex;
                  const offset = i - currentIndex;
                  if (offset > 2) return null;

                  return (
                      <motion.div
                          key={i}
                          drag={isTop && i < memoriesData.length - 1 ? "x" : false}
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.8}
                          onDragEnd={(e, { offset, velocity }) => {
                              if (Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 300) {
                                  setExitX(offset.x > 0 ? 500 : -500);
                                  setCurrentIndex(c => c + 1);
                              }
                          }}
                          initial={{ scale: 0.8, opacity: 0, y: 50 }}
                          animate={{ 
                              scale: 1 - offset * 0.05, 
                              y: offset * 20,
                              zIndex: 10 - offset,
                              opacity: 1 - (offset * 0.15),
                              rotate: i % 2 === 0 ? offset * 2 : -offset * 2
                          }}
                          exit={{ x: exitX, opacity: 0, scale: 0.8, rotate: exitX > 0 ? 20 : -20, transition: { duration: 0.3 } }}
                          className="absolute w-[80%] max-w-[280px] h-auto min-h-[380px] bg-[#fdfdfd] border-2 border-black flex flex-col items-center justify-start p-3 sm:p-4 shadow-xl"
                          style={{ touchAction: 'none' }}
                          whileDrag={isTop ? { scale: 1.05, rotate: exitX > 0 ? 5 : -5 } : {}}
                      >
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/10 rounded-full blur-[1px]"></div>
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/80 border border-black/20 shadow-sm transform rotate-2"></div>
                          
                          <div className="w-full bg-white border border-black/10 shadow-inner flex flex-col items-center justify-start p-3 mt-4 flex-1 text-center pb-6">
                             <div className="mb-3 mt-2 relative z-10 drop-shadow-sm bg-[#f0f0f0] border-2 border-black p-2 sm:p-3 rounded-full shrink-0">
                                {getIcon(i)}
                             </div>
                             <div className="font-sans font-bold text-sm sm:text-base md:text-lg text-black whitespace-pre-wrap relative z-10 leading-relaxed px-1 sm:px-2 flex-1 flex flex-col justify-center w-full">
                                 {isTop && i === memoriesData.length - 1 ? (
                                     <TypewriterText text={mem.text} delay={300} />
                                 ) : (
                                     mem.text
                                 )}
                             </div>
                          </div>

                          {isTop && i < memoriesData.length - 1 && (
                              <motion.div animate={{x:[-3, 3, -3]}} transition={{repeat:Infinity, duration:1.5}} className="absolute bottom-4 right-4 text-[10px] font-pixel text-black/40">
                                 &lt; SWIPE &gt;
                              </motion.div>
                          )}
                      </motion.div>
                  )
              })}
          </AnimatePresence>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-0">
             {memoriesData.map((_, i) => (
                <div key={i} className={`h-2 transition-all duration-300 border border-black ${i === currentIndex ? 'w-6 bg-[#ff69b4]' : (i < currentIndex ? 'w-2 bg-black/20' : 'w-2 bg-white')}`} />
             ))}
          </div>
        </div>
      </div>
    );
}

function Surprise() {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!opened) return;

    const fire = () => {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#ff69b4', '#000000', '#ffffff', '#00ffff'],
        shapes: ['star', 'circle']
      });
    };

    fire();

    const t = setTimeout(() => {
        fire();
    }, 1500);

    return () => {
      clearTimeout(t);
      confetti.reset();
    };
  }, [opened]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center p-4 z-20 bg-checkered-dark overflow-hidden"
    >
      <FloatingNotes />

      <AnimatePresence>
        {opened && (
            <motion.div 
              initial={{ opacity: 1, backgroundColor: "#ffffff" }}
              animate={{ opacity: 0, backgroundColor: "transparent" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 z-50 pointer-events-none"
            />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!opened ? (
            <motion.div key="envelope" exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }} className="relative z-20">
              <Envelope onOpen={() => setOpened(true)} />
            </motion.div>
        ) : (
            <motion.div key="gallery" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full relative z-20 h-full flex flex-col items-center justify-center">
               <MemoryStack />
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function App() {
  const [step, setStep] = useState<'BIOS' | 'LOGIN' | 'LOGIN_LOADING' | 'EXPLORER' | 'MESSENGER' | 'POPUP_HELL' | 'SURPRISE'>('BIOS');
  const [isRestarting, setIsRestarting] = useState(false);

  // Global Music State
  const [playlist, setPlaylist] = useState<{name: string, src: string}[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isSystemReady = !['BIOS', 'LOGIN', 'LOGIN_LOADING'].includes(step);

  // Load playlist on mount
  useEffect(() => {
    fetch('/api/music')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
           setPlaylist(data);
           fileSystem['C:\\Documents\\Secret\\Album'] = [
             { name: '.. (返回上级)', type: 'folder', target: 'C:\\Documents\\Secret', emoji: '📁' },
             ...data.map((song: any) => ({ name: song.name, type: 'audio', src: song.src, emoji: '🎵' }))
           ];
        } else {
           fileSystem['C:\\Documents\\Secret\\Album'] = [
             { name: '.. (返回上级)', type: 'folder', target: 'C:\\Documents\\Secret', emoji: '📁' },
             { name: '未找到音乐.txt', type: 'file', content: '请在 /public/music 文件夹中放入无损音乐！', emoji: '📝' }
           ];
        }
      })
      .catch((e) => {
           console.error("Music load error", e);
      });
  }, []);

  const playTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (currentTrackIndex === -1 && playlist.length > 0) {
       setCurrentTrackIndex(0);
       setIsPlaying(true);
       return;
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentTrackIndex, playlist]);

  const nextTrack = useCallback(() => {
    if (playlist.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  }, [playlist]);

  const prevTrack = useCallback(() => {
    if (playlist.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  }, [playlist]);

  useEffect(() => {
    if (audioRef.current) {
       if (isPlaying) {
          audioRef.current.play().catch(e => console.error("Playback error", e));
       } else {
          audioRef.current.pause();
       }
    }
  }, [isPlaying, currentTrackIndex]);

  // Background titles
  useEffect(() => {
    const titles = ['🐰 Happy Birthday!', '★ 05/20 ★', '💕 For You ~'];
    let i = 0;
    document.title = titles[0];
    const interval = setInterval(() => {
      i = (i + 1) % titles.length;
      document.title = titles[i];
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const onNextBios = useCallback(() => setStep('LOGIN'), []);
  const onNextLogin = useCallback(() => setStep('LOGIN_LOADING'), []);
  const onNextLoginLoading = useCallback(() => setStep('EXPLORER'), []);
  const onNextExplorer = useCallback(() => setStep('MESSENGER'), []);
  const onNextMessenger = useCallback(() => setStep('POPUP_HELL'), []);
  const onNextPopupHell = useCallback(() => setStep('SURPRISE'), []);

  const handlePowerClick = useCallback(() => {
    if (step !== 'SURPRISE' || isRestarting) return;
    setIsRestarting(true);
    setIsPlaying(false);
    setTimeout(() => {
      setStep('BIOS');
    }, 650);
    setTimeout(() => {
      setIsRestarting(false);
    }, 1200);
  }, [step, isRestarting]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-2 sm:p-8 flex items-center justify-center relative select-none overflow-hidden font-sans">
      <GlobalInteractions />
      
      <div className="relative w-full max-w-[1024px] h-[95vh] sm:h-auto aspect-auto sm:aspect-[4/3] sm:max-h-[90vh] mx-auto flex flex-col p-2 sm:p-6 md:p-8 rounded-[1.25rem] sm:rounded-[3rem] md:rounded-[3.5rem] shadow-[inset_2px_2px_10px_rgba(255,255,255,0.9),inset_-6px_-6px_20px_rgba(0,0,0,0.3),0_30px_60px_rgba(0,0,0,0.9),0_0_100px_rgba(255,255,255,0.05)] monitor-casing">
        
        {/* Top details of monitor casing */}
        <div className="absolute top-2 left-6 right-6 h-1 flex justify-between px-10 opacity-30 pointer-events-none">
            <div className="w-16 h-full bg-black rounded-full shadow-[1px_1px_0_rgba(255,255,255,0.5)]"></div>
            <div className="w-16 h-full bg-black rounded-full shadow-[1px_1px_0_rgba(255,255,255,0.5)]"></div>
        </div>

        {/* Inner Screen Bezel */}
        <div className="relative flex-1 w-full rounded-xl sm:rounded-3xl overflow-hidden shadow-[inset_0_4px_15px_rgba(0,0,0,0.8),0_2px_5px_rgba(255,255,255,0.6)] bg-black">
          
          {/* CRT Inner Screen Pincushion Shadow */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.95)] z-[60] mix-blend-multiply"></div>
          
          {/* Screen Glass Glare */}
          <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-10 z-[65] overflow-hidden">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] rotate-45 bg-gradient-to-b from-transparent via-white to-transparent opacity-40 blur-3xl transform translate-y-1/4"></div>
          </div>
          
          {/* CRT Convex reflection curve */}
          <div className="absolute inset-x-0 -top-[50%] h-[150%] bg-white/5 opacity-50 rounded-[100%] pointer-events-none z-[64] blur-sm mix-blend-overlay"></div>

          {/* Starfield */}
          <Starfield />

          <div className="relative w-full h-full overflow-hidden text-black selection:bg-black selection:text-white">
            <div className={`w-full h-full ${isRestarting ? 'animate-crt-off pointer-events-none' : ''}`}>
                <div className={`absolute inset-0 z-[70] pointer-events-none transition-colors duration-100 ${isRestarting ? 'bg-black' : 'bg-transparent'}`} />
                <div className={`w-full h-full transition-opacity duration-150 ${isRestarting ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="dv-grain z-[50]"></div>
                    <div className="scanlines z-[55]"></div>
                    
                    <AnimatePresence mode="wait">
                      {step === 'BIOS' && <BiosBoot key="bios" onNext={onNextBios} />}
                      {step === 'LOGIN' && <Login key="login" onNext={onNextLogin} />}
                      {step === 'LOGIN_LOADING' && <LoginLoading key="login_loading" onNext={onNextLoginLoading} />}
                      {step === 'EXPLORER' && <DesktopExplorer key="explorer" onNext={onNextExplorer} playlist={playlist} onPlayTrack={playTrack} />}
                      {step === 'MESSENGER' && <Messenger key="messenger" onNext={onNextMessenger} />}
                      {step === 'POPUP_HELL' && <PopupHell key="popup_hell" onNext={onNextPopupHell} />}
                      {step === 'SURPRISE' && <Surprise key="surprise" />}
                    </AnimatePresence>
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Monitor Deck (Buttons, Vents, Logo) */}
        <div className="h-10 sm:h-20 mt-2 sm:mt-6 flex flex-shrink-0 items-center justify-between px-2 sm:px-12 pointer-events-auto">
           {/* Music Player Control */}
           <div className="flex gap-2 sm:gap-4 items-center">
              <div className="flex bg-[#111] border-2 border-t-black border-l-black border-b-gray-500 border-r-gray-500 p-1 sm:p-2 shadow-inner h-8 sm:h-12 w-28 sm:w-48 overflow-hidden items-center relative">
                 <span className={cn("font-pixel text-[10px] sm:text-xs whitespace-nowrap overflow-hidden text-ellipsis w-full", isSystemReady ? "text-[#39ff14]" : "text-[#1a5510]")}>
                   <div className={cn(isSystemReady ? "animate-pulse" : "")}>{
                    !isSystemReady ? "SYSTEM OFFLINE" : 
                    playlist.length === 0 ? "NO DISC" : 
                    (currentTrackIndex === -1 ? "READY..." : 
                      `${isPlaying ? '▶' : '⏸'} ${playlist[currentTrackIndex]?.name || 'Unknown'}`
                    )
                   }</div>
                 </span>
              </div>
              <div className="flex gap-2 sm:gap-3">
                 <button disabled={!isSystemReady} onClick={prevTrack} className={cn("w-8 h-6 sm:w-12 sm:h-8 rounded-md bg-gradient-to-br from-[#e0dfd9] to-[#bfbeba] border border-[#a0a09e] shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.3),inset_3px_3px_6px_rgba(255,255,255,0.9),2px_2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all text-[#555] font-black text-[10px] sm:text-[11px] tracking-tighter", isSystemReady ? "cursor-pointer hover:brightness-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),0_0_0_rgba(0,0,0,0)] active:text-[#222]" : "opacity-60 cursor-default")}>|&lt;</button>
                 <button disabled={!isSystemReady} onClick={togglePlay} className={cn("w-8 h-6 sm:w-12 sm:h-8 rounded-md bg-gradient-to-br from-[#e0dfd9] to-[#bfbeba] border border-[#a0a09e] shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.3),inset_3px_3px_6px_rgba(255,255,255,0.9),2px_2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all text-[#555] font-black text-[10px] sm:text-[11px] tracking-tighter", isSystemReady ? "cursor-pointer hover:brightness-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),0_0_0_rgba(0,0,0,0)] active:text-[#222]" : "opacity-60 cursor-default")}>{isPlaying ? '||' : '▶'}</button>
                 <button disabled={!isSystemReady} onClick={nextTrack} className={cn("w-8 h-6 sm:w-12 sm:h-8 rounded-md bg-gradient-to-br from-[#e0dfd9] to-[#bfbeba] border border-[#a0a09e] shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.3),inset_3px_3px_6px_rgba(255,255,255,0.9),2px_2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all text-[#555] font-black text-[10px] sm:text-[11px] tracking-tighter", isSystemReady ? "cursor-pointer hover:brightness-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),0_0_0_rgba(0,0,0,0)] active:text-[#222]" : "opacity-60 cursor-default")}>&gt;|</button>
              </div>
           </div>
           
           <div className="flex items-center gap-4 sm:gap-8 pointer-events-none">
               {/* Logo Badge */}
               <div className="flex gap-3 items-center">
                 <div className="w-8 h-8 hidden sm:flex bg-gradient-to-br from-gray-100 to-gray-400 rounded-sm items-center justify-center shadow-[1px_1px_3px_rgba(0,0,0,0.4),inset_1px_1px_1px_rgba(255,255,255,0.9)] border border-gray-400">
                   <span className="font-pixel text-[10px] sm:text-xs text-[#d22] font-bold drop-shadow-[0.5px_0.5px_0_rgba(255,255,255,0.8)]">NJ</span>
                 </div>
                 <div className="font-pixel text-[#555] text-xs sm:text-lg font-bold tracking-widest drop-shadow-[1px_1px_0_rgba(255,255,255,0.8)] opacity-80 hidden md:block">BUNNY // 1998</div>
               </div>
           
               {/* Vents */}
               <div className="flex gap-2 flex-1 justify-center max-w-[120px] pb-1">
                  {[1,2,3,4].map(i => (
                      <div key={i} className="w-3 sm:w-4 h-1.5 sm:h-2.5 rounded-full bg-[#111] shadow-[inset_1px_2px_4px_rgba(0,0,0,0.9),1px_1px_0_rgba(255,255,255,0.8)]" />
                  ))}
               </div>
    
               {/* Power Controls */}
               <div className="flex items-center gap-3 sm:gap-6 pointer-events-auto">
                  <div className="flex flex-col gap-1 items-center hidden sm:flex">
                     <div className="w-3 h-1 bg-[#222] shadow-[1px_1px_0_rgba(255,255,255,0.6)]"></div>
                     <div className="w-3 h-1 bg-[#222] shadow-[1px_1px_0_rgba(255,255,255,0.6)]"></div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#39ff14] shadow-[0_0_12px_#39ff14,inset_1px_1px_3px_rgba(255,255,255,0.8)] border border-[#111]" />
                     <div onClick={handlePowerClick} className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#e0dfd9] to-[#bfbeba] border border-[#a0a09e] shadow-[inset_-2px_-2px_5px_rgba(0,0,0,0.3),inset_3px_3px_6px_rgba(255,255,255,0.9),3px_3px_6px_rgba(0,0,0,0.4)] flex items-center justify-center cursor-pointer hover:brightness-95 active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),0_0_0_rgba(0,0,0,0)] transition-all">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-[2.5px] border-[#777] rounded-full border-t-transparent relative opacity-80">
                            <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-[2.5px] h-2.5 bg-[#777] rounded-sm"></div>
                        </div>
                     </div>
                  </div>
               </div>
           </div>
        </div>
      </div>
      
      {/* Global Audio Element */}
      {playlist.length > 0 && currentTrackIndex !== -1 && (
        <audio 
          ref={audioRef} 
          src={playlist[currentTrackIndex]?.src} 
          onEnded={nextTrack}
        />
      )}
    </div>
  );
}


