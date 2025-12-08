import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TalentReport } from "../types";

// Define the response schema for structured output
const talentReportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    jobTitle: { type: Type.STRING, description: "A concise title for the analyzed position" },
    summary: { type: Type.STRING, description: "One sentence summary of the analysis" },
    portrait: {
      type: Type.OBJECT,
      properties: {
        hardSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        commonTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
        experienceBackground: { type: Type.STRING },
      },
    },
    companies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          categoryName: { type: Type.STRING, description: "e.g., 直接竞争对手, 上下游产业, 潜力独角兽" },
          companies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
            },
          },
        },
      },
    },
    marketAnalysis: {
      type: Type.OBJECT,
      properties: {
        geoDistribution: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "City or Region name" },
              value: { type: Type.NUMBER, description: "Importance score 0-100" },
              reason: { type: Type.STRING },
            },
          },
        },
        salaryRanges: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.STRING, enum: ["初级", "中级", "高级"] },
              range: { type: Type.STRING, description: "e.g. 30-50万 RMB" },
            },
          },
        },
        talentFlowTrends: { type: Type.STRING },
      },
    },
    sourcing: {
      type: Type.OBJECT,
      properties: {
        priorityChannels: { type: Type.ARRAY, items: { type: Type.STRING } },
        communities: { type: Type.ARRAY, items: { type: Type.STRING } },
        creativeStrategy: { type: Type.STRING },
      },
    },
    engagement: {
      type: Type.OBJECT,
      properties: {
        attractionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        outreachTemplate: { type: Type.STRING },
      },
    },
  },
  required: ["jobTitle", "portrait", "companies", "marketAnalysis", "sourcing", "engagement"],
};

export const generateTalentReport = async (jobDescription: string): Promise<TalentReport> => {
  // Use process.env.API_KEY as per guidelines. 
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemPrompt = `
    你是一名顶尖的“人才战略分析师”，专门为中国市场的招聘HR提供深度的人才地图分析。
    你的任务是基于用户的【岗位需求】，搜寻、分析并呈现符合要求的候选人群体、公司来源和技能分布。
    
    规则与约束：
    1. 真实性：基于公开市场知识，不做虚构。
    2. 具体性：提供具体的公司名称、技术栈、社区名称。
    3. 地域性：主要面向中国国内市场，但如果该岗位是全球性紧缺人才（如高端AI），请包含全球视野。
    4. 语言：必须使用简体中文输出。
    
    请分析以下职位描述，并返回符合JSON Schema的数据结构。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: jobDescription,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: talentReportSchema,
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from the model.");
    }

    const data = JSON.parse(text) as TalentReport;
    return data;

  } catch (error) {
    console.error("Error generating talent report:", error);
    throw error;
  }
};