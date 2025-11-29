import React from 'react';
import { TalentReport } from '../types';
import { 
  Briefcase, 
  MapPin, 
  Target, 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Globe, 
  Award,
  Download,
  FileText,
  Table as TableIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface AnalysisReportProps {
  data: TalentReport;
}

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

const AnalysisReport: React.FC<AnalysisReportProps> = ({ data }) => {

  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const rows = [
      ['类别', '项目', '详细内容'],
      ['基本信息', '职位名称', data.jobTitle],
      ['基本信息', '分析摘要', data.summary],
      ['人才画像', '核心硬技能', data.portrait.hardSkills.join('; ')],
      ['人才画像', '核心软技能', data.portrait.softSkills.join('; ')],
      ['人才画像', '常见头衔', data.portrait.commonTitles.join('; ')],
      ['人才画像', '经验背景', data.portrait.experienceBackground],
    ];

    data.companies.forEach(cat => {
       cat.companies.forEach(comp => {
          rows.push(['目标公司', cat.categoryName, `${comp.name} - ${comp.reason}`]);
       });
    });

    data.marketAnalysis.geoDistribution.forEach(geo => {
       rows.push(['人才分布', geo.name, `热度:${geo.value}, 原因:${geo.reason}`]);
    });
    
    data.marketAnalysis.salaryRanges.forEach(sal => {
        rows.push(['薪资参考', sal.level, sal.range]);
    });

    rows.push(['流动趋势', '描述', data.marketAnalysis.talentFlowTrends]);
    
    rows.push(['寻源建议', '优先渠道', data.sourcing.priorityChannels.join('; ')]);
    data.sourcing.communities.forEach(comm => {
      rows.push(['寻源建议', '专业社区', comm]);
    });
    rows.push(['寻源建议', '创新策略', data.sourcing.creativeStrategy]);

    data.engagement.attractionPoints.forEach((pt, i) => {
        rows.push(['沟通策略', `吸引点 ${i+1}`, pt]);
    });
    
    rows.push(['沟通策略', '话术模板', data.engagement.outreachTemplate]);

    const csvContent = "\uFEFF" + rows.map(row => 
      row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    downloadFile(csvContent, `TalentMap_${data.jobTitle.replace(/\s+/g, '_')}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleExportHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <title>人才地图分析报告 - ${data.jobTitle}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 40px; background-color: #fff; }
          h1 { color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 16px; }
          h2 { color: #1e293b; margin-top: 32px; border-left: 4px solid #6366f1; padding-left: 12px; }
          h3 { color: #475569; margin-top: 24px; font-size: 1.1em; }
          .section { margin-bottom: 32px; background: #f8fafc; padding: 24px; border-radius: 8px; }
          .tag { display: inline-block; background: #e0e7ff; color: #4338ca; padding: 4px 12px; border-radius: 16px; font-size: 0.9em; margin-right: 8px; margin-bottom: 8px; }
          .company-card { background: #fff; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 8px; }
          .company-cat { font-weight: bold; margin-top: 16px; display: block; color: #0f172a; }
          .highlight { background: #ecfdf5; color: #065f46; padding: 16px; border-radius: 8px; border: 1px solid #d1fae5; }
          .quote { font-style: italic; background: #fefce8; padding: 16px; border-left: 4px solid #facc15; color: #854d0e; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; }
          th { color: #64748b; font-size: 0.9em; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <h1>人才地图分析报告</h1>
        <div style="color: #64748b; margin-bottom: 24px;">职位：<strong>${data.jobTitle}</strong> | 生成日期：${new Date().toLocaleDateString()}</div>
        
        <p style="font-size: 1.1em; color: #334155;">${data.summary}</p>

        <h2>一、人才画像总结</h2>
        <div class="section">
          <h3>核心技能</h3>
          <div>
            ${data.portrait.hardSkills.map(s => `<span class="tag">${s}</span>`).join('')}
            ${data.portrait.softSkills.map(s => `<span class="tag" style="background:#fef3c7;color:#92400e;">${s}</span>`).join('')}
          </div>
          <h3>常见头衔</h3>
          <p>${data.portrait.commonTitles.join('、')}</p>
          <h3>背景经验</h3>
          <p>${data.portrait.experienceBackground}</p>
        </div>

        <h2>二、目标公司图谱</h2>
        <div class="section">
          ${data.companies.map(cat => `
            <span class="company-cat">${cat.categoryName}</span>
            ${cat.companies.map(c => `
              <div class="company-card">
                <strong>${c.name}</strong><br>
                <span style="font-size:0.9em;color:#64748b;">${c.reason}</span>
              </div>
            `).join('')}
          `).join('')}
        </div>

        <h2>三、市场深度分析</h2>
        <div class="section">
          <h3>地理分布</h3>
          <table>
            <thead><tr><th>地区</th><th>热度</th><th>原因</th></tr></thead>
            <tbody>
              ${data.marketAnalysis.geoDistribution.map(g => `
                <tr>
                  <td>${g.name}</td>
                  <td>${g.value}</td>
                  <td>${g.reason}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h3>薪资参考</h3>
          <table>
            <thead><tr><th>级别</th><th>范围</th></tr></thead>
            <tbody>
              ${data.marketAnalysis.salaryRanges.map(s => `<tr><td>${s.level}</td><td><strong>${s.range}</strong></td></tr>`).join('')}
            </tbody>
          </table>
          
          <h3>人才流动趋势</h3>
          <div class="highlight">${data.marketAnalysis.talentFlowTrends}</div>
        </div>

        <h2>四、寻源与沟通</h2>
        <div class="section">
          <h3>优先渠道</h3>
          <p>${data.sourcing.priorityChannels.join('、')}</p>
          <h3>专业社区</h3>
          <p>${data.sourcing.communities.join('、')}</p>
          <h3>创新策略</h3>
          <p>${data.sourcing.creativeStrategy}</p>
          
          <h3>话术模板</h3>
          <div class="quote">${data.engagement.outreachTemplate}</div>
        </div>
      </body>
      </html>
    `;
    downloadFile(htmlContent, `TalentMap_${data.jobTitle.replace(/\s+/g, '_')}.html`, 'text/html');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Summary Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <span className="text-indigo-600 font-semibold tracking-wider text-sm uppercase mb-2 block">分析报告</span>
            <h2 className="text-3xl font-bold text-slate-800">{data.jobTitle}</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            >
              <TableIcon className="w-4 h-4" />
              导出 CSV
            </button>
            <button 
              onClick={handleExportHTML}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              导出 HTML
            </button>
          </div>
        </div>
        <p className="mt-4 text-slate-600 text-lg leading-relaxed">{data.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 1: Talent Portrait */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">人才画像总结</h3>
          </div>
          
          <div className="space-y-6 flex-1">
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">核心技能</h4>
              <div className="flex flex-wrap gap-2">
                {data.portrait.hardSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-sm font-medium border border-slate-200">
                    {skill}
                  </span>
                ))}
                {data.portrait.softSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-md text-sm font-medium border border-amber-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">常见头衔</h4>
              <div className="flex flex-wrap gap-2">
                {data.portrait.commonTitles.map((title, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full text-sm border border-slate-100">
                    <Briefcase className="w-3 h-3 text-slate-400" />
                    {title}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">背景经验</h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                {data.portrait.experienceBackground}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Target Companies */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">目标公司图谱</h3>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {data.companies.map((category, idx) => (
              <div key={idx}>
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-rose-500' : idx === 1 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  {category.categoryName}
                </h4>
                <div className="space-y-3">
                  {category.companies.map((company, cIdx) => (
                    <div key={cIdx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors">
                      <div className="font-semibold text-slate-800">{company.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{company.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Market Analysis */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">人才库深度分析</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Geo Chart */}
          <div className="lg:col-span-2 min-h-[300px]">
            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 地理分布热图
            </h4>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.marketAnalysis.geoDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={80} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {data.marketAnalysis.geoDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
               {data.marketAnalysis.geoDistribution.slice(0, 4).map((item, idx) => (
                 <div key={idx} className="text-xs text-slate-500">
                   <span className="font-semibold text-slate-700">{item.name}:</span> {item.reason}
                 </div>
               ))}
            </div>
          </div>

          {/* Salary & Trends */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" /> 薪资带宽参考
              </h4>
              <div className="space-y-3">
                {data.marketAnalysis.salaryRanges.map((sal, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-sm font-medium text-slate-600">{sal.level}</span>
                    <span className="text-sm font-bold text-indigo-600">{sal.range}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <h4 className="text-sm font-semibold text-emerald-800 mb-2">人才流动趋势</h4>
              <p className="text-emerald-700 text-sm leading-relaxed">
                {data.marketAnalysis.talentFlowTrends}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4 & 5: Sourcing & Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">寻源渠道建议</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">优先渠道</h4>
              <div className="flex flex-wrap gap-2">
                {data.sourcing.priorityChannels.map((ch, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded border border-purple-100 text-sm font-medium">
                    {ch}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">专业社区</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {data.sourcing.communities.map((comm, i) => (
                  <li key={i}>{comm}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
               <h4 className="text-sm font-bold text-purple-800 mb-2">创造性寻源</h4>
               <p className="text-sm text-purple-900/80">{data.sourcing.creativeStrategy}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">个性化沟通</h3>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">关键吸引点</h4>
              <ul className="space-y-2">
                {data.engagement.attractionPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-orange-400 mt-1">★</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">沟通话术模板</h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 italic relative">
                <span className="absolute top-2 left-2 text-4xl text-slate-200 leading-none">"</span>
                <p className="relative z-10 px-2 py-1 whitespace-pre-line leading-relaxed">
                  {data.engagement.outreachTemplate}
                </p>
                <span className="absolute bottom-[-10px] right-4 text-4xl text-slate-200 leading-none">"</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;