/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import GalleryView from './components/GalleryView';
import WorkspaceView from './components/WorkspaceView';
import CheckoutView from './components/CheckoutView';
import { TEMPLATES } from './data';
import { CardDesign, CardTemplate } from './types';

export default function App() {
  // Navigation Router: 'landing' | 'gallery' | 'workspace' | 'checkout'
  const [currentView, setCurrentView] = useState<'landing' | 'gallery' | 'workspace' | 'checkout'>('landing');

  // Active state representing current card design work-in-progress (defaults to Stark White minimalist)
  const [currentDesign, setCurrentDesign] = useState<CardDesign>({
    ...TEMPLATES[0].design
  });

  // Handle template selection from Gallery or Landing page
  const handleSelectTemplate = (template: CardTemplate) => {
    // Clone design config to prevent mutations
    setCurrentDesign(JSON.parse(JSON.stringify(template.design)));
    setCurrentView('workspace');
  };

  const handleNavigate = (view: 'landing' | 'gallery' | 'workspace' | 'checkout') => {
    setCurrentView(view);
    // Scroll to top of viewport smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-brand-beige min-h-screen flex flex-col selection:bg-brand-gold selection:text-brand-charcoal select-none">
      
      {/* Universal brand Header */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main router controller switch */}
      <main className="flex-grow">
        {currentView === 'landing' && (
          <LandingView 
            onNavigate={handleNavigate} 
            onSelectTemplate={handleSelectTemplate} 
          />
        )}

        {currentView === 'gallery' && (
          <GalleryView 
            onNavigate={handleNavigate} 
            onSelectTemplate={handleSelectTemplate} 
          />
        )}

        {currentView === 'workspace' && (
          <WorkspaceView 
            currentDesign={currentDesign} 
            onChangeDesign={setCurrentDesign} 
            onNavigate={handleNavigate} 
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView 
            currentDesign={currentDesign} 
            onNavigate={handleNavigate} 
          />
        )}
      </main>

      {/* Elegant minimalist universal footer */}
      <footer className="w-full bg-white text-gray-400 py-10 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 select-none">
            <div className="w-6 h-6 bg-emerald-600 flex items-center justify-center text-white font-bold text-[10px] rounded-md">川农</div>
            <span className="font-sans font-semibold tracking-tight text-gray-900 text-sm">四川农业大学 名片设计系统</span>
          </div>
          <p className="font-sans text-[11px] tracking-wider text-gray-500 text-center md:text-right">
            © {new Date().getFullYear()} 四川农业大学. All rights reserved. 强农兴农 · 极简学术名片印制系统
          </p>
        </div>
      </footer>
    </div>
  );
}

