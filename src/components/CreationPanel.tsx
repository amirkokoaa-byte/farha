import React from 'react';
import { InvitationData } from '../types';

interface CreationPanelProps {
  data: InvitationData;
  onChange: (data: Partial<InvitationData>) => void;
}

export function CreationPanel({ data, onChange }: CreationPanelProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-stone-100 pb-4">
        إنشاء دعوة جديدة
      </h2>

      <div className="space-y-5 flex-1">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">أسماء العروسين</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="اسم العريس"
                value={data.groomName}
                onChange={(e) => onChange({ groomName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="اسم العروس"
                value={data.brideName}
                onChange={(e) => onChange({ brideName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">تاريخ وموعد الزفاف</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={data.weddingDate}
              onChange={(e) => onChange({ weddingDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-gray-600"
            />
            <input
              type="time"
              value={data.weddingTime}
              onChange={(e) => onChange({ weddingTime: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-gray-600"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">كلمة الدعوة</label>
          <textarea
            rows={5}
            placeholder="اكتب رسالة الترحيب بضيوفك هنا..."
            value={data.message}
            onChange={(e) => onChange({ message: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all resize-none"
          ></textarea>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-stone-100">
        <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all">
          حفظ المسودة
        </button>
      </div>
    </div>
  );
}
