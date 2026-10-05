import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MousePointer,
  Pencil,
  Highlighter,
  Square,
  Circle,
  Diamond,
  ArrowUpRight,
  Minus,
  StickyNote,
  Type,
  Eraser,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  Sparkles,
  Layers,
  Copy,
  Lock,
  Unlock,
  Move,
  Info,
  Frame,
  Smile,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Share2,
  Check,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';

export type ToolType =
  | 'select'
  | 'hand'
  | 'sticky'
  | 'text'
  | 'pen'
  | 'highlighter'
  | 'rectangle'
  | 'circle'
  | 'diamond'
  | 'frame'
  | 'arrow'
  | 'line'
  | 'eraser';

export interface CanvasElement {
  id: string;
  type:
    | 'path'
    | 'highlighter'
    | 'sticky'
    | 'text'
    | 'rectangle'
    | 'circle'
    | 'diamond'
    | 'frame'
    | 'arrow'
    | 'line'
    | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: { x: number; y: number }[];
  text?: string;
  color: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth: number;
  strokeDash?: number[];
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  locked?: boolean;
  imageUrl?: string;
  frameTitle?: string;
}

const STICKY_COLORS = [
  { name: 'Yellow', bg: '#fef08a', text: '#713f12', border: '#facc15' },
  { name: 'Peach', bg: '#ffedd5', text: '#7c2d12', border: '#fb923c' },
  { name: 'Pink', bg: '#fce7f3', text: '#831843', border: '#f472b6' },
  { name: 'Blue', bg: '#e0f2fe', text: '#0369a1', border: '#38bdf8' },
  { name: 'Mint Green', bg: '#dcfce7', text: '#15803d', border: '#4ade80' },
  { name: 'Lavender', bg: '#f3e8ff', text: '#6b21a8', border: '#c084fc' },
  { name: 'Pure White', bg: '#ffffff', text: '#1e293b', border: '#cbd5e1' },
];

const PRESET_STROKE_COLORS = [
  '#0f172a', // Slate 900
  '#4f46e5', // Indigo
  '#2563eb', // Blue
  '#0891b2', // Cyan
  '#16a34a', // Emerald
  '#ea580c', // Orange
  '#dc2626', // Red
  '#d946ef', // Fuchsia
  '#9333ea', // Purple
  '#64748b', // Slate 500
];

const TEMPLATES = [
  {
    id: 'user-journey',
    name: 'TCG Buylist Funnel',
    desc: 'Player trade-in to Shopify listing',
  },
  {
    id: 'lean-canvas',
    name: 'SaaS Strategic Matrix',
    desc: 'Problem, Solution, Value Proposition',
  },
  {
    id: 'kanban-whiteboard',
    name: 'Brainstorm Swimlanes',
    desc: 'To Do, In Progress, Shipped',
  },
];

const INITIAL_BOARD: CanvasElement[] = [
  {
    id: 'frame-1',
    type: 'frame',
    x: 80,
    y: 60,
    width: 820,
    height: 480,
    frameTitle: '🚀 Milestone 1: 0% GMV Buylist Wedge',
    color: '#6366f1',
    strokeColor: '#cbd5e1',
    fillColor: '#f8fafc',
    strokeWidth: 2,
    strokeDash: [6, 6],
  },
  {
    id: 'sticky-1',
    type: 'sticky',
    x: 120,
    y: 130,
    width: 210,
    height: 160,
    text: "💡 Value Proposition\n\nKill BinderPOS's 2.5% GMV tax. Save stores $2,000/mo immediately.",
    color: '#fef08a',
    strokeWidth: 2,
    fontSize: 14,
  },
  {
    id: 'sticky-2',
    type: 'sticky',
    x: 370,
    y: 130,
    width: 210,
    height: 160,
    text: "⚡ Core Kiosk Flow\n\nCustomer inputs card list on in-store tablet. Clerk reviews in 60s.",
    color: '#e0f2fe',
    strokeWidth: 2,
    fontSize: 14,
  },
  {
    id: 'sticky-3',
    type: 'sticky',
    x: 620,
    y: 130,
    width: 210,
    height: 160,
    text: "🎯 Instant Liquidity\n\nCards sync to Shopify webstore instantly (<500ms) with zero latency.",
    color: '#dcfce7',
    strokeWidth: 2,
    fontSize: 14,
  },
  {
    id: 'rect-1',
    type: 'rectangle',
    x: 120,
    y: 340,
    width: 200,
    height: 80,
    text: '🏪 Customer Tablet Kiosk',
    color: '#4f46e5',
    fillColor: '#eef2ff',
    strokeColor: '#6366f1',
    strokeWidth: 2,
  },
  {
    id: 'arrow-1',
    type: 'arrow',
    x: 330,
    y: 380,
    width: 90,
    height: 0,
    color: '#4f46e5',
    strokeColor: '#4f46e5',
    strokeWidth: 2.5,
  },
  {
    id: 'diamond-1',
    type: 'diamond',
    x: 430,
    y: 330,
    width: 140,
    height: 100,
    text: 'Clerk Verify?',
    color: '#ea580c',
    fillColor: '#fff7ed',
    strokeColor: '#ea580c',
    strokeWidth: 2,
  },
  {
    id: 'arrow-2',
    type: 'arrow',
    x: 580,
    y: 380,
    width: 90,
    height: 0,
    color: '#16a34a',
    strokeColor: '#16a34a',
    strokeWidth: 2.5,
  },
  {
    id: 'rect-2',
    type: 'rectangle',
    x: 680,
    y: 340,
    width: 200,
    height: 80,
    text: '🛍️ Live on Shopify Store',
    color: '#16a34a',
    fillColor: '#f0fdf4',
    strokeColor: '#22c55e',
    strokeWidth: 2,
  },
];

export const WhiteboardView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Viewport
  const [scale, setScale] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Tools & Styling
  const [tool, setTool] = useState<ToolType>('select');
  const [selectedColor, setSelectedColor] = useState<string>('#4f46e5');
  const [selectedStickyColor, setSelectedStickyColor] = useState(STICKY_COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState<number>(2.5);
  const [strokeDashType, setStrokeDashType] = useState<'solid' | 'dashed'>('solid');
  const [fillColorType, setFillColorType] = useState<'none' | 'light'>('light');
  const [fontSize, setFontSize] = useState<number>(15);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');

  // Elements & History
  const [elements, setElements] = useState<CanvasElement[]>(() => {
    try {
      const saved = localStorage.getItem('aeethod_advanced_whiteboard_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BOARD;
  });

  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Selection & Interactions
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null);
  const [tempShape, setTempShape] = useState<CanvasElement | null>(null);

  // Templates Dropdown
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [copiedLinkFeedback, setCopiedLinkFeedback] = useState(false);

  // Auto-save
  useEffect(() => {
    try {
      localStorage.setItem('aeethod_advanced_whiteboard_v2', JSON.stringify(elements));
    } catch (e) {
      console.error(e);
    }
  }, [elements]);

  const pushHistory = useCallback(
    (newElements: CanvasElement[]) => {
      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        return [...next, newElements];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const undo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setElements(history[nextIndex]);
      setHistoryIndex(nextIndex);
      setSelectedId(null);
    } else if (historyIndex === 0) {
      setElements(INITIAL_BOARD);
      setHistoryIndex(-1);
      setSelectedId(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setElements(history[nextIndex]);
      setHistoryIndex(nextIndex);
      setSelectedId(null);
    }
  };

  const toWorldCoords = useCallback(
    (screenX: number, screenY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const x = (screenX - rect.left - pan.x) / scale;
      const y = (screenY - rect.top - pan.y) / scale;
      return { x, y };
    },
    [pan, scale]
  );

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement?.getBoundingClientRect();
    const width = rect?.width || window.innerWidth;
    const height = rect?.height || window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Pure White Miro Canvas Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);

    // Infinite Miro Dot Grid
    const gridSize = 28;
    const startX = Math.floor((-pan.x / scale) / gridSize) * gridSize - gridSize;
    const endX = startX + width / scale + gridSize * 2;
    const startY = Math.floor((-pan.y / scale) / gridSize) * gridSize - gridSize;
    const endY = startY + height / scale + gridSize * 2;

    ctx.fillStyle = '#cbd5e1';
    for (let x = startX; x < endX; x += gridSize) {
      for (let y = startY; y < endY; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, 1.25, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const allElements = tempShape ? [...elements, tempShape] : elements;

    // Render elements (Frames first, then paths and shapes)
    const sortedElements = [...allElements].sort((a, b) => {
      if (a.type === 'frame' && b.type !== 'frame') return -1;
      if (a.type !== 'frame' && b.type === 'frame') return 1;
      return 0;
    });

    sortedElements.forEach((el) => {
      ctx.save();
      const isSelected = el.id === selectedId;

      switch (el.type) {
        case 'frame': {
          const w = el.width || 400;
          const h = el.height || 300;
          ctx.fillStyle = el.fillColor || '#f8fafc';
          ctx.fillRect(el.x, el.y, w, h);

          ctx.strokeStyle = el.strokeColor || '#94a3b8';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(el.x, el.y, w, h);
          ctx.setLineDash([]);

          // Frame Title bar
          ctx.fillStyle = '#475569';
          ctx.font = '600 13px system-ui, -apple-system, sans-serif';
          ctx.fillText(el.frameTitle || 'Frame', el.x + 8, el.y - 8);
          break;
        }

        case 'path':
        case 'highlighter': {
          if (!el.points || el.points.length === 0) break;
          ctx.beginPath();
          ctx.strokeStyle = el.color;
          ctx.lineWidth = el.type === 'highlighter' ? el.strokeWidth * 3.5 : el.strokeWidth;
          ctx.globalAlpha = el.type === 'highlighter' ? 0.35 : el.opacity || 1;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.moveTo(el.points[0].x, el.points[0].y);
          for (let i = 1; i < el.points.length; i++) {
            ctx.lineTo(el.points[i].x, el.points[i].y);
          }
          ctx.stroke();
          break;
        }

        case 'sticky': {
          const w = el.width || 210;
          const h = el.height || 160;

          // Soft Miro drop shadow
          ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
          ctx.shadowBlur = 14;
          ctx.shadowOffsetY = 6;

          ctx.fillStyle = el.color || '#fef08a';
          ctx.beginPath();
          ctx.roundRect(el.x, el.y, w, h, 8);
          ctx.fill();

          ctx.shadowColor = 'transparent';

          if (isSelected) {
            ctx.strokeStyle = '#4f46e5';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(el.x - 3, el.y - 3, w + 6, h + 6, 10);
            ctx.stroke();
          }

          if (el.text && editingId !== el.id) {
            ctx.fillStyle = '#1e293b';
            ctx.font = `500 ${el.fontSize || 14}px system-ui, -apple-system, sans-serif`;
            const lines = el.text.split('\n');
            let textY = el.y + 24;
            const maxWidth = w - 24;

            for (const line of lines) {
              const words = line.split(' ');
              let curLine = '';
              for (const word of words) {
                const testLine = curLine ? `${curLine} ${word}` : word;
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && curLine) {
                  ctx.fillText(curLine, el.x + 14, textY);
                  curLine = word;
                  textY += (el.fontSize || 14) * 1.35;
                } else {
                  curLine = testLine;
                }
              }
              if (curLine) {
                ctx.fillText(curLine, el.x + 14, textY);
                textY += (el.fontSize || 14) * 1.35;
              }
            }
          }
          break;
        }

        case 'rectangle': {
          const w = el.width || 120;
          const h = el.height || 80;

          if (el.fillColor) {
            ctx.fillStyle = el.fillColor;
            ctx.beginPath();
            ctx.roundRect(el.x, el.y, w, h, 8);
            ctx.fill();
          }

          ctx.strokeStyle = el.strokeColor || el.color;
          ctx.lineWidth = el.strokeWidth;
          if (el.strokeDash) ctx.setLineDash(el.strokeDash);
          ctx.beginPath();
          ctx.roundRect(el.x, el.y, w, h, 8);
          ctx.stroke();
          ctx.setLineDash([]);

          if (isSelected) {
            ctx.strokeStyle = '#4f46e5';
            ctx.lineWidth = 2;
            ctx.strokeRect(el.x - 4, el.y - 4, w + 8, h + 8);
          }

          if (el.text && editingId !== el.id) {
            ctx.fillStyle = '#0f172a';
            ctx.font = `${el.fontWeight || '600'} ${el.fontSize || 14}px system-ui, sans-serif`;
            ctx.textAlign = el.textAlign || 'center';
            ctx.textBaseline = 'middle';
            const lines = el.text.split('\n');
            const lineHeight = 19;
            const startTextY = el.y + h / 2 - ((lines.length - 1) * lineHeight) / 2;
            const textPosX =
              el.textAlign === 'left' ? el.x + 12 : el.textAlign === 'right' ? el.x + w - 12 : el.x + w / 2;

            lines.forEach((line, idx) => {
              ctx.fillText(line, textPosX, startTextY + idx * lineHeight);
            });
            ctx.textAlign = 'start';
            ctx.textBaseline = 'alphabetic';
          }
          break;
        }

        case 'circle': {
          const rx = Math.abs(el.width || 90) / 2;
          const ry = Math.abs(el.height || 90) / 2;
          const cx = el.x + rx;
          const cy = el.y + ry;

          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);

          if (el.fillColor) {
            ctx.fillStyle = el.fillColor;
            ctx.fill();
          }

          ctx.strokeStyle = el.strokeColor || el.color;
          ctx.lineWidth = el.strokeWidth;
          ctx.stroke();

          if (isSelected) {
            ctx.strokeStyle = '#4f46e5';
            ctx.lineWidth = 2;
            ctx.strokeRect(el.x - 4, el.y - 4, (el.width || 90) + 8, (el.height || 90) + 8);
          }

          if (el.text && editingId !== el.id) {
            ctx.fillStyle = '#0f172a';
            ctx.font = `600 ${el.fontSize || 13}px system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(el.text, cx, cy);
            ctx.textAlign = 'start';
            ctx.textBaseline = 'alphabetic';
          }
          break;
        }

        case 'diamond': {
          const w = el.width || 120;
          const h = el.height || 100;
          const cx = el.x + w / 2;
          const cy = el.y + h / 2;

          ctx.beginPath();
          ctx.moveTo(cx, el.y);
          ctx.lineTo(el.x + w, cy);
          ctx.lineTo(cx, el.y + h);
          ctx.lineTo(el.x, cy);
          ctx.closePath();

          if (el.fillColor) {
            ctx.fillStyle = el.fillColor;
            ctx.fill();
          }

          ctx.strokeStyle = el.strokeColor || el.color;
          ctx.lineWidth = el.strokeWidth;
          ctx.stroke();

          if (isSelected) {
            ctx.strokeStyle = '#4f46e5';
            ctx.lineWidth = 2;
            ctx.strokeRect(el.x - 4, el.y - 4, w + 8, h + 8);
          }

          if (el.text && editingId !== el.id) {
            ctx.fillStyle = '#0f172a';
            ctx.font = `600 13px system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(el.text, cx, cy);
            ctx.textAlign = 'start';
            ctx.textBaseline = 'alphabetic';
          }
          break;
        }

        case 'arrow':
        case 'line': {
          const tox = el.x + (el.width || 100);
          const toy = el.y + (el.height || 0);

          ctx.strokeStyle = el.strokeColor || el.color;
          ctx.lineWidth = el.strokeWidth;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(el.x, el.y);
          ctx.lineTo(tox, toy);
          ctx.stroke();

          if (el.type === 'arrow') {
            const angle = Math.atan2(toy - el.y, tox - el.x);
            const headlen = 13;
            ctx.fillStyle = el.strokeColor || el.color;
            ctx.beginPath();
            ctx.moveTo(tox, toy);
            ctx.lineTo(
              tox - headlen * Math.cos(angle - Math.PI / 6),
              toy - headlen * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              tox - headlen * Math.cos(angle + Math.PI / 6),
              toy - headlen * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fill();
          }

          if (isSelected) {
            ctx.strokeStyle = '#4f46e5';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(
              Math.min(el.x, tox) - 6,
              Math.min(el.y, toy) - 6,
              Math.abs(el.width || 100) + 12,
              Math.abs(el.height || 0) + 12
            );
          }
          break;
        }

        case 'text': {
          if (editingId === el.id) break;
          ctx.fillStyle = el.color || '#0f172a';
          ctx.font = `${el.fontStyle || 'normal'} ${el.fontWeight || '500'} ${
            el.fontSize || 16
          }px system-ui, sans-serif`;
          ctx.fillText(el.text || 'Text', el.x, el.y + (el.fontSize || 16));

          if (isSelected) {
            const metrics = ctx.measureText(el.text || 'Text');
            ctx.strokeStyle = '#4f46e5';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 3]);
            ctx.strokeRect(el.x - 4, el.y, metrics.width + 8, (el.fontSize || 16) * 1.4);
            ctx.setLineDash([]);
          }
          break;
        }
      }
      ctx.restore();
    });

    // Active live stroke
    if (currentStroke.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = tool === 'highlighter' ? strokeWidth * 3.5 : strokeWidth;
      ctx.globalAlpha = tool === 'highlighter' ? 0.35 : 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }, [
    elements,
    pan,
    scale,
    selectedId,
    tempShape,
    currentStroke,
    selectedColor,
    strokeWidth,
    editingId,
    tool,
  ]);

  // Click & Hit Detection
  const getElementAt = (x: number, y: number): CanvasElement | null => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (el.locked) continue;
      if (el.type === 'sticky' || el.type === 'rectangle' || el.type === 'frame') {
        const w = el.width || 200;
        const h = el.height || 140;
        if (x >= el.x && x <= el.x + w && y >= el.y && y <= el.y + h) {
          // If frame, only select if clicked near title top bar or frame is small
          if (el.type === 'frame' && y > el.y + 36 && w > 400) continue;
          return el;
        }
      } else if (el.type === 'diamond') {
        const w = el.width || 120;
        const h = el.height || 100;
        if (x >= el.x && x <= el.x + w && y >= el.y && y <= el.y + h) return el;
      } else if (el.type === 'circle') {
        const rx = Math.abs(el.width || 90) / 2;
        const ry = Math.abs(el.height || 90) / 2;
        const cx = el.x + rx;
        const cy = el.y + ry;
        const dist = Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2);
        if (dist <= 1) return el;
      } else if (el.type === 'text') {
        const w = el.width || 200;
        const h = (el.fontSize || 16) * 1.5;
        if (x >= el.x && x <= el.x + w && y >= el.y && y <= el.y + h) return el;
      } else if (el.type === 'arrow' || el.type === 'line') {
        const tox = el.x + (el.width || 100);
        const toy = el.y + (el.height || 0);
        const minX = Math.min(el.x, tox) - 8;
        const maxX = Math.max(el.x, tox) + 8;
        const minY = Math.min(el.y, toy) - 8;
        const maxY = Math.max(el.y, toy) + 8;
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) return el;
      }
    }
    return null;
  };

  // Mouse Interactions
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1 || tool === 'hand' || e.altKey || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    const { x, y } = toWorldCoords(e.clientX, e.clientY);

    if (tool === 'select') {
      const clicked = getElementAt(x, y);
      if (clicked) {
        setSelectedId(clicked.id);
        setIsDrawing(true);
        setDragOffset({ x: x - clicked.x, y: y - clicked.y });
      } else {
        setSelectedId(null);
        setIsPanning(true);
        setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    } else if (tool === 'pen' || tool === 'highlighter') {
      setIsDrawing(true);
      setCurrentStroke([{ x, y }]);
    } else if (tool === 'eraser') {
      const clicked = getElementAt(x, y);
      if (clicked) {
        const next = elements.filter((el) => el.id !== clicked.id);
        setElements(next);
        pushHistory(next);
      }
    } else if (tool === 'sticky') {
      const newSticky: CanvasElement = {
        id: `sticky-${Date.now()}`,
        type: 'sticky',
        x: x - 105,
        y: y - 80,
        width: 210,
        height: 160,
        text: 'New sticky...',
        color: selectedStickyColor.bg,
        strokeWidth: 2,
        fontSize: 14,
      };
      const next = [...elements, newSticky];
      setElements(next);
      pushHistory(next);
      setSelectedId(newSticky.id);
      setEditingId(newSticky.id);
      setEditingText('New sticky...');
      setTool('select');
    } else if (tool === 'text') {
      const newText: CanvasElement = {
        id: `text-${Date.now()}`,
        type: 'text',
        x,
        y,
        width: 200,
        height: 40,
        text: 'Heading / Note',
        color: selectedColor,
        strokeWidth: 1,
        fontSize: fontSize,
      };
      const next = [...elements, newText];
      setElements(next);
      pushHistory(next);
      setSelectedId(newText.id);
      setEditingId(newText.id);
      setEditingText('Heading / Note');
      setTool('select');
    } else if (['rectangle', 'circle', 'diamond', 'frame', 'arrow', 'line'].includes(tool)) {
      setIsDrawing(true);
      setShapeStart({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
      return;
    }

    const { x, y } = toWorldCoords(e.clientX, e.clientY);

    if (tool === 'select' && isDrawing && selectedId) {
      setElements((prev) =>
        prev.map((el) => {
          if (el.id === selectedId) {
            return {
              ...el,
              x: x - dragOffset.x,
              y: y - dragOffset.y,
            };
          }
          return el;
        })
      );
    } else if ((tool === 'pen' || tool === 'highlighter') && isDrawing) {
      setCurrentStroke((prev) => [...prev, { x, y }]);
    } else if (shapeStart && isDrawing) {
      const width = x - shapeStart.x;
      const height = y - shapeStart.y;

      let fill = undefined;
      if (fillColorType === 'light') {
        fill =
          tool === 'rectangle'
            ? `${selectedColor}18`
            : tool === 'circle'
            ? `${selectedColor}15`
            : tool === 'diamond'
            ? `${selectedColor}18`
            : undefined;
      }

      setTempShape({
        id: 'temp-shape',
        type: tool as any,
        x: shapeStart.x,
        y: shapeStart.y,
        width,
        height,
        color: selectedColor,
        strokeColor: selectedColor,
        fillColor: tool === 'frame' ? '#f8fafc' : fill,
        frameTitle: tool === 'frame' ? 'New Frame' : undefined,
        strokeWidth,
        strokeDash: strokeDashType === 'dashed' ? [6, 6] : undefined,
      });
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (tool === 'select' && isDrawing) {
      setIsDrawing(false);
      pushHistory(elements);
    } else if ((tool === 'pen' || tool === 'highlighter') && isDrawing) {
      setIsDrawing(false);
      if (currentStroke.length > 1) {
        const newPath: CanvasElement = {
          id: `path-${Date.now()}`,
          type: tool === 'highlighter' ? 'highlighter' : 'path',
          x: 0,
          y: 0,
          points: currentStroke,
          color: selectedColor,
          strokeWidth,
        };
        const next = [...elements, newPath];
        setElements(next);
        pushHistory(next);
      }
      setCurrentStroke([]);
    } else if (shapeStart && tempShape) {
      setIsDrawing(false);
      const newEl: CanvasElement = {
        ...tempShape,
        id: `shape-${Date.now()}`,
      };
      const next = [...elements, newEl];
      setElements(next);
      pushHistory(next);
      setShapeStart(null);
      setTempShape(null);
      setSelectedId(newEl.id);
      setTool('select');
    }
  };

  // Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.08;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
    newScale = Math.min(Math.max(0.2, newScale), 4);

    const newPanX = mouseX - (mouseX - pan.x) * (newScale / scale);
    const newPanY = mouseY - (mouseY - pan.y) * (newScale / scale);

    setScale(newScale);
    setPan({ x: newPanX, y: newPanY });
  };

  // Double Click inline text edit
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = toWorldCoords(e.clientX, e.clientY);
    const clicked = getElementAt(x, y);
    if (clicked && ['sticky', 'text', 'rectangle', 'circle', 'diamond'].includes(clicked.type)) {
      setSelectedId(clicked.id);
      setEditingId(clicked.id);
      setEditingText(clicked.text || '');
    } else {
      // Spawn new sticky on empty double-click
      const newSticky: CanvasElement = {
        id: `sticky-${Date.now()}`,
        type: 'sticky',
        x: x - 105,
        y: y - 80,
        width: 210,
        height: 160,
        text: '',
        color: selectedStickyColor.bg,
        strokeWidth: 2,
        fontSize: 14,
      };
      const next = [...elements, newSticky];
      setElements(next);
      pushHistory(next);
      setSelectedId(newSticky.id);
      setEditingId(newSticky.id);
      setEditingText('');
    }
  };

  const handleFinishEditing = () => {
    if (editingId) {
      const next = elements.map((el) => {
        if (el.id === editingId) {
          return { ...el, text: editingText };
        }
        return el;
      });
      setElements(next);
      pushHistory(next);
      setEditingId(null);
    }
  };

  // Duplicate Selected Element (Ctrl+D)
  const duplicateSelected = () => {
    const active = elements.find((el) => el.id === selectedId);
    if (!active) return;
    const copy: CanvasElement = {
      ...active,
      id: `${active.type}-${Date.now()}`,
      x: active.x + 30,
      y: active.y + 30,
    };
    const next = [...elements, copy];
    setElements(next);
    pushHistory(next);
    setSelectedId(copy.id);
  };

  // Toggle Lock
  const toggleLockSelected = () => {
    if (!selectedId) return;
    const next = elements.map((el) =>
      el.id === selectedId ? { ...el, locked: !el.locked } : el
    );
    setElements(next);
    pushHistory(next);
  };

  // Delete
  const handleDeleteSelected = () => {
    if (selectedId) {
      const next = elements.filter((el) => el.id !== selectedId);
      setElements(next);
      pushHistory(next);
      setSelectedId(null);
      setEditingId(null);
    }
  };

  // Load Template
  const loadTemplate = (templateId: string) => {
    if (templateId === 'user-journey') {
      setElements(INITIAL_BOARD);
      pushHistory(INITIAL_BOARD);
    } else if (templateId === 'lean-canvas') {
      const lean: CanvasElement[] = [
        {
          id: 'lean-frame',
          type: 'frame',
          x: 60,
          y: 60,
          width: 900,
          height: 480,
          frameTitle: '📊 Lean Strategy Canvas',
          color: '#6366f1',
          fillColor: '#fafaf9',
          strokeWidth: 1.5,
          strokeDash: [4, 4],
        },
        {
          id: 'lean-col-1',
          type: 'rectangle',
          x: 90,
          y: 110,
          width: 260,
          height: 400,
          color: '#ef4444',
          fillColor: '#fef2f2',
          strokeColor: '#f87171',
          strokeWidth: 2,
          text: '🚨 Problems\n• 2.5% GMV commission tax\n• Manual 40m buylist intake\n• Inaccurate card pricing',
          textAlign: 'left',
        },
        {
          id: 'lean-col-2',
          type: 'rectangle',
          x: 380,
          y: 110,
          width: 260,
          height: 400,
          color: '#3b82f6',
          fillColor: '#eff6ff',
          strokeColor: '#60a5fa',
          strokeWidth: 2,
          text: '💡 Solutions\n• 0% GMV flat SaaS\n• Self-serve Player Kiosk\n• Real-time TCGplayer feeds',
          textAlign: 'left',
        },
        {
          id: 'lean-col-3',
          type: 'rectangle',
          x: 670,
          y: 110,
          width: 260,
          height: 400,
          color: '#10b981',
          fillColor: '#ecfdf5',
          strokeColor: '#34d399',
          strokeWidth: 2,
          text: '🏆 Unfair Advantage\n• <500ms Shopify sync\n• Double-entry credit ledger\n• Zero catalog desync',
          textAlign: 'left',
        },
      ];
      setElements(lean);
      pushHistory(lean);
    } else if (templateId === 'kanban-whiteboard') {
      const kanban: CanvasElement[] = [
        {
          id: 'kb-col-1',
          type: 'rectangle',
          x: 80,
          y: 80,
          width: 260,
          height: 460,
          color: '#64748b',
          fillColor: '#f8fafc',
          strokeColor: '#cbd5e1',
          strokeWidth: 2,
          text: '📋 TO DO (Backlog)',
          textAlign: 'center',
        },
        {
          id: 'kb-col-2',
          type: 'rectangle',
          x: 370,
          y: 80,
          width: 260,
          height: 460,
          color: '#f59e0b',
          fillColor: '#fffbeb',
          strokeColor: '#fcd34d',
          strokeWidth: 2,
          text: '⚡ IN PROGRESS',
          textAlign: 'center',
        },
        {
          id: 'kb-col-3',
          type: 'rectangle',
          x: 660,
          y: 80,
          width: 260,
          height: 460,
          color: '#10b981',
          fillColor: '#f0fdf4',
          strokeColor: '#86efac',
          strokeWidth: 2,
          text: '✅ DONE / SHIPPED',
          textAlign: 'center',
        },
        {
          id: 'kb-sticky-1',
          type: 'sticky',
          x: 105,
          y: 140,
          width: 210,
          height: 120,
          color: '#fef08a',
          text: 'Buylist condition tier pricing (NM, LP, MP)',
          strokeWidth: 2,
        },
        {
          id: 'kb-sticky-2',
          type: 'sticky',
          x: 395,
          y: 140,
          width: 210,
          height: 120,
          color: '#bfdbfe',
          text: 'Shopify Webhook sync test runner',
          strokeWidth: 2,
        },
        {
          id: 'kb-sticky-3',
          type: 'sticky',
          x: 685,
          y: 140,
          width: 210,
          height: 120,
          color: '#bbf7d0',
          text: 'Economics & WTP competitor matrix',
          strokeWidth: 2,
        },
      ];
      setElements(kanban);
      pushHistory(kanban);
    }
    setTemplatesOpen(false);
  };

  // Export PNG
  const exportAsPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `aeethod-board-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingId) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          e.preventDefault();
          handleDeleteSelected();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        duplicateSelected();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      if (e.key === 'v' || e.key === 'V') setTool('select');
      if (e.key === 'h' || e.key === 'H') setTool('hand');
      if (e.key === 'p' || e.key === 'P') setTool('pen');
      if (e.key === 's' || e.key === 'S') setTool('sticky');
      if (e.key === 't' || e.key === 'T') setTool('text');
      if (e.key === 'r' || e.key === 'R') setTool('rectangle');
      if (e.key === 'c' || e.key === 'C') setTool('circle');
      if (e.key === 'a' || e.key === 'A') setTool('arrow');
      if (e.key === 'e' || e.key === 'E') setTool('eraser');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, editingId, elements, historyIndex]);

  const activeSelected = elements.find((el) => el.id === selectedId);

  return (
    <div className="relative w-full h-[calc(100vh-45px)] overflow-hidden bg-white select-none flex flex-col font-sans">
      {/* 1. TOP HEADER TOOLBAR (Miro Style) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3.5 py-2 rounded-2xl shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-2.5 pr-3 border-r border-slate-200">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            🎨
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Aeethod Miro Board</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-600 font-semibold border border-indigo-200/60 font-mono">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-normal">Infinite Miro Canvas</p>
          </div>
        </div>

        {/* Templates Selector */}
        <div className="relative">
          <button
            onClick={() => setTemplatesOpen(!templatesOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 text-xs font-medium transition"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
            <span>Templates</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {templatesOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-40 space-y-1">
              <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Miro Board Starters
              </div>
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => loadTemplate(tmpl.id)}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-indigo-50/70 group transition"
                >
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600">
                    {tmpl.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{tmpl.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 px-2 border-l border-slate-200">
          <button
            onClick={() => setScale((s) => Math.max(0.2, s - 0.15))}
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-700 min-w-[38px] text-center font-medium">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(4, s + 0.15))}
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setScale(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            title="Reset View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Share / Export */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
          <button
            onClick={exportAsPng}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              setCopiedLinkFeedback(true);
              setTimeout(() => setCopiedLinkFeedback(false), 2000);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
            title="Copy board link"
          >
            {copiedLinkFeedback ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* 2. LEFT MIRO TOOLBAR (Floating Vertical Dock) */}
      <div className="absolute top-24 left-4 z-20 flex flex-col gap-1 bg-white/95 backdrop-blur-md border border-slate-200/90 p-1.5 rounded-2xl shadow-xl shadow-slate-200/50">
        <button
          onClick={() => setTool('select')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'select'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
          title="Select & Move (V)"
        >
          <MousePointer className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('hand')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'hand'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
          title="Pan / Hand Tool (H)"
        >
          <Move className="w-4 h-4" />
        </button>

        <div className="h-[1px] bg-slate-200 my-0.5" />

        <button
          onClick={() => setTool('sticky')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'sticky'
              ? 'bg-amber-400 text-amber-950 font-bold shadow-md shadow-amber-400/30'
              : 'text-amber-600 hover:bg-amber-50'
          }`}
          title="Miro Sticky Note (S)"
        >
          <StickyNote className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('text')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'text'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
          title="Text Box (T)"
        >
          <Type className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('frame')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'frame'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
          title="Miro Frame Container (F)"
        >
          <Frame className="w-4 h-4" />
        </button>

        <div className="h-[1px] bg-slate-200 my-0.5" />

        <button
          onClick={() => setTool('pen')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'pen'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
          title="Pen / Pencil (P)"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('highlighter')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'highlighter'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
          title="Highlighter Tool"
        >
          <Highlighter className="w-4 h-4" />
        </button>

        <div className="h-[1px] bg-slate-200 my-0.5" />

        <button
          onClick={() => setTool('rectangle')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'rectangle'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
          title="Rectangle Card (R)"
        >
          <Square className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('circle')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'circle'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
          title="Circle / Node (C)"
        >
          <Circle className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('diamond')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'diamond'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
          title="Decision Diamond (D)"
        >
          <Diamond className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('arrow')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'arrow'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
          title="Connector Arrow (A)"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('line')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'line'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
          title="Line Connector (L)"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="h-[1px] bg-slate-200 my-0.5" />

        <button
          onClick={() => setTool('eraser')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'eraser'
              ? 'bg-rose-600 text-white'
              : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50'
          }`}
          title="Eraser (E)"
        >
          <Eraser className="w-4 h-4" />
        </button>
      </div>

      {/* 3. CONTEXTUAL FLOATING INSPECTOR (Miro Quick Bar) */}
      {(tool === 'sticky' ||
        tool === 'pen' ||
        tool === 'highlighter' ||
        tool === 'rectangle' ||
        tool === 'circle' ||
        tool === 'diamond' ||
        tool === 'arrow' ||
        tool === 'text' ||
        activeSelected) && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-white/95 backdrop-blur-md border border-slate-200/90 px-4 py-2 rounded-2xl shadow-xl shadow-slate-200/60">
          {/* Sticky Pastel Color Palette */}
          {(tool === 'sticky' || activeSelected?.type === 'sticky') && (
            <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium">Sticky:</span>
              <div className="flex items-center gap-1">
                {STICKY_COLORS.map((sc) => (
                  <button
                    key={sc.name}
                    onClick={() => {
                      setSelectedStickyColor(sc);
                      if (activeSelected && activeSelected.type === 'sticky') {
                        setElements((prev) =>
                          prev.map((el) =>
                            el.id === activeSelected.id ? { ...el, color: sc.bg } : el
                          )
                        );
                      }
                    }}
                    style={{ backgroundColor: sc.bg }}
                    className={`w-5 h-5 rounded-full border transition ${
                      selectedStickyColor.name === sc.name
                        ? 'border-indigo-600 scale-110 shadow-sm'
                        : 'border-slate-300'
                    }`}
                    title={sc.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stroke Colors */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-medium">Color:</span>
            <div className="flex items-center gap-1">
              {PRESET_STROKE_COLORS.slice(0, 6).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedColor(c);
                    if (activeSelected) {
                      setElements((prev) =>
                        prev.map((el) =>
                          el.id === activeSelected.id
                            ? {
                                ...el,
                                color: c,
                                strokeColor: c,
                                fillColor:
                                  el.type === 'rectangle' || el.type === 'diamond'
                                    ? `${c}18`
                                    : el.fillColor,
                              }
                            : el
                        )
                      );
                    }
                  }}
                  style={{ backgroundColor: c }}
                  className={`w-5 h-5 rounded-full border transition ${
                    selectedColor === c ? 'border-indigo-600 scale-110 shadow-sm' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stroke Width */}
          <div className="flex items-center gap-1.5 pl-2.5 border-l border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">Stroke:</span>
            <div className="flex items-center gap-0.5">
              {[2, 3, 5].map((w) => (
                <button
                  key={w}
                  onClick={() => {
                    setStrokeWidth(w);
                    if (activeSelected) {
                      setElements((prev) =>
                        prev.map((el) => (el.id === activeSelected.id ? { ...el, strokeWidth: w } : el))
                      );
                    }
                  }}
                  className={`px-2 py-0.5 rounded-md text-xs font-mono ${
                    strokeWidth === w
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>

          {/* Stroke Dash Type */}
          {(tool === 'rectangle' ||
            tool === 'line' ||
            tool === 'arrow' ||
            activeSelected?.type === 'rectangle' ||
            activeSelected?.type === 'line' ||
            activeSelected?.type === 'arrow') && (
            <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
              <button
                onClick={() => {
                  setStrokeDashType('solid');
                  if (activeSelected) {
                    setElements((prev) =>
                      prev.map((el) =>
                        el.id === activeSelected.id ? { ...el, strokeDash: undefined } : el
                      )
                    );
                  }
                }}
                className={`px-2 py-0.5 rounded text-xs ${
                  strokeDashType === 'solid'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Solid
              </button>
              <button
                onClick={() => {
                  setStrokeDashType('dashed');
                  if (activeSelected) {
                    setElements((prev) =>
                      prev.map((el) =>
                        el.id === activeSelected.id ? { ...el, strokeDash: [6, 6] } : el
                      )
                    );
                  }
                }}
                className={`px-2 py-0.5 rounded text-xs ${
                  strokeDashType === 'dashed'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Dashed
              </button>
            </div>
          )}

          {/* Duplicate / Lock / Delete */}
          {activeSelected && (
            <div className="flex items-center gap-1 pl-2.5 border-l border-slate-200">
              <button
                onClick={duplicateSelected}
                className="p-1 rounded text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                title="Duplicate (Ctrl+D)"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleLockSelected}
                className="p-1 rounded text-slate-600 hover:text-amber-600 hover:bg-amber-50"
                title={activeSelected.locked ? 'Unlock' : 'Lock element'}
              >
                {activeSelected.locked ? (
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <Unlock className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={handleDeleteSelected}
                className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                title="Delete (Backspace)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. FLOATING TEXT / NOTE INLINE EDITOR */}
      {editingId && (
        <div
          className="absolute z-30"
          style={{
            left: `${((elements.find((e) => e.id === editingId)?.x || 0) * scale + pan.x)}px`,
            top: `${((elements.find((e) => e.id === editingId)?.y || 0) * scale + pan.y)}px`,
            width: `${((elements.find((e) => e.id === editingId)?.width || 210) * scale)}px`,
            height: `${((elements.find((e) => e.id === editingId)?.height || 160) * scale)}px`,
          }}
        >
          <textarea
            autoFocus
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onBlur={handleFinishEditing}
            onKeyDown={(e) => {
              if (e.key === 'Escape') handleFinishEditing();
            }}
            placeholder="Type your notes..."
            className="w-full h-full p-3 bg-white/95 text-slate-900 font-medium rounded-xl border-2 border-indigo-600 shadow-2xl resize-none outline-none"
            style={{
              fontSize: `${Math.max(
                12,
                (elements.find((e) => e.id === editingId)?.fontSize || 14) * scale
              )}px`,
              lineHeight: 1.35,
            }}
          />
        </div>
      )}

      {/* 5. MAIN WHITEBOARD CANVAS */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        className={`w-full h-full flex-1 touch-none ${
          isPanning || tool === 'hand'
            ? 'cursor-grab active:cursor-grabbing'
            : tool === 'select'
            ? 'cursor-default'
            : tool === 'pen' || tool === 'highlighter'
            ? 'cursor-crosshair'
            : tool === 'eraser'
            ? 'cursor-pointer'
            : 'cursor-crosshair'
        }`}
      />

      {/* 6. BOTTOM RIGHT MIRO STATUS BAR */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-slate-200/80 px-3 py-1.5 rounded-xl text-[11px] text-slate-500 shadow-lg shadow-slate-200/40">
        <Info className="w-3.5 h-3.5 text-indigo-600" />
        <span>Double-click to write • Ctrl+D to duplicate • Spacebar to pan • Mouse wheel to zoom</span>
      </div>
    </div>
  );
};
