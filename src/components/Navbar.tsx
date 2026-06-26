/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu, X, Landmark, Compass, Palette, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  currentView: 'landing' | 'gallery' | 'workspace' | 'checkout';
  onNavigate: (view: 'landing' | 'gallery' | 'workspace' | 'checkout') => void;
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: '品牌主页', icon: Landmark },
    { id: 'gallery', label: '设计画廊', icon: Compass },
    { id: 'workspace', label: '定制工作台', icon: Palette },
    { id: 'checkout', label: '纸张与订单', icon: ShoppingBag },
  ] as const;

  return (
    <header className="w-full h-16 border-b border-brand-border bg-white sticky top-0 z-50 transition-all">
      <nav className="flex justify-between items-center h-full max-w-7xl mx-auto px-6">
        {/* Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-8 h-8 bg-emerald-600 flex items-center justify-center text-white font-bold text-sm rounded-lg">川农</div>
          <h1 className="text-lg font-semibold tracking-tight text-gray-900 flex items-center">
            四川农业大学 <span className="text-xs font-normal text-gray-500 ml-2 hidden sm:inline">名片设计系统</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`font-sans-hanken text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Start/Call-to-Action */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => onNavigate('workspace')}
            className="bg-black text-white hover:bg-gray-800 font-sans-hanken text-xs uppercase tracking-widest font-semibold px-5 py-2 rounded-lg active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
          >
            开启设计
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-900 hover:text-black focus:outline-none p-2"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white/95 backdrop-blur-md z-40 flex flex-col p-6 animate-fade-in border-t border-brand-border">
          <div className="flex flex-col gap-4 mt-4">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 py-3 px-4 rounded-lg font-sans-hanken text-sm font-semibold tracking-wider transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-black text-white' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <hr className="border-brand-border my-2" />
            <button
              onClick={() => {
                onNavigate('workspace');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-lg font-sans-hanken text-xs uppercase tracking-widest font-bold active:scale-95 transition-all"
            >
              立即创作名片
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
