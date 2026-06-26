/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, ChevronLeft, ChevronRight, HelpCircle, Check, Info } from 'lucide-react';
import React, { useState } from 'react';
import { TEMPLATES } from '../data';
import { CardTemplate } from '../types';

interface GalleryViewProps {
  onNavigate: (view: 'landing' | 'gallery' | 'workspace' | 'checkout') => void;
  onSelectTemplate: (template: CardTemplate) => void;
}

export default function GalleryView({ onNavigate, onSelectTemplate }: GalleryViewProps) {
  // Filter States
  const [selectedCollection, setSelectedCollection] = useState<'all' | 'minimal' | 'professional' | 'creative'>('all');
  const [selectedFinish, setSelectedFinish] = useState<'all' | 'matte' | 'deboss' | 'gold_foil'>('all');
  
  // Custom design request modal state
  const [isInquireModalOpen, setIsInquireModalOpen] = useState(false);
  const [inquireSuccess, setInquireSuccess] = useState(false);
  const [inquireForm, setInquireForm] = useState({ name: '', email: '', desc: '' });

  // Filter logic
  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesCollection = selectedCollection === 'all' || template.collection === selectedCollection;
    const matchesFinish = 
      selectedFinish === 'all' || 
      (selectedFinish === 'matte' && template.design.paperType === 'matte') ||
      (selectedFinish === 'deboss' && template.design.finishType === 'deboss') ||
      (selectedFinish === 'gold_foil' && template.design.finishType === 'gold_foil');
    return matchesCollection && matchesFinish;
  });

  const handleInquireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inquireForm.name && inquireForm.email) {
      setInquireSuccess(true);
      setTimeout(() => {
        setInquireSuccess(false);
        setIsInquireModalOpen(false);
        setInquireForm({ name: '', email: '', desc: '' });
      }, 3000);
    }
  };

  return (
    <div className="bg-brand-beige text-brand-charcoal min-h-screen py-12 md:py-20 font-sans-hanken selection:bg-brand-gold selection:text-brand-charcoal">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Gallery Hero Title */}
        <div className="mb-16 md:mb-24 max-w-3xl space-y-4 animate-fade-in">
          <span className="font-sans text-xs tracking-widest text-emerald-700 uppercase font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 w-fit block">SICAU SHOWROOM</span>
          <h1 className="font-sans text-4xl md:text-5xl font-bold tracking-tight text-brand-charcoal leading-none">
            The Academic Template Gallery
          </h1>
          <p className="font-sans text-xl md:text-2xl text-emerald-600 font-light italic">
            学术标准与规范名片模版馆
          </p>
          <p className="text-brand-gray text-xs md:text-sm leading-relaxed max-w-2xl pt-2 border-l-2 border-emerald-600 pl-4">
            探索我们为您悉心构筑的学术名片模版画廊。每一款方案都契合四川农业大学的视觉形象规范，深度融合了农林生态、科学实验、高新生物技术等多重院系特色，为您的学术会议、科研合作递出最严谨大气的名片印象。
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Filter Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-10 animate-fade-in-left">
            {/* Category Filter */}
            <div className="space-y-4">
              <h3 className="font-sans text-xs uppercase tracking-widest text-brand-charcoal font-bold pb-2 border-b border-brand-border">
                学科及设计风格 (Collections)
              </h3>
              <div className="space-y-3">
                {([
                  { id: 'all', name: '全部风格系列 (All)' },
                  { id: 'minimal', name: '极简学术风 (Minimal)' },
                  { id: 'professional', name: '精英学术风 (Academic)' },
                  { id: 'creative', name: '前沿科创风 (Creative/Tech)' },
                ] as const).map((item) => {
                  const isChecked = selectedCollection === item.id;
                  return (
                    <label 
                      key={item.id} 
                      className="flex items-center group cursor-pointer"
                    >
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => setSelectedCollection(item.id)}
                          className="peer appearance-none w-4 h-4 border border-brand-gray/50 rounded-[4px] checked:bg-emerald-600 checked:border-emerald-600 transition-all cursor-pointer"
                        />
                        {isChecked && <Check className="w-3 h-3 text-white absolute left-0.5 top-0.5" />}
                      </div>
                      <span className={`ml-3 text-xs font-semibold tracking-wide transition-colors ${
                        isChecked ? 'text-emerald-700 font-bold' : 'text-brand-gray group-hover:text-brand-charcoal'
                      }`}>
                        {item.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Print Finish Filter */}
            <div className="space-y-4">
              <h3 className="font-sans text-xs uppercase tracking-widest text-brand-charcoal font-bold pb-2 border-b border-brand-border">
                纸张及印金工艺 (Paper & Finishes)
              </h3>
              <div className="space-y-3">
                {([
                  { id: 'all', name: '全部工艺 (All Finishes)' },
                  { id: 'matte', name: '特厚哑光卡纸 (Matte Premium)' },
                  { id: 'deboss', name: '传统无墨压凹 (Debossed Cotton)' },
                  { id: 'gold_foil', name: '科创极简阳极烫金 (Laser Gold)' },
                ] as const).map((item) => {
                  const isSelected = selectedFinish === item.id;
                  return (
                    <label 
                      key={item.id} 
                      className="flex items-center group cursor-pointer"
                    >
                      <input 
                        type="radio"
                        name="finish-filter"
                        checked={isSelected}
                        onChange={() => setSelectedFinish(item.id)}
                        className="appearance-none w-4 h-4 border border-brand-gray/50 rounded-full checked:border-brand-gold checked:border-[5px] transition-all cursor-pointer"
                      />
                      <span className={`ml-3 text-xs font-semibold tracking-wide transition-colors ${
                        isSelected ? 'text-brand-charcoal' : 'text-brand-gray group-hover:text-brand-charcoal'
                      }`}>
                        {item.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Inquire Bespoke Service Promobox */}
            <div className="p-6 bg-white border border-brand-border rounded-sm ambient-shadow space-y-4">
              <span className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-sans-hanken text-xs font-bold text-brand-charcoal tracking-wide">
                  高级工坊私人定制服务
                </h4>
                <p className="font-serif-caslon text-[11px] text-brand-gold italic">
                  Bespoke Design Service
                </p>
              </div>
              <p className="text-[11px] text-brand-gray leading-relaxed">
                想拥有独一无二的名片或标志设计方案？我们的资深设计总监和版式专家可为您进行一站式的品牌视觉策划及专属凹凸烫金制版。
              </p>
              <button 
                onClick={() => setIsInquireModalOpen(true)}
                className="w-full py-2.5 border border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white font-sans-hanken text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer rounded-sm"
              >
                立即联络全案咨询
              </button>
            </div>
          </aside>

          {/* Right Template Showcase Grid */}
          <div className="flex-1 space-y-16 animate-fade-in">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-24 bg-white border border-brand-border rounded-sm p-12">
                <Info className="w-8 h-8 text-brand-gold mx-auto mb-4" />
                <h4 className="font-sans-hanken text-sm font-semibold text-brand-charcoal">
                  未找到符合筛选条件的模版
                </h4>
                <p className="text-brand-gray text-xs mt-2">
                  建议您尝试更改左侧的分类集合或工艺筛选项。
                </p>
                <button 
                  onClick={() => { setSelectedCollection('all'); setSelectedFinish('all'); }}
                  className="mt-6 px-6 py-2 bg-brand-charcoal text-white font-sans-hanken text-xs font-bold tracking-widest uppercase hover:bg-brand-gold transition-colors"
                >
                  重置筛选条件
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                {filteredTemplates.map((template) => {
                  return (
                    <div 
                      key={template.id} 
                      className="card-perspective group"
                    >
                      {/* Card Frame */}
                      <div className="relative border border-brand-border bg-white p-2 mb-4 rounded-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-lg">
                        <div className="relative aspect-[1.75/1] overflow-hidden bg-brand-beige">
                          {/* Tactile real physical photorealistic card mockup */}
                          <img 
                            className="w-full h-full object-cover select-none pointer-events-none" 
                            src={template.bgImage} 
                            alt={template.name}
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-brand-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              onClick={() => {
                                onSelectTemplate(template);
                                onNavigate('workspace');
                              }}
                              className="bg-brand-charcoal text-white hover:bg-brand-gold font-sans-hanken text-xs uppercase tracking-widest font-bold py-3 px-8 rounded-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                            >
                              立即定制
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Card Info Details */}
                      <div className="flex justify-between items-start px-1">
                        <div>
                          <h4 className="font-sans-hanken text-xs font-bold text-brand-charcoal tracking-wide">
                            {template.name}
                          </h4>
                          <p className="text-[10px] text-brand-gray">
                            {template.collectionName}
                          </p>
                        </div>
                        <span className="font-sans-hanken text-xs font-semibold text-brand-gold">
                          ${template.price} <span className="text-[9px] text-brand-gray font-normal">/ 100张起</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Segment */}
            <div className="mt-20 pt-10 border-t border-brand-border flex justify-between items-center">
              <p className="text-xs text-brand-gray">
                显示精选设计的第 1-{filteredTemplates.length} 项（共 {filteredTemplates.length} 款高端作品）
              </p>
              <div className="flex justify-center items-center gap-6">
                <button className="p-2 border border-brand-border rounded-full hover:border-brand-charcoal hover:text-brand-charcoal transition-colors disabled:opacity-35 text-brand-gray" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-4">
                  <span className="font-sans-hanken text-xs font-bold text-brand-charcoal cursor-pointer border-b border-brand-charcoal pb-0.5">01</span>
                  <span className="font-sans-hanken text-xs text-brand-gray hover:text-brand-charcoal cursor-pointer">02</span>
                  <span className="font-sans-hanken text-xs text-brand-gray hover:text-brand-charcoal cursor-pointer">03</span>
                  <span className="font-sans-hanken text-xs text-brand-gray">...</span>
                  <span className="font-sans-hanken text-xs text-brand-gray hover:text-brand-charcoal cursor-pointer">12</span>
                </div>
                <button className="p-2 border border-brand-border rounded-full hover:border-brand-charcoal hover:text-brand-charcoal transition-colors text-brand-gray">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bespoke Inquiry Modal */}
      {isInquireModalOpen && (
        <div className="fixed inset-0 bg-brand-charcoal/85 z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-brand-beige w-full max-w-lg p-8 md:p-10 rounded-sm border border-brand-border relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsInquireModalOpen(false)}
              className="absolute top-6 right-6 text-brand-gray hover:text-brand-charcoal font-sans text-xl focus:outline-none"
            >
              ✕
            </button>
            
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="text-brand-gold font-serif-caslon text-3xl">⚜</span>
                <h3 className="font-serif-caslon text-2xl font-bold text-brand-charcoal">
                  Bespoke Studio Inquiry
                </h3>
                <p className="font-sans-hanken text-xs text-brand-gold uppercase tracking-widest font-semibold">
                  奥勒留高级私人印记定制
                </p>
              </div>

              {inquireSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    ✓
                  </div>
                  <h4 className="font-sans-hanken text-sm font-semibold text-brand-charcoal">
                    需求提交成功
                  </h4>
                  <p className="text-brand-gray text-xs leading-relaxed max-w-sm mx-auto">
                    我们已收到您的私人高案定制请求。我们的首席视觉顾问将在 24 小时内通过邮件与您取得联络，共同开启您的专属品牌美学。
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquireSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-brand-gray font-bold">
                      您的尊称 (Full Name)
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="例如：Alexander Thorne 先生"
                      value={inquireForm.name}
                      onChange={(e) => setInquireForm({ ...inquireForm, name: e.target.value })}
                      className="w-full bg-transparent border-b border-brand-gray/40 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-gold text-brand-charcoal placeholder-brand-gray/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-brand-gray font-bold">
                      联系邮箱 (Email Address)
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="hello@studio.com"
                      value={inquireForm.email}
                      onChange={(e) => setInquireForm({ ...inquireForm, email: e.target.value })}
                      className="w-full bg-transparent border-b border-brand-gray/40 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-gold text-brand-charcoal placeholder-brand-gray/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-brand-gray font-bold">
                      描述您的定制期待 (Inquiry Message)
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="如：需要设计一枚契合极简石材美学的建筑事务所Logo，并印制于莱妮布纹黑卡上..."
                      value={inquireForm.desc}
                      onChange={(e) => setInquireForm({ ...inquireForm, desc: e.target.value })}
                      className="w-full bg-transparent border-b border-brand-gray/40 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-gold text-brand-charcoal placeholder-brand-gray/30 resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-brand-charcoal text-white hover:bg-brand-gold font-sans-hanken text-xs uppercase tracking-widest font-bold transition-all rounded-sm cursor-pointer"
                  >
                    提交定制期待
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
