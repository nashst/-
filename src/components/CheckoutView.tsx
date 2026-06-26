/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, ArrowLeft, Landmark, BadgeCent, CreditCard, ShoppingBag, Truck, Gift, ClipboardCheck } from 'lucide-react';
import React, { useState } from 'react';
import { CardDesign } from '../types';

interface CheckoutViewProps {
  currentDesign: CardDesign;
  onNavigate: (view: 'landing' | 'gallery' | 'workspace' | 'checkout') => void;
}

export default function CheckoutView({ currentDesign, onNavigate }: CheckoutViewProps) {
  // Quantity selector
  const [quantity, setQuantity] = useState<100 | 200 | 500>(200);
  
  // Custom luxury boxes options
  const [selectedBox, setSelectedBox] = useState<'standard' | 'mahogany' | 'leather'>('standard');

  // Order state
  const [isOrdered, setIsOrdered] = useState(false);
  const [shippingForm, setShippingForm] = useState({ name: '', phone: '', address: '', zip: '', notes: '' });

  // Calculation pricing
  const basePricePerPack = 129;
  let packMultiplier = 1;
  let discountPct = 0;

  if (quantity === 100) {
    packMultiplier = 1;
    discountPct = 0;
  } else if (quantity === 200) {
    packMultiplier = 1.7; // 15% discount
    discountPct = 15;
  } else if (quantity === 500) {
    packMultiplier = 3.5; // 30% discount
    discountPct = 30;
  }

  // Base pricing based on design choices
  let premiumMaterialAddon = 0;
  if (currentDesign.paperType === 'linen') premiumMaterialAddon = 25;
  if (currentDesign.paperType === 'metallic') premiumMaterialAddon = 45;

  let premiumFinishAddon = 0;
  if (currentDesign.finishType === 'gold_foil') premiumFinishAddon = 35;
  if (currentDesign.finishType === 'letterpress') premiumFinishAddon = 55;

  const cardSubtotal = Math.round((basePricePerPack + premiumMaterialAddon + premiumFinishAddon) * packMultiplier);
  
  let boxPrice = 0;
  if (selectedBox === 'mahogany') boxPrice = 49;
  if (selectedBox === 'leather') boxPrice = 69;

  const shippingCost = cardSubtotal > 200 ? 0 : 15;
  const grandTotal = cardSubtotal + boxPrice + shippingCost;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (shippingForm.name && shippingForm.phone && shippingForm.address) {
      setIsOrdered(true);
    }
  };

  return (
    <div className="bg-brand-beige text-brand-charcoal min-h-[calc(100vh-64px)] py-12 md:py-16 font-sans-hanken selection:bg-brand-gold selection:text-brand-charcoal animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Breadcrumbs */}
        <button 
          onClick={() => onNavigate('workspace')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gray hover:text-brand-charcoal mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回定制编辑工作台</span>
        </button>

        {isOrdered ? (
          /* Order Success Screen */
          <div className="max-w-xl mx-auto bg-white border border-brand-border rounded-sm p-10 text-center luxury-shadow space-y-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto shadow-inner">
              <ClipboardCheck className="w-8 h-8" />
            </div>
            
            <div className="space-y-3">
              <h2 className="font-serif-caslon text-3xl font-bold text-brand-charcoal">
                订单提交成功
              </h2>
              <p className="font-sans-hanken text-xs uppercase tracking-widest text-brand-gold font-semibold">
                Order Placed Successfully
              </p>
              <p className="text-brand-gray text-xs leading-relaxed max-w-sm mx-auto">
                {shippingForm.name} 老师/同学，我们已成功为您生成符合四川农业大学视觉规范的名片订单。我们将开启标准化高速高精度印制，并在 48 小时内为您寄出。
              </p>
            </div>

            <div className="p-5 bg-brand-beige/50 border border-brand-border text-left rounded-sm space-y-3 text-xs">
              <div className="flex justify-between font-bold">
                <span>订单编号：</span>
                <span className="font-mono">SICAU-2026-88091</span>
              </div>
              <div className="flex justify-between">
                <span>印制数量：</span>
                <span>{quantity} 张 (特选 {currentDesign.paperType === 'linen' ? '学术布纹纸' : currentDesign.paperType === 'metallic' ? '科创拉丝卡' : '高档艺术白卡'})</span>
              </div>
              <div className="flex justify-between">
                <span>印后工艺：</span>
                <span>{currentDesign.finishType === 'gold_foil' ? '极简亮面烫金' : currentDesign.finishType === 'letterpress' ? '活字油墨压印' : '经典无墨凹陷压凸'}</span>
              </div>
              <div className="flex justify-between">
                <span>收件地址：</span>
                <span className="text-brand-gray">{shippingForm.address}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-brand-border pt-2 text-brand-charcoal text-sm">
                <span>结余总计：</span>
                <span className="text-brand-gold">${grandTotal} USD</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setIsOrdered(false);
                  setShippingForm({ name: '', phone: '', address: '', zip: '', notes: '' });
                  onNavigate('landing');
                }}
                className="w-full py-3.5 bg-brand-charcoal text-white hover:bg-brand-gold font-sans-hanken text-xs uppercase tracking-widest font-bold transition-all rounded-sm cursor-pointer"
              >
                返回品牌主页
              </button>
              <button 
                onClick={() => onNavigate('workspace')}
                className="w-full py-3 border border-brand-border hover:border-brand-charcoal text-brand-gray hover:text-brand-charcoal font-sans-hanken text-xs uppercase tracking-widest font-bold transition-all rounded-sm cursor-pointer"
              >
                设计新名片
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Setup Config Screen */
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Options Form: 8 cols */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Box 1: Print Volume Quantity */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-gold" />
                  <h3 className="font-sans-hanken text-sm font-bold uppercase tracking-wider text-brand-charcoal">
                    01 / 选择印制数量 (Select Quantity)
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {([
                    { qty: 100, save: '基础装', desc: '新星职人首选，轻盈初遇' },
                    { qty: 200, save: '15% OFF', desc: '推荐精英配置，稳重可靠' },
                    { qty: 500, save: '30% OFF', desc: '尊贵领袖配置，从容彰显' }
                  ] as const).map((item) => {
                    const isSelected = quantity === item.qty;
                    return (
                      <button 
                        key={item.qty}
                        onClick={() => setQuantity(item.qty)}
                        className={`p-5 rounded-sm border text-left cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-brand-gold bg-brand-beige/40 scale-[1.02] shadow-sm' 
                            : 'border-brand-border hover:border-brand-gray'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-sans-hanken text-2xl font-bold text-brand-charcoal">{item.qty} <span className="text-xs font-normal text-brand-gray">张</span></span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] ${isSelected ? 'bg-brand-gold text-brand-charcoal' : 'bg-brand-border text-brand-gray'}`}>
                            {item.save}
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-gray">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Box 2: Custom Packaging and Storage box */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-brand-gold" />
                  <h3 className="font-sans-hanken text-sm font-bold uppercase tracking-wider text-brand-charcoal">
                    02 / 配套高奢名片收纳盒 (Select Storage Case)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {([
                    { id: 'standard', name: '极简黑卡环保盒', price: 0, desc: '免费含于包裹内，再生环保纸浆手工糊制，低调典雅' },
                    { id: 'mahogany', name: '百年黑胡桃原木盒', price: 49, desc: '特选北美黑胡桃原木整料雕琢，榫卯印泥，尊贵厚重' },
                    { id: 'leather', name: '经典手工复古皮套', price: 69, desc: '意大利头层植鞣皮纯手工缝制，铜扣按压，随身携带质感十足' }
                  ] as const).map((box) => {
                    const isSelected = selectedBox === box.id;
                    return (
                      <button 
                        key={box.id}
                        onClick={() => setSelectedBox(box.id)}
                        className={`p-5 rounded-sm border text-left cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-brand-gold bg-brand-beige/40 scale-[1.02] shadow-sm' 
                            : 'border-brand-border hover:border-brand-gray'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-sans-hanken text-xs font-bold text-brand-charcoal">{box.name}</span>
                          <span className="text-xs font-mono font-bold text-brand-gold">
                            {box.price === 0 ? 'FREE' : `+$${box.price}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-gray leading-relaxed">{box.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Box 3: Contact & Shipping details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-brand-gold" />
                  <h3 className="font-sans-hanken text-sm font-bold uppercase tracking-wider text-brand-charcoal">
                    03 / 寄送地址与付款配置 (Shipping Details)
                  </h3>
                </div>

                <form onSubmit={handlePlaceOrder} className="bg-white p-6 border border-brand-border rounded-sm ambient-shadow grid md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-brand-gray font-bold">收件人真实姓名 *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="如：Alexander Thorne"
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                      className="w-full bg-transparent border-b border-brand-border py-2 text-sm text-brand-charcoal focus:outline-none focus:border-brand-gold placeholder-brand-gray/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-brand-gray font-bold">联络电话号码 *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="如：+86 188 8888 8888"
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      className="w-full bg-transparent border-b border-brand-border py-2 text-sm text-brand-charcoal focus:outline-none focus:border-brand-gold placeholder-brand-gray/30"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] uppercase text-brand-gray font-bold">详细寄送地址 *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="如：上海市徐汇区衡山路102号 优雅大厦 302"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      className="w-full bg-transparent border-b border-brand-border py-2 text-sm text-brand-charcoal focus:outline-none focus:border-brand-gold placeholder-brand-gray/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-brand-gray font-bold">邮政编码</label>
                    <input 
                      type="text" 
                      placeholder="200030"
                      value={shippingForm.zip}
                      onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                      className="w-full bg-transparent border-b border-brand-border py-2 text-sm text-brand-charcoal focus:outline-none focus:border-brand-gold placeholder-brand-gray/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-brand-gray font-bold">印制专属备注</label>
                    <input 
                      type="text" 
                      placeholder="如：希望压凹深度更深一些，谢谢"
                      value={shippingForm.notes}
                      onChange={(e) => setShippingForm({ ...shippingForm, notes: e.target.value })}
                      className="w-full bg-transparent border-b border-brand-border py-2 text-sm text-brand-charcoal focus:outline-none focus:border-brand-gold placeholder-brand-gray/30"
                    />
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <button 
                      type="submit"
                      className="w-full py-4 bg-brand-charcoal text-white hover:bg-brand-gold font-sans-hanken text-xs uppercase tracking-widest font-bold rounded-sm transition-all active:scale-95 shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4 text-brand-gold" />
                      <span>模拟建立印制下单 (${grandTotal} USD)</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* Right Summary Panel: 4 cols */}
            <div className="lg:col-span-4 bg-white border border-brand-border p-6 rounded-sm ambient-shadow space-y-6">
              <h3 className="font-sans-hanken text-xs uppercase tracking-widest text-brand-charcoal font-bold pb-2 border-b border-brand-border">
                当前名片定制规格 (Your Custom Specs)
              </h3>

              <div className="space-y-4 text-xs text-brand-gray">
                {/* Visual mini thumbnail of card */}
                <div 
                  className="aspect-[1.75/1] rounded-sm border border-brand-border p-4 flex flex-col justify-between"
                  style={{ background: currentDesign.front.background, color: currentDesign.front.textColor }}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-sans text-xs font-bold leading-none text-emerald-600">四川农业大学</span>
                    <span className="text-[8px] opacity-70">✦</span>
                  </div>
                  <div>
                    <h5 className="font-sans-hanken text-[10px] font-bold leading-none">
                      {currentDesign.front.elements.find(el => el.key === 'name')?.text || 'Alexander Thorne'}
                    </h5>
                    <p className="text-[7px] opacity-65 leading-none mt-0.5">
                      {currentDesign.front.elements.find(el => el.key === 'title')?.text || 'PRINCIPAL ARCHITECT'}
                    </p>
                  </div>
                </div>

                {/* Specifics details list */}
                <div className="space-y-2.5 pt-2 text-[11px]">
                  <div className="flex justify-between">
                    <span>名片版型：</span>
                    <span className="font-semibold text-brand-charcoal">{currentDesign.layout === 'horizontal' ? '标准横版' : '现代竖版'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>纸张材质：</span>
                    <span className="font-semibold text-brand-charcoal">
                      {currentDesign.paperType === 'linen' ? '苏格兰莱妮布纹纸' : currentDesign.paperType === 'metallic' ? '拉丝金属微珠光纸' : '特厚棉卡哑光纸'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>印后工艺：</span>
                    <span className="font-semibold text-brand-charcoal">
                      {currentDesign.finishType === 'gold_foil' ? '24K亮面香槟金烫金' : currentDesign.finishType === 'letterpress' ? '活字油墨压印' : '无墨深层重磅压凹'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>裁切圆角：</span>
                    <span className="font-semibold text-brand-charcoal">
                      {currentDesign.cornerRadius === 'none' ? '直角 (无圆角)' : currentDesign.cornerRadius === 'sm' ? '小圆角 (2px)' : currentDesign.cornerRadius === 'md' ? '中圆角 (4px)' : currentDesign.cornerRadius === 'lg' ? '大圆角 (8px)' : '正圆圆角卡'}
                    </span>
                  </div>
                </div>

                <hr className="border-brand-border" />

                {/* Subtotals & Discounts calculation */}
                <div className="space-y-2 pt-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>起步包标准价格：</span>
                    <span className="font-mono text-brand-charcoal">${basePricePerPack} USD</span>
                  </div>
                  {premiumMaterialAddon > 0 && (
                    <div className="flex justify-between">
                      <span>高级材质溢价：</span>
                      <span className="font-mono text-brand-charcoal">+${premiumMaterialAddon} USD</span>
                    </div>
                  )}
                  {premiumFinishAddon > 0 && (
                    <div className="flex justify-between">
                      <span>高阶印金工艺溢价：</span>
                      <span className="font-mono text-brand-charcoal">+${premiumFinishAddon} USD</span>
                    </div>
                  )}
                  {discountPct > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>批量定制折扣：</span>
                      <span className="font-semibold">-{discountPct}% OFF</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-brand-border pt-2 text-brand-charcoal font-semibold">
                    <span>名片小计 ({quantity}张)：</span>
                    <span className="font-mono">${cardSubtotal} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>定制高档包装盒：</span>
                    <span className="font-mono text-brand-charcoal">${boxPrice === 0 ? 'FREE' : `+$${boxPrice} USD`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>高规格安全物流：</span>
                    <span className="font-mono text-brand-charcoal">{shippingCost === 0 ? 'FREE' : `$${shippingCost} USD`}</span>
                  </div>
                </div>

                <hr className="border-brand-border" />

                {/* GRAND TOTAL */}
                <div className="flex justify-between items-center text-brand-charcoal font-bold text-sm pt-2">
                  <span className="uppercase tracking-wide">总计支出 (Grand Total)</span>
                  <span className="font-mono text-brand-gold text-lg">${grandTotal} USD</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
