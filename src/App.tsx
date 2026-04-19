import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from "motion/react";
import confetti from 'canvas-confetti';
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
    const colors = ['#ff69b4', '#00ffff', '#ffffff'];
    for(let i=0; i<150; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.5 + 0.1,
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
            ctx.fillStyle = star.color;
            ctx.globalAlpha = Math.random() * 0.5 + 0.5;
            ctx.fillRect(star.x, star.y, star.size, star.size);
            ctx.globalAlpha = 1.0;
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
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50 block" />;
}

const GlobalInteractions = () => {
  const [pos, setPos] = useState({x: -100, y: -100});
  const [isJumping, setIsJumping] = useState(false);
  const [hearts, setHearts] = useState<{id:number, x:number, y:number}[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({x: e.clientX, y: e.clientY});
    };
    const handleMouseDown = (e: MouseEvent) => {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 200);

      const newHearts = Array.from({length: 3 + Math.floor(Math.random()*3)}).map((_, i) => ({
         id: Date.now() + i + Math.random(),
         x: e.clientX,
         y: e.clientY
      }));
      setHearts(prev => [...prev, ...newHearts]);
      setTimeout(() => {
         setHearts(prev => prev.filter(h => !newHearts.map(nh => nh.id).includes(h.id)));
      }, 1500);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    }
  }, []);

  return (
    <>
      <div 
        className={cn("fixed pointer-events-none z-[10000] text-3xl filter drop-shadow select-none", isJumping ? "animate-[shake_0.1s_ease-in-out_infinite]" : "transition-transform")}
        style={{ left: pos.x, top: pos.y, transform: `translate(-20%, -20%) ${isJumping ? 'scale(1.2)' : 'scale(1)'}` }}
      >
        🐰
      </div>
      {hearts.map(h => (
        <div 
          key={h.id}
          className="fixed pointer-events-none z-[9998] text-sm text-[#ff69b4] animate-float-up drop-shadow-md select-none"
          style={{ 
              left: h.x + (Math.random() * 40 - 20), 
              top: h.y + (Math.random() * 20 - 10) 
          }}
        >
          ❤
        </div>
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
    const [displayed, setDisplayed] = useState('');
    const [isDone, setIsDone] = useState(false);
    useEffect(() => {
        let i = 0;
        const t = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayed(text.substring(0, i+1));
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    setIsDone(true);
                    if(onComplete) onComplete();
                }
            }, 80);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(t);
    }, [text, delay]);
    return <span>{displayed}{!isDone && <span className="animate-pulse">_</span>}</span>;
}

const Envelope = ({ onOpen }: { onOpen: () => void }) => {
    const [isFlipping, setIsFlipping] = useState(false);
    const handleClick = () => {
        setIsFlipping(true);
        setTimeout(onOpen, 1000);
    }
    return (
        <div className="w-80 h-48 relative cursor-none hover:scale-105 transition-transform drop-shadow-[8px_8px_0_rgba(0,0,0,0.8)]" onClick={handleClick} style={{ perspective: '1000px' }}>
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

const DesktopExplorer: React.FC<{ onNext: () => void }> = ({ onNext }) => {
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
        setPopupContent({ name: item.name, src: item.src!, type: 'audio' });
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
                "flex flex-col items-center p-2 w-20 md:w-24 gap-1 cursor-pointer transition-colors border-2 border-transparent",
                selected === item.name && "bg-[#000080] text-white border-dotted border-black/50 outline outline-1 outline-white"
              )}
            >
              <div className="text-4xl filter drop-shadow-md">{item.emoji}</div>
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
              {popupContent.type === 'audio' ? (
                <div onPointerDown={(e) => e.stopPropagation()} className="cursor-default">
                  <AudioPlayerPopup src={popupContent.src!} name={popupContent.name} onClose={() => setPopupContent(null)} />
                </div>
              ) : (
                <div onPointerDown={(e) => e.stopPropagation()} className="p-4 bg-white border-x-2 border-b-2 border-white flex flex-col gap-4 font-sans text-sm text-black cursor-default">
                   <p className="whitespace-pre-wrap font-bold leading-relaxed max-h-[40vh] overflow-y-auto">{popupContent.content}</p>
                   <div className="flex justify-center mt-2">
                     <button className="win98-button font-pixel px-6 py-1" onPointerUp={() => setPopupContent(null)}>确认 / OK</button>
                   </div>
                </div>
              )}
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
      <div className="win98-window w-full max-w-sm h-[80vh] max-h-[600px] flex flex-col relative bg-[#c0c0c0] shadow-[8px_8px_0_0_#000]">
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
                  className="w-10 h-10 border-2 border-black flex items-center justify-center text-lg shrink-0 shadow-[2px_2px_0_0_#000]"
                  style={{ backgroundColor: m.color || '#ccc' }}
                >
                  {m.emoji}
                </div>
                
                <div className="flex flex-col">
                  <span className="font-bold text-xs uppercase font-pixel tracking-wider">{m.sender}</span>
                  {m.type === 'file' ? (
                    <button 
                      onClick={onNext}
                      className="mt-1 bg-[#ff00ff] text-white border-2 border-black p-3 text-left shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all group"
                    >
                      <div className="font-pixel flex items-center gap-2">
                         <span className="text-2xl group-hover:animate-bounce">💾</span>
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
             left: `clamp(10px, ${popup.x}vw, calc(100vw - min(90vw, ${popup.w}px) - 10px))`,
             top: `clamp(10px, ${popup.y}vh, calc(100vh - 200px))`,
             width: `min(90vw, ${popup.w}px)`
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
            
            <div className="w-full max-w-sm flex flex-col items-center">
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
                   "brutalist-button relative w-full text-xl font-bold px-6 py-8 border-4 border-black font-pixel transition-shadow overflow-hidden",
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
               <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 px-[10vw] sm:px-[5vw] md:px-0 md:justify-center hide-scrollbar w-full items-center pl-24 md:pl-0">
                  {memoriesData.map((mem, i) => (
                      <div key={i} className="polaroid min-w-[80vw] sm:min-w-[320px] max-w-[360px] mx-auto snap-center shrink-0 -rotate-2 hover:rotate-1 transition-transform relative top-0 cursor-ew-resize">
                          <div className="bg-[#e0e0e0] w-full aspect-[4/5] overflow-hidden border-2 border-black relative flex flex-col items-center justify-center p-6 text-center select-none shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]">
                              <div className="absolute inset-0 bg-lined pointer-events-none z-0 opacity-40"></div>
                              <div className="text-6xl mb-6 relative z-10 filter drop-shadow-md">{mem.emoji}</div>
                              <div className="font-sans font-bold text-lg text-black whitespace-pre-wrap relative z-10 leading-relaxed px-2 flex-1 flex flex-col justify-center">
                                  {i === memoriesData.length - 1 ? (
                                      <TypewriterText text={mem.text} delay={800} />
                                  ) : (
                                      mem.text
                                  )}
                              </div>
                              {i < memoriesData.length - 1 && <div className="absolute bottom-4 right-4 text-xs font-pixel text-black/50 animate-bounce">SWIPE ➔</div>}
                          </div>
                          
                          <div className="text-center mt-4 border-t-2 border-black/10 pt-2">
                             <p className="font-display font-bold text-xl sm:text-2xl text-black inline-block bg-[#00ffff] px-2 border-2 border-black shadow-[2px_2px_0_0_#000]">05/20</p>
                          </div>
                      </div>
                  ))}
               </div>
               
               <div className="fixed bottom-6 left-0 w-full text-center pointer-events-none">
                 <p className="font-pixel text-white/50 text-sm italic">Scroll horizontally / 滑动翻阅</p>
               </div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function App() {
  const [step, setStep] = useState<'LOGIN' | 'BIOS' | 'EXPLORER' | 'MESSENGER' | 'POPUP_HELL' | 'SURPRISE'>('LOGIN');

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

  const onNextLogin = useCallback(() => setStep('BIOS'), []);
  const onNextBios = useCallback(() => setStep('EXPLORER'), []);
  const onNextExplorer = useCallback(() => setStep('MESSENGER'), []);
  const onNextMessenger = useCallback(() => setStep('POPUP_HELL'), []);
  const onNextPopupHell = useCallback(() => setStep('SURPRISE'), []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-2 sm:p-8 flex items-center justify-center relative select-none">
      <GlobalInteractions />
      
      <div className="relative w-full h-full max-w-[1024px] aspect-auto sm:aspect-[4/3] max-h-[90vh] bg-black border-[12px] sm:border-[32px] border-[#d8d0c0] rounded-[2rem] sm:rounded-[3rem] shadow-[inset_0_0_20px_rgba(0,0,0,1),0_20px_50px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* CRT Inner Bezel Pincushion Shadow */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] z-[60] mix-blend-multiply rounded-xl sm:rounded-2xl border-4 border-black"></div>
        
        {/* Starfield */}
        <Starfield />

        <div className="relative w-full h-full overflow-hidden text-black selection:bg-black selection:text-white">
          <div className="dv-grain z-[50]"></div>
          <div className="scanlines z-[55]"></div>
          
          <AnimatePresence mode="wait">
            {step === 'LOGIN' && <Login key="login" onNext={onNextLogin} />}
            {step === 'BIOS' && <BiosBoot key="bios" onNext={onNextBios} />}
            {step === 'EXPLORER' && <DesktopExplorer key="explorer" onNext={onNextExplorer} />}
            {step === 'MESSENGER' && <Messenger key="messenger" onNext={onNextMessenger} />}
            {step === 'POPUP_HELL' && <PopupHell key="popup_hell" onNext={onNextPopupHell} />}
            {step === 'SURPRISE' && <Surprise key="surprise" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


