import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeResumeWithAI(
  resumeText: string,
  jobDescription?: string
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are an expert ATS (Applicant Tracking System) analyst with 10+ years of experience in HR tech.

Analyze this resume for ATS compatibility and return ONLY a valid JSON object with no extra text, no markdown, no backticks.

RESUME TEXT:
${resumeText}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}` : ''}

Return this exact JSON structure:
{
  "overall_score": <0-100 integer>,
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
      "category": "formatting|keywords|structure|content",
      "title": "<issue title>",
      "description": "<what the issue is>",
      "suggestion": "<how to fix it>"
    }
  ],
  "keywords_found": ["<keyword1>", "<keyword2>"],
  "keywords_missing": ["<keyword1>", "<keyword2>"],
  "strengths": ["<strength1>", "<strength2>"],
  "quick_wins": ["<quick win1>", "<quick win2>"],
  "word_count": <integer>,
  "pass_rate": "Low|Medium|High|Very High"
}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const cleaned = responseText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(cleaned);
}