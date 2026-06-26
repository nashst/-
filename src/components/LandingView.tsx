/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, PenTool, Award, Sparkles, Mail, Send } from 'lucide-react';
import React, { useState } from 'react';
import { TEMPLATES } from '../data';
import { CardTemplate } from '../types';

interface LandingViewProps {
  onNavigate: (view: 'landing' | 'gallery' | 'workspace' | 'checkout') => void;
  onSelectTemplate: (template: CardTemplate) => void;
}

export default function LandingView({ onNavigate, onSelectTemplate }: LandingViewProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // 3D Card tilt effect on hover
  const [tilt, setTilt] = useState({ x: -5, y: 10 });
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Card relative mouse positions
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Center point of the card
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Maximum tilt angles: 12 degrees
    const rotateX = ((centerY - y) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 15;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    // Return to gentle resting state
    setTilt({ x: -5, y: 10 });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmailInput('');
      }, 3000);
    }
  };

  return (
    <div className="bg-brand-beige text-brand-charcoal min-h-screen font-sans-hanken overflow-x-hidden selection:bg-brand-gold selection:text-brand-charcoal">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Hero info */}
          <div className="z-10 animate-fade-in space-y-8">
            <span className="font-sans-hanken text-xs tracking-[0.2em] text-emerald-700 uppercase font-semibold block bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
              ACADEMIC DESIGN SYSTEM · 四川农业大学名片设计
            </span>
            <h1 className="font-serif-caslon text-4xl md:text-5xl text-brand-charcoal font-bold tracking-tight leading-[1.1] max-w-xl">
              学术形象的精准表达。
              <span className="block text-emerald-600 mt-2 font-light text-2xl md:text-4xl">Precision in Academic Representation.</span>
            </h1>
            <p className="text-brand-gray text-sm md:text-base leading-relaxed max-w-md">
              本系统专为四川农业大学教职工、科研工作者及在校学生设计，提供规范、科学、极简的学术名片定制方案，助力您的学术交流与科研项目对接。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => onNavigate('workspace')}
                className="bg-brand-charcoal text-white hover:bg-emerald-600 font-sans-hanken text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-lg transition-all active:scale-95 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <span>进入名片工作台</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onNavigate('gallery')}
                className="border border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white font-sans-hanken text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-lg transition-all active:scale-95 cursor-pointer"
              >
                浏览学术模版
              </button>
            </div>
          </div>

          {/* Right Hero Interactive 3D Card */}
          <div className="relative h-[380px] md:h-[480px] flex items-center justify-center card-perspective mt-12 md:mt-0">
            {/* Ambient Background blur */}
            <div className="absolute w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl -top-10 -right-10 pointer-events-none" />
            <div className="absolute w-96 h-96 bg-brand-charcoal/5 rounded-full blur-3xl -bottom-20 -left-20 pointer-events-none" />

            {/* 3D Card Container */}
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.1s ease-out'
              }}
              className="relative z-10 w-full max-w-[380px] aspect-[1.75/1] bg-white rounded-lg border border-gray-200 shadow-xl p-8 md:p-10 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div className="flex justify-between items-start" style={{ transform: 'translateZ(30px)' }}>
                <div>
                  <h3 className="font-sans text-lg text-brand-charcoal font-bold tracking-tight">四川农业大学</h3>
                  <p className="font-sans text-[8px] tracking-[0.1em] text-brand-gray uppercase mt-0.5">Sichuan Agricultural University</p>
                </div>
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-md flex items-center justify-center font-sans text-xs font-semibold">
                  川农
                </div>
              </div>
              
              <div className="space-y-1" style={{ transform: 'translateZ(20px)' }}>
                <h4 className="font-sans text-base font-bold text-brand-charcoal tracking-wide">林向阳</h4>
                <p className="font-sans text-[8px] text-emerald-700 uppercase tracking-widest font-semibold">教授 / 博导 · 作物遗传育种实验室</p>
              </div>

              {/* Card grain overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.01] via-transparent to-white/10 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Curated Templates Section */}
      <section className="bg-gray-100/60 py-20 md:py-28 border-y border-brand-border/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl space-y-3">
              <span className="font-sans text-xs tracking-widest text-emerald-700 uppercase font-bold">精选模版 · MASTERPIECES</span>
              <h2 className="font-sans text-3xl font-bold tracking-tight text-brand-charcoal">
                Curated Templates / 经典学术规范名片
              </h2>
              <p className="text-brand-gray text-sm">
                结合四川农业大学深厚的农林科学传统，我们倾心设计了这套集极简、专业、现代科研于一体的名片排版模版，适合各学科教授、青年学者及研究生使用。
              </p>
            </div>
            <button 
              onClick={() => onNavigate('gallery')}
              className="font-sans text-xs uppercase tracking-widest text-brand-charcoal border-b-2 border-brand-charcoal pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-all cursor-pointer font-bold"
            >
              探索完整学术系列
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEMPLATES.slice(0, 3).map((template, idx) => {
              const isHovered = hoveredCard === template.id;
              return (
                <div 
                  key={template.id}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredCard(template.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => {
                    onSelectTemplate(template);
                    onNavigate('workspace');
                  }}
                >
                  {/* Template Image / Frame */}
                  <div className="aspect-[1.75/1] bg-white rounded-lg border border-gray-200 shadow-md mb-6 overflow-hidden relative transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-lg">
                    {/* Normal view content: elegant typography */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-all duration-500 group-hover:scale-95 group-hover:opacity-10">
                      <h5 className="font-sans text-lg font-bold text-brand-charcoal/80 mb-2">{template.name}</h5>
                      <div className="w-8 h-[1px] bg-emerald-600 mx-auto mb-2" />
                      <p className="text-[10px] text-gray-400 font-sans tracking-wider line-clamp-1">{template.description}</p>
                    </div>

                    {/* Hover view hotlinked photo content */}
                    <div 
                      className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ backgroundImage: `url('${template.bgImage}')` }}
                    />

                    {/* Hover quick overlay */}
                    <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-emerald-600 text-white text-xs tracking-wider font-bold px-6 py-2.5 rounded-lg shadow-lg hover:bg-emerald-700 transition-colors">
                        使用此模版
                      </span>
                    </div>
                  </div>

                  {/* Template Meta */}
                  <div className="flex justify-between items-center px-1">
                    <p className="font-sans text-xs font-semibold text-brand-charcoal">
                      {`0${idx + 1} / ${template.name}`}
                    </p>
                    <span className="font-sans text-[10px] text-emerald-600 uppercase font-bold tracking-wider">
                      {template.design.paperType === 'linen' ? '高端布纹纸' : template.design.paperType === 'metallic' ? '科创拉丝卡' : '高档艺术白卡'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tactile Excellence Section */}
      <section className="py-24 md:py-32 bg-brand-beige">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
          {/* Left Craft Image */}
          <div className="order-2 md:order-1">
            <div className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden border border-gray-300 shadow-md">
              <img 
                className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7Mrqkqm7HDxw7cAFzaDIBCmFDGrF3M3XbklAjiHo5CE-40aGLStbmzOJqwvtJBn8S3p7uh8gsHoFXVt_YvwpceYu9fYxfSK8B-O_Kz9WWcz-h7pZkRD8vzABqiTJ-jz1dwXDmioKVswreWqXtutC9DSiQd73zXRGMObK_KI00tcWRxpXDjUpYczBU5O2QsOvtz_Iazdoss5O-5OmsymxVcahwAoWwL8cYsZR-BRgPHJlo_jKoEH7Xeh8XSEm_2cQf2ibqR5MKo1Y"
                alt="Tactile printing process"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 border border-gray-200 rounded-lg shadow-sm">
                <p className="font-sans text-sm italic text-brand-charcoal leading-relaxed">
                  "在学术交流中，一张设计严谨而精美的名片，不仅是个人身份的介绍，更是科研实力与求真学风的直观呈现。"
                </p>
              </div>
            </div>
          </div>

          {/* Right Craft Description */}
          <div className="order-1 md:order-2 space-y-12">
            <div className="space-y-4">
              <span className="font-sans text-xs tracking-widest text-emerald-700 uppercase font-bold">设计规范 · PROFESSIONAL GUIDELINES</span>
              <h2 className="font-sans text-3xl font-bold tracking-tight text-brand-charcoal">
                Rigor & Design / 科学精神与现代化排版
              </h2>
              <p className="text-brand-gray text-sm">
                我们抛弃了繁琐冗余的奢华装饰，专注于学术信息的清晰呈现与排版的几何美感。名片包含专属的院系位置、实验室信息区块，提供最为标准统一的川农视觉风范。
              </p>
            </div>

            <div className="space-y-8">
              {/* Point 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-semibold text-brand-charcoal uppercase tracking-wider">
                    学术印制规范 (ACADEMIC STANDARDS)
                  </h4>
                  <p className="text-brand-gray text-xs mt-1 leading-relaxed">
                    提供规范的中文姓名与西文拼写对照排版、校徽标准色系（川农绿、深海蓝、石墨黑、经典白），以及双面凸版印制及激光微雕工艺选项。
                  </p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-semibold text-brand-charcoal uppercase tracking-wider">
                    多层院系与实验室区块 (DEPARTMENT PLACEMENT)
                  </h4>
                  <p className="text-brand-gray text-xs mt-1 leading-relaxed">
                    专为农林、生命科学、兽医、工科等不同学科科研工作者定制，贴心预留“作物遗传育种”、“森林生态”、“动物遗传”等各国家及部省级重点实验室标注字段。
                  </p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-semibold text-brand-charcoal uppercase tracking-wider">
                    全新自定义组件工作台 (CUSTOM COMPONENT WORKBENCH)
                  </h4>
                  <p className="text-brand-gray text-xs mt-1 leading-relaxed">
                    打破常规呆板模版，工作台全新支持在名片上添加【自定义文本框】、【几何图形/修饰线】或【学术科研类小 Icon】，通过鼠标直观拖拽调校，满足任何个性化的板式构想。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero CTA section banner */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto bg-brand-charcoal text-white rounded-lg overflow-hidden relative p-12 md:p-24 text-center shadow-2xl">
          {/* Subtle gradient lines in background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-gray-900 to-gray-900 opacity-95 z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.08)_0%,_transparent_65%)] z-0" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="font-sans text-3xl md:text-5xl font-bold tracking-tight">
              Establish your academic presence.
              <span className="block text-emerald-400 text-xl md:text-3xl font-light mt-2">确立您在学术交流中的严谨专业形象</span>
            </h2>
            <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
              加入全校数百位已使用规范学术名片的学术带头人、科研先锋与青年学者。使用四川农业大学学术名片设计系统，每一次递出，都是您严谨治学、务实创新态度的无声宣告。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button 
                onClick={() => onNavigate('workspace')}
                className="bg-emerald-600 text-white hover:bg-emerald-500 font-sans text-xs uppercase tracking-widest font-bold px-10 py-4.5 rounded-lg transition-all active:scale-95 shadow-md"
              >
                立即开始专属设计
              </button>
              <button 
                onClick={() => onNavigate('gallery')}
                className="border border-white/20 text-white hover:bg-white/10 font-sans text-xs uppercase tracking-widest font-bold px-10 py-4.5 rounded-lg transition-all active:scale-95"
              >
                浏览学术标准模版
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe newsletter section */}
      <section className="py-16 bg-gray-100/60 border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-3">
            <h3 className="font-sans text-2xl font-bold text-brand-charcoal">
              Academic Design Digest / 订阅排版与学术规范指南
            </h3>
            <p className="text-brand-gray text-xs md:text-sm">
              订阅获取四川农业大学最新名片设计规范、教研汇报PPT通用配色、科研插图规范与优秀排版案例分享。
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input 
                type="email" 
                placeholder="school_email@sicau.edu.cn" 
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-brand-gray/60 py-3.5 px-1 font-sans text-sm text-brand-charcoal focus:outline-none focus:border-emerald-600 placeholder-brand-gray/50 transition-colors"
              />
            </div>
            <button 
              type="submit"
              className="font-sans text-xs uppercase tracking-widest font-bold text-brand-charcoal border-b-2 border-brand-charcoal pb-1.5 hover:text-emerald-600 hover:border-emerald-600 transition-all self-start sm:self-center flex items-center gap-2 cursor-pointer mt-2 sm:mt-0"
            >
              <span>{subscribed ? '订阅成功' : '即刻订阅'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
