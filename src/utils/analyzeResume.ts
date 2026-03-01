import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

function getGemini() {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      throw new Error("GEMINI_API_KEY missing at runtime");
    }

    genAI = new GoogleGenerativeAI(key);
  }

  return genAI;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function analyzeResumeWithAI(
  resumeText: string,
  jobDescription?: string,
  retries = 3
): Promise<any> {
  const model = getGemini().getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const prompt = `You are a senior ATS (Applicant Tracking System) expert and professional resume consultant with 15+ years of experience at Fortune 500 companies. You have deep knowledge of how ATS systems like Workday, Taleo, Greenhouse, Lever, and iCIMS parse and score resumes.

Your task is to perform a comprehensive, STRICT and ACCURATE ATS analysis of the provided resume. Be critical and precise — do NOT give inflated scores. A perfect resume rarely scores above 90.

${jobDescription ? `
TARGET JOB DESCRIPTION:
${jobDescription}
Analyze the resume specifically for this role. Match skills, experience, keywords, and requirements from the job description.
` : `No job description provided. Perform a general ATS analysis based on industry best practices.`}

RESUME TEXT TO ANALYZE:
---
${resumeText}
---

SCORING CRITERIA (be strict and accurate):
1. FORMATTING (0-100): ATS-parseable format, standard headings, consistent dates, no tables/columns/graphics
2. KEYWORDS (0-100): Industry keywords, job description match, skills completeness
3. READABILITY (0-100): Action verbs, quantifiable achievements, concise bullets
4. CONTACT INFO (0-100): Name, email, phone, LinkedIn, location
5. WORK EXPERIENCE (0-100): Relevant experience, clear titles, achievement-focused
6. EDUCATION (0-100): Degree, institution, graduation year
7. SKILLS (0-100): Technical skills, relevant to role, certifications

OVERALL SCORE: Weighted average (Formatting 20%, Keywords 25%, Readability 20%, Contact 10%, Experience 15%, Skills 10%)
Be strict: most resumes score 55-80. Perfect resumes rarely exceed 90.

Return ONLY valid JSON, no markdown, no backticks:

{
  "overall_score": <0-100>,
  "section_scores": {
    "formatting": <0-100>,
    "keywords": <0-100>,
    "readability": <0-100>,
    "contact_info": <0-100>,
    "work_experience": <0-100>,
    "education": <0-100>,
    "skills": <0-100>
  },
  "issues": [
    {
      "severity": "high|medium|low",
      "category": "formatting|keywords|structure|content|contact",
      "title": "<specific issue title>",
      "description": "<detailed explanation referencing actual resume content>",
      "suggestion": "<specific actionable fix>"
    }
  ],
  "keywords_found": ["<actual keywords from resume, max 30>"],
  "keywords_missing": ["<important missing keywords, max 15>"],
  "strengths": ["<specific strengths from this resume>"],
  "quick_wins": ["<specific quick fixes>"],
  "word_count": <actual count>,
  "pass_rate": "Low|Medium|High|Very High",
  "ats_verdict": "<2-3 sentence honest assessment of ATS performance>"
}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleaned = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(cleaned);
    } catch (error: any) {
      const isRateLimit = error.message?.includes('429') || error.message?.includes('quota');
      if (isRateLimit && attempt < retries) {
        console.log(`Rate limit hit, waiting 30s before retry ${attempt}/${retries}...`);
        await sleep(30000);
        continue;
      }
      if (attempt === retries) throw error;
      await sleep(5000);
    }
  }
}