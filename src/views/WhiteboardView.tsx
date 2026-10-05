import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MousePointer,
  Pencil,
  Square,
  Circle,
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
  FileText,
  Palette,
  Layers,
  ChevronDown,
  Move,
  Info
} from 'lucide-react';

export type ToolType =
  | 'select'
  | 'pen'
  | 'sticky'
  | 'text'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'line'
  | 'eraser';

export interface CanvasElement {
  id: string;
  type: 'path' | 'sticky' | 'text' | 'rectangle' | 'circle' | 'arrow' | 'line';
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: { x: number; y: number }[]; // for pen strokes
  text?: string;
  color: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth: number;
  fontSize?: number;
}

const STICKY_COLORS = [
  { name: 'Yellow', bg: '#fef08a', text: '#713f12', border: '#facc15' },
  { name: 'Pink', bg: '#fbcfe8', text: '#831843', border: '#f472b6' },
  { name: 'Blue', bg: '#bfdbfe', text: '#1e3a8a', border: '#60a5fa' },
  { name: 'Green', bg: '#bbf7d0', text: '#14532d', border: '#4ade80' },
  { name: 'Purple', bg: '#e9d5ff', text: '#581c87', border: '#c084fc' },
  { name: 'Dark Slate', bg: '#1e293b', text: '#f1f5f9', border: '#475569' },
];

const STROKE_COLORS = [
  '#f87171', // red
  '#fb923c', // orange
  '#facc15', // yellow
  '#4ade80', // green
  '#38bdf8', // sky
  '#818cf8', // indigo
  '#c084fc', // purple
  '#f43f5e', // rose
  '#ffffff', // white
  '#94a3b8', // slate
];

const INITIAL_ELEMENTS: CanvasElement[] = [
  {
    id: 'intro-sticky-1',
    type: 'sticky',
    x: 120,
    y: 100,
    width: 220,
    height: 160,
    text: "💡 Strategic Wedge Idea\n\nBuylist Kiosk + Shopify Zero-GMV Tax Sync = High conversion for WPN Premier stores!",
    color: '#fef08a',
    strokeWidth: 2,
    fontSize: 14,
  },
  {
    id: 'intro-sticky-2',
    type: 'sticky',
    x: 400,
    y: 100,
    width: 220,
    height: 160,
    text: "⚡ Core Pain Killer\n\nReplace 35-min manual clerk TCGplayer lookup with a 2-min self-serve player intake tablet.",
    color: '#bfdbfe',
    strokeWidth: 2,
    fontSize: 14,
  },
  {
    id: 'intro-rect-1',
    type: 'rectangle',
    x: 120,
    y: 320,
    width: 260,
    height: 90,
    text: "🏪 In-Store Tablet Kiosk\n(Player inputs collection)",
    color: '#818cf8',
    fillColor: 'rgba(99, 102, 241, 0.15)',
    strokeColor: '#818cf8',
    strokeWidth: 2,
  },
  {
    id: 'intro-arrow-1',
    type: 'arrow',
    x: 390,
    y: 365,
    width: 140,
    height: 0,
    color: '#38bdf8',
    strokeColor: '#38bdf8',
    strokeWidth: 3,
  },
  {
    id: 'intro-rect-2',
    type: 'rectangle',
    x: 540,
    y: 320,
    width: 260,
    height: 90,
    text: "🛍️ Shopify Real-time Catalog\n(Instantly listed with 0% tax)",
    color: '#4ade80',
    fillColor: 'rgba(74, 222, 128, 0.15)',
    strokeColor: '#4ade80',
    strokeWidth: 2,
  },
  {
    id: 'intro-text-1',
    type: 'text',
    x: 120,
    y: 460,
    width: 450,
    height: 50,
    text: "Aeethod OS Miro Canvas • Double-click sticky to edit • Drag to pan with Spacebar",
    color: '#94a3b8',
    strokeWidth: 1,
    fontSize: 14,
  }
];

export const WhiteboardView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas Viewport Transformation
  const [scale, setScale] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Tool State
  const [tool, setTool] = useState<ToolType>('select');
  const [selectedColor, setSelectedColor] = useState<string>('#818cf8');
  const [selectedStickyColor, setSelectedStickyColor] = useState(STICKY_COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [fontSize, setFontSize] = useState<number>(16);

  // History & Elements
  const [elements, setElements] = useState<CanvasElement[]>(() => {
    try {
      const saved = localStorage.getItem('aeethod_whiteboard_elements');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ELEMENTS;
  });

  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Selected Element for Dragging / Editing
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingStickyId, setEditingStickyId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Active interaction (drawing, creating shape, dragging element)
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null);
  const [tempShape, setTempShape] = useState<CanvasElement | null>(null);

  // Auto-save elements to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aeethod_whiteboard_elements', JSON.stringify(elements));
    } catch (e) {
      console.error('Failed to save canvas:', e);
    }
  }, [elements]);

  // Save history state
  const pushHistory = useCallback((newElements: CanvasElement[]) => {
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, newElements];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setElements(history[nextIndex]);
      setHistoryIndex(nextIndex);
      setSelectedId(null);
    } else if (historyIndex === 0) {
      setElements(INITIAL_ELEMENTS);
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

  // Convert Screen Coordinates to World/Canvas Coordinates
  const toWorldCoords = useCallback((screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (screenX - rect.left - pan.x) / scale;
    const y = (screenY - rect.top - pan.y) / scale;
    return { x, y };
  }, [pan, scale]);

  // Redraw Canvas on Every State Change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
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
    ctx.clearRect(0, 0, width, height);

    // Apply Viewport Translation & Scale
    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);

    // Draw Subtle Infinite Grid (Miro-style dots)
    const gridSize = 32;
    const startX = Math.floor((-pan.x / scale) / gridSize) * gridSize - gridSize;
    const endX = startX + (width / scale) + gridSize * 2;
    const startY = Math.floor((-pan.y / scale) / gridSize) * gridSize - gridSize;
    const endY = startY + (height / scale) + gridSize * 2;

    ctx.fillStyle = '#262626';
    for (let x = startX; x < endX; x += gridSize) {
      for (let y = startY; y < endY; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Elements
    const allElements = tempShape ? [...elements, tempShape] : elements;

    allElements.forEach((el) => {
      ctx.save();
      const isSelected = el.id === selectedId;

      switch (el.type) {
        case 'path': {
          if (!el.points || el.points.length === 0) break;
          ctx.beginPath();
          ctx.strokeStyle = el.color;
          ctx.lineWidth = el.strokeWidth;
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
          const w = el.width || 200;
          const h = el.height || 140;

          // Shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 4;

          // Sticky Background
          ctx.fillStyle = el.color || '#fef08a';
          ctx.beginPath();
          ctx.roundRect(el.x, el.y, w, h, 6);
          ctx.fill();

          ctx.shadowColor = 'transparent';

          // Selection border
          if (isSelected) {
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(el.x - 3, el.y - 3, w + 6, h + 6, 8);
            ctx.stroke();
          }

          // Sticky Text
          if (el.text && editingStickyId !== el.id) {
            ctx.fillStyle = '#1c1917'; // dark text on sticky
            ctx.font = `500 ${el.fontSize || 14}px system-ui, -apple-system, sans-serif`;
            const lines = el.text.split('\n');
            let textY = el.y + 24;
            const maxWidth = w - 24;

            for (const line of lines) {
              // Simple word wrap
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
          const w = el.width || 100;
          const h = el.height || 60;

          if (el.fillColor) {
            ctx.fillStyle = el.fillColor;
            ctx.beginPath();
            ctx.roundRect(el.x, el.y, w, h, 6);
            ctx.fill();
          }

          ctx.strokeStyle = el.strokeColor || el.color;
          ctx.lineWidth = el.strokeWidth;
          ctx.beginPath();
          ctx.roundRect(el.x, el.y, w, h, 6);
          ctx.stroke();

          if (isSelected) {
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(el.x - 4, el.y - 4, w + 8, h + 8);
            ctx.setLineDash([]);
          }

          if (el.text) {
            ctx.fillStyle = '#ffffff';
            ctx.font = `600 13px system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const lines = el.text.split('\n');
            const lineHeight = 18;
            const startTextY = el.y + h / 2 - ((lines.length - 1) * lineHeight) / 2;
            lines.forEach((line, idx) => {
              ctx.fillText(line, el.x + w / 2, startTextY + idx * lineHeight);
            });
            ctx.textAlign = 'start';
            ctx.textBaseline = 'alphabetic';
          }
          break;
        }

        case 'circle': {
          const rx = Math.abs(el.width || 80) / 2;
          const ry = Math.abs(el.height || 80) / 2;
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
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(el.x - 4, el.y - 4, (el.width || 80) + 8, (el.height || 80) + 8);
            ctx.setLineDash([]);
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
            const headlen = 14;
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
            ctx.strokeStyle = '#6366f1';
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
          if (editingStickyId === el.id) break;
          ctx.fillStyle = el.color || '#ffffff';
          ctx.font = `500 ${el.fontSize || 16}px system-ui, sans-serif`;
          ctx.fillText(el.text || 'Text', el.x, el.y + (el.fontSize || 16));

          if (isSelected) {
            const metrics = ctx.measureText(el.text || 'Text');
            ctx.strokeStyle = '#6366f1';
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

    // Draw active drawing pen stroke
    if (currentStroke.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = strokeWidth;
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
    editingStickyId,
  ]);

  // Find Element at coordinate
  const getElementAt = (x: number, y: number): CanvasElement | null => {
    // Reverse check so topmost elements get picked first
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (el.type === 'sticky' || el.type === 'rectangle') {
        const w = el.width || 200;
        const h = el.height || 140;
        if (x >= el.x && x <= el.x + w && y >= el.y && y <= el.y + h) {
          return el;
        }
      } else if (el.type === 'circle') {
        const rx = Math.abs(el.width || 80) / 2;
        const ry = Math.abs(el.height || 80) / 2;
        const cx = el.x + rx;
        const cy = el.y + ry;
        const dist = Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2);
        if (dist <= 1) return el;
      } else if (el.type === 'text') {
        const w = el.width || 200;
        const h = (el.fontSize || 16) * 1.5;
        if (x >= el.x && x <= el.x + w && y >= el.y && y <= el.y + h) {
          return el;
        }
      } else if (el.type === 'arrow' || el.type === 'line') {
        const tox = el.x + (el.width || 100);
        const toy = el.y + (el.height || 0);
        const minX = Math.min(el.x, tox) - 8;
        const maxX = Math.max(el.x, tox) + 8;
        const minY = Math.min(el.y, toy) - 8;
        const maxY = Math.max(el.y, toy) + 8;
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
          return el;
        }
      }
    }
    return null;
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Middle click OR Spacebar held down: PAN
    if (e.button === 1 || e.buttons === 4 || e.altKey || (e.button === 0 && e.shiftKey)) {
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
        // Start dragging canvas if clicking empty space
        setIsPanning(true);
        setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    } else if (tool === 'pen') {
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
        x: x - 100,
        y: y - 70,
        width: 200,
        height: 150,
        text: 'New thought...',
        color: selectedStickyColor.bg,
        strokeWidth: 2,
        fontSize: 14,
      };
      const next = [...elements, newSticky];
      setElements(next);
      pushHistory(next);
      setSelectedId(newSticky.id);
      setEditingStickyId(newSticky.id);
      setEditingText('New thought...');
      setTool('select');
    } else if (tool === 'text') {
      const newText: CanvasElement = {
        id: `text-${Date.now()}`,
        type: 'text',
        x,
        y,
        width: 220,
        height: 40,
        text: 'Type your title...',
        color: selectedColor,
        strokeWidth: 1,
        fontSize: fontSize,
      };
      const next = [...elements, newText];
      setElements(next);
      pushHistory(next);
      setSelectedId(newText.id);
      setEditingStickyId(newText.id);
      setEditingText('Type your title...');
      setTool('select');
    } else if (['rectangle', 'circle', 'arrow', 'line'].includes(tool)) {
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
    } else if (tool === 'pen' && isDrawing) {
      setCurrentStroke((prev) => [...prev, { x, y }]);
    } else if (shapeStart && isDrawing) {
      const width = x - shapeStart.x;
      const height = y - shapeStart.y;

      setTempShape({
        id: 'temp-shape',
        type: tool as any,
        x: shapeStart.x,
        y: shapeStart.y,
        width,
        height,
        color: selectedColor,
        strokeColor: selectedColor,
        fillColor: tool === 'rectangle' ? `${selectedColor}22` : undefined,
        strokeWidth,
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
    } else if (tool === 'pen' && isDrawing) {
      setIsDrawing(false);
      if (currentStroke.length > 1) {
        const newPath: CanvasElement = {
          id: `path-${Date.now()}`,
          type: 'path',
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

  // Zoom with Wheel
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

    // Zoom centered around mouse cursor
    const newPanX = mouseX - (mouseX - pan.x) * (newScale / scale);
    const newPanY = mouseY - (mouseY - pan.y) * (newScale / scale);

    setScale(newScale);
    setPan({ x: newPanX, y: newPanY });
  };

  // Double Click to Edit Sticky / Text
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = toWorldCoords(e.clientX, e.clientY);
    const clicked = getElementAt(x, y);
    if (clicked && (clicked.type === 'sticky' || clicked.type === 'text' || clicked.type === 'rectangle')) {
      setSelectedId(clicked.id);
      setEditingStickyId(clicked.id);
      setEditingText(clicked.text || '');
    } else {
      // Double click on empty space spawns a quick sticky
      const newSticky: CanvasElement = {
        id: `sticky-${Date.now()}`,
        type: 'sticky',
        x: x - 100,
        y: y - 70,
        width: 200,
        height: 150,
        text: '',
        color: selectedStickyColor.bg,
        strokeWidth: 2,
        fontSize: 14,
      };
      const next = [...elements, newSticky];
      setElements(next);
      pushHistory(next);
      setSelectedId(newSticky.id);
      setEditingStickyId(newSticky.id);
      setEditingText('');
    }
  };

  const handleFinishEditing = () => {
    if (editingStickyId) {
      const next = elements.map((el) => {
        if (el.id === editingStickyId) {
          return { ...el, text: editingText };
        }
        return el;
      });
      setElements(next);
      pushHistory(next);
      setEditingStickyId(null);
    }
  };

  // Delete Selected Element
  const handleDeleteSelected = () => {
    if (selectedId) {
      const next = elements.filter((el) => el.id !== selectedId);
      setElements(next);
      pushHistory(next);
      setSelectedId(null);
      setEditingStickyId(null);
    }
  };

  // Export Canvas as PNG
  const exportAsPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `aeethod-whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Reset / Clear board
  const clearBoard = () => {
    if (window.confirm('Clear whiteboard canvas?')) {
      setElements([]);
      pushHistory([]);
      setSelectedId(null);
    }
  };

  // Keyboard Delete / Backspace listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingStickyId) return; // Don't delete if actively typing
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          e.preventDefault();
          handleDeleteSelected();
        }
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
      // Quick tools shortcuts
      if (!editingStickyId) {
        if (e.key === 'v' || e.key === 'V') setTool('select');
        if (e.key === 'p' || e.key === 'P') setTool('pen');
        if (e.key === 's' || e.key === 'S') setTool('sticky');
        if (e.key === 't' || e.key === 'T') setTool('text');
        if (e.key === 'r' || e.key === 'R') setTool('rectangle');
        if (e.key === 'c' || e.key === 'C') setTool('circle');
        if (e.key === 'e' || e.key === 'E') setTool('eraser');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, editingStickyId, elements, historyIndex]);

  // Find currently selected element object
  const activeSelectedElement = elements.find((el) => el.id === selectedId);

  return (
    <div className="relative w-full h-[calc(100vh-45px)] overflow-hidden bg-[#18181b] select-none flex flex-col">
      {/* Top Floating Miro-Style Header Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-[#242427]/90 backdrop-blur-md border border-[#3f3f46]/70 px-4 py-2 rounded-xl shadow-2xl">
        <div className="flex items-center gap-2 pr-3 border-r border-[#3f3f46]">
          <span className="text-lg">🎨</span>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Aeethod Studio Whiteboard</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                Miro Mode
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">Collaborative wireframing &amp; buylist architecture</p>
          </div>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 px-2 border-l border-[#3f3f46]">
          <button
            onClick={() => setScale((s) => Math.max(0.2, s - 0.15))}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-zinc-300 min-w-[42px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(4, s + 0.15))}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setScale(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
            title="Reset View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#3f3f46]">
          <button
            onClick={exportAsPng}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>
          <button
            onClick={clearBoard}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Clear Canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Left Miro Toolbox Panel */}
      <div className="absolute top-24 left-4 z-20 flex flex-col gap-1 bg-[#242427]/95 backdrop-blur-md border border-[#3f3f46]/80 p-1.5 rounded-2xl shadow-2xl">
        <button
          onClick={() => setTool('select')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'select'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title="Select & Move (V)"
        >
          <MousePointer className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('sticky')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'sticky'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/30'
              : 'text-amber-300 hover:bg-zinc-800'
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
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title="Text Box (T)"
        >
          <Type className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('pen')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'pen'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title="Pen / Freehand (P)"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <div className="h-[1px] bg-zinc-700/60 my-1" />

        <button
          onClick={() => setTool('rectangle')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'rectangle'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title="Rectangle Box (R)"
        >
          <Square className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('circle')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'circle'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title="Circle / Node (C)"
        >
          <Circle className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('arrow')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'arrow'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
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
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title="Straight Line (L)"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="h-[1px] bg-zinc-700/60 my-1" />

        <button
          onClick={() => setTool('eraser')}
          className={`p-2.5 rounded-xl transition flex items-center justify-center ${
            tool === 'eraser'
              ? 'bg-rose-600 text-white'
              : 'text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30'
          }`}
          title="Eraser (E)"
        >
          <Eraser className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Styling Inspector when Sticky or Pen is selected */}
      {(tool === 'sticky' || tool === 'pen' || tool === 'rectangle' || tool === 'arrow' || activeSelectedElement) && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-[#242427]/95 backdrop-blur-md border border-[#3f3f46]/80 px-4 py-2.5 rounded-2xl shadow-2xl">
          {/* Sticky Color Picker */}
          {(tool === 'sticky' || activeSelectedElement?.type === 'sticky') && (
            <div className="flex items-center gap-1.5 pr-3 border-r border-[#3f3f46]">
              <span className="text-[11px] text-zinc-400 font-medium">Sticky Color:</span>
              <div className="flex items-center gap-1">
                {STICKY_COLORS.map((sc) => (
                  <button
                    key={sc.name}
                    onClick={() => {
                      setSelectedStickyColor(sc);
                      if (activeSelectedElement && activeSelectedElement.type === 'sticky') {
                        setElements((prev) =>
                          prev.map((el) =>
                            el.id === activeSelectedElement.id ? { ...el, color: sc.bg } : el
                          )
                        );
                      }
                    }}
                    style={{ backgroundColor: sc.bg }}
                    className={`w-5 h-5 rounded-full border-2 transition ${
                      selectedStickyColor.name === sc.name ? 'border-indigo-500 scale-110' : 'border-black/30'
                    }`}
                    title={sc.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stroke Colors */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-400 font-medium">Color:</span>
            <div className="flex items-center gap-1">
              {STROKE_COLORS.slice(0, 6).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedColor(c);
                    if (activeSelectedElement) {
                      setElements((prev) =>
                        prev.map((el) =>
                          el.id === activeSelectedElement.id
                            ? { ...el, color: c, strokeColor: c }
                            : el
                        )
                      );
                    }
                  }}
                  style={{ backgroundColor: c }}
                  className={`w-5 h-5 rounded-full border transition ${
                    selectedColor === c ? 'border-white scale-110' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stroke Width */}
          <div className="flex items-center gap-2 pl-3 border-l border-[#3f3f46]">
            <span className="text-[11px] text-zinc-400 font-medium">Size:</span>
            <div className="flex items-center gap-1">
              {[2, 4, 6].map((w) => (
                <button
                  key={w}
                  onClick={() => setStrokeWidth(w)}
                  className={`px-2 py-0.5 rounded text-xs font-mono ${
                    strokeWidth === w ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>

          {/* Delete active element */}
          {activeSelectedElement && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1 pl-3 border-l border-[#3f3f46] text-rose-400 hover:text-rose-300 text-xs font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      )}

      {/* Floating Inline Text Editor for Sticky Note or Text element */}
      {editingStickyId && (
        <div
          className="absolute z-30"
          style={{
            left: `${((elements.find((e) => e.id === editingStickyId)?.x || 0) * scale + pan.x)}px`,
            top: `${((elements.find((e) => e.id === editingStickyId)?.y || 0) * scale + pan.y)}px`,
            width: `${((elements.find((e) => e.id === editingStickyId)?.width || 200) * scale)}px`,
            height: `${((elements.find((e) => e.id === editingStickyId)?.height || 140) * scale)}px`,
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
            placeholder="Write your note..."
            className="w-full h-full p-3 bg-transparent text-zinc-950 font-medium rounded-lg border-2 border-indigo-600 shadow-2xl resize-none outline-none"
            style={{
              fontSize: `${Math.max(12, (elements.find((e) => e.id === editingStickyId)?.fontSize || 14) * scale)}px`,
              lineHeight: 1.35,
            }}
          />
        </div>
      )}

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        className={`w-full h-full flex-1 touch-none ${
          isPanning
            ? 'cursor-grabbing'
            : tool === 'select'
            ? 'cursor-default'
            : tool === 'pen'
            ? 'cursor-crosshair'
            : tool === 'eraser'
            ? 'cursor-pointer'
            : 'cursor-crosshair'
        }`}
      />

      {/* Bottom Right Floating Helper Bar */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-[#202023]/90 backdrop-blur-md border border-[#3f3f46]/70 px-3 py-1.5 rounded-xl text-[11px] text-zinc-400 shadow-lg">
        <Info className="w-3.5 h-3.5 text-indigo-400" />
        <span>Double-click to write • Shift + Drag to Pan • Mouse wheel to Zoom</span>
      </div>
    </div>
  );
};
