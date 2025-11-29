import React, { useState } from 'react';
import InputSection from './components/InputSection';
import AnalysisReport from './components/AnalysisReport';
import SavedReportsList from './components/SavedReportsList';
import { TalentReport, LoadingState, SavedTalentReport } from './types';
import { generateTalentReport } from './services/geminiService';
import { AlertCircle, Bookmark, Home } from 'lucide-react';

type ViewMode = 'generator' | 'saved_list';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [reportData, setReportData] = useState<TalentReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('generator');

  const handleAnalyze = async (jd: string) => {
    setLoadingState(LoadingState.LOADING);
    setErrorMsg(null);
    setReportData(null); // Clear previous results
    setViewMode('generator');
    
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

  const handleSelectSavedReport = (report: SavedTalentReport) => {
    setReportData(report);
    setLoadingState(LoadingState.SUCCESS);
    setViewMode('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
              setViewMode('generator');
              if (loadingState === LoadingState.SUCCESS) {
                // Keep report if it exists
              } else {
                setLoadingState(LoadingState.IDLE);
                setReportData(null);
              }
            }}>
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
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => {
                 setViewMode('generator');
               }}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                 viewMode === 'generator' 
                  ? 'bg-slate-100 text-slate-900' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
               }`}
             >
               <Home className="w-4 h-4" />
               <span className="hidden sm:inline">分析中心</span>
             </button>
             <button 
               onClick={() => {
                 setViewMode('saved_list');
               }}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                 viewMode === 'saved_list' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
               }`}
             >
               <Bookmark className="w-4 h-4" />
               <span className="hidden sm:inline">我的收藏</span>
             </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-8">
        
        {viewMode === 'saved_list' ? (
          <SavedReportsList onSelect={handleSelectSavedReport} />
        ) : (
          /* Generator View */
          <>
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
                    onClick={() => {
                      setLoadingState(LoadingState.IDLE);
                      setErrorMsg(null);
                    }}
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
                       window.scrollTo({ top: 0, behavior: 'smooth' });
                     }}
                     className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm font-medium"
                   >
                     分析另一个职位
                   </button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;