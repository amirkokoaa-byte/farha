import React, { useRef } from 'react';
import { Upload, Type, Image as ImageIcon, X } from 'lucide-react';
import { InvitationData } from '../types';

interface DesignPanelProps {
  data: InvitationData;
  onChange: (data: Partial<InvitationData>) => void;
}

const FONTS = ['Cairo', 'Amiri', 'Tajawal', 'Reem Kufi', 'Aref Ruqaa', 'Changa', 'Lalezar', 'Lateef'];
const BACKGROUNDS = ['bg-stone-50', 'bg-amber-50', 'bg-rose-50', 'bg-slate-50', 'bg-orange-50'];

export function DesignPanel({ data, onChange }: DesignPanelProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    onChange({ customBackgroundImage: objectUrl, background: 'bg-transparent' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-stone-100 pb-4">
        تخصيص التصميم
      </h2>

      {/* Live Preview */}
      <div className="flex-1 flex items-center justify-center bg-stone-100 rounded-xl mb-8 p-4 relative overflow-hidden border border-stone-200">
        <div className={`w-full max-w-sm aspect-[3/4] ${data.customBackgroundImage ? 'bg-transparent' : data.background} shadow-xl rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all duration-500 relative border-8 border-white/50 ring-1 ring-black/5 bg-cover bg-center`}
             style={{ 
               fontFamily: data.font,
               backgroundImage: data.customBackgroundImage ? `url(${data.customBackgroundImage})` : 'none'
             }}>
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-300/50 rounded-tl-lg z-10"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-300/50 rounded-tr-lg z-10"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-300/50 rounded-bl-lg z-10"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-300/50 rounded-br-lg z-10"></div>

          <div className="relative z-10 flex flex-col items-center w-full h-full bg-white/40 p-4 rounded-lg backdrop-blur-[2px]">
            <p className="text-amber-800 mb-6 text-sm tracking-widest font-sans font-semibold drop-shadow-md">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-relaxed drop-shadow-md">
              {data.groomName || '00'}
              <span className="block text-2xl text-amber-600 my-2 drop-shadow-md">&amp;</span>
              {data.brideName || '00'}
            </h1>
            
            <div className="w-16 h-px bg-amber-400 mx-auto my-6 drop-shadow-md"></div>
            
            <p className="text-gray-900 font-medium text-lg whitespace-pre-wrap leading-relaxed drop-shadow-md">
              {data.message || 'كلمة الدعوة...'}
            </p>
            
            <div className="mt-8 pt-8 border-t border-black/10 w-full drop-shadow-md">
              <p className="text-amber-800 font-bold drop-shadow-md">{data.weddingDate || 'التاريخ'}</p>
              <p className="text-gray-800 font-semibold text-sm mt-1 drop-shadow-md">{data.weddingTime || 'الوقت'}</p>
            </div>
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
          <label className="flex items-center justify-between text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} className="text-amber-500" />
              خلفية الدعوة
            </div>
            {data.customBackgroundImage && (
              <button 
                onClick={() => onChange({ customBackgroundImage: undefined, background: 'bg-stone-50' })}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <X size={14} /> إزالة الصورة
              </button>
            )}
          </label>
          <div className="flex gap-2">
            <button 
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center justify-center px-4 py-3 rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-400 hover:bg-amber-50 transition-colors text-gray-500 hover:text-amber-600 relative overflow-hidden group"
              title="رفع صورة للخلفية"
            >
              <Upload size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <input 
              type="file" 
              ref={imageInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
            />
            <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-thin items-center">
              {BACKGROUNDS.map((bg, idx) => (
                <button
                  key={bg}
                  onClick={() => onChange({ background: bg, customBackgroundImage: undefined })}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 ${data.background === bg && !data.customBackgroundImage ? 'border-amber-500 ring-2 ring-amber-200' : 'border-stone-200'} ${bg} transition-all relative z-10`}
                  title={`لون ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
