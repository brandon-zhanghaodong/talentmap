export interface GeoDistributionItem {
  name: string;
  value: number; // 0-100 scale for heatmap intensity
  reason: string;
}

export interface SalaryRange {
  level: '初级' | '中级' | '高级';
  range: string;
}

export interface CompanyCategory {
  categoryName: string; // e.g., "直接竞争对手", "上下游", "潜力独角兽"
  companies: Array<{
    name: string;
    reason: string;
  }>;
}

export interface TalentReport {
  jobTitle: string; // Inferred from JD
  summary: string;
  portrait: {
    hardSkills: string[];
    softSkills: string[];
    commonTitles: string[];
    experienceBackground: string;
  };
  companies: CompanyCategory[];
  marketAnalysis: {
    geoDistribution: GeoDistributionItem[];
    salaryRanges: SalaryRange[];
    talentFlowTrends: string;
  };
  sourcing: {
    priorityChannels: string[];
    communities: string[];
    creativeStrategy: string;
  };
  engagement: {
    attractionPoints: string[];
    outreachTemplate: string;
  };
}

export interface SavedTalentReport extends TalentReport {
  id: string;
  savedAt: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}