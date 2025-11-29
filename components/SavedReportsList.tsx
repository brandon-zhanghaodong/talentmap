import React, { useState, useEffect } from 'react';
import { SavedTalentReport } from '../types';
import { Trash2, ArrowRight, Calendar, Briefcase, ChevronRight, Inbox } from 'lucide-react';

interface SavedReportsListProps {
  onSelect: (report: SavedTalentReport) => void;
  onDelete?: (id: string) => void;
}

const SavedReportsList: React.FC<SavedReportsListProps> = ({ onSelect }) => {
  const [reports, setReports] = useState<SavedTalentReport[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('talentMap_saved') || '[]');
      setReports(saved);
    } catch (e) {
      console.error("Failed to load saved reports", e);
    }
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这份报告吗？')) {
      const updated = reports.filter(r => r.id !== id);
      setReports(updated);
      localStorage.setItem('talentMap_saved', JSON.stringify(updated));
    }
  };

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
           <Inbox className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-lg font-medium text-slate-500">暂无收藏的报告</p>
        <p className="text-sm mt-2">在生成的分析报告中点击“收藏”按钮即可保存。</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-indigo-600" />
        已收藏的报告
        <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {reports.length}
        </span>
      </h2>
      
      <div className="grid gap-4">
        {reports.map((report) => (
          <div 
            key={report.id}
            onClick={() => onSelect(report)}
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {report.jobTitle}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(report.savedAt).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => handleDelete(e, report.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors z-10"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-slate-600 text-sm line-clamp-2 mb-4 pr-8">
              {report.summary}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="flex gap-2">
                {report.portrait.hardSkills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{skill}</span>
                ))}
              </div>
              {report.portrait.hardSkills.length > 3 && (
                  <span className="text-slate-400">+{report.portrait.hardSkills.length - 3}</span>
              )}
            </div>
            
            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-indigo-50 p-2 rounded-full text-indigo-600">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedReportsList;