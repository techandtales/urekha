"use client";

import React from 'react';
import { FileText, Star, Shield, Zap, Info, Calendar, MapPin, User, ChevronRight } from 'lucide-react';

interface Props {
  data: any;
}

export function SampleReportPreview({ data }: Props) {
  if (!data) return null;

  const profile = data.profile || {};
  const ascendant_report = data.ascendant_report?.response?.[0] || data.ascendant_report || {};
  const dasha_current_maha = data.dasha_current_maha?.response || data.dasha_current_maha || {};
  const dosha_kaalsarp = data.dosha_kaalsarp?.response || data.dosha_kaalsarp || {};
  const dosha_mangal = data.dosha_mangal?.response || data.dosha_mangal || {};
  const summary_report = data.summary_report || { blocks: [] };
  const planet_details = data.planet_details?.response || data.planet_details || {};

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* 1. Header Card - Royal Aesthetic */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0A1010] border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Star size={120} className="text-primary" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
              Premium Kundli Report
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-800 dark:text-white leading-tight">
              {profile.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-zinc-400">
              <span className="flex items-center gap-2"><Calendar size={18} className="text-primary" /> {profile.date_of_birth}</span>
              <span className="flex items-center gap-2"><MapPin size={18} className="text-primary" /> {profile.place_of_birth}</span>
            </div>
          </div>
          
          <div className="bg-primary text-white p-6 rounded-2xl shadow-xl shadow-primary/20 min-w-[200px]">
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-2">Moon Sign / राशि</p>
            <p className="text-2xl font-bold">{planet_details.rasi || 'Calculating...'}</p>
            <div className="h-px bg-white/20 my-3" />
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-2">Nakshatra / नक्षत्र</p>
            <p className="text-lg font-medium">{planet_details.nakshatra || 'Calculating...'}</p>
          </div>
        </div>
      </div>

      {/* 2. Ascendant Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-primary rounded-full" />
          <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-white">लग्न फल (Ascendant Details)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Ascendant', value: ascendant_report.ascendant, icon: Zap },
            { label: 'Ascendant Lord', value: ascendant_report.ascendant_lord, icon: User },
            { label: 'Lucky Gem', value: ascendant_report.lucky_gem, icon: Star },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-2xl hover:border-primary/30 transition-colors">
              <item.icon size={24} className="text-primary mb-4" />
              <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">{item.label}</p>
              <p className="text-xl font-bold text-slate-800 dark:text-zinc-200">{item.value || 'N/A'}</p>
            </div>
          ))}
        </div>

        {ascendant_report.gayatri_mantra && (
          <div className="bg-primary/5 dark:bg-white/[0.02] border border-primary/20 dark:border-white/5 rounded-2xl p-6 italic text-center">
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              "{ascendant_report.gayatri_mantra}"
            </p>
          </div>
        )}
      </section>

      {/* 3. AI Intelligence Summary */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-primary rounded-full" />
          <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-white">अंतर्मन का रहस्य (Psychological Blueprint)</h2>
        </div>

        <div className="bg-white dark:bg-[#080D0D] border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-10 space-y-8">
          {summary_report.blocks?.map((block: any, idx: number) => (
            <div key={idx} className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 100}ms` }}>
              {block.type === 'heading' && (
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <ChevronRight size={20} /> {block.text}
                </h3>
              )}
              {(block.type === 'paragraph' || block.type === 'closing') && (
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-lg">{block.text}</p>
              )}
              {block.type === 'highlight_box' && (
                <div className="my-8 p-8 bg-gradient-to-br from-primary to-indigo-900 text-white rounded-2xl shadow-xl shadow-primary/20">
                  {block.title && <h4 className="text-xs uppercase tracking-widest font-bold opacity-70 mb-3">{block.title}</h4>}
                  <p className="text-xl font-serif leading-relaxed italic">"{block.text}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Dasha & Dosha Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dasha Card */}
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-serif font-bold flex items-center gap-2">
            <Zap size={20} className="text-primary" /> वर्तमान दशा (Current Dasha)
          </h3>
          <div className="space-y-4">
            {dasha_current_maha.mahadasha && (
              <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Mahadasha</p>
                  <p className="text-lg font-bold text-primary">{dasha_current_maha.mahadasha.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Ends On</p>
                  <p className="text-sm font-medium">{dasha_current_maha.mahadasha.end}</p>
                </div>
              </div>
            )}
            {dasha_current_maha.antardasha && (
              <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Antardasha</p>
                  <p className="text-lg font-bold text-primary">{dasha_current_maha.antardasha.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Ends On</p>
                  <p className="text-sm font-medium">{dasha_current_maha.antardasha.end}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dosha Card */}
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-serif font-bold flex items-center gap-2">
            <Shield size={20} className="text-primary" /> दोष विश्लेषण (Dosha Analysis)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border transition-all ${dosha_mangal.is_dosha_present ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
              <p className="text-[10px] uppercase font-bold opacity-70 mb-1">Mangal Dosha</p>
              <p className="text-sm font-bold">{dosha_mangal.is_dosha_present ? 'Present' : 'Absent'}</p>
            </div>
            <div className={`p-4 rounded-xl border transition-all ${dosha_kaalsarp.is_dosha_present ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
              <p className="text-[10px] uppercase font-bold opacity-70 mb-1">Kaalsarp Dosha</p>
              <p className="text-sm font-bold">{dosha_kaalsarp.is_dosha_present ? 'Present' : 'Absent'}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-500 italic">
            Note: Remedies are included in the downloadable premium PDF report.
          </p>
        </div>
      </div>
    </div>
  );
}
