import React, { useState } from 'react';
import { Search, Calendar, Link as LinkIcon, Copy, Eye, Edit2, Check } from 'lucide-react';
import { MOCK_INVITATIONS } from '../types';

interface ManagementTableProps {
  onPreview: (id: string) => void;
}

export function ManagementTable({ onPreview }: ManagementTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">الأرشيف والروابط</h2>
          <p className="text-sm text-gray-500 mt-1">سجل الدعوات وإدارة الروابط الخاصة بها</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="البحث باسم العروسين..."
              className="w-full sm:w-64 pl-4 pr-10 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm"
            />
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="relative">
            <input 
              type="date"
              className="w-full sm:w-48 pl-4 pr-10 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm text-gray-600 appearance-none"
            />
            <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          
          <button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm">
            بحث
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/50">
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 rounded-tr-lg">العروسين</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-600">تاريخ الفرح</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-600">الرابط المختصر</th>
              <th className="py-4 px-4 text-sm font-semibold text-gray-600 rounded-tl-lg">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {MOCK_INVITATIONS.map((inv) => {
              // Create a short link representation
              const shortLink = `${window.location.origin}/invite_${inv.id}`;

              return (
                <tr key={inv.id} className="hover:bg-stone-50/80 transition-colors group">
                  <td className="py-4 px-4 text-sm font-medium text-gray-800">
                    {inv.groomName} & {inv.brideName}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                    {inv.weddingDate}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3 bg-stone-100/80 w-fit px-3 py-2 rounded-lg border border-stone-200 group-hover:border-amber-200 transition-colors">
                      <LinkIcon size={14} className="text-amber-500" />
                      <span className="text-sm font-medium text-gray-700" dir="ltr">{shortLink}</span>
                      <button 
                        onClick={() => handleCopy(inv.id, shortLink)}
                        className={`mr-2 p-1.5 rounded-md transition-colors ${copiedId === inv.id ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400 hover:text-amber-600 hover:shadow-sm border border-stone-200'}`}
                        title="نسخ الرابط"
                      >
                        {copiedId === inv.id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onPreview(inv.id)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-amber-50 hover:text-amber-600 transition-colors" 
                        title="معاينة"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors" 
                        title="تعديل"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
