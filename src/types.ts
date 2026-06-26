/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TextElement {
  id: string;
  text: string;
  key: string; // 'name' | 'title' | 'phone' | 'email' | 'web' | 'company' | 'address' | 'custom1' | etc.
  x: number; // percentage from left (0 to 100)
  y: number; // percentage from top (0 to 100)
  fontSize: number; // in pixels
  fontWeight: string; // 'normal' | 'medium' | 'semibold' | 'bold'
  fontFamily: string; // font family name
  color: string; // hex color or preset key
  letterSpacing: string; // CSS letter-spacing value (e.g., '0.1em')
  align: 'left' | 'center' | 'right';
  isLocked?: boolean;
  
  // Custom component fields
  type?: 'text' | 'shape' | 'icon';
  shapeType?: 'rect' | 'circle' | 'line';
  shapeWidth?: number;
  shapeHeight?: number;
  iconName?: string;
}

export interface CardSideData {
  background: string; // background color or gradient
  textColor: string;
  logoType: 'icon' | 'text' | 'image' | 'none';
  logoIcon: string; // material symbols icon name or lucide icon name
  logoText: string;
  logoImage?: string; // base64 or URL
  logoX: number;
  logoY: number;
  logoSize: number;
  elements: TextElement[];
}

export interface CardDesign {
  id: string;
  name: string;
  layout: 'horizontal' | 'vertical'; // 'horizontal' (90x54) or 'vertical' (54x90)
  cornerRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'; // 'none' (0px), 'sm' (4px), 'md' (8px), 'lg' (12px), 'full' (circular)
  paperType: 'matte' | 'linen' | 'metallic'; // Matte Eggshell, Woven Linen, Champagne Metallic
  finishType: 'deboss' | 'gold_foil' | 'letterpress'; // Deep Debossed, Gold Leaf Foil, Ink Letterpress
  paletteId: string;
  front: CardSideData;
  back: CardSideData;
}

export interface ColorPalette {
  id: string;
  name: string;
  background: string;
  textColor: string;
  accentColor: string;
  backBackground: string;
  backTextColor: string;
}

export interface CardTemplate {
  id: string;
  name: string;
  collection: 'minimal' | 'professional' | 'creative';
  collectionName: string;
  price: number;
  bgImage: string; // hotlinked image
  description: string;
  design: CardDesign;
}
