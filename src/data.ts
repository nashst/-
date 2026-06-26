/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CardTemplate, ColorPalette } from './types';

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'stark-white',
    name: '学术象牙白 (Ivory White)',
    background: '#FAF9F6',
    textColor: '#1E293B',
    accentColor: '#10B981',
    backBackground: '#1E293B',
    backTextColor: '#FAF9F6',
  },
  {
    id: 'midnight-noir',
    name: '石墨学术黑 (Carbon Black)',
    background: '#111827',
    textColor: '#F9FAFB',
    accentColor: '#10B981',
    backBackground: '#F9FAFB',
    backTextColor: '#111827',
  },
  {
    id: 'sage-linen',
    name: '川农学术绿 (SAU Forest Green)',
    background: '#F0F5F2',
    textColor: '#1B4332',
    accentColor: '#2D6A4F',
    backBackground: '#1B4332',
    backTextColor: '#F0F5F2',
  },
  {
    id: 'executive-slate',
    name: '科创深海蓝 (Tech Ocean Blue)',
    background: '#F0F4F8',
    textColor: '#0F172A',
    accentColor: '#3B82F6',
    backBackground: '#0F172A',
    backTextColor: '#F0F4F8',
  }
];

export const FONT_OPTIONS = [
  { value: 'sans', label: '极简无衬线 (Clean Sans)', css: 'font-sans' },
  { value: 'sans-hanken', label: '现代几何体 (Hanken Grotesk)', css: 'font-sans-hanken' },
  { value: 'mono', label: '科研等宽体 (JetBrains Mono)', css: 'font-mono' },
  { value: 'serif-caslon', label: '学术经典体 (Libre Caslon)', css: 'font-serif-caslon' },
  { value: 'serif', label: '严谨细衬线 (Classic Serif)', css: 'font-serif' }
];

export const WEIGHT_OPTIONS = [
  { value: 'normal', label: '标准 (Regular)' },
  { value: 'medium', label: '中等 (Medium)' },
  { value: 'semibold', label: '半粗 (Semi Bold)' },
  { value: 'bold', label: '粗体 (Bold)' }
];

export const ABSTRACT_LOGOS = [
  { id: 'logo-sau', name: '川农标志', icon: 'school', content: '川农' },
  { id: 'logo-atom', name: '科学原子', icon: 'science', content: '⚛' },
  { id: 'logo-wheat', name: '麦穗生态', icon: 'agriculture', content: '🌾' },
  { id: 'logo-dna', name: '基因工程', icon: 'biotech', content: '🧬' },
  { id: 'logo-book', name: '学术研究', icon: 'menu_book', content: '📖' },
  { id: 'logo-leaf', name: '自然生态', icon: 'eco', content: '🌿' }
];

export const TEMPLATES: CardTemplate[] = [
  {
    id: 'temp-sau-agronomy',
    name: '学术经典 象牙白',
    collection: 'minimal',
    collectionName: '极简学术系列 (Academic)',
    price: 99,
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwGq7vp6uXN8ETgFvbX_KLB5t9vExSdH6DJc53uOTFuYmxsy3CEJsvFs7mtASgvgwPnoKBpgvLhgtP3QCLhMrFC_hw99rJf2BlbqlCm3IZhod8UG0Z91sDsQnnzPE5-lCO0rPBz0tnJ14Fvwvm9H8WPOXQI0hHzvqJFaCQoOnRENjmZROqG0I9aWZOsPeQYLMrxvVP5in4Ua_VFPvkV4QoVPGbU6SSyN5kJ-z_2DAwut-YrIUm124tLPnu9rQVnQKF2H5uZPuz8HE',
    description: '四川农业大学农学院·作物遗传育种国家重点实验室。经典象牙白与深绿色，展现严谨治学、强农兴农的学术底蕴。',
    design: {
      id: 'design-sau-agronomy',
      name: '农学研究经典名片',
      layout: 'horizontal',
      cornerRadius: 'none',
      paperType: 'matte',
      finishType: 'deboss',
      paletteId: 'stark-white',
      front: {
        background: '#FAF9F6',
        textColor: '#1E293B',
        logoType: 'text',
        logoIcon: 'school',
        logoText: '四川农业大学',
        logoX: 80,
        logoY: 20,
        logoSize: 14,
        elements: [
          { id: 'e1', text: '林向阳', key: 'name', x: 10, y: 22, fontSize: 22, fontWeight: 'bold', fontFamily: 'sans', color: '#1E293B', letterSpacing: '0.05em', align: 'left' },
          { id: 'e2', text: '教授 / 博士生导师 · 作物遗传育种实验室主任', key: 'title', x: 10, y: 35, fontSize: 8.5, fontWeight: 'medium', fontFamily: 'sans', color: '#1B4332', letterSpacing: '0.05em', align: 'left' },
          { id: 'e_direction', text: '研究方向：作物抗逆基因挖掘与分子育种机制', key: 'custom1', x: 10, y: 44, fontSize: 7.5, fontWeight: 'normal', fontFamily: 'sans', color: '#6B7280', letterSpacing: '0.02em', align: 'left' },
          { id: 'e3', text: '电话：+86 138 0000 8888', key: 'phone', x: 10, y: 64, fontSize: 9, fontWeight: 'normal', fontFamily: 'mono', color: '#4B5563', letterSpacing: '0.02em', align: 'left' },
          { id: 'e4', text: '邮箱：lin.xy@sicau.edu.cn', key: 'email', x: 10, y: 72, fontSize: 9, fontWeight: 'normal', fontFamily: 'mono', color: '#4B5563', letterSpacing: '0.02em', align: 'left' },
          { id: 'e5', text: '地址：四川省雅安市雨城区新康路46号 四川农业大学农学院', key: 'address', x: 10, y: 80, fontSize: 8, fontWeight: 'normal', fontFamily: 'sans', color: '#6B7280', letterSpacing: '0.01em', align: 'left' }
        ]
      },
      back: {
        background: '#1B4332',
        textColor: '#F0F5F2',
        logoType: 'icon',
        logoIcon: 'school',
        logoText: 'SICAU',
        logoX: 50,
        logoY: 30,
        logoSize: 32,
        elements: [
          { id: 'e_back_1', text: '四川农业大学农学院', key: 'company', x: 50, y: 55, fontSize: 18, fontWeight: 'bold', fontFamily: 'sans', color: '#FAF9F6', letterSpacing: '0.15em', align: 'center' },
          { id: 'e_back_2', text: 'SICHUAN AGRICULTURAL UNIVERSITY', key: 'slogan', x: 50, y: 68, fontSize: 8, fontWeight: 'medium', fontFamily: 'mono', color: '#A3B18A', letterSpacing: '0.12em', align: 'center' }
        ]
      }
    }
  },
  {
    id: 'temp-sau-forestry',
    name: '川农学术绿 特厚卡',
    collection: 'professional',
    collectionName: '精英学术系列 (Professional)',
    price: 119,
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_N3AO7gFonm09UPb833J9NrbV5ikkvhxyn5qgxVdZkEdNeXk3u1YtT-GzcFGtAWxfDFZPSdSZjM1ig4QomChkrYMWEDzFmhptZqHN-nWHhnR08LXRESlsVMgSjc6WbPADy60LlrLQzmNhtj7jD9_HMAftZMukWRVHpXz2vTxqKSQbRLUbah2MKZUE9l4Ac_6Y0rtE7vDdRN8kYE_PbAVFTyt5vclTe7Ipq4JxyBVjZ5HK8nTbBrxx7UiY77gKiQQB78YnF0Z9rAo',
    description: '四川农业大学林学院·森林生态与生态工程重点实验室。墨绿背景与白底结合，突出长江上游水源涵养与生态修复的责任感。',
    design: {
      id: 'design-sau-forestry',
      name: '林学与生态研究名片',
      layout: 'horizontal',
      cornerRadius: 'sm',
      paperType: 'linen',
      finishType: 'letterpress',
      paletteId: 'sage-linen',
      front: {
        background: '#F0F5F2',
        textColor: '#1B4332',
        logoType: 'text',
        logoIcon: 'eco',
        logoText: '林学院',
        logoX: 82,
        logoY: 20,
        logoSize: 13,
        elements: [
          { id: 'f1', text: '陈秀兰', key: 'name', x: 10, y: 22, fontSize: 22, fontWeight: 'bold', fontFamily: 'sans', color: '#1B4332', letterSpacing: '0.05em', align: 'left' },
          { id: 'f2', text: '研究员 / 博士生导师 · 森林生态学研究室主理人', key: 'title', x: 10, y: 35, fontSize: 8.5, fontWeight: 'semibold', fontFamily: 'sans', color: '#2D6A4F', letterSpacing: '0.05em', align: 'left' },
          { id: 'f_direction', text: '研究领域：退化林群落演替、生物多样性保育与碳汇效应', key: 'custom1', x: 10, y: 44, fontSize: 7.5, fontWeight: 'normal', fontFamily: 'sans', color: '#4B5563', letterSpacing: '0.02em', align: 'left' },
          { id: 'f3', text: '电话：+86 159 1234 5678', key: 'phone', x: 10, y: 64, fontSize: 9, fontWeight: 'normal', fontFamily: 'mono', color: '#4B5563', letterSpacing: '0.02em', align: 'left' },
          { id: 'f4', text: '邮箱：chenxl@sicau.edu.cn', key: 'email', x: 10, y: 72, fontSize: 9, fontWeight: 'normal', fontFamily: 'mono', color: '#4B5563', letterSpacing: '0.02em', align: 'left' },
          { id: 'f5', text: '地址：四川省成都市温江区惠民路211号 四川农业大学林学院', key: 'address', x: 10, y: 80, fontSize: 8, fontWeight: 'normal', fontFamily: 'sans', color: '#6B7280', letterSpacing: '0.01em', align: 'left' }
        ]
      },
      back: {
        background: '#2D6A4F',
        textColor: '#F0F5F2',
        logoType: 'icon',
        logoIcon: 'eco',
        logoText: '',
        logoX: 50,
        logoY: 32,
        logoSize: 36,
        elements: [
          { id: 'f_back_1', text: '森林生态与生态工程重点实验室', key: 'company', x: 50, y: 55, fontSize: 16, fontWeight: 'bold', fontFamily: 'sans', color: '#F0F5F2', letterSpacing: '0.1em', align: 'center' },
          { id: 'f_back_2', text: 'Key Laboratory of Forest Ecology - SICAU', key: 'slogan', x: 50, y: 68, fontSize: 7.5, fontWeight: 'medium', fontFamily: 'mono', color: '#D8F3DC', letterSpacing: '0.08em', align: 'center' }
        ]
      }
    }
  },
  {
    id: 'temp-sau-biotech',
    name: '科创深海蓝 前沿卡',
    collection: 'creative',
    collectionName: '现代前沿系列 (Creative)',
    price: 129,
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ7CocPBlpN7hs0ZrYgkr4RLB8cMoSFRX5VAyZdPihDiJe95rd9GCXsQHoFGI4-CenAAhbEAFm1HL0UfSHkofNHg3S_0y32M8FX7uq23Z5Evh7Dia0wT41g03reay9oUz6pfsDr3m7Zj0Mys8RgdJno6uva2z-H6AjzMrYUhMR6nc7At-JxgYZXhrECXW3ivXfa7ASupsk3HZHe-7EF0heKSbTLm7Hl18Z_PT_eoI260_XKC5BsM9nPYHK4GUr8GlfwueY5uOe-DE',
    description: '四川农业大学动物科技学院·动物遗传育种与繁殖实验室。深海蓝背景融合分子科技质感，展示现代化生猪遗传育种的高科技名片。',
    design: {
      id: 'design-sau-biotech',
      name: '动物生物技术前沿名片',
      layout: 'vertical',
      cornerRadius: 'md',
      paperType: 'matte',
      finishType: 'gold_foil',
      paletteId: 'executive-slate',
      front: {
        background: '#F0F4F8',
        textColor: '#0F172A',
        logoType: 'icon',
        logoIcon: 'biotech',
        logoText: '🧬',
        logoX: 50,
        logoY: 15,
        logoSize: 24,
        elements: [
          { id: 'b1', text: '张建国', key: 'name', x: 50, y: 28, fontSize: 20, fontWeight: 'bold', fontFamily: 'sans', color: '#0F172A', letterSpacing: '0.05em', align: 'center' },
          { id: 'b2', text: '副教授 / 硕士生导师', key: 'title', x: 50, y: 36, fontSize: 8.5, fontWeight: 'semibold', fontFamily: 'sans', color: '#3B82F6', letterSpacing: '0.05em', align: 'center' },
          { id: 'b_field', text: '动物生物技术与分子育种实验室', key: 'company', x: 50, y: 43, fontSize: 8, fontWeight: 'normal', fontFamily: 'sans', color: '#475569', letterSpacing: '0.02em', align: 'center' },
          { id: 'b_direction', text: '方向: 高产优质猪新品系分子标记辅助选择', key: 'custom1', x: 50, y: 50, fontSize: 7, fontWeight: 'normal', fontFamily: 'sans', color: '#64748B', letterSpacing: '0.01em', align: 'center' },
          { id: 'b3', text: 'jianguo.zhang@sicau.edu.cn', key: 'email', x: 50, y: 68, fontSize: 8.5, fontWeight: 'normal', fontFamily: 'mono', color: '#334155', letterSpacing: '0.01em', align: 'center' },
          { id: 'b4', text: '电话: +86 182 8888 9999', key: 'phone', x: 50, y: 75, fontSize: 8.5, fontWeight: 'normal', fontFamily: 'mono', color: '#334155', letterSpacing: '0.01em', align: 'center' },
          { id: 'b5', text: '成都温江校区 动物科技学院大楼', key: 'address', x: 50, y: 83, fontSize: 7.5, fontWeight: 'normal', fontFamily: 'sans', color: '#64748B', letterSpacing: '0.01em', align: 'center' }
        ]
      },
      back: {
        background: '#0F172A',
        textColor: '#F0F4F8',
        logoType: 'text',
        logoIcon: 'biotech',
        logoText: '四川农业大学',
        logoX: 50,
        logoY: 42,
        logoSize: 18,
        elements: [
          { id: 'b_back_1', text: '动物遗传育种与繁殖实验室', key: 'custom2', x: 50, y: 55, fontSize: 13, fontWeight: 'semibold', fontFamily: 'sans', color: '#3B82F6', letterSpacing: '0.1em', align: 'center' },
          { id: 'b_back_2', text: 'Department of Animal Science - SICAU', key: 'slogan', x: 50, y: 66, fontSize: 7.5, fontWeight: 'medium', fontFamily: 'mono', color: '#94A3B8', letterSpacing: '0.06em', align: 'center' }
        ]
      }
    }
  }
];
