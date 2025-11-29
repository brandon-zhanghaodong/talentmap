import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (jd: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [jd, setJd] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jd.trim()) {
      onAnalyze(jd);
    }
  };

  const examplePrompts = [
    "AIGC领域，精通Diffusion Model，有跨文化团队管理经验的首席科学家",
    "新能源汽车资深BMS算法工程师，5年以上经验，熟悉ISO26262",
    "出海电商运营总监，主要负责北美市场，TikTok渠道"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          人才地图智能分析
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          输入职位描述或关键词，AI将为您生成全方位的人才画像、目标公司图谱及寻源策略。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
        <div className="p-2">
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="请在此粘贴JD或输入核心关键词..."
            className="w-full h-40 p-6 text-lg text-slate-700 placeholder-slate-400 bg-transparent border-none outline-none resize-none focus:ring-0"
            disabled={isLoading}
          />
        </div>
        <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 gap-4">
          <div className="flex gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 no-scrollbar">
            {examplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setJd(prompt)}
                className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                示例 {idx + 1}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={isLoading || !jd.trim()}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all shadow-md hover:shadow-lg transform active:scale-95 ${
              isLoading || !jd.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                分析中...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                生成报告
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputSection;