import React from 'react';
import { Upload, Type, Image as ImageIcon } from 'lucide-react';
import { InvitationData } from '../types';

interface DesignPanelProps {
  data: InvitationData;
  onChange: (data: Partial<InvitationData>) => void;
}

const FONTS = ['Cairo', 'Amiri', 'Tajawal', 'Reem Kufi', 'Aref Ruqaa', 'Changa', 'Lalezar', 'Lateef'];
const BACKGROUNDS = ['bg-stone-50', 'bg-amber-50', 'bg-rose-50', 'bg-slate-50', 'bg-orange-50'];

export function DesignPanel({ data, onChange }: DesignPanelProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-stone-100 pb-4">
        تخصيص التصميم
      </h2>

      {/* Live Preview */}
      <div className="flex-1 flex items-center justify-center bg-stone-100 rounded-xl mb-8 p-4 relative overflow-hidden border border-stone-200">
        <div className={`w-full max-w-sm aspect-[3/4] ${data.background} shadow-xl rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all duration-500 relative border-8 border-white/50 ring-1 ring-black/5`}
             style={{ fontFamily: data.font }}>
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-300/50 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-300/50 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-300/50 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-300/50 rounded-br-lg"></div>

          <p className="text-amber-600/80 mb-6 text-sm tracking-widest font-sans">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-relaxed">
            {data.groomName || '00'}
            <span className="block text-2xl text-amber-500 my-2">&amp;</span>
            {data.brideName || '00'}
          </h1>
          
          <div className="w-16 h-px bg-amber-300 mx-auto my-6"></div>
          
          <p className="text-gray-600 text-lg whitespace-pre-wrap leading-relaxed">
            {data.message || 'كلمة الدعوة...'}
          </p>
          
          <div className="mt-8 pt-8 border-t border-black/5 w-full">
            <p className="text-amber-700 font-bold">{data.weddingDate || 'التاريخ'}</p>
            <p className="text-gray-500 text-sm mt-1">{data.weddingTime || 'الوقت'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Font Selector */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Type size={16} className="text-amber-500" />
            اختيار الخط
          </label>
          <div className="relative">
            <select
              value={data.font}
              onChange={(e) => onChange({ font: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-400 outline-none appearance-none"
            >
              {FONTS.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font} - معاينة الخط الحي
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xs text-amber-500">80+ خط</span>
            </div>
          </div>
        </div>

        {/* Background Selector */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <ImageIcon size={16} className="text-amber-500" />
            خلفية الدعوة
          </label>
          <div className="flex gap-2">
            <button className="flex items-center justify-center px-4 py-3 rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-400 hover:bg-amber-50 transition-colors text-gray-500 hover:text-amber-600">
              <Upload size={20} />
            </button>
            <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {BACKGROUNDS.map((bg, idx) => (
                <button
                  key={bg}
                  onClick={() => onChange({ background: bg })}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 ${data.background === bg ? 'border-amber-500 ring-2 ring-amber-200' : 'border-stone-200'} ${bg} transition-all`}
                  title={`Background ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
