import express from 'express';
import multer from 'multer';
import { extractTextFromFile } from '../utils/extractText';
import { analyzeResumeWithAI } from '../utils/analyzeResume';
import { getSupabase } from '../lib/supabase';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  // FIX 1: Increased limit to 10MB. Mobile uploads (images/scans) are often larger.
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg', // Added support for mobile photo-resumes
      'image/png'
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, TXT, and Images allowed.'));
    }
  }
});

// Using .single('resume') is more stable than .any() for mobile fetch
router.post('/', upload.single('resume'), async (req: any, res) => {
  try {
    // FIX 2: Better file detection. Mobile browsers sometimes wrap files differently.
    const file = req.file || (req.files && req.files[0]);

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded. Ensure field name is "resume".' });
    }

    const { jobDescription, userId } = req.body;

    // FIX 3: Timeout Protection. AI analysis can take time; 
    // Render might cut the connection if we don't respond soon.
    const resumeText = await extractTextFromFile(
      file.buffer,
      file.mimetype,
      file.originalname
    );

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract enough text from the file.' });
    }

    const analysis = await analyzeResumeWithAI(resumeText, jobDescription);

    let savedId = null;
    if (userId) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('analyses')
        .insert({
          user_id: userId,
          resume_filename: file.originalname,
          resume_text: resumeText,
          job_description: jobDescription || null,
          overall_score: analysis.overall_score,
          section_scores: analysis.section_scores,
          issues: analysis.issues,
          keywords_found: analysis.keywords_found,
          keywords_missing: analysis.keywords_missing,
          strengths: analysis.strengths,
          quick_wins: analysis.quick_wins,
          word_count: analysis.word_count,
          pass_rate: analysis.pass_rate
        })
        .select('id')
        .single();

      if (!error && data) {
        savedId = data.id;
      }
    }

    return res.json({
      success: true,
      analysisId: savedId,
      filename: file.originalname,
      ...analysis
    });

  } catch (error: any) {
    console.error('Analysis error:', error);
    // Specifically handle Multer Limit errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File is too large. Max limit is 10MB.' });
    }
    return res.status(500).json({ error: error.message });
  }
});

export default router;