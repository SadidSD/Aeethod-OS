import React, { useState } from 'react';
import {
  Smile,
  Image as ImageIcon,
  X,
  Sparkles,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface NotionPageHeaderProps {
  title: string;
  emoji?: string;
  category?: string;
  description?: string;
  coverGradient?: string;
  onTitleChange?: (newTitle: string) => void;
  onEmojiChange?: (newEmoji: string) => void;
}

const COMMON_EMOJIS = [
  '🎯', '📣', '🤝', '🎨', '💰', '🧮', '📈', '🚚', '🏪', '🗄️',
  '📊', '⚙️', '❤️', '⚖️', '👥', '📋', '🔗', '🚀', '🧠', '📦',
  '📐', '🛠️', '💡', '🔥', '⭐', '⚡', '💎', '🔑', '🏷️', '📝',
];

const PRESET_COVERS = [
  'from-indigo-900/60 via-purple-900/40 to-slate-900',
  'from-emerald-900/60 via-teal-900/40 to-slate-900',
  'from-amber-900/60 via-orange-900/40 to-slate-900',
  'from-rose-900/60 via-pink-900/40 to-slate-900',
  'from-cyan-900/60 via-blue-900/40 to-slate-900',
];

export const NotionPageHeader: React.FC<NotionPageHeaderProps> = ({
  title,
  emoji = '📄',
  category,
  description,
  coverGradient,
  onTitleChange,
  onEmojiChange,
}) => {
  const [currentCover, setCurrentCover] = useState<string | null>(coverGradient || null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(title);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (onTitleChange && titleValue.trim() && titleValue !== title) {
      onTitleChange(titleValue.trim());
    }
  };

  const handleSelectEmoji = (e: string) => {
    if (onEmojiChange) onEmojiChange(e);
    setShowEmojiPicker(false);
  };

  const cycleCover = () => {
    if (!currentCover) {
      setCurrentCover(PRESET_COVERS[0]);
    } else {
      const idx = PRESET_COVERS.indexOf(currentCover);
      const next = idx >= 0 && idx < PRESET_COVERS.length - 1 ? PRESET_COVERS[idx + 1] : null;
      setCurrentCover(next);
    }
  };

  return (
    <div className="w-full relative select-none">
      {/* Cover Banner */}
      {currentCover && (
        <div className={`h-36 w-full bg-gradient-to-r ${currentCover} relative group transition-all duration-300 border-b border-[#2e2e2e]`}>
          <div className="absolute right-4 bottom-3 opacity-0 group-hover:opacity-100 transition flex items-center gap-1.5 bg-[#191919]/80 backdrop-blur-xs px-2 py-1 rounded-md text-[11px] border border-[#2e2e2e]">
            <button
              onClick={cycleCover}
              className="text-[#9b9b9b] hover:text-white transition flex items-center gap-1"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Change cover</span>
            </button>
            <span className="text-[#444444]">|</span>
            <button
              onClick={() => setCurrentCover(null)}
              className="text-[#9b9b9b] hover:text-rose-400 transition"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <div className={`max-w-5xl mx-auto px-8 ${currentCover ? '-mt-7' : 'pt-10'} space-y-3`}>
        {/* Hover Controls (if no cover) */}
        {!currentCover && (
          <div className="flex items-center gap-2 opacity-0 hover:opacity-100 transition text-[11px] text-[#787774] pb-1">
            <button
              onClick={cycleCover}
              className="hover:text-white flex items-center gap-1 transition"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Add cover</span>
            </button>
          </div>
        )}

        {/* Emoji Icon */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl hover:bg-[#252525] transition cursor-pointer select-none bg-[#1e1e1e] border border-[#2e2e2e] shadow-sm"
            title="Change icon"
          >
            {emoji}
          </button>

          {/* Emoji Picker Modal */}
          {showEmojiPicker && (
            <div className="absolute left-0 top-16 z-50 p-3 bg-[#202020] border border-[#2e2e2e] rounded-xl shadow-2xl w-64 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#787774] flex items-center justify-between">
                <span>Select Emoji</span>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="text-[#787774] hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-6 gap-1 pt-1">
                {COMMON_EMOJIS.map((em) => (
                  <button
                    key={em}
                    onClick={() => handleSelectEmoji(em)}
                    className="w-8 h-8 rounded hover:bg-[#2c2c2c] flex items-center justify-center text-lg transition"
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Page Title */}
        <div className="space-y-1">
          {category && (
            <div className="text-[11px] uppercase tracking-wider font-semibold text-[#787774]">
              {category}
            </div>
          )}

          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
              className="text-3xl font-extrabold text-white bg-transparent border-b border-[#3e3e3e] outline-none w-full tracking-tight"
            />
          ) : (
            <h1
              onClick={() => onTitleChange && setIsEditingTitle(true)}
              className={`text-3xl font-extrabold text-white tracking-tight ${
                onTitleChange ? 'hover:bg-[#202020] rounded px-1 -mx-1 cursor-text transition' : ''
              }`}
            >
              {title}
            </h1>
          )}

          {description && (
            <p className="text-xs text-[#9b9b9b] leading-relaxed max-w-3xl pt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
