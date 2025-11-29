import React, { useState } from 'react';
import InputSection from './components/InputSection';
import AnalysisReport from './components/AnalysisReport';
import { TalentReport, LoadingState } from './types';
import { generateTalentReport } from './services/geminiService';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [reportData, setReportData] = useState<TalentReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async (jd: string) => {
    setLoadingState(LoadingState.LOADING);
    setErrorMsg(null);
    setReportData(null); // Clear previous results

    try {
      const data = await generateTalentReport(jd);
      setReportData(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
      setErrorMsg("分析生成失败。请检查API Key设置或稍后重试。");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              T
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                TalentMap AI
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                （由知识星球：AI时代的HR创建）
              </span>
            </div>
          </div>
          <div className="text-sm text-slate-500 hidden md:block">
            智能人才战略分析平台
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-8">
        {loadingState === LoadingState.IDLE && (
           <InputSection onAnalyze={handleAnalyze} isLoading={false} />
        )}

        {loadingState === LoadingState.LOADING && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">正在构建人才图谱...</h3>
            <p className="text-slate-500 text-center max-w-md">
              AI正在分析全网数据，识别核心技能、匹配目标公司并制定寻源策略。请稍候。
            </p>
          </div>
        )}

        {loadingState === LoadingState.ERROR && (
          <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-50 border border-red-100 rounded-xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-1">出错了</h3>
              <p className="text-red-700">{errorMsg}</p>
              <button 
                onClick={() => setLoadingState(LoadingState.IDLE)}
                className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
              >
                返回重试
              </button>
            </div>
          </div>
        )}

        {loadingState === LoadingState.SUCCESS && reportData && (
          <>
            <AnalysisReport data={reportData} />
            <div className="flex justify-center mt-8">
               <button 
                 onClick={() => {
                   setReportData(null);
                   setLoadingState(LoadingState.IDLE);
                 }}
                 className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm font-medium"
               >
                 分析另一个职位
               </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;