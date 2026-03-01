import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeResumeWithAI(
  resumeText: string,
  jobDescription?: string
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const prompt = `You are a senior ATS (Applicant Tracking System) expert and professional resume consultant with 15+ years of experience at Fortune 500 companies. You have deep knowledge of how ATS systems like Workday, Taleo, Greenhouse, Lever, and iCIMS parse and score resumes.

Your task is to perform a comprehensive, STRICT and ACCURATE ATS analysis of the provided resume. Be critical and precise — do NOT give inflated scores. A perfect resume rarely scores above 90.

${jobDescription ? `
TARGET JOB DESCRIPTION:
${jobDescription}

Analyze the resume specifically for this role. Match skills, experience, keywords, and requirements from the job description.
` : `
No job description provided. Perform a general ATS analysis based on industry best practices.
`}

RESUME TEXT TO ANALYZE:
---
${resumeText}
---

SCORING CRITERIA (be strict and accurate):

1. FORMATTING (0-100):
   - ATS-parseable format (no tables, columns, headers/footers, graphics)
   - Standard section headings (Experience, Education, Skills, etc.)
   - Consistent date formats
   - Appropriate font and spacing
   - File structure clarity
   - Penalize: Multiple columns, tables, text boxes, unusual characters

2. KEYWORDS (0-100):
   - Industry-relevant technical keywords present
   - ${jobDescription ? 'Match with job description keywords' : 'Common industry keywords'}
   - Keyword density and natural placement
   - Skills section completeness
   - Penalize: Keyword stuffing, missing critical skills

3. READABILITY (0-100):
   - Clear, concise bullet points
   - Strong action verbs (Led, Developed, Implemented, etc.)
   - Quantifiable achievements (%, $, numbers)
   - Appropriate resume length
   - Penalize: Passive voice, vague descriptions, walls of text

4. CONTACT INFO (0-100):
   - Name clearly visible
   - Professional email address
   - Phone number present
   - LinkedIn URL (bonus)
   - Location (city/state minimum)
   - Penalize: Missing critical contact info

5. WORK EXPERIENCE (0-100):
   - Relevant experience for the role
   - Clear job titles and company names
   - Dates clearly shown
   - Achievement-focused bullets
   - Penalize: Job hopping without explanation, gaps, vague descriptions

6. EDUCATION (0-100):
   - Degree and field of study
   - Institution name
   - Graduation year
   - Relevant coursework (if entry level)

7. SKILLS (0-100):
   - Technical skills clearly listed
   - Relevant to target role
   - Mix of hard and soft skills
   - Certifications mentioned

OVERALL SCORE calculation:
- Weight: Formatting 20%, Keywords 25%, Readability 20%, Contact 10%, Experience 15%, Skills 10%
- Calculate weighted average
- Be strict: most resumes score 55-80

ISSUE DETECTION RULES:
- HIGH severity: Issues that will cause ATS rejection or immediate disqualification
- MEDIUM severity: Issues that significantly reduce match score
- LOW severity: Minor improvements that could boost score

Return ONLY a valid JSON object with absolutely no markdown, no backticks, no extra text:

{
  "overall_score": <weighted score 0-100, be strict>,
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
      "title": "<specific, actionable issue title>",
      "description": "<detailed explanation of why this is a problem for ATS>",
      "suggestion": "<specific, actionable fix with example if possible>"
    }
  ],
  "keywords_found": ["<actual keywords found in resume, max 30>"],
  "keywords_missing": ["<important keywords missing based on role/industry, max 15>"],
  "strengths": ["<specific strengths found in this resume, not generic>"],
  "quick_wins": ["<specific quick fixes that will immediately improve ATS score>"],
  "word_count": <actual word count>,
  "pass_rate": "Low|Medium|High|Very High",
  "ats_verdict": "<2-3 sentence honest assessment of this resume's ATS performance>"
}

IMPORTANT RULES:
- Be SPECIFIC to this resume, not generic
- Every issue must reference actual content from the resume
- Keywords found must actually appear in the resume text
- Missing keywords must be relevant to the role/industry
- Scores must reflect actual quality, not be inflated
- Most resumes have 5-15 issues total`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const cleaned = responseText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(cleaned);
}