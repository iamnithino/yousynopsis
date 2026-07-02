import { ChangeEvent, CSSProperties, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  BarChart3,
  Bold,
  BringToFront,
  Brush,
  Circle,
  Copy,
  Download,
  Droplets,
  FileText,
  Grid2X2,
  Image as ImageIcon,
  Italic,
  LayoutTemplate,
  LineChart,
  Palette,
  Plus,
  RotateCcw,
  SendToBack,
  Shapes,
  Smile,
  Sparkles,
  Table2,
  Trash2,
  Type,
  Underline,
  Upload,
  Video,
  Wand2,
} from 'lucide-react';
import { api } from '../apiService';

type ElementType = 'text' | 'image' | 'shape' | 'table' | 'chart' | 'icon' | 'video';
type ChartType = 'bar' | 'pie' | 'line' | 'area';

interface SlideElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
  fontFamily?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  color?: string;
  fill?: string;
  chartType?: ChartType;
  rows?: string[][];
  imageUrl?: string;
}

interface Slide {
  id: string;
  title: string;
  elements: SlideElement[];
  background?: string;
  notes?: string;
}

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const fonts = ['Inter', 'Arial', 'Georgia', 'Times New Roman', 'Courier New'];
const chartTypes: ChartType[] = ['bar', 'pie', 'line', 'area'];
const templateCategories = ['Business', 'Education', 'Data', 'Marketing', 'Creative', 'Simple', 'Video'] as const;

interface DeckTemplate {
  id: string;
  name: string;
  category: typeof templateCategories[number];
  background: string;
  accent: string;
  layout: 'title' | 'twoColumn' | 'quote' | 'metrics' | 'timeline' | 'imageRight' | 'comparison' | 'section';
}

const palettePresets = [
  { name: 'Slate', bg: '#f8fafc', accent: '#0f172a', text: '#111827' },
  { name: 'Indigo', bg: '#eef2ff', accent: '#4f46e5', text: '#172554' },
  { name: 'Emerald', bg: '#ecfdf5', accent: '#059669', text: '#064e3b' },
  { name: 'Amber', bg: '#fffbeb', accent: '#d97706', text: '#451a03' },
  { name: 'Rose', bg: '#fff1f2', accent: '#e11d48', text: '#4c0519' },
  { name: 'Cyan', bg: '#ecfeff', accent: '#0891b2', text: '#164e63' },
];

const templateNames = [
  ['Executive Brief', 'Business', 'title'], ['Investor Update', 'Business', 'metrics'], ['Board Report', 'Business', 'twoColumn'], ['Strategy Map', 'Business', 'timeline'], ['Sales Review', 'Business', 'metrics'], ['Project Kickoff', 'Business', 'section'], ['Client Proposal', 'Business', 'imageRight'], ['Quarterly Plan', 'Business', 'comparison'],
  ['Lecture Notes', 'Education', 'twoColumn'], ['Course Recap', 'Education', 'title'], ['Research Review', 'Education', 'quote'], ['Class Agenda', 'Education', 'timeline'], ['Study Guide', 'Education', 'section'], ['Workshop Flow', 'Education', 'timeline'], ['Learning Outcomes', 'Education', 'metrics'], ['Thesis Defense', 'Education', 'imageRight'],
  ['Analytics Snapshot', 'Data', 'metrics'], ['KPI Dashboard', 'Data', 'metrics'], ['Market Trends', 'Data', 'line'], ['Data Story', 'Data', 'twoColumn'], ['Survey Findings', 'Data', 'comparison'], ['Experiment Results', 'Data', 'section'], ['Forecast Deck', 'Data', 'timeline'], ['Insight Cards', 'Data', 'quote'],
  ['Campaign Pitch', 'Marketing', 'imageRight'], ['Brand Story', 'Marketing', 'title'], ['Launch Plan', 'Marketing', 'timeline'], ['Social Report', 'Marketing', 'metrics'], ['Audience Persona', 'Marketing', 'twoColumn'], ['Content Calendar', 'Marketing', 'timeline'], ['Growth Review', 'Marketing', 'comparison'], ['Product Narrative', 'Marketing', 'section'],
  ['Portfolio Clean', 'Creative', 'imageRight'], ['Moodboard', 'Creative', 'section'], ['Design Critique', 'Creative', 'twoColumn'], ['Case Study', 'Creative', 'timeline'], ['Visual Essay', 'Creative', 'quote'], ['Creator Pitch', 'Creative', 'title'], ['Story Beats', 'Creative', 'timeline'], ['Showcase', 'Creative', 'imageRight'],
  ['Plain Notes', 'Simple', 'twoColumn'], ['Minimal White', 'Simple', 'title'], ['Clean Agenda', 'Simple', 'timeline'], ['Simple Report', 'Simple', 'section'], ['Reading Summary', 'Simple', 'quote'], ['Decision Memo', 'Simple', 'comparison'], ['One Page Plan', 'Simple', 'metrics'], ['Reference Deck', 'Simple', 'section'],
  ['Video Synopsis', 'Video', 'title'], ['Podcast Breakdown', 'Video', 'twoColumn'], ['Creator Brief', 'Video', 'imageRight'], ['Comparison Review', 'Video', 'comparison'], ['Takeaway Deck', 'Video', 'section'], ['Timestamp Guide', 'Video', 'timeline'], ['Clip Strategy', 'Video', 'metrics'], ['Lesson Extractor', 'Video', 'quote'],
] as const;

const deckTemplates: DeckTemplate[] = templateNames.map(([name, category, layout], index) => {
  const palette = palettePresets[index % palettePresets.length];
  return {
    id: `template-${index + 1}`,
    name,
    category,
    layout: layout === 'line' ? 'metrics' : layout,
    background: palette.bg,
    accent: palette.accent,
  };
});

function createText(content: string, x = 8, y = 8, w = 46, h = 14, fontSize = 26): SlideElement {
  return {
    id: uid(),
    type: 'text',
    x,
    y,
    w,
    h,
    content,
    fontFamily: 'Inter',
    fontSize,
    color: '#111827',
    align: 'left',
  };
}

function readPresentationSeed() {
  const storedSeed = localStorage.getItem('presentation_seed');
  try {
    return storedSeed ? JSON.parse(storedSeed) : null;
  } catch {
    return null;
  }
}

function plainText(value = '') {
  return value.replace(/[#*_>`~-]/g, '').replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      const record = item as Record<string, unknown>;
      return [record.title, record.description, record.summary, record.text].filter(Boolean).join(': ');
    }
    return '';
  }).filter(Boolean);
}

function numbered(items: string[], fallback: string, limit = 5) {
  const lines = items.slice(0, limit).map((item, index) => `${index + 1}. ${plainText(item)}`);
  return lines.length ? lines.join('\n') : fallback;
}

function getPresentationSeedKey() {
  const seed = readPresentationSeed();
  const data = seed?.data || {};
  return seed?.seedId || [
    seed?.type || 'summary',
    data.id,
    data.youtube_url,
    data.title,
    data.combined_summary?.slice?.(0, 80),
    data.summary?.slice?.(0, 80),
  ].filter(Boolean).join('|') || 'default';
}

function createShape(content: string, x: number, y: number, w: number, h: number, fill: string, color = '#ffffff'): SlideElement {
  return { id: uid(), type: 'shape', x, y, w, h, content, fill, color };
}

function createImage(imageUrl: string, x: number, y: number, w: number, h: number): SlideElement {
  return { id: uid(), type: 'image', x, y, w, h, content: 'Video thumbnail', imageUrl };
}

function slidesFromSeed() {
  const seed = readPresentationSeed();
  const data = seed?.data || JSON.parse(localStorage.getItem('last_summary') || 'null') || {};
  const isComparison = seed?.type === 'comparison';
  const title = isComparison ? 'Video Comparison' : data.title || 'Synopsis Presentation';
  const summary = isComparison ? data.combined_summary : data.summary;
  const points = asStringArray(isComparison ? data.common_points || [] : data.key_points || data.keywords || []);
  const actions = asStringArray(data.action_items || []);
  const chapters = asStringArray(data.chapters || []);
  const questions = asStringArray((data.questions || []).map((item: { question?: string; answer?: string; correct_answer?: string }) => `${item.question || ''} - ${item.answer || item.correct_answer || ''}`));
  const timestamps = asStringArray((data.caption_summaries || []).map((item: { start_time?: string; end_time?: string; summary?: string }) => `${item.start_time || ''} - ${item.end_time || ''}: ${item.summary || ''}`));
  const thumbnail = isComparison ? data.video_1?.thumbnail : data.thumbnail;
  const accent = isComparison ? '#0f766e' : '#4f46e5';
  const cleanedSummary = plainText(summary || '').slice(0, 950);

  const baseSlides: Slide[] = [
    {
      id: uid(),
      title: 'Title Slide',
      background: '#eef2ff',
      elements: [
        createShape('SYNOPSIS', 8, 10, 18, 7, accent),
        createText(title, 8, 23, 55, 22, 34),
        createText(isComparison ? 'AI comparison deck' : data.channel || 'AI generated video deck', 8, 48, 44, 10, 17),
        thumbnail
          ? createImage(thumbnail, 67, 13, 25, 48)
          : { id: uid(), type: 'shape', x: 68, y: 14, w: 24, h: 42, content: 'Video Thumbnail', fill: '#e0e7ff', color: '#4f46e5' },
      ],
    },
    {
      id: uid(),
      title: 'Agenda',
      background: '#ffffff',
      elements: [
        createText('Agenda', 8, 8, 50, 10, 28),
        createText('1. Executive summary\n2. Key insights\n3. Content map\n4. Practice questions\n5. Action plan\n6. References', 10, 22, 58, 44, 20),
        createShape('Editable deck', 70, 24, 18, 12, accent),
        createShape('PPT/PDF ready', 70, 42, 18, 12, '#0f172a'),
      ],
    },
    {
      id: uid(),
      title: 'Executive Summary',
      background: '#f8fafc',
      elements: [
        createText('Executive Summary', 8, 8, 58, 10, 28),
        createText(cleanedSummary || 'Add your executive summary here.', 8, 22, 58, 42, 17),
        createShape(`${points.length || 0}\nKey points`, 71, 23, 18, 14, accent),
        createShape(`${questions.length || 0}\nQuestions`, 71, 43, 18, 14, '#0891b2'),
      ],
    },
    {
      id: uid(),
      title: 'Key Insights',
      background: '#ffffff',
      elements: [
        createText('Key Insights', 8, 8, 50, 10, 28),
        createText(numbered(points, 'Add your key insights here.', 6), 9, 22, 74, 42, 17),
      ],
    },
    {
      id: uid(),
      title: chapters.length ? 'Content Map' : 'Important Points',
      background: '#ffffff',
      elements: [
        createText(chapters.length ? 'Content Map' : 'Important Points', 8, 8, 58, 10, 28),
        createText(numbered(chapters.length ? chapters : points.slice(6), 'Add important supporting points here.', 5), 9, 22, 72, 42, 17),
      ],
    },
    {
      id: uid(),
      title: 'Practice Questions',
      background: '#ecfeff',
      elements: [
        createText('Practice Questions', 8, 8, 58, 10, 28),
        createText(numbered(questions, 'Generate questions from the summary page, then refresh this deck.', 4), 9, 22, 74, 42, 16),
      ],
    },
    {
      id: uid(),
      title: 'Action Plan',
      background: '#f0fdf4',
      elements: [
        createText('Action Plan', 8, 8, 50, 10, 28),
        createText(numbered(actions, isComparison ? data.best_overall_video?.reasoning || 'Use the stronger video for your target audience.' : 'Turn the insights into a focused action plan.', 5), 9, 22, 58, 42, 17),
        { id: uid(), type: 'chart', x: 72, y: 24, w: 18, h: 30, content: 'Clarity, Depth, Action', chartType: 'bar' },
      ],
    },
    {
      id: uid(),
      title: 'Timestamp Guide',
      background: '#ffffff',
      elements: [
        createText('Timestamp Guide', 8, 8, 54, 10, 28),
        createText(numbered(timestamps, 'Timestamp summaries will appear here when captions are available.', 6), 9, 22, 76, 42, 15),
      ],
    },
    {
      id: uid(),
      title: 'References',
      background: '#ffffff',
      elements: [
        createText('References', 8, 10, 50, 10, 30),
        createText(isComparison ? `${data.video_1?.youtube_url || ''}\n${data.video_2?.youtube_url || ''}` : data.youtube_url || 'Add references here.', 8, 25, 76, 24, 16),
      ],
    },
  ];

  return baseSlides;
}

function renderChart(element: SlideElement) {
  const values = [72, 54, 88, 63];
  if (element.chartType === 'pie') {
    return <div className="h-full w-full rounded-full" style={{ background: 'conic-gradient(#4f46e5 0 35%, #06b6d4 35% 62%, #f59e0b 62% 82%, #10b981 82% 100%)' }} />;
  }
  if (element.chartType === 'line' || element.chartType === 'area') {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-slate-50">
        <div className="absolute inset-x-4 bottom-6 h-0.5 bg-slate-300" />
        <svg viewBox="0 0 300 160" className="h-full w-full">
          {element.chartType === 'area' && <path d="M20 130 L90 80 L160 100 L230 45 L280 70 L280 145 L20 145 Z" fill="#c7d2fe" />}
          <polyline points="20,130 90,80 160,100 230,45 280,70" fill="none" stroke="#4f46e5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex h-full items-end gap-3 rounded-lg bg-slate-50 p-4">
      {values.map((value, index) => (
        <div key={value} className="flex flex-1 flex-col items-center gap-2">
          <div className="w-full rounded-t-lg bg-indigo-600" style={{ height: `${value}%` }} />
          <span className="text-xs font-bold text-slate-500">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

export default function PresentationEditorPage() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [templateCategory, setTemplateCategory] = useState<(typeof templateCategories)[number] | 'All'>('All');
  const seedKey = useMemo(() => getPresentationSeedKey(), []);

  useEffect(() => {
    const stored = localStorage.getItem('synopsis_presentation_project');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && !readPresentationSeed()) {
          setSlides(parsed);
          return;
        }
        if (parsed?.seedKey === seedKey && Array.isArray(parsed.slides)) {
          setSlides(parsed.slides);
          return;
        }
      } catch {
        localStorage.removeItem('synopsis_presentation_project');
      }
    }
    const nextSlides = slidesFromSeed();
    setSlides(nextSlides);
    localStorage.setItem('synopsis_presentation_project', JSON.stringify({ seedKey, slides: nextSlides }));
  }, [seedKey]);

  useEffect(() => {
    if (slides.length) {
      localStorage.setItem('synopsis_presentation_project', JSON.stringify({ seedKey, slides }));
    }
  }, [seedKey, slides]);

  const activeSlide = slides[activeIndex];
  const selectedElement = useMemo(
    () => activeSlide?.elements.find((element) => element.id === selectedId) || null,
    [activeSlide, selectedId]
  );
  const filteredTemplates = useMemo(
    () => templateCategory === 'All' ? deckTemplates : deckTemplates.filter((template) => template.category === templateCategory),
    [templateCategory]
  );

  const updateElement = (id: string, patch: Partial<SlideElement>) => {
    setSlides((current) => current.map((slide, index) => index === activeIndex ? {
      ...slide,
      elements: slide.elements.map((element) => element.id === id ? { ...element, ...patch } : element),
    } : slide));
  };

  const addElement = (type: ElementType) => {
    const common = { id: uid(), x: 14, y: 20, w: 34, h: 18, content: '' };
    const element: SlideElement =
      type === 'text' ? createText('Double click to edit', 14, 20, 42, 12, 20) :
      type === 'image' ? { ...common, type, content: 'Upload Image', fill: '#eef2ff' } :
      type === 'shape' ? { ...common, type, content: 'Shape', fill: '#dbeafe', color: '#1d4ed8' } :
      type === 'table' ? { ...common, type, w: 48, h: 26, content: '', rows: [['Metric', 'Video 1', 'Video 2'], ['Clarity', 'High', 'Medium'], ['Actionability', 'Medium', 'High']] } :
      type === 'chart' ? { ...common, type, w: 42, h: 28, content: 'Chart', chartType: 'bar' } :
      type === 'icon' ? { ...common, type, w: 12, h: 12, content: 'Star', fill: '#fef3c7', color: '#d97706' } :
      { ...common, type, w: 28, h: 18, content: 'Video Thumbnail', fill: '#111827', color: '#ffffff' };

    setSlides((current) => current.map((slide, index) => index === activeIndex ? { ...slide, elements: [...slide.elements, element] } : slide));
    setSelectedId(element.id);
  };

  const buildTemplateSlide = (template: DeckTemplate, sourceSlide?: Slide): Slide => {
    const sourceTitle = sourceSlide?.title || template.name;
    const sourceText = sourceSlide?.elements.find((element) => element.type === 'text')?.content || 'Add your content here.';
    const titleElement = createText(sourceTitle, 7, 7, 62, 10, 28);
    titleElement.color = template.accent;

    const accentBlock: SlideElement = { id: uid(), type: 'shape', x: 73, y: 8, w: 18, h: 7, content: template.category, fill: template.accent, color: '#ffffff' };
    const body = createText(sourceText, 8, 24, 48, 38, 17);
    const secondary = createText('Key takeaway\nSupporting idea\nNext action', 58, 24, 30, 38, 17);
    const metricA = createText('72%\nClarity', 11, 30, 18, 22, 28);
    const metricB = createText('4.8x\nFaster', 40, 30, 18, 22, 28);
    const metricC = createText('10\nActions', 69, 30, 18, 22, 28);
    const quote = createText(sourceText.split('\n')[0] || 'A clear idea deserves a clear slide.', 14, 26, 70, 24, 30);
    const timeline = createText('01  Context\n02  Evidence\n03  Recommendation\n04  Next step', 14, 22, 62, 38, 20);
    const visual: SlideElement = { id: uid(), type: 'shape', x: 61, y: 20, w: 29, h: 43, content: 'Visual', fill: `${template.accent}22`, color: template.accent };

    const layoutElements: Record<DeckTemplate['layout'], SlideElement[]> = {
      title: [createText(sourceTitle, 8, 20, 64, 18, 34), createText(sourceText.slice(0, 170), 8, 43, 58, 16, 18), visual],
      twoColumn: [titleElement, body, secondary, accentBlock],
      quote: [accentBlock, quote, createText(template.name, 15, 55, 44, 8, 16)],
      metrics: [titleElement, metricA, metricB, metricC, accentBlock],
      timeline: [titleElement, timeline, visual],
      imageRight: [titleElement, body, visual],
      comparison: [titleElement, createText('Option A\nStrengths\nRisks', 10, 24, 34, 34, 18), createText('Option B\nStrengths\nRisks', 53, 24, 34, 34, 18), accentBlock],
      section: [titleElement, createText(sourceText.slice(0, 260), 10, 25, 76, 32, 20), accentBlock],
    };

    return {
      id: uid(),
      title: template.name,
      background: template.background,
      notes: `Template: ${template.name}`,
      elements: layoutElements[template.layout].map((element) => ({
        ...element,
        color: element.type === 'text' ? element.color || '#111827' : element.color,
      })),
    };
  };

  const applyTemplate = (template: DeckTemplate) => {
    setSlides((current) => current.map((slide, index) => index === activeIndex ? buildTemplateSlide(template, slide) : slide));
    setSelectedId(null);
  };

  const applyPalette = (palette: typeof palettePresets[number]) => {
    setSlides((current) => current.map((slide, index) => index === activeIndex ? {
      ...slide,
      background: palette.bg,
      elements: slide.elements.map((element, elementIndex) => ({
        ...element,
        color: element.type === 'text' ? palette.text : element.color,
        fill: element.type === 'shape' && elementIndex % 2 === 0 ? palette.accent : element.fill,
      })),
    } : slide));
  };

  const duplicateSlide = () => {
    if (!activeSlide) return;
    const clone: Slide = {
      ...activeSlide,
      id: uid(),
      title: `${activeSlide.title} Copy`,
      elements: activeSlide.elements.map((element) => ({ ...element, id: uid() })),
    };
    setSlides((current) => [...current.slice(0, activeIndex + 1), clone, ...current.slice(activeIndex + 1)]);
    setActiveIndex(activeIndex + 1);
    setSelectedId(null);
  };

  const duplicateElement = () => {
    if (!selectedElement) return;
    const clone = { ...selectedElement, id: uid(), x: Math.min(selectedElement.x + 4, 90 - selectedElement.w), y: Math.min(selectedElement.y + 4, 90 - selectedElement.h) };
    setSlides((current) => current.map((slide, index) => index === activeIndex ? { ...slide, elements: [...slide.elements, clone] } : slide));
    setSelectedId(clone.id);
  };

  const reorderElement = (direction: 'front' | 'back') => {
    if (!selectedId) return;
    setSlides((current) => current.map((slide, index) => {
      if (index !== activeIndex) return slide;
      const selected = slide.elements.find((element) => element.id === selectedId);
      if (!selected) return slide;
      const rest = slide.elements.filter((element) => element.id !== selectedId);
      return { ...slide, elements: direction === 'front' ? [...rest, selected] : [selected, ...rest] };
    }));
  };

  const resetProject = () => {
    const nextSlides = slidesFromSeed();
    setSlides(nextSlides);
    setActiveIndex(0);
    setSelectedId(null);
    localStorage.setItem('synopsis_presentation_project', JSON.stringify({ seedKey, slides: nextSlides }));
  };

  const addSlide = () => {
    setSlides((current) => [...current, { id: uid(), title: `Slide ${current.length + 1}`, background: '#ffffff', elements: [createText('New Slide', 8, 8, 50, 10, 28)] }]);
    setActiveIndex(slides.length);
  };

  const deleteElement = () => {
    if (!selectedId) return;
    setSlides((current) => current.map((slide, index) => index === activeIndex ? { ...slide, elements: slide.elements.filter((element) => element.id !== selectedId) } : slide));
    setSelectedId(null);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedElement) return;
    const reader = new FileReader();
    reader.onload = () => updateElement(selectedElement.id, { imageUrl: String(reader.result), content: file.name });
    reader.readAsDataURL(file);
  };

  const improveSlide = async () => {
    if (!activeSlide) return;
    setIsSaving(true);
    try {
      const result = await api.improveSlide(activeSlide, { purpose: 'Improve readability and reduce text clutter' });
      if (result?.slide) {
        setSlides((current) => current.map((slide, index) => index === activeIndex ? result.slide : slide));
      }
    } catch {
      setSlides((current) => current.map((slide, index) => index === activeIndex ? {
        ...slide,
        elements: slide.elements.map((element) => element.type === 'text' ? { ...element, content: element.content.split('\n').slice(0, 5).join('\n'), fontSize: Math.max(16, Math.min(element.fontSize || 18, 24)) } : element),
      } : slide));
    } finally {
      setIsSaving(false);
    }
  };

  const generateBetterLayout = () => {
    setSlides((current) => current.map((slide, index) => index === activeIndex ? {
      ...slide,
      background: '#f8fafc',
      elements: slide.elements.map((element, elementIndex) => ({
        ...element,
        x: elementIndex === 0 ? 8 : elementIndex % 2 === 0 ? 54 : 8,
        y: elementIndex === 0 ? 8 : 22 + Math.floor((elementIndex - 1) / 2) * 24,
        w: elementIndex === 0 ? 70 : 36,
        h: element.type === 'text' ? 16 : 20,
      })),
    } : slide));
  };

  const saveProject = async () => {
    setIsSaving(true);
    try {
      await api.savePresentation({ title: 'Synopsis Presentation', slides });
    } catch (error) {
      console.warn('Presentation saved locally only', error);
    } finally {
      localStorage.setItem('synopsis_presentation_project', JSON.stringify({ seedKey, slides }));
      setIsSaving(false);
    }
  };

  const downloadPptx = async () => {
    const { default: PptxGenJS } = await import('pptxgenjs');
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'Synopsis';
    pptx.subject = 'AI generated video presentation';
    pptx.title = 'Synopsis Presentation';

    slides.forEach((slide) => {
      const pptSlide = pptx.addSlide();
      pptSlide.background = { color: (slide.background || '#ffffff').replace('#', '') };
      slide.elements.forEach((element) => {
        const x = element.x * 0.1333;
        const y = element.y * 0.075;
        const w = element.w * 0.1333;
        const h = element.h * 0.075;
        if (element.type === 'image' && element.imageUrl) {
          const imageSource = element.imageUrl.startsWith('data:')
            ? { data: element.imageUrl }
            : { path: element.imageUrl };
          pptSlide.addImage({ ...imageSource, x, y, w, h });
          return;
        }
        if (element.type === 'shape' || element.type === 'icon' || element.type === 'video') {
          pptSlide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: (element.fill || '#eef2ff').replace('#', '') }, line: { color: 'CBD5E1' } });
        }
        if (element.type === 'table' && element.rows) {
          pptSlide.addTable(element.rows, { x, y, w, h, border: { color: 'CBD5E1', type: 'solid', pt: 1 }, fontSize: 12 });
          return;
        }
        if (element.type === 'chart') {
          pptSlide.addText(`${element.chartType || 'bar'} chart\n${element.content}`, { x, y, w, h, fontSize: 16, bold: true, color: '4F46E5', align: 'center', valign: 'mid', fill: { color: 'EEF2FF' } });
          return;
        }
        pptSlide.addText(element.content || '', { x, y, w, h, fontFace: element.fontFamily || 'Arial', fontSize: element.fontSize || 16, bold: element.bold, italic: element.italic, underline: element.underline, color: (element.color || '#111827').replace('#', ''), align: element.align || 'left', fit: 'shrink', breakLine: false, valign: 'mid', margin: 0.08 });
      });
    });

    await pptx.writeFile({ fileName: 'synopsis-presentation.pptx' });
  };

  const downloadPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const escapeHtml = (value = '') => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));
    const slidesHtml = slides.map((slide) => `
      <section class="slide" style="background:${slide.background || '#fff'}">
        ${slide.elements.map((element) => `<div style="position:absolute;left:${element.x}%;top:${element.y}%;width:${element.w}%;height:${element.h}%;font-family:${element.fontFamily || 'Inter'};font-size:${element.fontSize || 16}px;font-weight:${element.bold ? 800 : 400};font-style:${element.italic ? 'italic' : 'normal'};text-decoration:${element.underline ? 'underline' : 'none'};color:${element.color || '#111827'};background:${element.fill || 'transparent'};display:flex;align-items:center;justify-content:${element.align === 'center' ? 'center' : element.align === 'right' ? 'flex-end' : 'flex-start'};padding:12px;box-sizing:border-box;white-space:pre-wrap;overflow:hidden">${element.imageUrl ? `<img src="${escapeHtml(element.imageUrl)}" style="width:100%;height:100%;object-fit:cover"/>` : escapeHtml(element.content)}</div>`).join('')}
      </section>`).join('');
    printWindow.document.write(`<html><head><title>Synopsis Presentation</title><style>@page{size:16in 9in;margin:0}body{margin:0;background:#111}.slide{position:relative;width:16in;height:9in;page-break-after:always;overflow:hidden}</style></head><body>${slidesHtml}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  if (!activeSlide) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">Loading editor...</div>;
  }

  const canvasStyle: CSSProperties = { background: activeSlide.background || '#ffffff' };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-950">
      <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-lg p-2 hover:bg-slate-100" title="Back"><ArrowLeft className="h-5 w-5" /></button>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Presentation Editor</p>
            <h1 className="text-xl font-bold">Synopsis Presentation</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={improveSlide} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold hover:bg-slate-50"><Sparkles className="h-4 w-4" />Improve Slide</button>
          <button onClick={generateBetterLayout} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold hover:bg-slate-50"><Wand2 className="h-4 w-4" />Generate Better Layout</button>
          <button onClick={resetProject} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold hover:bg-slate-50"><RotateCcw className="h-4 w-4" />Reset</button>
          <button onClick={saveProject} disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold hover:bg-slate-50"><FileText className="h-4 w-4" />{isSaving ? 'Saving...' : 'Save'}</button>
          <button onClick={downloadPptx} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-bold text-white"><Download className="h-4 w-4" />PPTX</button>
          <button onClick={downloadPdf} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-bold text-white"><Download className="h-4 w-4" />PDF</button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_310px]">
        <aside className="border-r border-slate-200 bg-white p-3 lg:h-[calc(100vh-73px)] lg:overflow-y-auto">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <button onClick={addSlide} className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><Plus className="h-4 w-4" />Add</button>
            <button onClick={duplicateSlide} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><Copy className="h-4 w-4" />Copy</button>
          </div>
          <div className="space-y-2">
            {slides.map((slide, index) => (
              <button key={slide.id} onClick={() => { setActiveIndex(index); setSelectedId(null); }} className={`w-full rounded-xl border p-3 text-left text-sm ${index === activeIndex ? 'border-indigo-300 bg-indigo-50 text-indigo-900' : 'border-slate-200 bg-white text-slate-700'}`}>
                <span className="font-bold">Slide {index + 1}</span>
                <span className="mt-1 block truncate text-xs">{slide.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="min-w-0 overflow-auto p-4 md:p-8">
          <div className="mb-4 rounded-2xl bg-white p-3 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800"><LayoutTemplate className="h-4 w-4 text-indigo-600" />56 prebuilt templates</div>
              <div className="flex flex-wrap gap-2">
                {(['All', ...templateCategories] as const).map((category) => (
                  <button
                    key={category}
                    onClick={() => setTemplateCategory(category)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${templateCategory === category ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid max-h-44 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-4">
              {filteredTemplates.map((template) => (
                <button key={template.id} onClick={() => applyTemplate(template)} className="group rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-indigo-300 hover:bg-indigo-50">
                  <div className="mb-3 flex h-12 items-end gap-1 rounded-lg p-2" style={{ background: template.background }}>
                    <span className="h-7 flex-1 rounded-sm" style={{ background: template.accent }} />
                    <span className="h-4 flex-1 rounded-sm bg-white/80" />
                    <span className="h-9 flex-1 rounded-sm bg-slate-900/15" />
                  </div>
                  <p className="truncate text-sm font-bold text-slate-900">{template.name}</p>
                  <p className="text-xs text-slate-500">{template.category}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2 rounded-2xl bg-white p-3 shadow-sm">
            {[
              { type: 'text', label: 'Text', icon: Type },
              { type: 'image', label: 'Image', icon: ImageIcon },
              { type: 'shape', label: 'Shape', icon: Shapes },
              { type: 'table', label: 'Table', icon: Table2 },
              { type: 'chart', label: 'Chart', icon: BarChart3 },
              { type: 'icon', label: 'Icon', icon: Smile },
              { type: 'video', label: 'Video Thumbnail', icon: Video },
            ].map((tool) => {
              const Icon = tool.icon;
              return <button key={tool.type} onClick={() => addElement(tool.type as ElementType)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold hover:bg-slate-100"><Icon className="h-4 w-4" />{tool.label}</button>;
            })}
            <span className="mx-1 h-9 w-px bg-slate-200" />
            {palettePresets.map((palette) => (
              <button key={palette.name} onClick={() => applyPalette(palette)} title={palette.name} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200">
                <span className="h-5 w-5 rounded-full" style={{ background: palette.accent }} />
              </button>
            ))}
          </div>

          <div className="mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 shadow-2xl" style={canvasStyle}>
            <div className="relative h-full w-full">
              {activeSlide.elements.map((element) => (
                <div
                  key={element.id}
                  onClick={() => setSelectedId(element.id)}
                  className={`absolute overflow-hidden rounded-lg ${selectedId === element.id ? 'ring-4 ring-indigo-400' : 'ring-1 ring-slate-200/70'}`}
                  style={{ left: `${element.x}%`, top: `${element.y}%`, width: `${element.w}%`, height: `${element.h}%`, background: element.fill || 'transparent', color: element.color || '#111827' }}
                >
                  {element.type === 'text' && (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(event) => updateElement(element.id, { content: event.currentTarget.textContent || '' })}
                      className="h-full w-full whitespace-pre-wrap p-3 outline-none"
                      style={{ fontFamily: element.fontFamily, fontSize: element.fontSize, fontWeight: element.bold ? 800 : 400, fontStyle: element.italic ? 'italic' : 'normal', textDecoration: element.underline ? 'underline' : 'none', textAlign: element.align }}
                    >
                      {element.content}
                    </div>
                  )}
                  {element.type === 'image' && (element.imageUrl ? <img src={element.imageUrl} alt={element.content || 'Slide image'} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm font-bold text-indigo-600">Upload Image</div>)}
                  {element.type === 'shape' && <div className="flex h-full items-center justify-center p-3 text-center font-bold">{element.content}</div>}
                  {element.type === 'icon' && <div className="flex h-full items-center justify-center text-4xl font-black">{element.content.slice(0, 1) || '*'}</div>}
              {element.type === 'video' && <div className="flex h-full items-center justify-center bg-slate-950 p-3 text-center text-sm font-bold text-white"><Video className="mr-2 h-5 w-5" />{element.content}</div>}
                  {element.type === 'table' && <table className="h-full w-full border-collapse text-sm"><tbody>{(element.rows || []).map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border border-slate-300 p-2" contentEditable suppressContentEditableWarning onInput={(event) => {
                    const nextRows = (element.rows || []).map((nextRow) => [...nextRow]);
                    nextRows[rowIndex][cellIndex] = event.currentTarget.textContent || '';
                    updateElement(element.id, { rows: nextRows });
                  }}>{cell}</td>)}</tr>)}</tbody></table>}
                  {element.type === 'chart' && <div className="h-full w-full p-3">{renderChart(element)}</div>}
                </div>
              ))}
            </div>
          </div>
        </main>

        <aside className="border-l border-slate-200 bg-white p-4 lg:h-[calc(100vh-73px)] lg:overflow-y-auto">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500"><Palette className="h-4 w-4" />Properties</h2>
          {selectedElement ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <button onClick={duplicateElement} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-2 py-2 text-xs font-bold hover:bg-slate-50"><Copy className="h-4 w-4" />Copy</button>
                <button onClick={() => reorderElement('front')} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-2 py-2 text-xs font-bold hover:bg-slate-50"><BringToFront className="h-4 w-4" />Front</button>
                <button onClick={() => reorderElement('back')} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-2 py-2 text-xs font-bold hover:bg-slate-50"><SendToBack className="h-4 w-4" />Back</button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(['x', 'y', 'w', 'h'] as const).map((key) => (
                  <label key={key} className="text-xs font-bold uppercase text-slate-500">{key}
                    <input type="number" value={Math.round(selectedElement[key])} onChange={(event) => updateElement(selectedElement.id, { [key]: Number(event.target.value) } as Partial<SlideElement>)} className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-sm text-slate-900" />
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 p-3">
                <label className="text-xs font-bold uppercase text-slate-500"><Brush className="mb-1 inline h-3.5 w-3.5" /> Text
                  <input type="color" value={selectedElement.color || '#111827'} onChange={(event) => updateElement(selectedElement.id, { color: event.target.value })} className="mt-1 h-10 w-full" />
                </label>
                <label className="text-xs font-bold uppercase text-slate-500"><Droplets className="mb-1 inline h-3.5 w-3.5" /> Fill
                  <input type="color" value={selectedElement.fill || '#ffffff'} onChange={(event) => updateElement(selectedElement.id, { fill: event.target.value })} className="mt-1 h-10 w-full" />
                </label>
              </div>

              {selectedElement.type === 'text' && (
                <div className="space-y-3">
                  <select value={selectedElement.fontFamily} onChange={(event) => updateElement(selectedElement.id, { fontFamily: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">{fonts.map((font) => <option key={font}>{font}</option>)}</select>
                  <label className="block text-xs font-bold uppercase text-slate-500">Font size
                    <input type="range" min="10" max="48" value={selectedElement.fontSize || 18} onChange={(event) => updateElement(selectedElement.id, { fontSize: Number(event.target.value) })} className="mt-2 w-full" />
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => updateElement(selectedElement.id, { bold: !selectedElement.bold })} className="rounded-lg border p-2"><Bold className="h-4 w-4" /></button>
                    <button onClick={() => updateElement(selectedElement.id, { italic: !selectedElement.italic })} className="rounded-lg border p-2"><Italic className="h-4 w-4" /></button>
                    <button onClick={() => updateElement(selectedElement.id, { underline: !selectedElement.underline })} className="rounded-lg border p-2"><Underline className="h-4 w-4" /></button>
                    <button onClick={() => updateElement(selectedElement.id, { align: 'left' })} className="rounded-lg border p-2"><AlignLeft className="h-4 w-4" /></button>
                    <button onClick={() => updateElement(selectedElement.id, { align: 'center' })} className="rounded-lg border p-2"><AlignCenter className="h-4 w-4" /></button>
                    <button onClick={() => updateElement(selectedElement.id, { align: 'right' })} className="rounded-lg border p-2"><AlignRight className="h-4 w-4" /></button>
                  </div>
                </div>
              )}

              {selectedElement.type === 'image' && (
                <div className="space-y-3 rounded-xl border border-slate-200 p-3">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-bold text-white"><Upload className="h-4 w-4" />Upload or Replace<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
                  <button onClick={deleteElement} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700"><Trash2 className="h-4 w-4" />Delete Image</button>
                </div>
              )}

              {selectedElement.type === 'table' && (
                <div className="grid gap-2">
                  <button onClick={() => updateElement(selectedElement.id, { rows: [...(selectedElement.rows || []), new Array((selectedElement.rows?.[0]?.length || 3)).fill('New cell')] })} className="rounded-lg border px-3 py-2 text-sm font-bold">Add row</button>
                  <button onClick={() => updateElement(selectedElement.id, { rows: (selectedElement.rows || []).map((row) => [...row, 'New']) })} className="rounded-lg border px-3 py-2 text-sm font-bold">Add column</button>
                  <button onClick={() => updateElement(selectedElement.id, { content: 'Merged selected cells' })} className="rounded-lg border px-3 py-2 text-sm font-bold">Merge cells</button>
                </div>
              )}

              {selectedElement.type === 'chart' && (
                <div className="space-y-3 rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500"><LineChart className="h-4 w-4" />Chart style</div>
                  <div className="grid grid-cols-2 gap-2">
                    {chartTypes.map((chartType) => <button key={chartType} onClick={() => updateElement(selectedElement.id, { chartType })} className={`rounded-lg border px-3 py-2 text-sm font-bold ${selectedElement.chartType === chartType ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : ''}`}>{chartType}</button>)}
                  </div>
                </div>
              )}

              <button onClick={deleteElement} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 font-bold text-white"><Trash2 className="h-4 w-4" />Delete Element</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Select an element on the canvas to edit it.</div>
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-slate-500"><Grid2X2 className="h-4 w-4" />Slide design</div>
                <label className="text-xs font-bold uppercase text-slate-500">Slide title
                  <input value={activeSlide.title} onChange={(event) => setSlides((current) => current.map((slide, index) => index === activeIndex ? { ...slide, title: event.target.value } : slide))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm normal-case text-slate-900" />
                </label>
                <label className="mt-3 block text-xs font-bold uppercase text-slate-500"><Circle className="mb-1 inline h-3.5 w-3.5" />Background
                  <input type="color" value={activeSlide.background || '#ffffff'} onChange={(event) => setSlides((current) => current.map((slide, index) => index === activeIndex ? { ...slide, background: event.target.value } : slide))} className="mt-1 h-10 w-full" />
                </label>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
