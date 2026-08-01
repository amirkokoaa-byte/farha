import React, { useState } from 'react';
import { UploadCloud, Play, Square, Settings2, Music } from 'lucide-react';
import { InvitationData } from '../types';

interface AudioPanelProps {
  data: InvitationData;
  onChange: (data: Partial<InvitationData>) => void;
}

export function AudioPanel({ data, onChange }: AudioPanelProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateUpload = () => {
    setIsUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsUploading(false), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-stone-100 pb-4">
        المقاطع الصوتية والميزات
      </h2>

      <div className="space-y-8 flex-1">
        {/* Audio Section */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Music size={18} className="text-amber-500" />
            اختيار الأغنية
          </label>
          
          <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
               onClick={!isUploading ? simulateUpload : undefined}>
            <UploadCloud size={32} className="text-amber-400 mb-3" />
            <p className="text-gray-800 font-semibold mb-1">ارفع أغنية</p>
            <p className="text-gray-400 text-sm">MP3, WAV (الحد الأقصى 10MB)</p>
          </div>

          {isUploading && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-amber-700 font-semibold">جارِ الضغط...</span>
                <span className="text-amber-700">{progress}%</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {!isUploading && progress === 100 && (
            <div className="flex items-center justify-between bg-stone-100 p-3 rounded-xl border border-stone-200">
              <div className="flex items-center gap-3">
                <Music size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">wedding_song_final.mp3</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:text-amber-600 bg-white rounded-lg shadow-sm border border-stone-200 transition-colors" title="معاينة">
                  <Play size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="space-y-4 pt-6 border-t border-stone-100">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Settings2 size={18} className="text-amber-500" />
            إعدادات إضافية
          </label>
          
          <label className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer hover:bg-stone-100 transition-colors">
            <span className="text-gray-700 font-medium">زر إيقاف الأغنية الجانبي</span>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${data.showPauseButton ? 'bg-amber-500' : 'bg-stone-300'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${data.showPauseButton ? 'left-1' : 'left-7'}`}
                   onClick={(e) => {
                     e.preventDefault();
                     onChange({ showPauseButton: !data.showPauseButton });
                   }}
              ></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
