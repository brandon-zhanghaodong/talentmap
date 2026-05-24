import { TalentReport } from "../types";

const API_URL = "https://api.minimaxi.com/v1/chat/completions";

const SYSTEM_PROMPT = `你是一名顶尖的"人才战略分析师"，专门为中国市场的招聘HR提供深度的人才地图分析。
你的任务是基于用户的【岗位需求】，搜寻、分析并呈现符合要求的候选人群体、公司来源和技能分布。

规则与约束：
1. 真实性：基于公开市场知识，不做虚构。
2. 具体性：提供具体的公司名称、技术栈、社区名称。
3. 地域性：主要面向中国国内市场，但如果该岗位是全球性紧缺人才（如高端AI），请包含全球视野。
4. 语言：必须使用简体中文输出。
5. 输出必须是纯JSON，不要包含markdown代码块标记或任何其他说明文字。

请严格按以下JSON结构输出：

{
  "jobTitle": "推断的职位名称",
  "summary": "一句话分析总结",
  "portrait": {
    "hardSkills": ["硬技能1", "硬技能2"],
    "softSkills": ["软技能1", "软技能2"],
    "commonTitles": ["常见职位名称1"],
    "experienceBackground": "典型的经验背景描述"
  },
  "companies": [
    {
      "categoryName": "直接竞争对手",
      "companies": [
        {"name": "公司名称", "reason": "原因"}
      ]
    }
  ],
  "marketAnalysis": {
    "geoDistribution": [
      {"name": "城市名", "value": 80, "reason": "原因"}
    ],
    "salaryRanges": [
      {"level": "高级", "range": "80-120万"}
    ],
    "talentFlowTrends": "人才流动趋势描述"
  },
  "sourcing": {
    "priorityChannels": ["渠道1"],
    "communities": ["社区1"],
    "creativeStrategy": "策略描述"
  },
  "engagement": {
    "attractionPoints": ["吸引点1"],
    "outreachTemplate": "沟通模板"
  }
}`;

export const generateTalentReport = async (jobDescription: string): Promise<TalentReport> => {
  const apiKey = "sk-cp-e1O0UR1uc0CMA5J3OhefnDosNAXh8nWXwqBrV7j_ng4a00azAqiFlqVtwbqwOl5BRW5Ov3FV_FVnxYSf_TiaWCvPlhqJMNtAnk85ZYnxjHTBpTtwMsByp9Y";
  if (!apiKey) {
    throw new Error("API_KEY is not configured. Please set VITE_API_KEY in your environment.");
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "MiniMax-M2.7",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: jobDescription },
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API request failed (${response.status}): ${errText}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response generated from the model.");
    }

    // Parse the JSON response and merge with defaults for any missing fields
    const parsed = JSON.parse(content);
    
    // Ensure all required fields exist with defaults if missing
    const data: TalentReport = {
      jobTitle: parsed.jobTitle || jobDescription,
      summary: parsed.summary || "",
      portrait: {
        hardSkills: parsed.portrait?.hardSkills || [],
        softSkills: parsed.portrait?.softSkills || [],
        commonTitles: parsed.portrait?.commonTitles || [],
        experienceBackground: parsed.portrait?.experienceBackground || "",
      },
      companies: parsed.companies || [],
      marketAnalysis: {
        geoDistribution: parsed.marketAnalysis?.geoDistribution || [],
        salaryRanges: parsed.marketAnalysis?.salaryRanges || [],
        talentFlowTrends: parsed.marketAnalysis?.talentFlowTrends || "",
      },
      sourcing: {
        priorityChannels: parsed.sourcing?.priorityChannels || [],
        communities: parsed.sourcing?.communities || [],
        creativeStrategy: parsed.sourcing?.creativeStrategy || "",
      },
      engagement: {
        attractionPoints: parsed.engagement?.attractionPoints || [],
        outreachTemplate: parsed.engagement?.outreachTemplate || "",
      },
    };

    return data;
  } catch (error) {
    console.error("Error generating talent report:", error);
    throw error;
  }
};
