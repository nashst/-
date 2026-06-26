/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  RotateCw, Sparkles, Download, Upload, Plus, Trash2, Grid, Type, Paintbrush, 
  Check, Layers, Lock, Unlock, Move, HelpCircle, CheckCircle2, Eye, RefreshCw, 
  FileCode, Settings, FileText, Image, BadgeCent, AlignLeft, AlignCenter, AlignRight,
  GraduationCap, BookOpen, Award, Dna, Atom, Microscope, Wheat, Globe, Brain, 
  TrendingUp, Database, Lightbulb, Star, Mail, Phone, Shield, Activity
} from 'lucide-react';

const IconComponents: { [key: string]: React.ComponentType<any> } = {
  graduation: GraduationCap,
  book: BookOpen,
  award: Award,
  dna: Dna,
  atom: Atom,
  microscope: Microscope,
  wheat: Wheat,
  globe: Globe,
  brain: Brain,
  trending: TrendingUp,
  database: Database,
  lightbulb: Lightbulb,
  star: Star,
  mail: Mail,
  phone: Phone,
  shield: Shield,
  activity: Activity
};
import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ABSTRACT_LOGOS, COLOR_PALETTES, FONT_OPTIONS, WEIGHT_OPTIONS } from '../data';
import { CardDesign, TextElement, CardTemplate } from '../types';

interface WorkspaceViewProps {
  currentDesign: CardDesign;
  onChangeDesign: (design: CardDesign) => void;
  onNavigate: (view: 'landing' | 'gallery' | 'workspace' | 'checkout') => void;
}

export default function WorkspaceView({ currentDesign, onChangeDesign, onNavigate }: WorkspaceViewProps) {
  // Active state: Front side vs Back side
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  
  // Dragging states
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Selected element for detailed formatting
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Submenu show/hide toggles for custom elements
  const [showShapeSelector, setShowShapeSelector] = useState(false);
  const [showIconSelector, setShowIconSelector] = useState(false);

  // Hover 3D Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Custom palette color pickers
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [customBg, setCustomBg] = useState(currentDesign.front.background);
  const [customText, setCustomText] = useState(currentDesign.front.textColor);

  // Notification toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // File import ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show visual coordinates on hover/drag
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  // Show toast utility
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Switch sides
  const toggleSide = () => {
    setActiveSide(activeSide === 'front' ? 'back' : 'front');
    setSelectedElementId(null);
  };

  const activeSideData = activeSide === 'front' ? currentDesign.front : currentDesign.back;

  // Render 3D hover tilt
  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingId || isDraggingLogo) return; // disable 3D effect while dragging elements
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Moderate tilt angles for professional look
    const rotateX = ((centerY - y) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave3D = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Element Drag & Drop Handlers
  const handleElementStartDrag = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDraggingId(elementId);
    setSelectedElementId(elementId);
    
    // Calculate drag offset if necessary, but we can also just snap to cursor center
  };

  const handleLogoStartDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDraggingLogo(true);
    setSelectedElementId('logo');
  };

  // Card general dragging tracking mouse move
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingId && !isDraggingLogo) return;
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Calculate percentages
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Clamp percentages between 2% and 98% for safe margins
    const pctX = Math.round(Math.max(2, Math.min(98, rawX)));
    const pctY = Math.round(Math.max(2, Math.min(98, rawY)));

    const updatedDesign = { ...currentDesign };
    if (draggingId) {
      if (activeSide === 'front') {
        updatedDesign.front.elements = updatedDesign.front.elements.map(el => 
          el.id === draggingId ? { ...el, x: pctX, y: pctY } : el
        );
      } else {
        updatedDesign.back.elements = updatedDesign.back.elements.map(el => 
          el.id === draggingId ? { ...el, x: pctX, y: pctY } : el
        );
      }
    } else if (isDraggingLogo) {
      if (activeSide === 'front') {
        updatedDesign.front.logoX = pctX;
        updatedDesign.front.logoY = pctY;
      } else {
        updatedDesign.back.logoX = pctX;
        updatedDesign.back.logoY = pctY;
      }
    }
    onChangeDesign(updatedDesign);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setIsDraggingLogo(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleDragEnd();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [draggingId, isDraggingLogo, currentDesign]);

  // Edit Text element value
  const handleTextChange = (elementId: string, value: string) => {
    const updatedDesign = { ...currentDesign };
    if (activeSide === 'front') {
      updatedDesign.front.elements = updatedDesign.front.elements.map(el => 
        el.id === elementId ? { ...el, text: value } : el
      );
    } else {
      updatedDesign.back.elements = updatedDesign.back.elements.map(el => 
        el.id === elementId ? { ...el, text: value } : el
      );
    }
    onChangeDesign(updatedDesign);
  };

  // Add custom text element
  const handleAddTextElement = () => {
    const newId = `custom-${Date.now()}`;
    const newElement: TextElement = {
      id: newId,
      text: '自定义文本行 (Custom Line)',
      key: `custom_${Date.now()}`,
      x: 50,
      y: 50,
      fontSize: 11,
      fontWeight: 'normal',
      fontFamily: 'sans-hanken',
      color: activeSideData.textColor,
      letterSpacing: '0.05em',
      align: 'center'
    };

    const updatedDesign = { ...currentDesign };
    if (activeSide === 'front') {
      updatedDesign.front.elements.push(newElement);
    } else {
      updatedDesign.back.elements.push(newElement);
    }
    onChangeDesign(updatedDesign);
    setSelectedElementId(newId);
    showToast('已在画布中心添加自定义文本行，可自由拖动调整位置', 'success');
  };

  // Delete element
  const handleDeleteElement = (elementId: string) => {
    const updatedDesign = { ...currentDesign };
    if (activeSide === 'front') {
      updatedDesign.front.elements = updatedDesign.front.elements.filter(el => el.id !== elementId);
    } else {
      updatedDesign.back.elements = updatedDesign.back.elements.filter(el => el.id !== elementId);
    }
    onChangeDesign(updatedDesign);
    setSelectedElementId(null);
    showToast('已删除该文本行', 'info');
  };

  // Font adjustments for selected element
  const handleFontFamilyChange = (fontFamily: string) => {
    if (!selectedElementId) return;
    const updatedDesign = { ...currentDesign };
    const mapper = (el: TextElement) => el.id === selectedElementId ? { ...el, fontFamily } : el;
    
    if (activeSide === 'front') {
      updatedDesign.front.elements = updatedDesign.front.elements.map(mapper);
    } else {
      updatedDesign.back.elements = updatedDesign.back.elements.map(mapper);
    }
    onChangeDesign(updatedDesign);
  };

  const handleFontWeightChange = (fontWeight: string) => {
    if (!selectedElementId) return;
    const updatedDesign = { ...currentDesign };
    const mapper = (el: TextElement) => el.id === selectedElementId ? { ...el, fontWeight } : el;

    if (activeSide === 'front') {
      updatedDesign.front.elements = updatedDesign.front.elements.map(mapper);
    } else {
      updatedDesign.back.elements = updatedDesign.back.elements.map(mapper);
    }
    onChangeDesign(updatedDesign);
  };

  const handleFontSizeChange = (fontSize: number) => {
    if (!selectedElementId) return;
    const updatedDesign = { ...currentDesign };
    const mapper = (el: TextElement) => el.id === selectedElementId ? { ...el, fontSize } : el;

    if (activeSide === 'front') {
      updatedDesign.front.elements = updatedDesign.front.elements.map(mapper);
    } else {
      updatedDesign.back.elements = updatedDesign.back.elements.map(mapper);
    }
    onChangeDesign(updatedDesign);
  };

  const handleLetterSpacingChange = (letterSpacing: string) => {
    if (!selectedElementId) return;
    const updatedDesign = { ...currentDesign };
    const mapper = (el: TextElement) => el.id === selectedElementId ? { ...el, letterSpacing } : el;

    if (activeSide === 'front') {
      updatedDesign.front.elements = updatedDesign.front.elements.map(mapper);
    } else {
      updatedDesign.back.elements = updatedDesign.back.elements.map(mapper);
    }
    onChangeDesign(updatedDesign);
  };

  const handleAlignChange = (align: 'left' | 'center' | 'right') => {
    if (!selectedElementId) return;
    const updatedDesign = { ...currentDesign };
    const mapper = (el: TextElement) => el.id === selectedElementId ? { ...el, align } : el;

    if (activeSide === 'front') {
      updatedDesign.front.elements = updatedDesign.front.elements.map(mapper);
    } else {
      updatedDesign.back.elements = updatedDesign.back.elements.map(mapper);
    }
    onChangeDesign(updatedDesign);
  };

  // Add custom components functions
  const handleAddShapeElement = (shapeType: 'rect' | 'circle' | 'line') => {
    const newId = `shape-${Date.now()}`;
    const newElement: TextElement = {
      id: newId,
      text: shapeType === 'rect' ? '矩形' : shapeType === 'circle' ? '圆形' : '装饰线',
      key: `custom_shape_${Date.now()}`,
      x: 50,
      y: 50,
      fontSize: 16,
      fontWeight: 'normal',
      fontFamily: 'sans',
      color: activeSide === 'front' ? currentDesign.front.textColor : currentDesign.back.textColor,
      letterSpacing: '0',
      align: 'center',
      type: 'shape',
      shapeType: shapeType,
      shapeWidth: shapeType === 'line' ? 80 : 30,
      shapeHeight: shapeType === 'line' ? 2 : 20
    };
    const updatedDesign = { ...currentDesign };
    if (activeSide === 'front') {
      updatedDesign.front.elements.push(newElement);
    } else {
      updatedDesign.back.elements.push(newElement);
    }
    onChangeDesign(updatedDesign);
    setSelectedElementId(newId);
    showToast(`已在中心添加自定义【${shapeType === 'rect' ? '矩形' : shapeType === 'circle' ? '圆形' : '线条'}】图形，可自由拖动和微调`, 'success');
  };

  const handleAddIconElement = (iconName: string) => {
    const newId = `icon-${Date.now()}`;
    const newElement: TextElement = {
      id: newId,
      text: iconName,
      key: `custom_icon_${Date.now()}`,
      x: 50,
      y: 50,
      fontSize: 24,
      fontWeight: 'normal',
      fontFamily: 'sans',
      color: activeSide === 'front' ? currentDesign.front.textColor : currentDesign.back.textColor,
      letterSpacing: '0',
      align: 'center',
      type: 'icon',
      iconName: iconName
    };
    const updatedDesign = { ...currentDesign };
    if (activeSide === 'front') {
      updatedDesign.front.elements.push(newElement);
    } else {
      updatedDesign.back.elements.push(newElement);
    }
    onChangeDesign(updatedDesign);
    setSelectedElementId(newId);
    showToast(`已在中心添加【${iconName}】学术图标，可自由拖动和微调`, 'success');
  };

  const handleShapeWidthChange = (width: number) => {
    if (!selectedElementId) return;
    const updatedDesign = { ...currentDesign };
    const mapper = (el: TextElement) => el.id === selectedElementId ? { ...el, shapeWidth: width } : el;
    if (activeSide === 'front') {
      updatedDesign.front.elements = updatedDesign.front.elements.map(mapper);
    } else {
      updatedDesign.back.elements = updatedDesign.back.elements.map(mapper);
    }
    onChangeDesign(updatedDesign);
  };

  const handleShapeHeightChange = (height: number) => {
    if (!selectedElementId) return;
    const updatedDesign = { ...currentDesign };
    const mapper = (el: TextElement) => el.id === selectedElementId ? { ...el, shapeHeight: height } : el;
    if (activeSide === 'front') {
      updatedDesign.front.elements = updatedDesign.front.elements.map(mapper);
    } else {
      updatedDesign.back.elements = updatedDesign.back.elements.map(mapper);
    }
    onChangeDesign(updatedDesign);
  };

  // Color selection
  const handleApplyPalette = (palette: typeof COLOR_PALETTES[0]) => {
    const updatedDesign = { ...currentDesign };
    updatedDesign.paletteId = palette.id;
    
    // Apply front colors
    updatedDesign.front.background = palette.background;
    updatedDesign.front.textColor = palette.textColor;
    
    // Apply back colors
    updatedDesign.back.background = palette.backBackground;
    updatedDesign.back.textColor = palette.backTextColor;

    // Apply color to elements
    updatedDesign.front.elements = updatedDesign.front.elements.map(el => ({ ...el, color: palette.textColor }));
    updatedDesign.back.elements = updatedDesign.back.elements.map(el => ({ ...el, color: palette.backTextColor }));

    setCustomBg(palette.background);
    setCustomText(palette.textColor);

    onChangeDesign(updatedDesign);
    showToast(`已应用主题色盘：${palette.name}`, 'success');
  };

  const handleCustomColorApply = () => {
    const updatedDesign = { ...currentDesign };
    if (activeSide === 'front') {
      updatedDesign.front.background = customBg;
      updatedDesign.front.textColor = customText;
      updatedDesign.front.elements = updatedDesign.front.elements.map(el => ({ ...el, color: customText }));
    } else {
      updatedDesign.back.background = customBg;
      updatedDesign.back.textColor = customText;
      updatedDesign.back.elements = updatedDesign.back.elements.map(el => ({ ...el, color: customText }));
    }
    onChangeDesign(updatedDesign);
    showToast('已应用自定义色值', 'success');
  };

  // Logo modifications
  const handleLogoTypeChange = (logoType: 'icon' | 'text' | 'image' | 'none') => {
    const updatedDesign = { ...currentDesign };
    if (activeSide === 'front') {
      updatedDesign.front.logoType = logoType;
    } else {
      updatedDesign.back.logoType = logoType;
    }
    onChangeDesign(updatedDesign);
  };

  const handleLogoIconChange = (icon: string, content: string) => {
    const updatedDesign = { ...currentDesign };
    if (activeSide === 'front') {
      updatedDesign.front.logoIcon = icon;
      updatedDesign.front.logoText = content;
    } else {
      updatedDesign.back.logoIcon = icon;
      updatedDesign.back.logoText = content;
    }
    onChangeDesign(updatedDesign);
  };

  const handleLogoSizeChange = (logoSize: number) => {
    const updatedDesign = { ...currentDesign };
    if (activeSide === 'front') {
      updatedDesign.front.logoSize = logoSize;
    } else {
      updatedDesign.back.logoSize = logoSize;
    }
    onChangeDesign(updatedDesign);
  };

  // Layout format toggles
  const handleLayoutChange = (layout: 'horizontal' | 'vertical') => {
    const updatedDesign = { ...currentDesign, layout };
    onChangeDesign(updatedDesign);
    showToast(`名片版型已切换为 ${layout === 'horizontal' ? '标准横版 (90x54mm)' : '现代竖版 (54x90mm)'}`, 'info');
  };

  // Paper finishes adjustment
  const handlePaperTypeChange = (paperType: 'matte' | 'linen' | 'metallic') => {
    const updatedDesign = { ...currentDesign, paperType };
    onChangeDesign(updatedDesign);
    showToast(`材质已切换为：${paperType === 'matte' ? '特厚哑光纯棉纸' : paperType === 'linen' ? '苏格兰莱妮布纹纸' : '拉丝金属微珠光纸'}`, 'info');
  };

  const handleFinishTypeChange = (finishType: 'deboss' | 'gold_foil' | 'letterpress') => {
    const updatedDesign = { ...currentDesign, finishType };
    onChangeDesign(updatedDesign);
    showToast(`印后工艺已切换为：${finishType === 'deboss' ? '无墨深层压凹' : finishType === 'gold_foil' ? '24K香槟金烫金' : '古法活字凸版油墨压印'}`, 'info');
  };

  // Corner radius adjustments
  const handleCornerRadiusChange = (cornerRadius: 'none' | 'sm' | 'md' | 'lg' | 'full') => {
    const updatedDesign = { ...currentDesign, cornerRadius };
    onChangeDesign(updatedDesign);
  };

  // Project Export as JSON (saving local copy)
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentDesign, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aurelius_design_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('项目工程包 (JSON) 导出成功！您可在未来导入该文件继续编辑。', 'success');
  };

  // Project Import from JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        // Basic schema verification
        if (parsed.front && parsed.back && parsed.layout) {
          onChangeDesign(parsed);
          showToast('设计项目导入成功！所有文字、排版和定制位置已完整还原。', 'success');
        } else {
          showToast('导入失败：该文件似乎不是有效的四川农业大学项目设计包。', 'error');
        }
      } catch (err) {
        showToast('导入失败：解析 JSON 数据时发生错误。', 'error');
      }
    };
    reader.readAsText(file);
    // Clear value to allow re-uploading the same file
    e.target.value = '';
  };

  // SVG Export helper
  const handleExportSVG = () => {
    // Generate high quality XML string representation of the card design
    const layoutWidth = currentDesign.layout === 'horizontal' ? 1050 : 630;
    const layoutHeight = currentDesign.layout === 'horizontal' ? 630 : 1050;
    
    const buildSideSVG = (side: typeof currentDesign.front, title: string) => {
      const elSvgLines = side.elements.map(el => {
        // Map alignment
        const textAnchor = el.align === 'center' ? 'middle' : el.align === 'right' ? 'end' : 'start';
        // Calculate coordinate relative to SVG canvas size
        const elX = (el.x / 100) * layoutWidth;
        const elY = (el.y / 100) * layoutHeight;
        // Map font weight
        const svgWeight = el.fontWeight === 'bold' ? 'bold' : el.fontWeight === 'semibold' ? '600' : el.fontWeight === 'medium' ? '500' : 'normal';
        // Letter spacing mapping
        const letterSpacingAttr = el.letterSpacing ? `letter-spacing="${el.letterSpacing}"` : '';
        
        return `<text x="${elX}" y="${elY}" text-anchor="${textAnchor}" fill="${el.color}" font-family="${el.fontFamily === 'serif-caslon' ? 'Georgia, serif' : 'system-ui, sans-serif'}" font-size="${el.fontSize * 1.5}" font-weight="${svgWeight}" ${letterSpacingAttr}>${el.text}</text>`;
      }).join('\n    ');

      let logoSvg = '';
      if (side.logoType === 'icon' || side.logoType === 'text') {
        const logoX = (side.logoX / 100) * layoutWidth;
        const logoY = (side.logoY / 100) * layoutHeight;
        logoSvg = `<text x="${logoX}" y="${logoY}" text-anchor="middle" fill="${side.textColor}" font-size="${side.logoSize * 2}" font-family="system-ui" font-weight="bold">${side.logoText || '♦'}</text>`;
      }

      return `
  <!-- ${title} -->
  <g transform="translate(0, ${title === '背面' ? layoutHeight + 40 : 0})">
    <rect width="${layoutWidth}" height="${layoutHeight}" fill="${side.background}" stroke="#eaeaea" stroke-width="2" rx="4"/>
    ${logoSvg}
    ${elSvgLines}
  </g>`;
    };

    const fullSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${layoutWidth} ${layoutHeight * 2 + 80}" width="${layoutWidth}" height="${layoutHeight * 2 + 80}">
  <style>
    text { font-family: system-ui, -apple-system, sans-serif; }
  </style>
  ${buildSideSVG(currentDesign.front, '正面')}
  ${buildSideSVG(currentDesign.back, '背面')}
</svg>`;

    const dataStr = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(fullSvgContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aurelius_vector_${Date.now()}.svg`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('矢量格式 (SVG) 导出成功！该格式无损缩放，非常适合印刷厂直接印制。', 'success');
  };

  // PNG & JPG Export utilizing html2canvas
  const handleExportImage = async (format: 'png' | 'jpeg') => {
    showToast('正在为您渲染高清画面，请稍候...', 'info');
    
    if (!cardRef.current) {
      showToast('画面加载中，渲染失败', 'error');
      return;
    }

    try {
      // Temporarily disable 3D rotation and remove selection rings for neat capture
      setTilt({ x: 0, y: 0 });
      const originalSelectedId = selectedElementId;
      setSelectedElementId(null);

      // Force high DPI scaling in html2canvas (scale: 3 represents > 300 DPI)
      const canvas = await html2canvas(cardRef.current, {
        scale: 3.5,
        useCORS: true,
        backgroundColor: null,
        logging: false
      });

      const imgData = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 1.0);
      
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", imgData);
      downloadAnchor.setAttribute("download", `aurelius_${activeSide === 'front' ? '正面' : '背面'}_HD.${format}`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setSelectedElementId(originalSelectedId);
      showToast(`名片【${activeSide === 'front' ? '正面' : '背面'}】高清${format.toUpperCase()}图片已导出！`, 'success');
    } catch (err) {
      showToast('图片导出失败，请重试或更换格式', 'error');
    }
  };

  // High quality printing-grade PDF export with simulated Bleed lines and crop marks
  const handleExportPDF = async () => {
    showToast('正在渲染生成印刷级高质量PDF（含裁切裁切参考线）...', 'info');

    try {
      // Capture front side first
      const originalSide = activeSide;
      const originalSelectedId = selectedElementId;
      setSelectedElementId(null);
      setTilt({ x: 0, y: 0 });

      // Build double-side canvas elements sequentially to package in PDF
      setActiveSide('front');
      await new Promise(r => setTimeout(r, 400)); // allow state update and font settling
      
      if (!cardRef.current) throw new Error();
      const canvasFront = await html2canvas(cardRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      setActiveSide('back');
      await new Promise(r => setTimeout(r, 400));
      const canvasBack = await html2canvas(cardRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Initialize jsPDF (Standard ISO Business Card Landscape or Portrait is roughly 90x54)
      const orientation = currentDesign.layout === 'horizontal' ? 'l' : 'p';
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: [94, 58] // 90x54 with +2mm bleed lines on each edge
      });

      // Draw crop lines / print-ready markups in the PDF directly
      // Front page
      const imgFront = canvasFront.toDataURL('image/png');
      pdf.addImage(imgFront, 'PNG', 2, 2, 90, 54);
      
      // Draw simulated subtle bleed indicator text in corner
      pdf.setFontSize(5);
      pdf.setTextColor(150, 150, 150);
      pdf.text('SICAU Bleed Marker [2mm Area Boundary]', 4, 3);

      // Back page
      pdf.addPage([94, 58], orientation);
      const imgBack = canvasBack.toDataURL('image/png');
      pdf.addImage(imgBack, 'PNG', 2, 2, 90, 54);
      pdf.text('SICAU Bleed Marker [2mm Area Boundary]', 4, 3);

      pdf.save(`sicau_print_ready_${Date.now()}.pdf`);

      // Restore initial user editing state
      setActiveSide(originalSide);
      setSelectedElementId(originalSelectedId);
      showToast('双面印刷级 PDF 生成成功！已在四周安全包含 2mm 出血区，适配工厂高规格裁切。', 'success');
    } catch (err) {
      showToast('PDF 渲染打包失败，请尝试导出 SVG 或图片。', 'error');
    }
  };

  const activeElement = selectedElementId && selectedElementId !== 'logo'
    ? activeSideData.elements.find(el => el.id === selectedElementId)
    : null;

  return (
    <div className="bg-brand-beige text-brand-charcoal min-h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden font-sans-hanken selection:bg-brand-gold selection:text-brand-charcoal">
      
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-charcoal border border-brand-gold/20 text-white px-6 py-3 rounded-sm shadow-xl flex items-center gap-3 animate-fade-in max-w-md text-xs tracking-wide">
          <span className="text-brand-gold">✦</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* LEFT AREA: High-Fidelity Preview Canvas */}
      <section className="flex-grow bg-gray-100 p-6 md:p-12 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center gap-8 relative select-none">
        {/* Ambient layout grids in workspace */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-60 pointer-events-none" />

        {/* View mode indicators */}
        <div className="flex gap-4 z-10">
          <button 
            onClick={() => setActiveSide('front')}
            className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
              activeSide === 'front' 
                ? 'bg-brand-charcoal text-white shadow-md' 
                : 'bg-white/80 text-brand-gray border border-brand-border/60 hover:text-brand-charcoal'
            }`}
          >
            名片正面 (FRONT SIDE)
          </button>
          <button 
            onClick={() => setActiveSide('back')}
            className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
              activeSide === 'back' 
                ? 'bg-brand-charcoal text-white shadow-md' 
                : 'bg-white/80 text-brand-gray border border-brand-border/60 hover:text-brand-charcoal'
            }`}
          >
            名片背面 (BACK SIDE)
          </button>
          <button 
            onClick={toggleSide}
            className="p-2 bg-white/80 hover:bg-white text-brand-charcoal rounded-full border border-brand-border/60 shadow-sm transition-all"
            title="一键双面翻转"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Card Container with 3D Parallax Tilt */}
        <div className="relative group/canvas select-none">
          {/* Outer perspective frame */}
          <div 
            onMouseMove={handleMouseMove3D}
            onMouseLeave={handleMouseLeave3D}
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: draggingId || isDraggingLogo ? 'none' : 'transform 0.2s ease-out'
            }}
            className="relative"
          >
            {/* Bleed line container (90x54 with safety offset) */}
            <div className="absolute -inset-2.5 border border-dashed border-brand-gold/25 pointer-events-none rounded-sm flex items-center justify-center">
              <span className="absolute -top-5 left-0 text-[8px] uppercase tracking-wider text-brand-gold opacity-50 font-mono">
                印前2mm安全裁切线 (Bleed Line)
              </span>
            </div>

            {/* THE BUSINESS CARD */}
            <div 
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              className={`relative bg-white luxury-shadow border border-[#eaeaea] overflow-hidden transition-all duration-300 ${
                currentDesign.layout === 'horizontal' 
                  ? 'w-[450px] h-[257px]' 
                  : 'w-[257px] h-[450px]'
              } ${
                currentDesign.cornerRadius === 'sm' ? 'rounded-[4px]' :
                currentDesign.cornerRadius === 'md' ? 'rounded-[8px]' :
                currentDesign.cornerRadius === 'lg' ? 'rounded-[16px]' :
                currentDesign.cornerRadius === 'full' ? 'rounded-[24px]' : 'rounded-none'
              }`}
              style={{ 
                background: activeSideData.background,
                color: activeSideData.textColor
              }}
            >
              {/* Paper finish textures simulated in CSS */}
              {currentDesign.paperType === 'linen' && (
                <div 
                  className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
                  style={{
                    background: `repeating-linear-gradient(45deg, #000, #000 2px, transparent 2px, transparent 10px),
                                 repeating-linear-gradient(-45deg, #000, #000 2px, transparent 2px, transparent 10px)`
                  }}
                />
              )}
              {currentDesign.paperType === 'metallic' && (
                <div 
                  className="absolute inset-0 opacity-[0.08] mix-blend-color-burn pointer-events-none bg-gradient-to-r from-white via-neutral-300 to-white"
                  style={{ backgroundSize: '200% auto' }}
                />
              )}
              {currentDesign.finishType === 'gold_foil' && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-brand-gold/5 via-transparent to-brand-gold/10 mix-blend-color-dodge" />
              )}

              {/* Grid guide helper overlay on dragging */}
              {(draggingId || isDraggingLogo) && (
                <div className="absolute inset-0 border border-brand-gold/15 bg-brand-gold/[0.01] pointer-events-none z-10 animate-pulse">
                  <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-brand-gold/10" />
                  <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-brand-gold/10" />
                </div>
              )}

              {/* LOGO DRAGGABLE */}
              {activeSideData.logoType !== 'none' && (
                <div 
                  onMouseDown={handleLogoStartDrag}
                  onMouseEnter={() => setHoveredElementId('logo')}
                  onMouseLeave={() => setHoveredElementId(null)}
                  className={`absolute group cursor-grab active:cursor-grabbing transition-shadow hover:ring-1 hover:ring-brand-gold/40 hover:ring-offset-2 z-20 ${
                    selectedElementId === 'logo' ? 'ring-2 ring-brand-gold ring-offset-2' : ''
                  }`}
                  style={{ 
                    left: `${activeSideData.logoX}%`, 
                    top: `${activeSideData.logoY}%`,
                    transform: 'translate(-50%, -50%)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Coordinates indicator on drag or hover */}
                  {(hoveredElementId === 'logo' || selectedElementId === 'logo') && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-brand-charcoal text-white text-[8px] font-mono px-1.5 py-0.5 rounded-sm whitespace-nowrap z-30 pointer-events-none">
                      徽标 X:{activeSideData.logoX}% Y:{activeSideData.logoY}%
                    </span>
                  )}

                  {/* Icon or Monogram markup */}
                  {activeSideData.logoType === 'icon' ? (
                    <span 
                      className={`material-symbols-outlined select-none transition-all ${
                        currentDesign.finishType === 'gold_foil' 
                          ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-200 font-bold drop-shadow-sm' 
                          : ''
                      }`}
                      style={{ 
                        fontSize: `${activeSideData.logoSize}px`,
                        color: currentDesign.finishType === 'gold_foil' ? undefined : activeSideData.textColor
                      }}
                    >
                      {activeSideData.logoIcon}
                    </span>
                  ) : (
                    <span 
                      className={`font-serif-caslon font-bold tracking-tight text-center block ${
                        currentDesign.finishType === 'gold_foil' 
                          ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-200' 
                          : ''
                      }`}
                      style={{ 
                        fontSize: `${activeSideData.logoSize}px`,
                        color: currentDesign.finishType === 'gold_foil' ? undefined : activeSideData.textColor,
                        lineHeight: 1
                      }}
                    >
                      {activeSideData.logoText || 'A'}
                    </span>
                  )}
                </div>
              )}

              {/* DRAGGABLE TEXT ELEMENTS */}
              {activeSideData.elements.map((el) => {
                const isSelected = selectedElementId === el.id;
                const isHovered = hoveredElementId === el.id;
                
                // Align styles map
                const textAlignment = el.align === 'center' ? 'text-center' : el.align === 'right' ? 'text-right' : 'text-left';
                const xTransform = el.align === 'center' ? '-50%' : el.align === 'right' ? '-100%' : '0%';
                
                // Font Family map
                const fontClass = el.fontFamily === 'serif-caslon' ? 'font-serif-caslon' : el.fontFamily === 'sans-hanken' ? 'font-sans-hanken' : el.fontFamily === 'mono' ? 'font-mono' : 'font-sans';
                
                // Font Weight map
                const weightClass = el.fontWeight === 'bold' ? 'font-bold' : el.fontWeight === 'semibold' ? 'font-semibold' : el.fontWeight === 'medium' ? 'font-medium' : 'font-normal';

                return (
                  <div 
                    key={el.id}
                    onMouseDown={(e) => handleElementStartDrag(el.id, e)}
                    onMouseEnter={() => setHoveredElementId(el.id)}
                    onMouseLeave={() => setHoveredElementId(null)}
                    className={`absolute cursor-grab active:cursor-grabbing hover:bg-brand-gold/[0.05] hover:ring-1 hover:ring-brand-gold/30 z-20 ${
                      isSelected ? 'ring-2 ring-brand-gold' : ''
                    }`}
                    style={{ 
                      left: `${el.x}%`, 
                      top: `${el.y}%`,
                      transform: `translate(${xTransform}, -50%)`,
                      maxWidth: '85%'
                    }}
                  >
                    {/* Visual alignment aids and element coords */}
                    {(isHovered || isSelected) && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-brand-charcoal text-white text-[8px] font-mono px-1.5 py-0.5 rounded-sm whitespace-nowrap z-30 pointer-events-none flex items-center gap-1">
                        <Move className="w-2.5 h-2.5 text-brand-gold" />
                        <span>X:{el.x}% Y:{el.y}%</span>
                      </div>
                    )}

                    {el.type === 'shape' ? (
                      el.shapeType === 'circle' ? (
                        <div 
                          style={{
                            width: `${el.shapeWidth || 20}px`,
                            height: `${el.shapeWidth || 20}px`,
                            backgroundColor: el.color,
                            borderRadius: '50%'
                          }}
                        />
                      ) : (
                        <div 
                          style={{
                            width: `${el.shapeWidth || 60}px`,
                            height: `${el.shapeHeight || 3}px`,
                            backgroundColor: el.color
                          }}
                        />
                      )
                    ) : el.type === 'icon' ? (
                      (() => {
                        const IconComp = IconComponents[el.iconName || 'graduation'] || GraduationCap;
                        return <IconComp style={{ width: `${el.fontSize || 24}px`, height: `${el.fontSize || 24}px`, color: el.color }} />;
                      })()
                    ) : (
                      <p 
                        className={`${fontClass} ${weightClass} ${textAlignment} select-none leading-none tracking-tight break-all`}
                        style={{ 
                          fontSize: `${el.fontSize}px`, 
                          color: el.color,
                          letterSpacing: el.letterSpacing
                        }}
                      >
                        {el.text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drag tips info bar */}
        <div className="flex items-center gap-3 bg-white border border-brand-border px-6 py-2.5 rounded-full shadow-sm">
          <span className="animate-bounce">👉</span>
          <span className="text-xs font-semibold text-brand-charcoal">
            可以直接在画布的名片上【按住鼠标拖动】文字和标志来调整精细版面位置
          </span>
        </div>
      </section>

      {/* RIGHT AREA: Side Control Editor Panel */}
      <aside className="w-full md:w-[420px] bg-white border-l border-brand-border flex flex-col shrink-0 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
        <div className="p-8 space-y-8 pb-16">
          
          {/* Section A: Layout & Template Pack Import */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-sans-hanken text-xs uppercase tracking-widest text-brand-charcoal font-bold">
                名片物理版式 (Card Layout)
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-md hover:bg-brand-beige border border-brand-border text-brand-gray hover:text-brand-charcoal"
                  title="导入备份设计包 (.json)"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportJSON}
                  accept=".json"
                  className="hidden"
                />
                <button 
                  onClick={handleExportJSON}
                  className="p-1.5 rounded-md hover:bg-brand-beige border border-brand-border text-brand-gray hover:text-brand-charcoal"
                  title="导出备份设计包 (.json)"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleLayoutChange('horizontal')}
                className={`py-3 px-4 rounded-sm border text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  currentDesign.layout === 'horizontal' 
                    ? 'border-brand-gold bg-brand-beige text-brand-charcoal' 
                    : 'border-brand-border hover:border-brand-gray text-brand-gray'
                }`}
              >
                <div className="w-8 h-5 border border-current rounded-sm mb-1 opacity-70" />
                <span>标准横版 (90x54)</span>
              </button>
              <button 
                onClick={() => handleLayoutChange('vertical')}
                className={`py-3 px-4 rounded-sm border text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  currentDesign.layout === 'vertical' 
                    ? 'border-brand-gold bg-brand-beige text-brand-charcoal' 
                    : 'border-brand-border hover:border-brand-gray text-brand-gray'
                }`}
              >
                <div className="w-5 h-8 border border-current rounded-sm mb-1 opacity-70" />
                <span>经典竖版 (54x90)</span>
              </button>
            </div>
          </div>

          {/* Section B: Add Custom Components & Canvas Fields */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>添加画布自定义组件 (Add Components)</span>
            </h4>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleAddTextElement}
                className="p-2 bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-600 rounded-md text-[10px] font-bold transition-all flex flex-col items-center gap-1 shadow-sm cursor-pointer"
              >
                <Type className="w-4 h-4 text-emerald-600" />
                <span>添加文本</span>
              </button>
              
              <button
                onClick={() => { setShowShapeSelector(!showShapeSelector); setShowIconSelector(false); }}
                className={`p-2 bg-white border rounded-md text-[10px] font-bold transition-all flex flex-col items-center gap-1 shadow-sm cursor-pointer ${
                  showShapeSelector ? 'border-emerald-500 text-emerald-600 bg-emerald-50/20' : 'border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
                }`}
              >
                <Grid className="w-4 h-4 text-emerald-600" />
                <span>添加图形</span>
              </button>
              
              <button
                onClick={() => { setShowIconSelector(!showIconSelector); setShowShapeSelector(false); }}
                className={`p-2 bg-white border rounded-md text-[10px] font-bold transition-all flex flex-col items-center gap-1 shadow-sm cursor-pointer ${
                  showIconSelector ? 'border-emerald-500 text-emerald-600 bg-emerald-50/20' : 'border-gray-200 hover:border-emerald-500 hover:text-emerald-600'
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>学术 Icon</span>
              </button>
            </div>

            {/* Shape selection subpanel */}
            {showShapeSelector && (
              <div className="grid grid-cols-3 gap-2 p-2 bg-white border border-gray-100 rounded-md animate-fade-in text-[10px]">
                <button
                  onClick={() => { handleAddShapeElement('rect'); setShowShapeSelector(false); }}
                  className="p-1.5 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 rounded text-center font-semibold text-gray-700 cursor-pointer"
                >
                  ■ 矩形
                </button>
                <button
                  onClick={() => { handleAddShapeElement('circle'); setShowShapeSelector(false); }}
                  className="p-1.5 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 rounded text-center font-semibold text-gray-700 cursor-pointer"
                >
                  ● 圆形
                </button>
                <button
                  onClick={() => { handleAddShapeElement('line'); setShowShapeSelector(false); }}
                  className="p-1.5 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 rounded text-center font-semibold text-gray-700 cursor-pointer"
                >
                  ▬ 装饰线
                </button>
              </div>
            )}

            {/* Icon selection subpanel */}
            {showIconSelector && (
              <div className="p-2.5 bg-white border border-gray-100 rounded-md animate-fade-in space-y-1.5">
                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-1">选择学术及联系图标：</span>
                <div className="grid grid-cols-6 gap-1.5">
                  {Object.keys(IconComponents).map((name) => {
                    const IconComp = IconComponents[name];
                    return (
                      <button
                        key={name}
                        onClick={() => { handleAddIconElement(name); setShowIconSelector(false); }}
                        className="p-1.5 hover:bg-emerald-50 hover:text-emerald-600 rounded border border-gray-100 flex items-center justify-center transition-all cursor-pointer"
                        title={name}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section B2: Card Elements List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-brand-border">
              <h3 className="font-sans-hanken text-xs uppercase tracking-widest text-brand-charcoal font-bold">
                画布图层组件 (Layer Elements)
              </h3>
            </div>

            <div className="space-y-3">
              {activeSideData.elements.map((el) => {
                const isSelected = selectedElementId === el.id;
                return (
                  <div 
                    key={el.id} 
                    className={`p-3 rounded-sm border transition-all ${
                      isSelected ? 'border-emerald-600 bg-emerald-50/10 shadow-sm' : 'border-brand-border'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-800">
                        {el.type === 'shape' 
                          ? `自定义图形 (${el.shapeType === 'rect' ? '矩形' : el.shapeType === 'circle' ? '圆形' : '装饰线'})`
                          : el.type === 'icon'
                          ? `学术图标 (${el.iconName})`
                          : el.key.startsWith('custom') 
                          ? '自定义文本行' 
                          : el.key === 'name' 
                          ? '姓名 / Name' 
                          : el.key === 'title' 
                          ? '职位 / Title' 
                          : el.key === 'phone' 
                          ? '电话 / Phone' 
                          : el.key === 'email' 
                          ? '邮箱 / Email' 
                          : el.key === 'web' 
                          ? '网址 / Website' 
                          : '通用信息'
                        }
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedElementId(isSelected ? null : el.id)}
                          className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                            isSelected ? 'text-emerald-700 font-bold' : 'text-brand-gray hover:text-brand-charcoal'
                          }`}
                        >
                          <Settings className="w-3 h-3" />
                          <span>微调参数</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteElement(el.id)}
                          className="text-brand-gray hover:text-red-500 transition-colors"
                          title="删除该图层"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {el.type === 'shape' || el.type === 'icon' ? (
                      <div className="text-[10px] text-gray-500 italic pt-1 flex items-center gap-1 select-none">
                        <span>✨ 已添加，在右侧点击“微调参数”控制尺寸及色彩</span>
                      </div>
                    ) : (
                      <input 
                        type="text"
                        value={el.text}
                        onChange={(e) => handleTextChange(el.id, e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-brand-border/80 py-1 font-sans text-sm text-brand-charcoal focus:outline-none focus:border-emerald-600"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section C: Format Detail adjustments for selected element */}
          {activeElement && (
            <div className="p-4 bg-emerald-50/15 border border-emerald-600/30 rounded-lg space-y-4 animate-fade-in text-brand-charcoal">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h4 className="text-xs uppercase tracking-wider text-brand-charcoal font-bold flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {activeElement.type === 'shape' 
                      ? '自定义图形样式微调' 
                      : activeElement.type === 'icon' 
                      ? '学术图标样式微调' 
                      : '文本字体排版微调'
                    }
                  </span>
                </h4>
                <button 
                  onClick={() => setSelectedElementId(null)}
                  className="text-xs text-brand-gray hover:text-brand-charcoal cursor-pointer font-bold"
                >
                  ✕ 关闭面板
                </button>
              </div>

              {activeElement.type === 'shape' ? (
                /* SHAPE CUSTOMIZER */
                <div className="space-y-3">
                  <div className="text-[11px] text-gray-500 font-medium">
                    当前图形类型: <span className="font-bold text-emerald-700">{activeElement.shapeType === 'rect' ? '矩形' : activeElement.shapeType === 'circle' ? '圆形' : '装饰线'}</span>
                  </div>

                  {activeElement.shapeType !== 'circle' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-brand-gray font-bold uppercase">
                        <span>图形宽度 / Width</span>
                        <span className="font-mono">{activeElement.shapeWidth || 60}px</span>
                      </div>
                      <input 
                        type="range"
                        min="5"
                        max="300"
                        value={activeElement.shapeWidth || 60}
                        onChange={(e) => handleShapeWidthChange(parseInt(e.target.value))}
                        className="w-full h-1 bg-brand-border rounded-full appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                  )}

                  {activeElement.shapeType !== 'circle' && activeElement.shapeType !== 'line' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-brand-gray font-bold uppercase">
                        <span>图形高度 / Height</span>
                        <span className="font-mono">{activeElement.shapeHeight || 20}px</span>
                      </div>
                      <input 
                        type="range"
                        min="2"
                        max="150"
                        value={activeElement.shapeHeight || 20}
                        onChange={(e) => handleShapeHeightChange(parseInt(e.target.value))}
                        className="w-full h-1 bg-brand-border rounded-full appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                  )}

                  {activeElement.shapeType === 'circle' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-brand-gray font-bold uppercase">
                        <span>圆形大小 / Size</span>
                        <span className="font-mono">{activeElement.shapeWidth || 20}px</span>
                      </div>
                      <input 
                        type="range"
                        min="5"
                        max="150"
                        value={activeElement.shapeWidth || 20}
                        onChange={(e) => handleShapeWidthChange(parseInt(e.target.value))}
                        className="w-full h-1 bg-brand-border rounded-full appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                  )}

                  {activeElement.shapeType === 'line' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-brand-gray font-bold uppercase">
                        <span>线条粗细 / Weight</span>
                        <span className="font-mono">{activeElement.shapeHeight || 2}px</span>
                      </div>
                      <input 
                        type="range"
                        min="1"
                        max="15"
                        value={activeElement.shapeHeight || 2}
                        onChange={(e) => handleShapeHeightChange(parseInt(e.target.value))}
                        className="w-full h-1 bg-brand-border rounded-full appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                  )}
                </div>
              ) : activeElement.type === 'icon' ? (
                /* ICON CUSTOMIZER */
                <div className="space-y-3">
                  <div className="text-[11px] text-gray-500 font-medium flex items-center gap-2">
                    当前学术图标: <span className="font-bold text-emerald-700">{activeElement.iconName}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-brand-gray font-bold uppercase">
                      <span>图标尺寸 / Size</span>
                      <span className="font-mono">{activeElement.fontSize || 24}px</span>
                    </div>
                    <input 
                      type="range"
                      min="12"
                      max="100"
                      value={activeElement.fontSize || 24}
                      onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                      className="w-full h-1 bg-brand-border rounded-full appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>
              ) : (
                /* REGULAR TEXT CUSTOMIZER */
                <>
                  {/* Font Family Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-brand-gray font-bold">字体风格</label>
                      <select 
                        value={activeElement.fontFamily}
                        onChange={(e) => handleFontFamilyChange(e.target.value)}
                        className="w-full bg-white border border-brand-border px-2 py-1.5 text-xs rounded-sm focus:outline-none focus:border-emerald-600 font-semibold text-brand-charcoal cursor-pointer"
                      >
                        {FONT_OPTIONS.map(font => (
                          <option key={font.value} value={font.value}>{font.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-brand-gray font-bold">字重粗细</label>
                      <select 
                        value={activeElement.fontWeight}
                        onChange={(e) => handleFontWeightChange(e.target.value)}
                        className="w-full bg-white border border-brand-border px-2 py-1.5 text-xs rounded-sm focus:outline-none focus:border-emerald-600 font-semibold text-brand-charcoal cursor-pointer"
                      >
                        {WEIGHT_OPTIONS.map(wt => (
                          <option key={wt.value} value={wt.value}>{wt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Size & Spacing Sliders */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-brand-gray font-bold uppercase">
                        <span>字体大小</span>
                        <span className="font-mono">{activeElement.fontSize}px</span>
                      </div>
                      <input 
                        type="range"
                        min="6"
                        max="48"
                        value={activeElement.fontSize}
                        onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                        className="w-full h-1 bg-brand-border rounded-full appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-brand-gray font-bold uppercase">
                        <span>字间距</span>
                        <span className="font-mono">{activeElement.letterSpacing}</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="40"
                        value={parseFloat(activeElement.letterSpacing) * 100 || 0}
                        onChange={(e) => handleLetterSpacingChange(`${parseFloat(e.target.value) / 100}em`)}
                        className="w-full h-1 bg-brand-border rounded-full appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Text Alignment Alignment Option */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-brand-gray font-bold block mb-1">对齐锚点</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAlignChange('left')}
                        className={`flex-grow py-1 border rounded-sm flex justify-center text-xs cursor-pointer ${
                          activeElement.align === 'left' ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold shadow-sm' : 'border-brand-border text-brand-gray'
                        }`}
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleAlignChange('center')}
                        className={`flex-grow py-1 border rounded-sm flex justify-center text-xs cursor-pointer ${
                          activeElement.align === 'center' ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold shadow-sm' : 'border-brand-border text-brand-gray'
                        }`}
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleAlignChange('right')}
                        className={`flex-grow py-1 border rounded-sm flex justify-center text-xs cursor-pointer ${
                          activeElement.align === 'right' ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold shadow-sm' : 'border-brand-border text-brand-gray'
                        }`}
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section D: Logo Customization Panel */}
          <div className="space-y-4">
            <h3 className="font-sans-hanken text-xs uppercase tracking-widest text-brand-charcoal font-bold pb-2 border-b border-brand-border">
              定制品牌标志 (Brand Logo)
            </h3>
            
            {/* Logo Select type buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handleLogoTypeChange('icon')}
                className={`py-2 px-3 border rounded-sm text-xs font-semibold cursor-pointer text-center ${
                  activeSideData.logoType === 'icon' ? 'border-brand-gold bg-brand-beige' : 'border-brand-border'
                }`}
              >
                几何符号
              </button>
              <button 
                onClick={() => handleLogoTypeChange('text')}
                className={`py-2 px-3 border rounded-sm text-xs font-semibold cursor-pointer text-center ${
                  activeSideData.logoType === 'text' ? 'border-brand-gold bg-brand-beige' : 'border-brand-border'
                }`}
              >
                Monogram
              </button>
              <button 
                onClick={() => handleLogoTypeChange('none')}
                className={`py-2 px-3 border rounded-sm text-xs font-semibold cursor-pointer text-center ${
                  activeSideData.logoType === 'none' ? 'border-brand-gold bg-brand-beige' : 'border-brand-border'
                }`}
              >
                无Logo
              </button>
            </div>

            {/* If Logo type is Monogram text */}
            {activeSideData.logoType === 'text' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-brand-gray font-bold">Logo 首字母缩写</label>
                  <input 
                    type="text"
                    maxLength={2}
                    value={activeSideData.logoText}
                    onChange={(e) => {
                      const updatedDesign = { ...currentDesign };
                      if (activeSide === 'front') {
                        updatedDesign.front.logoText = e.target.value.toUpperCase();
                      } else {
                        updatedDesign.back.logoText = e.target.value.toUpperCase();
                      }
                      onChangeDesign(updatedDesign);
                    }}
                    className="w-full bg-transparent border-0 border-b border-brand-border py-1.5 text-sm text-brand-charcoal focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>
            )}

            {/* If Logo type is system icon */}
            {activeSideData.logoType === 'icon' && (
              <div className="space-y-3">
                <label className="text-[10px] uppercase text-brand-gray font-bold block">选择内置几何几何抽象标示</label>
                <div className="flex flex-wrap gap-2.5">
                  {ABSTRACT_LOGOS.map((lg) => {
                    const isIconSelected = activeSideData.logoIcon === lg.icon;
                    return (
                      <button 
                        key={lg.id}
                        onClick={() => handleLogoIconChange(lg.icon, lg.content)}
                        className={`w-9 h-9 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                          isIconSelected ? 'border-brand-gold bg-brand-beige text-brand-gold font-bold scale-105 shadow-sm' : 'border-brand-border text-brand-gray hover:text-brand-charcoal'
                        }`}
                        title={lg.name}
                      >
                        <span className="material-symbols-outlined text-xl">{lg.icon}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size parameter */}
            {activeSideData.logoType !== 'none' && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[10px] text-brand-gray font-bold uppercase">
                  <span>标志大小规格</span>
                  <span className="font-mono">{activeSideData.logoSize}px</span>
                </div>
                <input 
                  type="range"
                  min="16"
                  max="64"
                  value={activeSideData.logoSize}
                  onChange={(e) => handleLogoSizeChange(parseInt(e.target.value))}
                  className="w-full h-1 bg-brand-border rounded-full appearance-none cursor-pointer accent-brand-gold"
                />
              </div>
            )}
          </div>

          {/* Section E: Presets & Custom Color Palette Picker */}
          <div className="space-y-4">
            <h3 className="font-sans-hanken text-xs uppercase tracking-widest text-brand-charcoal font-bold pb-2 border-b border-brand-border">
              尊贵配色方案 (Color Palettes)
            </h3>

            {/* Color preset buttons */}
            <div className="flex flex-wrap gap-3">
              {COLOR_PALETTES.map((palette) => {
                const isSelected = currentDesign.paletteId === palette.id;
                return (
                  <button 
                    key={palette.id}
                    onClick={() => handleApplyPalette(palette)}
                    className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer relative ${
                      isSelected ? 'border-brand-gold scale-110 shadow-md ring-1 ring-brand-gold' : 'border-[#eaeaea] hover:scale-105'
                    }`}
                    style={{ background: palette.background }}
                    title={palette.name}
                  >
                    {/* Tiny half circle to represent text contrast color */}
                    <span 
                      className="absolute bottom-0 left-0 right-0 h-3 rounded-b-full opacity-90 block" 
                      style={{ background: palette.textColor }}
                    />
                    {isSelected && (
                      <Check className="w-3 h-3 text-brand-gold absolute inset-0 m-auto filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    )}
                  </button>
                );
              })}
              <button 
                onClick={() => setShowCustomColor(!showCustomColor)}
                className={`w-8 h-8 rounded-full border border-dashed border-brand-gray/50 flex items-center justify-center cursor-pointer hover:border-brand-gold ${
                  showCustomColor ? 'bg-brand-gold/10' : ''
                }`}
                title="自定义调色盘"
              >
                <Paintbrush className="w-3.5 h-3.5 text-brand-gray hover:text-brand-gold" />
              </button>
            </div>

            {/* Custom Color picking form expansion */}
            {showCustomColor && (
              <div className="p-4 bg-brand-beige/25 border border-brand-border rounded-sm space-y-4 animate-fade-in text-xs">
                <h4 className="font-sans-hanken font-bold text-brand-charcoal">自定义单面调色</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-brand-gray font-bold uppercase block">卡片底色 (Bg)</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        value={customBg}
                        onChange={(e) => setCustomBg(e.target.value)}
                        className="w-7 h-7 rounded-full border border-brand-border overflow-hidden cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={customBg.toUpperCase()}
                        onChange={(e) => setCustomBg(e.target.value)}
                        className="w-18 bg-white border border-brand-border text-[10px] px-1.5 py-1 focus:outline-none uppercase font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-brand-gray font-bold uppercase block">文字颜色 (Text)</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="w-7 h-7 rounded-full border border-brand-border overflow-hidden cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={customText.toUpperCase()}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="w-18 bg-white border border-brand-border text-[10px] px-1.5 py-1 focus:outline-none uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleCustomColorApply}
                  className="w-full py-2 bg-brand-charcoal text-white hover:bg-brand-gold text-[10px] font-bold uppercase tracking-widest rounded-sm cursor-pointer"
                >
                  应用当前自定义色彩
                </button>
              </div>
            )}
          </div>

          {/* Section F: Fine paper finish textures */}
          <div className="space-y-4">
            <h3 className="font-sans-hanken text-xs uppercase tracking-widest text-brand-charcoal font-bold pb-2 border-b border-brand-border">
              纸张材质与压印印后工艺 (Paper & Finishes)
            </h3>

            {/* Paper Selection */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-brand-gray font-bold">高级重磅纸张</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'matte', label: '特厚纯棉' },
                  { id: 'linen', label: '英伦莱妮' },
                  { id: 'metallic', label: '拉丝金属' }
                ] as const).map((paper) => (
                  <button 
                    key={paper.id}
                    onClick={() => handlePaperTypeChange(paper.id)}
                    className={`py-2 px-1 border text-[11px] font-semibold text-center cursor-pointer rounded-sm ${
                      currentDesign.paperType === paper.id ? 'border-brand-gold bg-brand-beige text-brand-charcoal font-bold' : 'border-brand-border text-brand-gray hover:border-brand-gray'
                    }`}
                  >
                    {paper.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Print Finishes Selection */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-brand-gray font-bold">高端印后工艺</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'deboss', label: '重磅压凹' },
                  { id: 'gold_foil', label: '亮香槟金' },
                  { id: 'letterpress', label: '活字油墨' }
                ] as const).map((finish) => (
                  <button 
                    key={finish.id}
                    onClick={() => handleFinishTypeChange(finish.id)}
                    className={`py-2 px-1 border text-[11px] font-semibold text-center cursor-pointer rounded-sm ${
                      currentDesign.finishType === finish.id ? 'border-brand-gold bg-brand-beige text-brand-charcoal font-bold' : 'border-brand-border text-brand-gray hover:border-brand-gray'
                    }`}
                  >
                    {finish.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card rounded corners */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-brand-gray font-bold block">物理名片裁切圆角 (Corner Radius)</label>
              <div className="grid grid-cols-5 gap-1">
                {([
                  { id: 'none', label: '直角' },
                  { id: 'sm', label: '2px' },
                  { id: 'md', label: '4px' },
                  { id: 'lg', label: '8px' },
                  { id: 'full', label: '圆卡' }
                ] as const).map((cr) => (
                  <button 
                    key={cr.id}
                    onClick={() => handleCornerRadiusChange(cr.id)}
                    className={`py-1.5 border text-[10px] text-center cursor-pointer rounded-sm ${
                      currentDesign.cornerRadius === cr.id ? 'border-brand-gold bg-brand-beige text-brand-charcoal font-bold' : 'border-brand-border text-brand-gray hover:border-brand-gray'
                    }`}
                  >
                    {cr.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-brand-border" />

          {/* Section G: Export Action Panel (the user explicit requested this) */}
          <div className="space-y-4 pt-2">
            <h3 className="font-sans-hanken text-xs uppercase tracking-widest text-brand-charcoal font-bold">
              设计保存与印制导出 (Export Options)
            </h3>
            
            <div className="space-y-3">
              {/* PDF EXPORT (High-Res Bleed line format) */}
              <button 
                onClick={handleExportPDF}
                className="w-full py-3.5 bg-brand-charcoal text-white hover:bg-brand-gold font-sans-hanken text-xs uppercase tracking-widest font-bold rounded-sm transition-all active:scale-98 flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
              >
                <FileText className="w-4 h-4 text-brand-gold" />
                <span>导出双面印刷级 PDF (含出血线)</span>
              </button>

              {/* IMAGE EXPORTS Grid */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleExportImage('png')}
                  className="py-3 border border-brand-charcoal text-brand-charcoal hover:bg-brand-beige font-sans-hanken text-[10px] uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Image className="w-3.5 h-3.5" />
                  <span>导出 PNG 图片</span>
                </button>
                <button 
                  onClick={() => handleExportImage('jpeg')}
                  className="py-3 border border-brand-charcoal text-brand-charcoal hover:bg-brand-beige font-sans-hanken text-[10px] uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Image className="w-3.5 h-3.5" />
                  <span>导出 JPG 图片</span>
                </button>
              </div>

              {/* VECTOR SVG EXPORT & PROJECTS SAVE */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleExportSVG}
                  className="py-3 border border-brand-gray/50 text-brand-gray hover:border-brand-charcoal hover:text-brand-charcoal font-sans-hanken text-[10px] uppercase tracking-widest font-semibold rounded-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="无损矢量放大印刷厂通用格式"
                >
                  <FileCode className="w-3.5 h-3.5 text-brand-gold" />
                  <span>导出 SVG 矢量图</span>
                </button>
                <button 
                  onClick={handleExportJSON}
                  className="py-3 border border-brand-gray/50 text-brand-gray hover:border-brand-charcoal hover:text-brand-charcoal font-sans-hanken text-[10px] uppercase tracking-widest font-semibold rounded-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="保存设计工程包到本地"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>导出项目设计包</span>
                </button>
              </div>

              {/* ORDER SAMPLES */}
              <button 
                onClick={() => onNavigate('checkout')}
                className="w-full py-3.5 border border-dashed border-brand-gold text-brand-gold hover:bg-brand-gold/5 font-sans-hanken text-xs uppercase tracking-widest font-bold rounded-sm transition-all flex items-center justify-center gap-2"
              >
                <BadgeCent className="w-4 h-4" />
                <span>估算印制下单预算 / 前往订单页</span>
              </button>
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
}
