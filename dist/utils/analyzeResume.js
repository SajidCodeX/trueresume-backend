"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeResumeWithAI = void 0;
const generative_ai_1 = require("@google/generative-ai");
let genAI = null;
function getGemini() {
    if (!genAI) {
        const key = process.env.GEMINI_API_KEY;
        if (!key)
            throw new Error("Missing Gemini API key");
        genAI = new generative_ai_1.GoogleGenerativeAI(key);
    }
    return genAI;
}
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, ms));
    });
}
function analyzeResumeWithAI(resumeText_1, jobDescription_1) {
    return __awaiter(this, arguments, void 0, function* (resumeText, jobDescription, retries = 3) {
        var _a, _b;
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
                const result = yield model.generateContent(prompt);
                const responseText = result.response.text();
                const cleaned = responseText
                    .replace(/```json/g, '')
                    .replace(/```/g, '')
                    .trim();
                return JSON.parse(cleaned);
            }
            catch (error) {
                const isRateLimit = ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('429')) || ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes('quota'));
                if (isRateLimit && attempt < retries) {
                    console.log(`Rate limit hit, waiting 30s before retry ${attempt}/${retries}...`);
                    yield sleep(30000);
                    continue;
                }
                if (attempt === retries)
                    throw error;
                yield sleep(5000);
            }
        }
    });
}
exports.analyzeResumeWithAI = analyzeResumeWithAI;
