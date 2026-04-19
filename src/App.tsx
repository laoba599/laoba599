import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "motion/react";
import confetti from 'canvas-confetti';
import { cn } from './lib/utils';
import './index.css';

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

const fileSystem: Record<string, {name: string, type: string, target?: string, content?: string, src?: string, emoji: string}[]> = {
  'C:\\': [
    { name: '我的文档 (Documents)', type: 'folder', target: 'C:\\Documents', emoji: '📁' },
    { name: '回收站 (Trash)', type: 'folder', target: 'C:\\Trash', emoji: '🗑️' },
    { name: 'readme.txt', type: 'file', content: '提示：去【我的文档】里找找隐藏的加密档案吧。', emoji: '📝' }
  ],
  'C:\\Trash': [
    { name: '.. (返回上级)', type: 'folder', target: 'C:\\', emoji: '📁' },
    { name: '无用的烦恼.txt', type: 'file', content: '已经全部清空啦！今天也要开心！', emoji: '📝' }
  ],
  'C:\\Documents': [
    { name: '.. (返回上级)', type: 'folder', target: 'C:\\', emoji: '📁' },
    { name: '工作文件', type: 'folder', target: 'C:\\Documents\\Work', emoji: '📁' },
    { name: 'TO_BUNNY_绝密存档', type: 'folder', target: 'C:\\Documents\\Secret', emoji: '🗄️' }
  ],
  'C:\\Documents\\Work': [
    { name: '.. (返回上级)', type: 'folder', target: 'C:\\Documents', emoji: '📁' },
    { name: '待办事项.doc', type: 'file', content: '1. 听 Ditto\n2. 听 OMG\n3. 快乐过生日！', emoji: '📝' }
  ],
  'C:\\Documents\\Secret': [
    { name: '.. (返回上级)', type: 'folder', target: 'C:\\Documents', emoji: '📁' },
    { name: 'BUNNIES_CHAT.exe', type: 'exe', emoji: '💾' },
    { name: 'BGM_Track_1.mp3', type: 'audio', src: './bgm.mp3', emoji: '💽' }
  ]
};

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
  const [popupContent, setPopupContent] = useState<{name: string, content?: string, type: string, src?: string} | null>(null);

  const items = fileSystem[path] || [];

  const handleItemClick = (item: any) => {
    if (selected === item.name) {
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
    } else {
      setSelected(item.name);
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

const chatMessages = [
  { id: 1, sender: 'MINJI', emoji: '🐻', text: '生日快乐呀！！！🎂 [HBD]', color: '#ff00ff', delay: 1000 },
  { id: 2, sender: 'HANNI', emoji: '🐰', text: '今天是Bunnies的专属日子！希望你会喜欢我们准备的惊喜！✨', color: '#00ffff', delay: 2500 },
  { id: 3, sender: 'DANIELLE', emoji: '🐶', text: '天哪！终于等到这一刻了！！🎉🎉 [LOADING_GIFT]', color: '#ffff00', delay: 4000 },
  { id: 4, sender: 'HAERIN', emoji: '🐱', text: '我在你的系统里偷偷藏了一个加密文件哦... [SECRET_FILE]', color: '#00ff00', delay: 6500 },
  { id: 5, sender: 'HYEIN', emoji: '🐹', text: '可是千万别去点那些可疑的弹窗呀！😱 [WARNING]', color: '#ff8c00', delay: 8500 },
  { id: 6, type: 'file', sender: 'HAERIN', filename: '神秘礼物_gift.exe', delay: 10500 }
];

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

const popupsData = [
  { id: 1, title: 'WARNING!', text: '[OVERLOAD] 回忆碎片过载！\n>> 那天的音乐分享 🎧', x: 25, y: 25, w: 280 },
  { id: 2, title: 'LUCKY BUNNY', text: '[LUCKY] 幸运Bunny抽选成功！\n>> 深夜的长谈 🌙', x: 75, y: 35, w: 320 },
  { id: 3, title: 'SYSTEM ERROR', text: '[ERR_0x00] 刨冰摄入量超标 🍧\n>> 系统内存正在崩溃...', x: 20, y: 70, w: 260 },
  { id: 4, title: 'VIRUS.EXE', text: '[HEARTBEAT_MAX] 心跳波动突破阈值！\n>> 第一次看演唱会 🎤', x: 70, y: 75, w: 290 },
  { id: 5, title: 'MESSAGE', text: '[MSG_UNREAD] 新指令接入：\n>> “雨中奔跑的傻笑” 🌧️', x: 50, y: 50, w: 250 },
];

const PopupHell: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [activePopups, setActivePopups] = useState(popupsData);
  const [readyOpen, setReadyOpen] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);
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
      <div className="absolute inset-0 bg-checkered opacity-30"></div>

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
                      {Array.from({length: 200}).map(() => String.fromCharCode(33 + Math.random() * 90)).join('')}
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
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#000000', '#ffffff', '#ff69b4', '#00ffff'],
      shapes: ['square']
    });

  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center p-4 z-20 bg-checkered"
    >
      {/* 物理相机闪光灯效果：一瞬间的纯白覆盖然后褪去 */}
      <motion.div 
        initial={{ opacity: 1, backgroundColor: "#ffffff" }}
        animate={{ opacity: 0, backgroundColor: "transparent" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-50 pointer-events-none"
      />
      <div className="polaroid w-full max-w-sm relative -rotate-3 hover:rotate-2 transition-transform duration-200">
        
        <div className="bg-[#e0e0e0] w-full aspect-[4/5] overflow-hidden border-2 border-black relative flex items-center justify-center shadow-inner">
           <div className="absolute inset-0 bg-lined pointer-events-none z-0"></div>
           
           <AnimatePresence mode="wait">
             {!opened ? (
               <motion.button 
                 key="gift"
                 initial={{ scale: 0.9 }}
                 animate={{ scale: 1 }}
                 exit={{ scale: 0 }}
                 onClick={() => setOpened(true)}
                 className="brutalist-button px-6 py-4 text-2xl z-10"
               >
                 [ 拆开礼物 / OPEN ]
               </motion.button>
             ) : (
               <motion.div 
                 key="message"
                 initial={{ scale: 0, rotate: -5 }}
                 animate={{ scale: 1, rotate: 0 }}
                 className="relative z-10 w-full h-full flex flex-col items-center p-6 text-center bg-white/90 border-4 border-double border-black m-4 max-w-[90%] max-h-[90%]"
               >
                 <div className="text-4xl mb-2 font-pixel">☆(&gt;ᴗ•)</div>
                 <h2 className="text-2xl md:text-3xl font-display font-bold text-black bg-[#00ffff] px-2 mb-4 border border-black shadow-[2px_2px_0_0_#000]">
                   生日快乐 [HAPPY B-DAY]
                 </h2>
                 <p className="font-sans font-bold text-black text-[15px] md:text-lg leading-relaxed flex-1 flex flex-col justify-center whitespace-pre-wrap">
                   {`给我最专属的 Bunny，\n\n愿你的每一天都像时空隧道一样充满奇妙与闪耀！\n\n[ LOVE_U_ALL ] <3`}
                 </p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
        
        <div className="text-center mt-4">
          <p className="font-display font-bold text-3xl text-black inline-block bg-[#ff69b4] text-white px-2 border-2 border-black shadow-[2px_2px_0_0_#000]">05/20</p>
          <p className="font-pixel text-black text-sm mt-2 uppercase tracking-widest font-bold">B U N N I E S _ C L U B</p>
        </div>
        
        <div className="absolute top-2 right-2 text-black y2k-sticker shake-hover text-4xl">★</div>
        <div className="absolute bottom-20 left-2 text-[#00ffff] y2k-sticker shake-hover text-5xl">♡</div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [step, setStep] = useState<'LOGIN' | 'BIOS' | 'EXPLORER' | 'MESSENGER' | 'POPUP_HELL' | 'SURPRISE'>('LOGIN');

  return (
    <div className="min-h-screen relative overflow-hidden text-black selection:bg-black selection:text-white">
      <div className="dv-grain"></div>
      <div className="scanlines"></div>
      
      <AnimatePresence mode="wait">
        {step === 'LOGIN' && <Login key="login" onNext={() => setStep('BIOS')} />}
        {step === 'BIOS' && <BiosBoot key="bios" onNext={() => setStep('EXPLORER')} />}
        {step === 'EXPLORER' && <DesktopExplorer key="explorer" onNext={() => setStep('MESSENGER')} />}
        {step === 'MESSENGER' && <Messenger key="messenger" onNext={() => setStep('POPUP_HELL')} />}
        {step === 'POPUP_HELL' && <PopupHell key="popup_hell" onNext={() => setStep('SURPRISE')} />}
        {step === 'SURPRISE' && <Surprise key="surprise" />}
      </AnimatePresence>
    </div>
  );
}


