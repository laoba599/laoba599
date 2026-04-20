export type FileSystemItem = { name: string, type: string, target?: string, content?: string, src?: string, emoji: string };

export const fileSystem: Record<string, FileSystemItem[]> = {
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
    { name: '我的音乐专辑 (Album)', type: 'folder', target: 'C:\\Documents\\Secret\\Album', emoji: '💽' }
  ],
  'C:\\Documents\\Secret\\Album': [
    { name: '.. (返回上级)', type: 'folder', target: 'C:\\Documents\\Secret', emoji: '📁' },
    { name: '加载中...', type: 'file', content: '正在搜索音乐...', emoji: '⏳' }
  ]
};

export const chatMessages = [
  { id: 1, sender: 'MINJI', emoji: '🐻', text: '生日快乐呀！！！ [HBD]', color: '#ff00ff', delay: 1000 },
  { id: 2, sender: 'HANNI', emoji: '🐰', text: '今天是Bunnies的专属日子！希望你会喜欢我们准备的惊喜！', color: '#00ffff', delay: 2500 },
  { id: 3, sender: 'DANIELLE', emoji: '🐶', text: '天哪！终于等到这一刻了！！ [LOADING_GIFT]', color: '#ffff00', delay: 4000 },
  { id: 4, sender: 'HAERIN', emoji: '🐱', text: '我在你的系统里偷偷藏了一个加密文件哦... [SECRET_FILE]', color: '#00ff00', delay: 6500 },
  { id: 5, sender: 'HYEIN', emoji: '🐹', text: '可是千万别去点那些可疑的弹窗呀！ [WARNING]', color: '#ff8c00', delay: 8500 },
  { id: 6, type: 'file', sender: 'HAERIN', filename: '神秘礼物_gift.exe', delay: 10500, emoji: '🐱', color: '#00ff00' }
];

export const popupsData = [
  { id: 1, title: 'WARNING!', text: '[OVERLOAD] 回忆碎片过载！\n>> 那天的音乐分享', x: 25, y: 25, w: 280 },
  { id: 2, title: 'LUCKY BUNNY', text: '[LUCKY] 幸运Bunny抽选成功！\n>> 深夜的长谈', x: 75, y: 35, w: 320 },
  { id: 3, title: 'SYSTEM ERROR', text: '[ERR_0x00] 刨冰摄入量超标\n>> 系统内存正在崩溃...', x: 20, y: 70, w: 260 },
  { id: 4, title: 'VIRUS.EXE', text: '[HEARTBEAT_MAX] 心跳波动突破阈值！\n>> 第一次看演唱会', x: 70, y: 75, w: 290 },
  { id: 5, title: 'MESSAGE', text: '[MSG_UNREAD] 新指令接入：\n>> “雨中奔跑的傻笑”', x: 50, y: 50, w: 250 },
];

export const memoriesData = [
  { text: "那天的音乐分享\n虽然总是只听到一半就睡着了哈哈", emoji: "💿" },
  { text: "雨中奔跑的傻笑\n淋湿了肩膀但是好快乐！", emoji: "📸" },
  { text: "深夜看到星星的那瞬间\n不知道你有没有也看到？", emoji: "🌟" },
  { text: "给我最专属的 Bunny，\n\n愿你的每一天都像时空隧道一样充满奇妙与闪耀！\n\n[ LOVE_U_ALL ] <3", emoji: "🐰" }
];
